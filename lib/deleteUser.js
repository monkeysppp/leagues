
'use strict'

const config = require('./config.js')
const UserDb = require('./userDb.js')
const inquirer = require('inquirer')

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
        validate: (input) => {
          return input.length >= 8 ? true : 'Password must be at least 8 characters long'
        }
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
