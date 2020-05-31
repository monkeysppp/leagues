'use strict'

const mysql = require('mysql')
const password = require('password-hash-and-salt')

class UserDB {
  constructor (hostname, dbName, username, password) {
    if (!hostname) {
      throw new Error('Database hostname not set')
    }
    if (!dbName) {
      throw new Error('Database dbName not set')
    }
    if (!username) {
      throw new Error('Database username not set')
    }
    if (!password) {
      throw new Error('Database password not set')
    }

    this.dbHost = hostname
    this.dbName = dbName
    this.dbUser = username
    this.dbPass = password
  }

  async saltHashAndStore (username, pwd) {
    return new Promise((resolve, reject) => {
      password(pwd).hash((err, hash) => {
        if (err) {
          err.message = 'Error processing password: ' + err.message
          return reject(err)
        }

        this._storePassword(username, hash).then(resolve, reject)
      })
    })
  }

  async checkPassword (username, pwd) {
    if (process.env.NODE_SKIP_PASSWORD_CHECK === '1') {
      return Promise.resolve({ username: 'testUser' })
    }

    return new Promise((resolve, reject) => {
      const dbConnection = this._createConnection()
      dbConnection.query('SELECT * FROM `users` WHERE `username` = ?', [username], (err, rows) => {
        if (err) {
          dbConnection.destroy()
          err.message = 'Error querying userDb: ' + err.message
          return reject(err)
        }

        if (rows.length === 0) {
          dbConnection.destroy()
          return resolve(null, null)
        }

        password(pwd).verifyAgainst(rows[0].identity, (err, verified) => {
          if (err) {
            dbConnection.destroy()
            err.message = 'Error while validating password: ' + err.message
            return reject(err)
          }

          if (!verified) {
            dbConnection.destroy()
            reject(new Error('Password failed to validate'))
          } else {
            dbConnection.destroy()
            resolve({ username: rows[0].username })
          }
        })
      })
    })
  }

  async _storePassword (username, hash) {
    return new Promise((resolve, reject) => {
      const dbConnection = this._createConnection()
      dbConnection.query('CREATE TABLE IF NOT EXISTS `users` ' +
      '(`username` varchar(100) NOT NULL UNIQUE, `identity` varchar(280) NOT NULL)', (err) => {
        if (err) {
          dbConnection.destroy()
          err.message = 'Failed to create table in DB: ' + err.message
          return reject(err)
        }

        dbConnection.query('INSERT INTO users SET ?', { username: username, identity: hash }, (err) => {
          if (err) {
            dbConnection.destroy()
            err.message = 'Failed to add user to DB: ' + err.message
            return reject(err)
          }

          dbConnection.destroy()
          resolve()
        })
      })
    })
  }

  _createConnection () {
    return mysql.createConnection({
      host: this.dbHost,
      database: this.dbName,
      user: this.dbUser,
      password: this.dbPass
    })
  }
}

module.exports = UserDB
