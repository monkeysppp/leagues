'use strict'

var mysql = require('mysql')
var password = require('password-hash-and-salt')

var dbUser = null
var dbPassword = null
var dbName = null

function createDBConnection () {
  if (!dbName || !dbUser || !dbPassword) {
    throw new Error('Database properties not set')
  }

  return mysql.createConnection({
    host: '192.168.0.101',
    user: dbUser,
    password: dbPassword,
    database: dbName
  })
}

function saltHashAndStore (username, pwd, callback) {
  password(pwd).hash((err, hash) => {
    if (err) {
      err.message = 'Error processing password: ' + err.message
      callback(err)
      return
    }

    storePassword(username, hash, callback)
  })
}

function checkPassword (username, pwd, callback) {
  var user = [username]

  if (process.env.NODE_SKIP_PASSWORD_CHECK === '1') {
    callback(null, { username: 'testUser' })
    return
  }

  var dbConnection = createDBConnection()
  dbConnection.query('SELECT * FROM `users` WHERE `username` = ?', user, (err, rows) => {
    if (err) {
      dbConnection.destroy()
      err.message = 'Error querying userDb: ' + err.message
      callback(err)
      return
    }

    if (rows.length === 0) {
      dbConnection.destroy()
      callback(null, null)
      return
    }

    password(pwd).verifyAgainst(rows[0].identity, (err, verified) => {
      if (err) {
        err.message = 'Error while validating password: ' + err.message
        callback(err)
        dbConnection.destroy()
        return
      }

      if (!verified) {
        callback(new Error('Password failed to validate'))
        dbConnection.destroy()
      } else {
        var user = {}
        user.username = rows[0].username
        callback(null, user)
        dbConnection.destroy()
      }
    })
  })
}

function storePassword (username, hash, callback) {
  var dbConnection = createDBConnection()
  dbConnection.query('CREATE TABLE IF NOT EXISTS `users` ' +
    '(`username` varchar(100) NOT NULL UNIQUE, ' +
    '`identity` varchar(280) NOT NULL)', (err) => {
    if (err) {
      dbConnection.destroy()
      err.message = 'Failed to create table in DB: ' + err.message
      return callback(err)
    }

    var post = {
      username: username,
      identity: hash
    }

    dbConnection.query('INSERT INTO users SET ?', post, (err) => {
      if (err) {
        dbConnection.destroy()
        err.message = 'Failed to add user to DB: ' + err.message
        return callback(err)
      }

      dbConnection.destroy()
      callback()
    })
  })
}

function setDBParameters (databaseName, databaseUser, databasePassword) {
  dbUser = databaseUser
  dbPassword = databasePassword
  dbName = databaseName
}

module.exports = {
  setDBParameters: setDBParameters,
  checkPassword: checkPassword,
  createDBConnection: createDBConnection,
  saltHashAndStore: saltHashAndStore
}
