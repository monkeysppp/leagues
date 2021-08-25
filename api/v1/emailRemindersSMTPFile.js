/** @module api/v1/emailRemindersSMTPFile */

'use strict'

const logging = require('../../lib/logging.js')
const log = logging.getLogger('api/emailRemindersSTMP')
const fs = require('fs')
const path = require('path')

const emailRemindersSMTPDataDir = path.join(__dirname, '..', '..', 'data')
const emailRemindersSMTPDataFile = path.join(emailRemindersSMTPDataDir, 'emailRemindersSMTP.json')

function throwError (message, statusCode) {
  const error = new Error(message)
  error.status = statusCode
  throw error
}

/**
 * writeData - Writes the given SMTP config object to the datastore (currently
 * the 'emailRemindersSMTPData.json' file in the 'data' directory).
 *
 * @param  {object} emailRemindersSMTPData The emailRemindersSMTPData object to save
 * @param  {string} emailRemindersSMTPData.host The port for the SMTP server
 * @param  {number} emailRemindersSMTPData.port The port for the SMTP server
 * @param  {string} emailRemindersSMTPData.user The port for the SMTP server
 * @param  {string} emailRemindersSMTPData.password The port for the SMTP server
 * @param  {boolean} emailRemindersSMTPData.ssltls Whether to use SSL/TLS or STARTTLS
 */
exports.writeData = function (emailRemindersSMTPData) {
  const filteredData = JSON.parse(JSON.stringify(emailRemindersSMTPData))
  filteredData.password = 'REDACTED PASSWORD'
  log.debug(`writeData() ${JSON.stringify(filteredData)}`)

  try {
    fs.writeFileSync(emailRemindersSMTPDataFile, JSON.stringify(emailRemindersSMTPData), 'utf-8')
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
  let emailRemindersSMTPData

  try {
    data = fs.readFileSync(emailRemindersSMTPDataFile, 'utf-8')
  } catch (error) {
    if (error.code === 'ENOENT') {
      log.warn('File ' + emailRemindersSMTPDataFile + ' not found, so creating it now')
      emailRemindersSMTPData = { host: '', port: 587, user: 'user', password: 'pass' }
      try {
        try {
          fs.mkdirSync(emailRemindersSMTPDataDir)
        } catch (err) {
          // Intentionally ignore as the error may be that the directory already
          // exists and the next call will flush out any real errors.
        }
        fs.writeFileSync(emailRemindersSMTPDataFile, JSON.stringify(emailRemindersSMTPData), 'utf-8')
      } catch (errorInner) {
        const errorMessage = 'Failed to write new data file: ' + errorInner.message
        log.error(errorMessage)
        throwError(errorMessage, 500)
      }
      return emailRemindersSMTPData
    } else {
      const errorMessage = 'Failed to read data file: ' + error.message
      log.fatal(errorMessage)
      throwError(errorMessage, 500)
    }
  }

  try {
    emailRemindersSMTPData = JSON.parse(data)
  } catch (error) {
    const errorMessage = "Couldn't interpret the stored data as JSON: " + error.message
    log.error(errorMessage)
    throwError(errorMessage, 500)
  }

  return emailRemindersSMTPData
}
