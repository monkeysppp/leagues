/*
 * The main CLI interface to Leagues.
 */
'use strict'

const command = require('./lib/command.js')

command.run(process.argv)
  .then(() => {
    process.exit(0)
  })
  .catch((error) => {
    console.log('Exiting with ' + error)
    process.exit(1)
  })
