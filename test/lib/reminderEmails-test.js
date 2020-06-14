'use strict'

const chai = require('chai')
const expect = chai.expect
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
chai.use(sinonChai)
const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
const proxyquire = require('proxyquire')

const nodemailer = require('nodemailer')
const smtpConfigFile = require('../../api/v1/emailRemindersSMTPFile.js')
const emailConfigFile = require('../../api/v1/emailRemindersConfigFile.js')
const emailRemindersData = require('../../api/v1/emailRemindersData.js')

describe('reminderEmails', () => {
  describe('initialise', () => {
    let cronStub
    let stopStub
    let reminderEmails

    beforeEach(() => {
      sinon.stub(emailConfigFile, 'readData').returns({
        reminderTime: '10:00',
        enabled: true
      })
      cronStub = sinon.stub().callsFake(() => {
        return {
          stop: stopStub
        }
      })
      stopStub = sinon.stub()
      reminderEmails = proxyquire('../../lib/reminderEmails.js', {
        cron: {
          CronJob: cronStub
        }
      })
    })

    afterEach(() => {
      emailConfigFile.readData.restore()
    })

    context('on a first call', () => {
      context('when setting up a cron job succeeds', () => {
        it('starts the cron job', () => {
          reminderEmails.initialise()
          expect(cronStub).to.be.calledWith({
            cronTime: '0 00 10 * * *',
            onTick: reminderEmails.emailTick,
            start: true
          })
          expect(stopStub.callCount).to.equal(0)
        })
      })

      context('when setting up a cron job fails', () => {
        beforeEach(() => {
          cronStub.throws(new Error('Constructor Bang!'))
        })

        it('throws an error with a status of 500', () => {
          expect(reminderEmails.initialise).to.throw(Error, 'Constructor Bang!').with.property('status', 500)
          expect(cronStub).to.be.calledWith({
            cronTime: '0 00 10 * * *',
            onTick: reminderEmails.emailTick,
            start: true
          })
          expect(stopStub.callCount).to.equal(0)
        })
      })
    })

    context('on a second call', () => {
      it('starts the cron job and stops the first job', () => {
        reminderEmails.initialise()
        reminderEmails.initialise()
        expect(cronStub).to.be.calledWith({
          cronTime: '0 00 10 * * *',
          onTick: reminderEmails.emailTick,
          start: true
        })
        expect(stopStub.callCount).to.equal(1)
      })
    })
  })

  describe('emailTick', () => {
    let sendMailStub
    const reminderEmails = require('../../lib/reminderEmails.js')

    beforeEach(() => {
      sinon.stub(emailRemindersData, 'remindersEmailNextGet').returns({
        time: new Date(),
        recipients: 'a@example.com',
        subject: 'some subject',
        body: 'some body'
      })
      sinon.stub(smtpConfigFile, 'readData').returns({
        host: 'host',
        port: 12345,
        user: 'user',
        password: 'pass'
      })
      sinon.stub(emailConfigFile, 'readData').returns({
        from: 'f@example.com'
      })
      sendMailStub = sinon.stub()
      sinon.stub(nodemailer, 'createTransport').returns({ sendMail: sendMailStub })
    })

    afterEach(() => {
      emailRemindersData.remindersEmailNextGet.restore()
      smtpConfigFile.readData.restore()
      emailConfigFile.readData.restore()
      nodemailer.createTransport.restore()
    })

    context('when an email should be sent', () => {
      context('when sending email succeeds', () => {
        it('sends the email', () => {
          reminderEmails.emailTick()
          expect(nodemailer.createTransport).to.be.calledWith({
            host: 'host',
            port: 12345,
            auth: {
              user: 'user',
              pass: 'pass'
            }
          })
          expect(sendMailStub.callCount).to.equal(1)
          expect(sendMailStub).to.be.calledWith({
            from: 'f@example.com',
            to: 'a@example.com',
            subject: 'some subject',
            text: 'some body'
          })
        })
      })

      context('when sending email fails', () => {
        beforeEach(() => {
          sendMailStub.throws(new Error('sendMail Bang!'))
        })

        it('continues', () => {
          reminderEmails.emailTick()
          expect(nodemailer.createTransport).to.be.calledWith({
            host: 'host',
            port: 12345,
            auth: {
              user: 'user',
              pass: 'pass'
            }
          })
          expect(sendMailStub.callCount).to.equal(1)
          expect(sendMailStub).to.be.calledWith({
            from: 'f@example.com',
            to: 'a@example.com',
            subject: 'some subject',
            text: 'some body'
          })
        })
      })
    })

    context('when an email should not be sent', () => {
      beforeEach(() => {
        const tomorrow = new Date()
        tomorrow.setDate(tomorrow.getDate() + 1)
        emailRemindersData.remindersEmailNextGet.returns({
          time: tomorrow,
          recipients: 'a@example.com',
          subject: 'some subject',
          body: 'some body'
        })
      })

      it('does not send an email', () => {
        reminderEmails.emailTick()
        expect(sendMailStub.callCount).to.equal(0)
      })
    })
  })
})
