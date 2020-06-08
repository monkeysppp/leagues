'use strict'

const logging = require('../../lib/logging.js')
const log = logging.getLogger('api/data')
const emailRemindersConfigFile = require('./emailRemindersConfigFile.js')
const emailRemindersSMTPFile = require('./emailRemindersSMTPFile.js')
const matchChecker = require('./matchChecker')
const reminderEmails = require('../../lib/reminderEmails.js')

let configData
let smtpData

function throwError (message, statusCode) {
  const error = new Error(message)
  error.status = statusCode
  throw error
}

/**
 * Get the basic reminders email config
 *
 * @returns {array} The known seasons
 **/
exports.remindersEmailGet = function () {
  log.debug('remindersEmailGet()')
  configData = emailRemindersConfigFile.readData()
  return configData
}

/**
 * Set the basic reminders email config
 *
 * @param {boolean} enabled Whether the email reminder is enabled or not
 * @param {number} reminderDays The number of days in advance to send the reminder email
 * @param {string} reminderTime The time of day to send the reminder email
 *
 * @returns
 **/
exports.remindersEmailPut = function (enabled, fromAddress, reminderDays, reminderTime) {
  const timeRegex = /\d\d:\d\d/
  const emailRegex = /[^@]+@[^@]+/
  log.debug(`remindersEmailPut(emailConfig) req.body.enabled=<${enabled} req.body.from=<${fromAddress}> req.body.reminderDays=<${reminderDays} req.body.reminderTime=<${reminderTime}>`)

  if (typeof enabled !== 'boolean') {
    throwError('Bad enabled setting', 400)
  }
  if (typeof fromAddress !== 'string' || !fromAddress.match(emailRegex)) {
    throwError('Bad from address setting', 400)
  }
  if (typeof reminderDays !== 'number' || reminderDays > 32) {
    throwError('Bad reminderDays setting', 400)
  }
  if (!reminderTime || !reminderTime.match(timeRegex)) {
    throwError('Bad reminderTime setting', 400)
  }

  configData = emailRemindersConfigFile.readData()
  configData.enabled = enabled
  configData.from = fromAddress
  configData.reminderDays = reminderDays
  configData.reminderTime = reminderTime
  emailRemindersConfigFile.writeData(configData)

  reminderEmails.initialise()
}

/**
 * Set the basic reminders email config
 *
 * @param {string} leader The leader part of the reminder email
 * @param {string} tailer The tailer part of the reminder email
 *
 * @returns
 **/
exports.remindersEmailBodyPut = function (leader, tailer) {
  log.debug(`remindersEmailPut(leader, tailer) req.body.leader=<${leader}> req.body.tailer=<${tailer}>`)

  if (typeof leader !== 'string') {
    throwError('Bad email leader setting', 400)
  }
  if (typeof tailer !== 'string') {
    throwError('Bad email tailer setting', 400)
  }

  configData = emailRemindersConfigFile.readData()
  configData.email.leader = leader
  configData.email.tailer = tailer

  emailRemindersConfigFile.writeData(configData)
}

exports.remindersEmailSMTPGet = function () {
  log.debug('remindersEmailSMTPGet()')
  smtpData = emailRemindersSMTPFile.readData()
  const returnedData = {
    host: smtpData.host,
    port: smtpData.port,
    user: smtpData.user
  }
  return returnedData
}

exports.remindersEmailSMTPPut = function (host, port, user, password) {
  if (typeof password === 'string') {
    log.info(`remindersEmailSMTPPut(host, port, user, password) req.body.host=<${host}> req.body.port=<${port}> req.body.user=<${user}> req.body.password=<XXX>`)
  } else {
    log.info(`remindersEmailSMTPPut(host, port, user, password) req.body.host=<${host}> req.body.port=<${port}> req.body.user=<${user}>`)
  }

  if (typeof host !== 'string') {
    throwError('Bad SMTP host setting', 400)
  }
  if (typeof port !== 'number') {
    throwError('Bad SMTP port setting', 400)
  }
  if (typeof user !== 'string') {
    throwError('Bad SMTP user setting', 400)
  }
  if (typeof password !== 'string' && password !== undefined) {
    throwError('Bad SMTP password setting', 400)
  }

  smtpData = emailRemindersSMTPFile.readData()
  smtpData.host = host
  smtpData.port = port
  smtpData.user = user
  if (typeof password === 'string') {
    smtpData.password = password
  }
  emailRemindersSMTPFile.writeData(smtpData)
}

exports.remindersEmailNextGet = function () {
  configData = emailRemindersConfigFile.readData()

  const fromDate = new Date()
  fromDate.setHours(4)
  fromDate.setMinutes(0)
  fromDate.setSeconds(0)
  fromDate.setDate(fromDate.getDate() + parseInt(configData.reminderDays))

  const nextFixtureBundle = matchChecker.findNextFixtureAfterDate(fromDate)

  if (!nextFixtureBundle) {
    return {}
  }

  const [hours, minutes] = configData.reminderTime.split(':')
  const emailTime = new Date(nextFixtureBundle.fixture.date)
  emailTime.setDate(emailTime.getDate() - parseInt(configData.reminderDays))
  emailTime.setHours(hours)
  emailTime.setMinutes(minutes)

  return {
    time: emailTime,
    recipients: nextFixtureBundle.contacts,
    subject: `${nextFixtureBundle.seasonName} Match Reminder, ${nextFixtureBundle.fixture.date} at ${nextFixtureBundle.fixture.venue}`,
    body: `${configData.email.leader}${nextFixtureBundle.matches}${configData.email.tailer}`
  }
}
