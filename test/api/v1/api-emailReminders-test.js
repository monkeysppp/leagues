/*
 * Unit tests for controllers/SeasonsService.js
 */

'use strict'

const chai = require('chai')
const expect = chai.expect
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
chai.use(sinonChai)
const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
const express = require('express')
const bodyParser = require('body-parser')
const request = require('supertest')

const router = require('../../../api/v1/routes.js')
const seasonsDataFile = require('../../../api/v1/seasonsDataFile.js')
const emailRemindersConfigDataFile = require('../../../api/v1/emailRemindersConfigFile.js')
const emailRemindersSMTPDataFile = require('../../../api/v1/emailRemindersSMTPFile.js')
const reminderEmails = require('../../../lib/reminderEmails')

const error500 = new Error('Internal failure')
error500.status = 500
const sampleSeasonData = {
  seasons: [
    {
      id: 1,
      name: 'seasonName1',
      competitions: [
        {
          id: 1,
          name: 'competitionName',
          teams: [
            {
              id: 1,
              name: 'teamName1',
              contacts: [{ id: 1, email: 'contact1@teamName1' }]
            },
            {
              id: 2,
              name: 'teamName2',
              contacts: [
                { id: 1, email: 'contact1@teamName2' },
                { id: 3, email: 'contact3@teamName2' },
                { id: 2, email: 'contact2@teamName2' }
              ]
            },
            {
              id: 3,
              name: 'teamName3',
              contacts: [{ id: 1, email: 'contact1@teamName3' }]
            },
            {
              id: 4,
              name: 'teamName4',
              contacts: [{ id: 1, email: 'contact1@teamName4' }]
            }
          ],
          fixtures: [
            {
              id: 1,
              date: 'Fri 10-Jan-20',
              venue: 'Venue 1',
              matches: [
                { id: 3, time: '19:00', homeTeam: 1, awayTeam: 2, refTeam: 3 },
                { id: 1, time: '20:00', homeTeam: 2, awayTeam: 3 },
                { id: 2, time: '21:00', homeTeam: 3, awayTeam: 1, refTeam: 2 }
              ]
            },
            {
              id: 2,
              date: 'Fri 17-Jan-20',
              venue: 'Venue 1',
              adjudicator: 3,
              matches: [
                { id: 3, time: '19:00', homeTeam: 1, awayTeam: 2, refTeam: 3 },
                { id: 1, time: '20:00', homeTeam: 2, awayTeam: 3 },
                { id: 2, time: '21:00', homeTeam: 3, awayTeam: 1, refTeam: 2 }
              ]
            },
            {
              id: 3,
              date: 'Fri 24-Jan-20',
              venue: 'Venue 1',
              matches: []
            },
            {
              id: 4,
              date: 'Fri 03-Jan-20',
              venue: 'Venue 1',
              matches: []
            }
          ]
        }
      ]
    }
  ]
}

const sampleConfigData = {
  enabled: true,
  from: 'Alice Bobs <alice@example.com>',
  reminderDays: 6,
  reminderTime: '10:00',
  email: {
    leader: 'this is\na leader',
    tailer: 'this is\na tailer'
  }
}
const sampleSMTPData = {
  host: 'mail.example.com',
  port: 587,
  user: 'username',
  password: 'password'
}

const expectedConfig = {
  enabled: true,
  from: 'Alice Bobs <alice@example.com>',
  reminderDays: 6,
  reminderTime: '10:00'
}
const expectedBody = {
  leader: 'this is\na leader',
  tailer: 'this is\na tailer'
}
const expectedSMTP = {
  host: 'mail.example.com',
  port: 587,
  user: 'username'
}

function cloneData (data) {
  return JSON.parse(JSON.stringify(data))
}

describe('/api/v1', () => {
  let app

  before(() => {
    app = express()
    app.use(bodyParser.json())
    app.use('/api/v1', router)
  })

  beforeEach(() => {
    sinon.stub(seasonsDataFile, 'readData').returns(cloneData(sampleSeasonData))
    sinon.stub(emailRemindersConfigDataFile, 'readData').returns(cloneData(sampleConfigData))
    sinon.stub(emailRemindersConfigDataFile, 'writeData').returns()
    sinon.stub(emailRemindersSMTPDataFile, 'readData').returns(cloneData(sampleSMTPData))
    sinon.stub(emailRemindersSMTPDataFile, 'writeData').returns()
    sinon.stub(reminderEmails, 'initialise').returns()
  })

  afterEach(() => {
    seasonsDataFile.readData.restore()
    emailRemindersConfigDataFile.readData.restore()
    emailRemindersConfigDataFile.writeData.restore()
    emailRemindersSMTPDataFile.readData.restore()
    emailRemindersSMTPDataFile.writeData.restore()
    reminderEmails.initialise.restore()
  })

  describe('/reminders/email', () => {
    describe('GET', () => {
      context('reading data succeeds', () => {
        it('returns the data', () => {
          return request(app)
            .get('/api/v1/reminders/email')
            .set('Accept', 'application/json')
            .expect('Content-Type', /application\/json/)
            .expect(200)
            .then(res => {
              expect(JSON.stringify(res.body)).to.equal(JSON.stringify(expectedConfig))
            })
        })
      })

      context('reading data fails', () => {
        beforeEach(() => {
          emailRemindersConfigDataFile.readData.throws(error500)
        })

        it('returns 500', () => {
          return request(app)
            .get('/api/v1/reminders/email')
            .set('Accept', 'application/json')
            .expect(500)
        })
      })
    })
    describe('PUT', () => {
      context('reading data succeeds', () => {
        context('writing data succeeds', () => {
          context('all data is missing', () => {
            it('fails with 400', () => {
              return request(app)
                .put('/api/v1/reminders/email')
                .set('Accept', 'application/json')
                .expect(400)
            })
          })

          context('enabled is missing', () => {
            it('fails with 400', () => {
              return request(app)
                .put('/api/v1/reminders/email')
                .send({ from: 'Alice Bobs <alice@example.com>', reminderDays: 5, reminderTime: '14:00' })
                .set('Accept', 'application/json')
                .expect(400)
            })
          })

          context('enabled is invalid', () => {
            it('fails with 400', () => {
              return request(app)
                .put('/api/v1/reminders/email')
                .send({ enabled: 'true', from: 'Alice Bobs <alice@example.com>', reminderDays: 5, reminderTime: '14:00' })
                .set('Accept', 'application/json')
                .expect(400)
            })
          })

          context('from address is missing', () => {
            it('fails with 400', () => {
              return request(app)
                .put('/api/v1/reminders/email')
                .send({ enabled: true, reminderDays: 5, reminderTime: '14:00' })
                .set('Accept', 'application/json')
                .expect(400)
            })
          })

          context('from address is invalid', () => {
            it('fails with 400', () => {
              return request(app)
                .put('/api/v1/reminders/email')
                .send({ enabled: true, from: 'Alice Bobs', reminderDays: 5, reminderTime: '14:00' })
                .set('Accept', 'application/json')
                .expect(400)
            })
          })

          context('reminderDays is missing', () => {
            it('fails with 400', () => {
              return request(app)
                .put('/api/v1/reminders/email')
                .send({ enabled: true, from: 'Alice Bobs <alice@example.com>', reminderTime: '14:00' })
                .set('Accept', 'application/json')
                .expect(400)
            })
          })

          context('reminderDays is invalid', () => {
            it('fails with 400', () => {
              return request(app)
                .put('/api/v1/reminders/email')
                .send({ enabled: true, from: 'Alice Bobs <alice@example.com>', reminderDays: 'hello', reminderTime: '14:00' })
                .set('Accept', 'application/json')
                .expect(400)
            })
          })

          context('reminderDays is bigger than 32', () => {
            it('fails with 400', () => {
              return request(app)
                .put('/api/v1/reminders/email')
                .send({ enabled: true, from: 'Alice Bobs <alice@example.com>', reminderDays: 33, reminderTime: '14:00' })
                .set('Accept', 'application/json')
                .expect(400)
            })
          })

          context('reminderTime is missing', () => {
            it('fails with 400', () => {
              return request(app)
                .put('/api/v1/reminders/email')
                .send({ enabled: true, from: 'Alice Bobs <alice@example.com>', reminderDays: 5 })
                .set('Accept', 'application/json')
                .expect(400)
            })
          })

          context('reminderTime is invalid', () => {
            it('fails with 400', () => {
              return request(app)
                .put('/api/v1/reminders/email')
                .send({ enabled: true, from: 'Alice Bobs <alice@example.com>', reminderDays: 5, reminderTime: '100' })
                .set('Accept', 'application/json')
                .expect(400)
            })
          })

          context('reminderEmails.initialise throws', () => {
            beforeEach(() => {
              reminderEmails.initialise.throws(error500)
            })

            it('returns 500', () => {
              return request(app)
                .put('/api/v1/reminders/email')
                .send({ enabled: true, from: 'Alice Bobs <alice@example.com>', reminderDays: 5, reminderTime: '14:00' })
                .set('Accept', 'application/json')
                .expect(500)
            })
          })

          it('returns 200', () => {
            return request(app)
              .put('/api/v1/reminders/email')
              .send({ enabled: true, from: 'Alice Bobs <alice@example.com>', reminderDays: 5, reminderTime: '14:00' })
              .set('Accept', 'application/json')
              .expect(200)
              .then(() => {
                const newData = cloneData(sampleConfigData)
                newData.reminderDays = 5
                newData.reminderTime = '14:00'
                expect(emailRemindersConfigDataFile.writeData).to.be.calledWith(newData)
              })
          })
        })

        context('writing data fails', () => {
          beforeEach(() => {
            emailRemindersConfigDataFile.writeData.throws(error500)
          })

          it('returns 500', () => {
            return request(app)
              .put('/api/v1/reminders/email')
              .send({ enabled: true, from: 'Alice Bobs <alice@example.com>', reminderDays: 5, reminderTime: '14:00' })
              .set('Accept', 'application/json')
              .expect(500)
          })
        })
      })

      context('reading data fails', () => {
        beforeEach(() => {
          emailRemindersConfigDataFile.readData.throws(error500)
        })

        it('returns 500', () => {
          return request(app)
            .put('/api/v1/reminders/email')
            .send({ enabled: true, from: 'Alice Bobs <alice@example.com>', reminderDays: 5, reminderTime: '14:00' })
            .set('Accept', 'application/json')
            .expect(500)
        })
      })
    })

    describe('/body', () => {
      describe('GET', () => {
        context('reading data succeeds', () => {
          it('returns the data', () => {
            return request(app)
              .get('/api/v1/reminders/email/body')
              .set('Accept', 'application/json')
              .expect('Content-Type', /application\/json/)
              .expect(200)
              .then(res => {
                expect(JSON.stringify(res.body)).to.equal(JSON.stringify(expectedBody))
              })
          })
        })

        context('reading data fails', () => {
          beforeEach(() => {
            emailRemindersConfigDataFile.readData.throws(error500)
          })

          it('returns 500', () => {
            return request(app)
              .get('/api/v1/reminders/email/body')
              .set('Accept', 'application/json')
              .expect(500)
          })
        })
      })
      describe('PUT', () => {
        context('reading data succeeds', () => {
          context('writing data succeeds', () => {
            context('all data is missing', () => {
              it('fails with 400', () => {
                return request(app)
                  .put('/api/v1/reminders/email/body')
                  .set('Accept', 'application/json')
                  .expect(400)
              })
            })

            context('leader is missing', () => {
              it('fails with 400', () => {
                return request(app)
                  .put('/api/v1/reminders/email/body')
                  .send({ tailer: 'tailer text' })
                  .set('Accept', 'application/json')
                  .expect(400)
              })
            })

            context('leader is invalid', () => {
              it('fails with 400', () => {
                return request(app)
                  .put('/api/v1/reminders/email/body')
                  .send({ leader: true, tailer: 'tailer text' })
                  .set('Accept', 'application/json')
                  .expect(400)
              })
            })

            context('tailer is missing', () => {
              it('fails with 400', () => {
                return request(app)
                  .put('/api/v1/reminders/email/body')
                  .send({ leader: 'leader text' })
                  .set('Accept', 'application/json')
                  .expect(400)
              })
            })

            context('tailer is invalid', () => {
              it('fails with 400', () => {
                return request(app)
                  .put('/api/v1/reminders/email/body')
                  .send({ leader: 'leader text', tailer: true })
                  .set('Accept', 'application/json')
                  .expect(400)
              })
            })

            it('returns 200', () => {
              return request(app)
                .put('/api/v1/reminders/email/body')
                .send({ leader: 'leader text', tailer: 'tailer text' })
                .set('Accept', 'application/json')
                .expect(200)
                .then(() => {
                  const newData = cloneData(sampleConfigData)
                  newData.email.leader = 'leader text'
                  newData.email.tailer = 'tailer text'
                  expect(emailRemindersConfigDataFile.writeData).to.be.calledWith(newData)
                })
            })
          })

          context('writing data fails', () => {
            beforeEach(() => {
              emailRemindersConfigDataFile.writeData.throws(error500)
            })

            it('returns 500', () => {
              return request(app)
                .put('/api/v1/reminders/email/body')
                .send({ leader: 'leader text', tailer: 'tailer text' })
                .set('Accept', 'application/json')
                .expect(500)
            })
          })
        })

        context('reading data fails', () => {
          beforeEach(() => {
            emailRemindersConfigDataFile.readData.throws(error500)
          })

          it('returns 500', () => {
            return request(app)
              .put('/api/v1/reminders/email/body')
              .send({ leader: 'leader text', tailer: 'tailer text' })
              .set('Accept', 'application/json')
              .expect(500)
          })
        })
      })
    })

    describe('/smpt', () => {
      describe('GET', () => {
        context('reading data succeeds', () => {
          it('returns the data', () => {
            return request(app)
              .get('/api/v1/reminders/email/smtp')
              .set('Accept', 'application/json')
              .expect('Content-Type', /application\/json/)
              .expect(200)
              .then(res => {
                expect(JSON.stringify(res.body)).to.equal(JSON.stringify(expectedSMTP))
              })
          })
        })

        context('reading data fails', () => {
          beforeEach(() => {
            emailRemindersSMTPDataFile.readData.throws(error500)
          })

          it('returns 500', () => {
            return request(app)
              .get('/api/v1/reminders/email/smtp')
              .set('Accept', 'application/json')
              .expect(500)
          })
        })
      })
      describe('PUT', () => {
        context('reading data succeeds', () => {
          context('writing data succeeds', () => {
            context('all data is missing', () => {
              it('fails with 400', () => {
                return request(app)
                  .put('/api/v1/reminders/email/smtp')
                  .set('Accept', 'application/json')
                  .expect(400)
              })
            })

            context('host is missing', () => {
              it('fails with 400', () => {
                return request(app)
                  .put('/api/v1/reminders/email/smtp')
                  .send({ port: 123, user: 'dave', password: 'ImNotTellingYouMyPassword' })
                  .set('Accept', 'application/json')
                  .expect(400)
              })
            })

            context('host is invalid', () => {
              it('fails with 400', () => {
                return request(app)
                  .put('/api/v1/reminders/email/smtp')
                  .send({ host: 12345, port: 123, user: 'dave', password: 'ImNotTellingYouMyPassword' })
                  .set('Accept', 'application/json')
                  .expect(400)
              })
            })

            context('port is missing', () => {
              it('fails with 400', () => {
                return request(app)
                  .put('/api/v1/reminders/email/smtp')
                  .send({ host: 'foo.exmaple.net', user: 'dave', password: 'ImNotTellingYouMyPassword' })
                  .set('Accept', 'application/json')
                  .expect(400)
              })
            })

            context('port is invalid', () => {
              it('fails with 400', () => {
                return request(app)
                  .put('/api/v1/reminders/email/smtp')
                  .send({ host: 'foo.exmaple.net', port: true, user: 'dave', password: 'ImNotTellingYouMyPassword' })
                  .set('Accept', 'application/json')
                  .expect(400)
              })
            })

            context('user is missing', () => {
              it('fails with 400', () => {
                return request(app)
                  .put('/api/v1/reminders/email/smtp')
                  .send({ host: 'foo.exmaple.net', port: 123, password: 'ImNotTellingYouMyPassword' })
                  .set('Accept', 'application/json')
                  .expect(400)
              })
            })

            context('user is invalid', () => {
              it('fails with 400', () => {
                return request(app)
                  .put('/api/v1/reminders/email/smtp')
                  .send({ host: 'foo.exmaple.net', port: 123, user: true, password: 'ImNotTellingYouMyPassword' })
                  .set('Accept', 'application/json')
                  .expect(400)
              })
            })

            context('password is invalid', () => {
              it('fails with 400', () => {
                return request(app)
                  .put('/api/v1/reminders/email/smtp')
                  .send({ host: 'foo.exmaple.net', port: 123, user: 'dave', password: true })
                  .set('Accept', 'application/json')
                  .expect(400)
              })
            })

            context('password is missing', () => {
              it('returns 200', () => {
                return request(app)
                  .put('/api/v1/reminders/email/smtp')
                  .send({ host: 'foo.exmaple.net', port: 123, user: 'dave' })
                  .set('Accept', 'application/json')
                  .expect(200)
                  .then(() => {
                    const newData = cloneData(sampleSMTPData)
                    newData.host = 'foo.exmaple.net'
                    newData.port = 123
                    newData.user = 'dave'
                    expect(emailRemindersSMTPDataFile.writeData).to.be.calledWith(newData)
                  })
              })
            })

            it('returns 200', () => {
              return request(app)
                .put('/api/v1/reminders/email/smtp')
                .send({ host: 'foo.exmaple.net', port: 123, user: 'dave', password: 'ImNotTellingYouMyPassword' })
                .set('Accept', 'application/json')
                .expect(200)
                .then(() => {
                  const newData = cloneData(sampleSMTPData)
                  newData.host = 'foo.exmaple.net'
                  newData.port = 123
                  newData.user = 'dave'
                  newData.password = 'ImNotTellingYouMyPassword'
                  expect(emailRemindersSMTPDataFile.writeData).to.be.calledWith(newData)
                })
            })
          })

          context('writing data fails', () => {
            beforeEach(() => {
              emailRemindersSMTPDataFile.writeData.throws(error500)
            })

            it('returns 500', () => {
              return request(app)
                .put('/api/v1/reminders/email/smtp')
                .send({ host: 'foo.exmaple.net', port: 123, user: 'dave', password: 'ImNotTellingYouMyPassword' })
                .set('Accept', 'application/json')
                .expect(500)
            })
          })
        })

        context('reading data fails', () => {
          beforeEach(() => {
            emailRemindersSMTPDataFile.readData.throws(error500)
          })

          it('returns 500', () => {
            return request(app)
              .put('/api/v1/reminders/email/smtp')
              .send({ host: 'foo.exmaple.net', port: 123, user: 'dave', password: 'ImNotTellingYouMyPassword' })
              .set('Accept', 'application/json')
              .expect(500)
          })
        })
      })
    })

    describe('/next', () => {
      describe('GET', () => {
        context('reading data succeeds', () => {
          context('there is no season', () => {
            beforeEach(() => {
              seasonsDataFile.readData.returns({ seasons: [] })
            })

            it('returns 200 and an empty object', () => {
              return request(app)
                .get('/api/v1/reminders/email/next')
                .set('Accept', 'application/json')
                .expect('Content-Type', /application\/json/)
                .expect(200)
                .then(res => {
                  expect(JSON.stringify(res.body)).to.equal(JSON.stringify({}))
                })
            })
          })

          context('there is no competition', () => {
            beforeEach(() => {
              seasonsDataFile.readData.returns({ seasons: [{ competitions: [] }] })
            })

            it('returns 200 and an empty object', () => {
              return request(app)
                .get('/api/v1/reminders/email/next')
                .set('Accept', 'application/json')
                .expect('Content-Type', /application\/json/)
                .expect(200)
                .then(res => {
                  expect(JSON.stringify(res.body)).to.equal(JSON.stringify({}))
                })
            })
          })

          context('there is no next fixture', () => {
            beforeEach(() => {
              seasonsDataFile.readData.returns({ seasons: [{ competitions: [{ teams: [], fixtures: [] }] }] })
            })

            it('returns 200 and an empty object', () => {
              return request(app)
                .get('/api/v1/reminders/email/next')
                .set('Accept', 'application/json')
                .expect('Content-Type', /application\/json/)
                .expect(200)
                .then(res => {
                  expect(JSON.stringify(res.body)).to.equal(JSON.stringify({}))
                })
            })
          })

          context('there is a next fixture in a week', () => {
            let clock
            const expectedData = {
              time: '2020-01-04T10:00:00.000Z',
              recipients: 'contact1@teamName1,contact1@teamName2,contact3@teamName2,contact2@teamName2,contact1@teamName3',
              subject: 'seasonName1 Match Reminder, Fri 10-Jan-20 at Venue 1',
              body: 'this is\na leaderFri 10-Jan-20 at Venue 1\n19:00 teamName1 v teamName2 (teamName3 ref)\n20:00 teamName2 v teamName3\n21:00 teamName3 v teamName1 (teamName2 ref)\nthis is\na tailer'
            }

            beforeEach(() => {
              clock = sinon.useFakeTimers(new Date('Fri 03-Jan-20'))
            })

            afterEach(() => {
              clock.restore()
            })

            it('returns 200 and a nextFixture object', () => {
              return request(app)
                .get('/api/v1/reminders/email/next')
                .set('Accept', 'application/json')
                .expect('Content-Type', /application\/json/)
                .expect(200)
                .then(res => {
                  expect(JSON.stringify(res.body)).to.equal(JSON.stringify(expectedData))
                })
            })
          })

          context('there is a next fixture in over 14 days', () => {
            let clock
            const expectedData = {
              time: '2020-01-03T10:00:00.000Z',
              recipients: 'contact1@teamName1,contact1@teamName2,contact3@teamName2,contact2@teamName2,contact1@teamName3',
              subject: 'seasonName1 Match Reminder, Fri 17-Jan-20 at Venue 1',
              body: 'this is\na leaderFri 17-Jan-20 at Venue 1\n19:00 teamName1 v teamName2 (teamName3 ref)\n20:00 teamName2 v teamName3\n21:00 teamName3 v teamName1 (teamName2 ref)\nMatch Adjudicator: teamName3\nthis is\na tailer'
            }

            beforeEach(() => {
              const configDate = cloneData(sampleConfigData)
              configDate.reminderDays = 14
              emailRemindersConfigDataFile.readData.returns(configDate)
              clock = sinon.useFakeTimers(new Date('Fri 01-Jan-20'))
            })

            afterEach(() => {
              clock.restore()
            })

            it('returns 200 and a nextFixture object', () => {
              return request(app)
                .get('/api/v1/reminders/email/next')
                .set('Accept', 'application/json')
                .expect('Content-Type', /application\/json/)
                .expect(200)
                .then(res => {
                  expect(JSON.stringify(res.body)).to.equal(JSON.stringify(expectedData))
                })
            })
          })
        })

        context('reading config data fails', () => {
          beforeEach(() => {
            emailRemindersConfigDataFile.readData.throws(error500)
          })

          it('returns 500', () => {
            return request(app)
              .get('/api/v1/reminders/email/next')
              .set('Accept', 'application/json')
              .expect(500)
          })
        })

        context('reading seasons data fails', () => {
          beforeEach(() => {
            seasonsDataFile.readData.throws(error500)
          })

          it('returns 500', () => {
            return request(app)
              .get('/api/v1/reminders/email/next')
              .set('Accept', 'application/json')
              .expect(500)
          })
        })
      })
    })
  })
})
