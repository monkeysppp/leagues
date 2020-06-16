/** @module lib/users */

'use strict'

const config = require('./config.js')
const UserDb = require('./userDb.js')
const inquirer = require('inquirer')

module.exports.internal = {}

module.exports.internal.validatePassword = (input) => {
  return input.length >= 8 ? true : 'Password must be at least 8 characters long'
}

/**
 * addUser - Connect to the user database and add the new user, prompting for a password
 *
 * @param  {string} username The username to add
 * @return {Promise} A promise to have added the user
 */
module.exports.addUser = async function (username) {
  const dbHost = process.env.DATABASE_HOST || config.dbHost
  const dbName = process.env.DATABASE_NAME || config.dbName
  const dbUser = process.env.DATABASE_USER || config.dbUser
  const dbPass = process.env.DATABASE_PASS || config.dbPass

  try {
    const userDb = new UserDb(dbHost, dbName, dbUser, dbPass)
    const responses = await inquirer.prompt([
      {
        type: 'password',
        name: 'password',
        mask: '*',
        message: 'Enter a password',
        validate: module.exports.internal.validatePassword
      }
    ])

    console.log('Adding user')
    await userDb.saltHashAndStore(username, responses.password)
    console.log('User added successfully')
  } catch (err) {
    console.log('Error adding user: ' + err.message)
    throw err
  }
}

/**
 * deleteUser - Connect to the user database and delete the given user
 *
 * @param  {string} username The username to delete
 * @return {Promise} A promise to have deleted the user
 */
module.exports.deleteUser = async function (username) {
  const dbHost = process.env.DATABASE_HOST || config.dbHost
  const dbName = process.env.DATABASE_NAME || config.dbName
  const dbUser = process.env.DATABASE_USER || config.dbUser
  const dbPass = process.env.DATABASE_PASS || config.dbPass

  try {
    const userDb = new UserDb(dbHost, dbName, dbUser, dbPass)

    console.log('Deleting user')
    await userDb.deleteUser(username)
    console.log('User deleted successfully')
  } catch (err) {
    console.log('Error deleting user: ' + err.message)
    throw err
  }
}
