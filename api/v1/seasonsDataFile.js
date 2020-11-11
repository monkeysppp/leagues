/** @module api/v1/seasonsDataFile */

'use strict'

const logging = require('../../lib/logging.js')
const log = logging.getLogger('api/seasonsDataFile')
const fs = require('fs')
const path = require('path')

const seasonsDataDir = path.join(__dirname, '..', '..', 'data')
const seasonsDataFile = path.join(seasonsDataDir, 'seasons.json')

function throwError (message, statusCode) {
  const error = new Error(message)
  error.status = statusCode
  throw error
}

/**
 * writeData - Writes the given seasonsData object to the datastore (currently
 * the 'seasons.json' file in the 'data' directory).
 *
 * @param  {object} seasonsData The seasonsData object to save
 */
exports.writeData = function (seasonsData) {
  log.debug('writeData()')
  log.debug(JSON.stringify(seasonsData))

  try {
    fs.writeFileSync(seasonsDataFile, JSON.stringify(seasonsData), 'utf-8')
  } catch (err) {
    log.error(err.message)
    throwError(err.message, 500)
  }
}

/**
 * readData - Reads in the data from the datastore (currently the 'seasons.json'
*  file in the 'data' directory).
 *
 * @return {object} The currently saves seasons object, with defaulted values
 */
exports.readData = function () {
  log.debug('readFile()')

  let data
  let seasonsData

  try {
    data = fs.readFileSync(seasonsDataFile, 'utf-8')
  } catch (error) {
    if (error.code === 'ENOENT') {
      log.warn('File ' + seasonsDataFile + ' not found, so creating it now')
      seasonsData = { seasons: [] }
      try {
        try {
          fs.mkdirSync(seasonsDataDir)
        } catch (err) {
          // Intentionally ignore as the error may be that the directory already
          // exists and the next call will flush out any real errors.
        }
        fs.writeFileSync(seasonsDataFile, JSON.stringify(seasonsData), 'utf-8')
      } catch (errorInner) {
        const errorMessage = 'Failed to write new data file: ' + errorInner.message
        log.error(errorMessage)
        throwError(errorMessage, 500)
      }
      return seasonsData
    } else {
      const errorMessage = 'Failed to read data file: ' + error.message
      log.fatal(errorMessage)
      throwError(errorMessage, 500)
    }
  }

  try {
    seasonsData = JSON.parse(data)
  } catch (error) {
    const errorMessage = "Couldn't interpret the stored data as JSON: " + error.message
    log.error(errorMessage)
    throwError(errorMessage, 500)
  }

  return seasonsData
}
