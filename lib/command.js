'use strict'

const addUserLib = require('./addUser.js')
const server = require('./server.js')
const commander = require('commander')

/**
 * run - Implement the processing layer of the CLI.  This takes the commandline args
 * and then runs the appropriate commands.
 *
 * @param  {Array} args The array of commandling arguments
 * @return {Promise} A Promise to have processes the command call
 */
function run (args) {
  const command = new commander.Command()

  return new Promise((resolve, reject) => {
    command.description('Commands for the SADVA Leagues App.')

    command.command('run')
      .description('Run the Leagues application')
      .action(() => {
        module.exports.internal.runApp().then(resolve, reject)
      })

    command.command('addUser <databaseName> <databaseUser> <username>')
      .description('Add a single user to the user\'s database')
      .action((databaseName, databaseUser, username) => {
        module.exports.internal.addUser(databaseName, databaseUser, username).then(resolve, reject)
      })

    command.parse(args)
  })
}

/**
 * addUser - description
 *
 * @param  {type} databaseName description
 * @param  {type} databaseUser description
 * @param  {type} username     description
 * @return {type}              description
 */
function addUser (databaseName, databaseUser, username) {
  return addUserLib.addUser(databaseName, databaseUser, username)
}

/**
 * runApp - description
 *
 * @return {type}  description
 */
function runApp () {
  return server.runApp()
}

module.exports = {
  run: run,
  internal: {
    addUser: addUser,
    runApp: runApp
  }
}
