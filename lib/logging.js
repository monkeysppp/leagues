'use strict'

const bunyan = require('bunyan')
const config = require('./config')

/**
 * getLogger - Helper functiont hat sets up a Bunyan logger with the given name
 * that logs to STDOUT with our standard config.
 *
 * @param  {string} name The logger's name as it should appear in the logs.
 * @return {object} A Bunyan logger
 */
function getLogger (name) {
  var log = bunyan.createLogger({
    name: name,
    level: config.logging.level,
    src: true,
    streams: [
      {
        stream: process.stdout
      }
    ]
  })

  return log
}

module.exports = {
  getLogger: getLogger
}
