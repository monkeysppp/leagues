/** @module lib/logging */

'use strict'

const bunyan = require('bunyan')
const config = require('./config')

const loggers = {}

/**
 * getLogger - Helper function that sets up a Bunyan logger with the given name
 * that logs to STDOUT with our standard config.
 *
 * @param  {string} name The logger's name as it should appear in the logs.
 * @return {object} A Bunyan logger
 */
exports.getLogger = function (name) {
  if (!loggers.name) {
    loggers.name = bunyan.createLogger({
      name: name,
      level: config.logging.level,
      src: true,
      streams: [
        {
          stream: process.stdout
        }
      ]
    })
  }

  return loggers.name
}
