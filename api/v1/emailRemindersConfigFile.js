'use strict'

const logging = require('../../lib/logging.js')
const log = logging.getLogger('api/emailRemindersConfig')
const fs = require('fs')
const path = require('path')

const emailRemindersConfigDir = path.join(__dirname, '..', '..', 'data')
const emailRemindersConfigFile = path.join(emailRemindersConfigDir, 'emailRemindersConfig.json')

function throwError (message, statusCode) {
  const error = new Error(message)
  error.status = statusCode
  throw error
}

/**
 * writeData - Writes the given emailRemindersConfigData object to the datastore (currently
 * the 'seasons.json' file in the 'data' directory).
 *
 * @param  {object} emailRemindersConfigData The emailRemindersConfigData object to save
 * @return
 */
exports.writeData = function (emailRemindersConfigData) {
  log.debug('writeData()')
  log.debug(JSON.stringify(emailRemindersConfigData))

  try {
    fs.writeFileSync(emailRemindersConfigFile, JSON.stringify(emailRemindersConfigData), 'utf-8')
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
  let emailRemindersConfigData

  try {
    data = fs.readFileSync(emailRemindersConfigFile, 'utf-8')
  } catch (error) {
    if (error.code === 'ENOENT') {
      log.warn('File ' + emailRemindersConfigFile + ' not found, so creating it now')
      emailRemindersConfigData = { enabled: false, reminderDays: 6, reminderTime: '10:00', email: { leader: '', tailer: '' } }
      try {
        try {
          fs.mkdirSync(emailRemindersConfigDir)
        } catch (err) {
          // Intentionally ignore as the error may be that the directory already
          // exists and the next call will flush out any real errors.
        }
        fs.writeFileSync(emailRemindersConfigFile, JSON.stringify(emailRemindersConfigData), 'utf-8')
      } catch (errorInner) {
        const errorMessage = 'Failed to write new data file: ' + errorInner.message
        log.error(errorMessage)
        throwError(errorMessage, 500)
      }
      return emailRemindersConfigData
    } else {
      const errorMessage = 'Failed to read data file: ' + error.message
      log.fatal(errorMessage)
      throwError(errorMessage, 500)
    }
  }

  try {
    emailRemindersConfigData = JSON.parse(data)
  } catch (error) {
    var errorMessage = "Couldn't interpret the stored data as JSON: " + error.message
    log.error(errorMessage)
    throwError(errorMessage, 500)
  }

  return emailRemindersConfigData
}
