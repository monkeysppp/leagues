'use strict'

const log = require('./logging').getLogger('reminderEmails')
const CronJob = require('cron').CronJob
const nodemailer = require('nodemailer')
const smtpConfigFile = require('../api/v1/emailRemindersSMTPFile.js')
const emailConfigFile = require('../api/v1/emailRemindersConfigFile.js')
const emailRemindersData = require('../api/v1/emailRemindersData.js')

let cronJob

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

exports.emailTick = function () {
  log.info('Timer fired for an email check')

  const nextEmail = emailRemindersData.remindersEmailNextGet()
  const now = new Date()

  console.log(require('util').inspect(now.getDate(), { depth: null }))
  console.log(require('util').inspect(nextEmail.time.getDate(), { depth: null }))

  if (now.getDate() === nextEmail.time.getDate()) {
    log.info('Found a match to send an email reminder for')
    exports.sendEmail(nextEmail)
  } else {
    log.info('Not sending an email this time')
  }
}

exports.sendEmail = async function (nextEmail) {
  const emailConfig = emailConfigFile.readData()
  const smtpConfig = smtpConfigFile.readData()
  const transporter = nodemailer.createTransport({
    host: smtpConfig.host,
    port: smtpConfig.port,
    auth: {
      user: smtpConfig.user,
      pass: smtpConfig.password
    }
  })

  // TODO from address should be config
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
}
