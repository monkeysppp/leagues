'use strict'

const usersLib = require('./users.js')
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
    command.description('Commands for the Leagues App.')

    command.command('run')
      .description('Run the Leagues application')
      .action(() => {
        module.exports.internal.runApp().then(resolve, reject)
      })

    command.command('addUser <username>')
      .description('Add a single user to the user\'s database')
      .action((username) => {
        module.exports.internal.addUser(username).then(resolve, reject)
      })

    command.command('deleteUser <username>')
      .description('Remove a single user from the user\'s database')
      .action((username) => {
        module.exports.internal.deleteUser(username).then(resolve, reject)
      })

    command.parse(args)
  })
}

/**
 * addUser - description
 *
 * @param  {type} username     description
 * @return {type}              description
 */
function addUser (username) {
  return usersLib.addUser(username)
}

/**
 * deleteUser - description
 *
 * @param  {type} username     description
 * @return {type}              description
 */
function deleteUser (username) {
  return usersLib.deleteUser(username)
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
    deleteUser: deleteUser,
    runApp: runApp
  }
}
