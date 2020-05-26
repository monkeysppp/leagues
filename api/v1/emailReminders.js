'use strict'

const logging = require('../../lib/logging.js')
const log = logging.getLogger('api/emailReminders')
const data = require('./emailRemindersData.js')

exports.remindersEmailGet = function (req, res, next) {
  log.info('GET /v1/reminders/email')

  try {
    res.setHeader('Content-Type', 'application/json')
    const emailConfig = data.remindersEmailGet()
    res.json({ enabled: emailConfig.enabled, reminderDays: emailConfig.reminderDays, reminderTime: emailConfig.reminderTime })
  } catch (err) {
    log.warn(err.message)
    res.status(err.status).end()
  }
}

exports.remindersEmailPut = function (req, res, next) {
  log.info(`PUT /v1/reminders/email ${req.body.enabled}`)

  try {
    data.remindersEmailPut(req.body.enabled, req.body.reminderDays, req.body.reminderTime)
    res.end()
  } catch (err) {
    log.warn(err.message)
    res.status(err.status).end()
  }
}

exports.remindersEmailBodyGet = function (req, res, next) {
  log.info('GET /v1/reminders/email/body')

  try {
    res.setHeader('Content-Type', 'application/json')
    res.json(data.remindersEmailGet().email)
  } catch (err) {
    log.warn(err.message)
    res.status(err.status).end()
  }
}

exports.remindersEmailBodyPut = function (req, res, next) {
  log.info(`PUT /v1/reminders/email/body ${req.body.leader} ${req.body.tailer}`)

  try {
    data.remindersEmailBodyPut(req.body.leader, req.body.tailer)
    res.end()
  } catch (err) {
    log.warn(err.message)
    res.status(err.status).end()
  }
}

exports.remindersEmailSMTPGet = function (req, res, next) {
  log.info('GET /v1/reminders/email/smtp')

  try {
    res.setHeader('Content-Type', 'application/json')
    res.json(data.remindersEmailSMTPGet())
  } catch (err) {
    log.warn(err.message)
    res.status(err.status).end()
  }
}

exports.remindersEmailSMTPPut = function (req, res, next) {
  log.info(`PUT /v1/reminders/email/smtp ${req.body.host}:${req.body.port} ${req.body.user} ${req.body.password ? 'REDACTED PASSWORD' : 'no password'}`)

  try {
    data.remindersEmailSMTPPut(req.body.host, req.body.port, req.body.user, req.body.password)
    res.end()
  } catch (err) {
    log.warn(err.message)
    res.status(err.status).end()
  }
}

exports.remindersEmailNextGet = function (req, res, next) {
  log.info('GET /v1/reminders/email/next')

  try {
    res.setHeader('Content-Type', 'application/json')
    res.json(data.remindersEmailNextGet())
  } catch (err) {
    log.warn(err.message)
    res.status(err.status).end()
  }
}
