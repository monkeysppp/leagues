/** @module lib/reminderEmails */

'use strict'

const log = require('./logging').getLogger('reminderEmails')
const CronJob = require('cron').CronJob
const nodemailer = require('nodemailer')
const smtpConfigFile = require('../api/v1/emailRemindersSMTPFile.js')
const emailConfigFile = require('../api/v1/emailRemindersConfigFile.js')
const emailRemindersData = require('../api/v1/emailRemindersData.js')

let cronJob

/**
 * initialise - "initialise" the email reminder system, starting a CronJob
 * that wakes at the reminder time to check if there is an email reminder to send "today".
 */
exports.initialise = function () {
  const emailConfig = emailConfigFile.readData()
  const [hours, minutes] = emailConfig.reminderTime.split(':')

  try {
    if (cronJob) {
      cronJob.stop()
    }

    cronJob = new CronJob({
      cronTime: `0 ${minutes} ${hours} * * *`,
      onTick: exports.emailTick,
      start: emailConfig.enabled
    })
  } catch (e) {
    log.error('Failed to initialise the email reminders: ' + e)
    e.status = 500
    throw e
  }
}

/**
 * emailTick - Get the next reminder email and check whether it should be sent today
 */
exports.emailTick = function () {
  log.info('Timer fired for an email check')

  const nextEmail = emailRemindersData.remindersEmailNextGet()
  const now = new Date()

  if (now.getDate() === nextEmail.time.getDate()) {
    log.info('Found a match to send an email reminder for')
    exports.sendEmail(nextEmail)
  } else {
    log.info('Not sending an email this time')
  }
}

/**
 * sendEmail - Create a connection to the SMTP server and send the reminder email
 *
 * @param {object} nextEmail The details for the email to send
 * @param {string} nextEmail.recipients A comma-separated list of email addresses to send the reminders // TODO:
 * @param {string} nextEmail.subject The email subject inline
 * @param {string} nextEmail.body The body of the email
 */
exports.sendEmail = async function (nextEmail) {
  const emailConfig = emailConfigFile.readData()
  const smtpConfig = smtpConfigFile.readData()
  const nodemailerTransportConfig = {
    host: smtpConfig.host,
    port: smtpConfig.port,
    auth: {
      user: smtpConfig.user,
      pass: smtpConfig.password
    }
  }
  if (smtpConfig.ssltls) {
    nodemailerTransportConfig.secure = true
  }
  const transporter = nodemailer.createTransport(nodemailerTransportConfig)

  const mail = {
    from: emailConfig.from,
    to: nextEmail.recipients,
    subject: nextEmail.subject,
    text: nextEmail.body
  }

  try {
    await transporter.sendMail(mail)
  } catch (e) {
    log.error('Error sending reminder email')
    log.error(e)
  }
  log.info('Email sent')
  log.info(`To: ${nextEmail.recipients}`)
  log.info(`Subject: ${nextEmail.subject}`)
  log.info(`Text: ${nextEmail.text}`)
}
