'use strict'

const mysql = require('mysql')
const password = require('password-hash-and-salt')

/**
 * A connection to the database
 */
class UserDB {
  /**
   * constructor - Create a connection to the database.  Note that the database must
   * already exist; calling #saltHashAndStore (by running the CLI to add a user) will create
   * the database and user table.
   *
   * @param  {type} hostname the hostname of the database server
   * @param  {type} dbName   the name of the database
   * @param  {type} username the username for the connection to the DATABASE_USER
   * @param  {type} password the Password for the connection to the DATABASE_USER
   */
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

  /**
   * async saltHashAndStore - Takes a username and password, salts and hashes the password, then
   * stores the two in the Database
   *
   * @param  {string} username The user's getUsername
   * @param  {string} pwd      The user's Password
   * @return {Promise} A Promise to have stored the username and password securely in the user table in the database
   */
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

  /**
   * async deleteUser - Deletes a user from the user Database
   *
   * @param  {string} username the username to delete from the user table in the database
   * @return {Promise} A promise to have deleted the user
   */
  async deleteUser (username) {
    return new Promise((resolve, reject) => {
      const dbConnection = this._createConnection()
      dbConnection.query('DELETE FROM `users` WHERE `username` = ?', [username], (err, rows) => {
        dbConnection.destroy()
        if (err) {
          err.message = 'Error deleting user from userDb: ' + err.message
          return reject(err)
        }
        resolve()
      })
    })
  }

  /**
   * async checkPassword - Checks a given password for the given user to see if the password
   * is correct.
   *
   * @param  {string} username The username to check
   * @param  {string} pwd      The password to check
   * @return {Promise} A promise that the password is correct
   */
  async checkPassword (username, pwd) {
    if (process.env.NODE_SKIP_PASSWORD_CHECK === '1') {
      return Promise.resolve({ username: 'testUser' })
    }

    return new Promise((resolve, reject) => {
      const dbConnection = this._createConnection()
      dbConnection.query('SELECT * FROM `users` WHERE `username` = ?', [username], (err, rows) => {
        dbConnection.destroy()
        if (err) {
          err.message = 'Error querying userDb: ' + err.message
          return reject(err)
        }

        if (rows.length === 0) {
          return resolve()
        }

        password(pwd).verifyAgainst(rows[0].identity, (err, verified) => {
          if (err) {
            err.message = 'Error while validating password: ' + err.message
            return reject(err)
          }

          if (!verified) {
            reject(new Error('Password failed to validate'))
          } else {
            resolve({ username: rows[0].username })
          }
        })
      })
    })
  }

  /**
   * async _storePassword - Insert the user and salt'n'hashed password into the users table in the Database
   *
   * @param  {string} username the username
   * @param  {string} hash     the salt'n'hash value
   *
   * @return {Promise} A promise to have stored the username and salt'n'hash in the user table
   */
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
          dbConnection.destroy()
          if (err) {
            err.message = 'Failed to add user to DB: ' + err.message
            return reject(err)
          }

          resolve()
        })
      })
    })
  }

  /**
   * _createConnection - Create a connection to the MySQL database
   *
   * @return {object}  A connection to the mysql database
   */
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
