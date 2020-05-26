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

const error500 = new Error('Internal failure')
error500.status = 500
const sampleData = {
  seasons: [
    {
      id: 1,
      name: 'seasonName1',
      competitions: []
    },
    {
      id: 3,
      name: 'seasonName3',
      competitions: []
    },
    {
      id: 2,
      name: 'seasonName2',
      competitions: [
        {
          id: 1,
          name: 'competitionName1',
          teams: [],
          fixtures: []
        },
        {
          id: 3,
          name: 'competitionName3',
          teams: [],
          fixtures: []
        },
        {
          id: 2,
          name: 'competitionName2',
          teams: [
            {
              id: 1,
              name: 'teamName1',
              contacts: [{ id: 1, email: 'contact1@teamName1' }]
            },
            {
              id: 3,
              name: 'teamName3',
              contacts: [{ id: 1, email: 'contact1@teamName3' }]
            },
            {
              id: 2,
              name: 'teamName2',
              contacts: [
                { id: 1, email: 'contact1@teamName2' },
                { id: 3, email: 'contact3@teamName2' },
                { id: 2, email: 'contact2@teamName2' }
              ]
            }
          ],
          fixtures: [
            {
              id: 1,
              date: 'Fri 10-Jan-20',
              venue: 'Venue 1',
              matches: []
            },
            {
              id: 3,
              date: 'Fri 24-Jan-20',
              venue: 'Venue 1',
              matches: []
            },
            {
              id: 2,
              date: 'Fri 17-Jan-20',
              venue: 'Venue 1',
              adjudicator: 3,
              matches: [
                { id: 1, time: '20:00', homeTeam: 2, awayTeam: 3, refTeam: 1 },
                { id: 3, time: '19:00', homeTeam: 1, awayTeam: 2, refTeam: 3 },
                { id: 2, time: '21:00', homeTeam: 3, awayTeam: 1, refTeam: 2 }
              ]
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
const expectedData = {
  seasons: [
    {
      id: 1,
      name: 'seasonName1',
      competitions: []
    },
    {
      id: 3,
      name: 'seasonName3',
      competitions: []
    },
    {
      id: 2,
      name: 'seasonName2',
      competitions: [
        {
          id: 1,
          name: 'competitionName1',
          teams: [],
          fixtures: []
        },
        {
          id: 3,
          name: 'competitionName3',
          teams: [],
          fixtures: []
        },
        {
          id: 2,
          name: 'competitionName2',
          teams: [
            {
              id: 1,
              name: 'teamName1',
              contacts: [{ id: 1, email: 'contact1@teamName1' }]
            },
            {
              id: 3,
              name: 'teamName3',
              contacts: [{ id: 1, email: 'contact1@teamName3' }]
            },
            {
              id: 2,
              name: 'teamName2',
              contacts: [
                { id: 1, email: 'contact1@teamName2' },
                { id: 3, email: 'contact3@teamName2' },
                { id: 2, email: 'contact2@teamName2' }
              ]
            }
          ],
          fixtures: [
            {
              id: 4,
              date: 'Fri 03-Jan-20',
              venue: 'Venue 1',
              matches: []
            },
            {
              id: 1,
              date: 'Fri 10-Jan-20',
              venue: 'Venue 1',
              matches: []
            },
            {
              id: 2,
              date: 'Fri 17-Jan-20',
              venue: 'Venue 1',
              adjudicator: 3,
              matches: [
                { id: 1, time: '20:00', homeTeam: 2, awayTeam: 3, refTeam: 1 },
                { id: 3, time: '19:00', homeTeam: 1, awayTeam: 2, refTeam: 3 },
                { id: 2, time: '21:00', homeTeam: 3, awayTeam: 1, refTeam: 2 }
              ]
            },
            {
              id: 3,
              date: 'Fri 24-Jan-20',
              venue: 'Venue 1',
              matches: []
            }
          ]
        }
      ]
    }
  ]
}

function cloneSampleData () {
  return JSON.parse(JSON.stringify(sampleData))
}

function cloneExpectedData () {
  return JSON.parse(JSON.stringify(expectedData))
}

describe('/api/v1', () => {
  let app

  before(() => {
    app = express()
    app.use(bodyParser.json())
    app.use('/api/v1', router)
  })

  beforeEach(() => {
    sinon.stub(seasonsDataFile, 'readData').returns(cloneSampleData())
    sinon.stub(seasonsDataFile, 'writeData').returns()
  })

  afterEach(() => {
    seasonsDataFile.readData.restore()
    seasonsDataFile.writeData.restore()
  })

  describe('/seasons', () => {
    describe('/get', () => {
      context('reading data succeeds', () => {
        it('returns the data with matches in date order', () => {
          return request(app)
            .get('/api/v1/seasons')
            .set('Accept', 'application/json')
            .expect('Content-Type', /application\/json/)
            .expect(200)
            .then(res => {
              expect(JSON.stringify(res.body)).to.equal(JSON.stringify(expectedData.seasons))
            })
        })
      })

      context('reading data fails', () => {
        beforeEach(() => {
          seasonsDataFile.readData.throws(error500)
        })

        it('returns 500', () => {
          return request(app)
            .get('/api/v1/seasons')
            .set('Accept', 'application/json')
            .expect(500)
        })
      })
    })
    describe('/post', () => {
      context('reading data succeeds', () => {
        context('writing data succeeds', () => {
          context('seasonName is missing', () => {
            it('returns 400', () => {
              return request(app)
                .post('/api/v1/seasons')
                .set('Accept', 'application/json')
                .expect(400)
            })
          })

          context('seasonName is zero length', () => {
            it('returns 400', () => {
              return request(app)
                .post('/api/v1/seasons')
                .send({ name: '' })
                .set('Accept', 'application/json')
                .expect(400)
            })
          })

          context('season already exists', () => {
            it('returns the existing id', () => {
              return request(app)
                .post('/api/v1/seasons')
                .send({ name: 'seasonName2' })
                .set('Accept', 'application/json')
                .expect('Content-Type', /application\/json/)
                .expect(200)
                .then(res => {
                  expect(JSON.stringify(res.body)).to.equal(JSON.stringify({ id: 2 }))
                  expect(seasonsDataFile.writeData.callCount).to.equal(0)
                })
            })
          })

          context('posted data is not JSON', () => {
            it('returns 400', () => {
              return request(app)
                .post('/api/v1/seasons')
                .send('name=seasonName2')
                .set('Accept', 'application/json')
                .expect(400)
            })
          })

          it('returns the new id', () => {
            return request(app)
              .post('/api/v1/seasons')
              .send({ name: 'NewSeason' })
              .set('Accept', 'application/json')
              .expect('Content-Type', /application\/json/)
              .expect(200)
              .then(res => {
                expect(JSON.stringify(res.body)).to.equal(JSON.stringify({ id: 4 }))
                const newData = cloneSampleData()
                newData.seasons.push({ id: 4, name: 'NewSeason', competitions: [] })
                expect(seasonsDataFile.writeData).to.be.calledWith(newData)
              })
          })
        })

        context('writing data fails', () => {
          beforeEach(() => {
            seasonsDataFile.writeData.throws(error500)
          })

          it('returns 500', () => {
            return request(app)
              .post('/api/v1/seasons')
              .send({ name: 'NewSeason' })
              .set('Accept', 'application/json')
              .expect(500)
              .then(() => {
                const newData = cloneSampleData()
                newData.seasons.push({ id: 4, name: 'NewSeason', competitions: [] })
                expect(seasonsDataFile.writeData).to.be.calledWith(newData)
              })
          })
        })
      })

      context('reading data fails', () => {
        beforeEach(() => {
          seasonsDataFile.readData.throws(error500)
        })

        it('returns 500', () => {
          return request(app)
            .post('/api/v1/seasons')
            .send({ name: 'NewSeason' })
            .set('Accept', 'application/json')
            .expect(500)
            .then(() => {
              expect(seasonsDataFile.writeData.callCount).to.equal(0)
            })
        })
      })
    })
  })

  describe('/seasons/:seasonId', () => {
    describe('/get', () => {
      context('reading data succeeds', () => {
        context('seasonId is invalid', () => {
          it('returns 400', () => {
            return request(app)
              .get('/api/v1/seasons/a')
              .set('Accept', 'application/json')
              .expect(400)
          })
        })

        context('season does not exist', () => {
          it('returns 404', () => {
            return request(app)
              .get('/api/v1/seasons/1000')
              .set('Accept', 'application/json')
              .expect(404)
          })
        })

        it('returns the data', () => {
          return request(app)
            .get('/api/v1/seasons/2')
            .set('Accept', 'application/json')
            .expect('Content-Type', /application\/json/)
            .expect(200)
            .then(res => {
              expect(JSON.stringify(res.body)).to.equal(JSON.stringify(expectedData.seasons[2]))
            })
        })
      })

      context('reading data fails', () => {
        beforeEach(() => {
          seasonsDataFile.readData.throws(error500)
        })

        it('returns 500', () => {
          return request(app)
            .get('/api/v1/seasons/2')
            .set('Accept', 'application/json')
            .expect(500)
        })
      })
    })
    describe('/put', () => {
      context('reading data succeeds', () => {
        context('writing data succeeds', () => {
          context('seasonId is invalid', () => {
            it('returns 400', () => {
              return request(app)
                .put('/api/v1/seasons/a')
                .set('Accept', 'application/json')
                .expect(400)
            })
          })

          context('seasonName is missing', () => {
            it('returns 400', () => {
              return request(app)
                .put('/api/v1/seasons/2')
                .set('Accept', 'application/json')
                .expect(400)
            })
          })

          context('seasonName is zero length', () => {
            it('returns 400', () => {
              return request(app)
                .put('/api/v1/seasons/2')
                .send({ name: '' })
                .set('Accept', 'application/json')
                .expect(400)
            })
          })

          context('posted data is not JSON', () => {
            it('returns 400', () => {
              return request(app)
                .put('/api/v1/seasons/2')
                .send('name=seasonName2')
                .set('Accept', 'application/json')
                .expect(400)
            })
          })

          context('season does not exist', () => {
            it('returns 404', () => {
              return request(app)
                .put('/api/v1/seasons/1000')
                .send({ name: 'NewSeason2Name' })
                .set('Accept', 'application/json')
                .expect(404)
                .then(res => {
                  expect(seasonsDataFile.writeData.callCount).to.equal(0)
                })
            })
          })

          context('seasonName already used', () => {
            it('returns 409', () => {
              return request(app)
                .put('/api/v1/seasons/2')
                .send({ name: 'seasonName1' })
                .set('Accept', 'application/json')
                .expect(409)
                .then(res => {
                  expect(seasonsDataFile.writeData.callCount).to.equal(0)
                })
            })
          })

          it('returns the new id', () => {
            return request(app)
              .put('/api/v1/seasons/2')
              .send({ name: 'NewSeason2Name' })
              .set('Accept', 'application/json')
              .expect('Content-Type', /application\/json/)
              .expect(200)
              .then(res => {
                const newData = cloneSampleData()
                newData.seasons[2].name = 'NewSeason2Name'
                expect(JSON.stringify(res.body)).to.equal(JSON.stringify(newData.seasons[2]))
                expect(seasonsDataFile.writeData).to.be.calledWith(newData)
              })
          })
        })

        context('writing data fails', () => {
          beforeEach(() => {
            seasonsDataFile.writeData.throws(error500)
          })

          it('returns 500', () => {
            return request(app)
              .put('/api/v1/seasons/2')
              .send({ name: 'NewSeason2Name' })
              .set('Accept', 'application/json')
              .expect(500)
              .then(() => {
                const newData = cloneSampleData()
                newData.seasons[2].name = 'NewSeason2Name'
                expect(seasonsDataFile.writeData).to.be.calledWith(newData)
              })
          })
        })
      })

      context('reading data fails', () => {
        beforeEach(() => {
          seasonsDataFile.readData.throws(error500)
        })

        it('returns 500', () => {
          return request(app)
            .put('/api/v1/seasons/2')
            .send({ name: 'NewSeason' })
            .set('Accept', 'application/json')
            .expect(500)
            .then(() => {
              expect(seasonsDataFile.writeData.callCount).to.equal(0)
            })
        })
      })
    })
    describe('/delete', () => {
      context('reading data succeeds', () => {
        context('writing data succeeds', () => {
          context('seasonId is invalid', () => {
            it('returns 400', () => {
              return request(app)
                .delete('/api/v1/seasons/a')
                .set('Accept', 'application/json')
                .expect(400)
            })
          })

          context('season does not exist', () => {
            it('returns 200', () => {
              return request(app)
                .delete('/api/v1/seasons/1000')
                .set('Accept', 'application/json')
                .expect(200)
                .then(() => {
                  expect(seasonsDataFile.writeData.callCount).to.equal(0)
                })
            })
          })

          it('deletes the data', () => {
            return request(app)
              .delete('/api/v1/seasons/2')
              .set('Accept', 'application/json')
              .expect(200)
              .then(() => {
                const newData = cloneSampleData()
                newData.seasons.splice(2, 1)
                expect(seasonsDataFile.writeData).to.be.calledWith(newData)
              })
          })
        })

        context('writing data fails', () => {
          beforeEach(() => {
            seasonsDataFile.writeData.throws(error500)
          })

          it('returns 500', () => {
            return request(app)
              .delete('/api/v1/seasons/2')
              .set('Accept', 'application/json')
              .expect(500)
              .then(() => {
                const newData = cloneSampleData()
                newData.seasons.splice(2, 1)
                expect(seasonsDataFile.writeData).to.be.calledWith(newData)
              })
          })
        })
      })

      context('reading data fails', () => {
        beforeEach(() => {
          seasonsDataFile.readData.throws(error500)
        })

        it('returns 500', () => {
          return request(app)
            .delete('/api/v1/seasons/2')
            .set('Accept', 'application/json')
            .expect(500)
        })
      })
    })
  })

  describe('/seasons/:seasonId/competitions', () => {
    describe('/get', () => {
      context('reading data succeeds', () => {
        context('seasonId is invalid', () => {
          it('returns 400', () => {
            return request(app)
              .get('/api/v1/seasons/a/competitions')
              .set('Accept', 'application/json')
              .expect(400)
          })
        })

        context('season does not exist', () => {
          it('returns 404', () => {
            return request(app)
              .get('/api/v1/seasons/1000/competitions')
              .set('Accept', 'application/json')
              .expect(404)
          })
        })

        it('returns the data', () => {
          return request(app)
            .get('/api/v1/seasons/2/competitions')
            .set('Accept', 'application/json')
            .expect('Content-Type', /application\/json/)
            .expect(200)
            .then(res => {
              expect(JSON.stringify(res.body)).to.equal(JSON.stringify(expectedData.seasons[2].competitions))
            })
        })
      })

      context('reading data fails', () => {
        beforeEach(() => {
          seasonsDataFile.readData.throws(error500)
        })

        it('returns 500', () => {
          return request(app)
            .get('/api/v1/seasons/2/competitions')
            .set('Accept', 'application/json')
            .expect(500)
        })
      })
    })
    describe('/post', () => {
      context('reading data succeeds', () => {
        context('writing data succeeds', () => {
          context('season does not exist', () => {
            it('returns 404', () => {
              return request(app)
                .post('/api/v1/seasons/1000/competitions')
                .send({ name: 'competitionName2' })
                .set('Accept', 'application/json')
                .expect(404)
                .then(res => {
                  expect(seasonsDataFile.writeData.callCount).to.equal(0)
                })
            })
          })

          context('competitionName is missing', () => {
            it('returns 400', () => {
              return request(app)
                .post('/api/v1/seasons/2/competitions')
                .set('Accept', 'application/json')
                .expect(400)
            })
          })

          context('competitionName is zero length', () => {
            it('returns 400', () => {
              return request(app)
                .post('/api/v1/seasons/2/competitions')
                .send({ name: '' })
                .set('Accept', 'application/json')
                .expect(400)
            })
          })

          context('posted data is not JSON', () => {
            it('returns 400', () => {
              return request(app)
                .post('/api/v1/seasons/2/competitions')
                .send('name=competitionName2')
                .set('Accept', 'application/json')
                .expect(400)
            })
          })

          context('competition already exists', () => {
            it('returns the existing id', () => {
              return request(app)
                .post('/api/v1/seasons/2/competitions')
                .send({ name: 'competitionName2' })
                .set('Accept', 'application/json')
                .expect('Content-Type', /application\/json/)
                .expect(200)
                .then(res => {
                  expect(JSON.stringify(res.body)).to.equal(JSON.stringify({ id: 2 }))
                  expect(seasonsDataFile.writeData.callCount).to.equal(0)
                })
            })
          })

          it('returns the new id', () => {
            return request(app)
              .post('/api/v1/seasons/2/competitions')
              .send({ name: 'NewCompetition' })
              .set('Accept', 'application/json')
              .expect('Content-Type', /application\/json/)
              .expect(200)
              .then(res => {
                expect(JSON.stringify(res.body)).to.equal(JSON.stringify({ id: 4 }))
                const newData = cloneExpectedData()
                newData.seasons[2].competitions.push({ id: 4, name: 'NewCompetition', fixtures: [], teams: [] })
                expect(seasonsDataFile.writeData).to.be.calledWith(newData)
              })
          })
        })

        context('writing data fails', () => {
          beforeEach(() => {
            seasonsDataFile.writeData.throws(error500)
          })

          it('returns 500', () => {
            return request(app)
              .post('/api/v1/seasons/2/competitions')
              .send({ name: 'NewCompetition' })
              .set('Accept', 'application/json')
              .expect(500)
              .then(() => {
                const newData = cloneExpectedData()
                newData.seasons[2].competitions.push({ id: 4, name: 'NewCompetition', fixtures: [], teams: [] })
                expect(seasonsDataFile.writeData).to.be.calledWith(newData)
              })
          })
        })
      })

      context('reading data fails', () => {
        beforeEach(() => {
          seasonsDataFile.readData.throws(error500)
        })

        it('returns 500', () => {
          return request(app)
            .post('/api/v1/seasons/2/competitions')
            .send({ name: 'NewCompetition' })
            .set('Accept', 'application/json')
            .expect(500)
            .then(() => {
              expect(seasonsDataFile.writeData.callCount).to.equal(0)
            })
        })
      })
    })
  })

  describe('/seasons/:seasonId/competitions/:competitionId', () => {
    describe('/get', () => {
      context('reading data succeeds', () => {
        context('seasonId is invalid', () => {
          it('returns 400', () => {
            return request(app)
              .get('/api/v1/seasons/a/competitions/2')
              .set('Accept', 'application/json')
              .expect(400)
          })
        })

        context('competitionId is invalid', () => {
          it('returns 400', () => {
            return request(app)
              .get('/api/v1/seasons/2/competitions/a')
              .set('Accept', 'application/json')
              .expect(400)
          })
        })

        context('season does not exist', () => {
          it('returns 404', () => {
            return request(app)
              .get('/api/v1/seasons/1000/competitions/2')
              .set('Accept', 'application/json')
              .expect(404)
          })
        })

        context('competition does not exist', () => {
          it('returns 404', () => {
            return request(app)
              .get('/api/v1/seasons/2/competitions/1000')
              .set('Accept', 'application/json')
              .expect(404)
          })
        })

        it('returns the data', () => {
          return request(app)
            .get('/api/v1/seasons/2/competitions/2')
            .set('Accept', 'application/json')
            .expect('Content-Type', /application\/json/)
            .expect(200)
            .then(res => {
              expect(JSON.stringify(res.body)).to.equal(JSON.stringify(expectedData.seasons[2].competitions[2]))
            })
        })
      })

      context('reading data fails', () => {
        beforeEach(() => {
          seasonsDataFile.readData.throws(error500)
        })

        it('returns 500', () => {
          return request(app)
            .get('/api/v1/seasons/2/competitions/2')
            .set('Accept', 'application/json')
            .expect(500)
        })
      })
    })
    describe('/put', () => {
      context('reading data succeeds', () => {
        context('writing data succeeds', () => {
          context('seasonId is invalid', () => {
            it('returns 400', () => {
              return request(app)
                .put('/api/v1/seasons/a/competitions/2')
                .set('Accept', 'application/json')
                .expect(400)
            })
          })

          context('competitionId is invalid', () => {
            it('returns 400', () => {
              return request(app)
                .put('/api/v1/seasons/2/competitions/a')
                .set('Accept', 'application/json')
                .expect(400)
            })
          })

          context('competitionName is missing', () => {
            it('returns 400', () => {
              return request(app)
                .put('/api/v1/seasons/2/competitions/2')
                .set('Accept', 'application/json')
                .expect(400)
            })
          })

          context('competitionName is zero length', () => {
            it('returns 400', () => {
              return request(app)
                .put('/api/v1/seasons/2/competitions/2')
                .send({ name: '' })
                .set('Accept', 'application/json')
                .expect(400)
            })
          })

          context('posted data is not JSON', () => {
            it('returns 400', () => {
              return request(app)
                .put('/api/v1/seasons/2/competitions/2')
                .send('name=competitionName2')
                .set('Accept', 'application/json')
                .expect(400)
            })
          })

          context('season does not exist', () => {
            it('returns 404', () => {
              return request(app)
                .put('/api/v1/seasons/1000/competitions/2')
                .send({ name: 'NewCompetition2Name' })
                .set('Accept', 'application/json')
                .expect(404)
                .then(res => {
                  expect(seasonsDataFile.writeData.callCount).to.equal(0)
                })
            })
          })

          context('competition does not exist', () => {
            it('returns 404', () => {
              return request(app)
                .put('/api/v1/seasons/2/competitions/1000')
                .send({ name: 'NewCompetition2Name' })
                .set('Accept', 'application/json')
                .expect(404)
                .then(res => {
                  expect(seasonsDataFile.writeData.callCount).to.equal(0)
                })
            })
          })

          context('competitionName already used', () => {
            it('returns 409', () => {
              return request(app)
                .put('/api/v1/seasons/2/competitions/2')
                .send({ name: 'competitionName1' })
                .set('Accept', 'application/json')
                .expect(409)
                .then(res => {
                  expect(seasonsDataFile.writeData.callCount).to.equal(0)
                })
            })
          })

          it('returns the new id', () => {
            return request(app)
              .put('/api/v1/seasons/2/competitions/2')
              .send({ name: 'NewCompetition2Name' })
              .set('Accept', 'application/json')
              .expect('Content-Type', /application\/json/)
              .expect(200)
              .then(res => {
                const newData = cloneExpectedData()
                newData.seasons[2].competitions[2].name = 'NewCompetition2Name'
                expect(JSON.stringify(res.body)).to.equal(JSON.stringify(newData.seasons[2].competitions[2]))
                expect(seasonsDataFile.writeData).to.be.calledWith(newData)
              })
          })
        })

        context('writing data fails', () => {
          beforeEach(() => {
            seasonsDataFile.writeData.throws(error500)
          })

          it('returns 500', () => {
            return request(app)
              .put('/api/v1/seasons/2/competitions/2')
              .send({ name: 'NewCompetition2Name' })
              .set('Accept', 'application/json')
              .expect(500)
              .then(() => {
                const newData = cloneExpectedData()
                newData.seasons[2].competitions[2].name = 'NewCompetition2Name'
                expect(seasonsDataFile.writeData).to.be.calledWith(newData)
              })
          })
        })
      })

      context('reading data fails', () => {
        beforeEach(() => {
          seasonsDataFile.readData.throws(error500)
        })

        it('returns 500', () => {
          return request(app)
            .put('/api/v1/seasons/2/competitions/2')
            .send({ name: 'NewCompetition' })
            .set('Accept', 'application/json')
            .expect(500)
            .then(() => {
              expect(seasonsDataFile.writeData.callCount).to.equal(0)
            })
        })
      })
    })
    describe('/delete', () => {
      context('reading data succeeds', () => {
        context('writing data succeeds', () => {
          context('seasonId is invalid', () => {
            it('returns 400', () => {
              return request(app)
                .delete('/api/v1/seasons/a/competitions/2')
                .set('Accept', 'application/json')
                .expect(400)
            })
          })

          context('season does not exist', () => {
            it('returns 404', () => {
              return request(app)
                .delete('/api/v1/seasons/1000/competitions/2')
                .set('Accept', 'application/json')
                .expect(404)
                .then(() => {
                  expect(seasonsDataFile.writeData.callCount).to.equal(0)
                })
            })
          })

          context('competitionId is invalid', () => {
            it('returns 400', () => {
              return request(app)
                .delete('/api/v1/seasons/2/competitions/a')
                .set('Accept', 'application/json')
                .expect(400)
            })
          })

          context('competition does not exist', () => {
            it('returns 200', () => {
              return request(app)
                .delete('/api/v1/seasons/2/competitions/1000')
                .set('Accept', 'application/json')
                .expect(200)
                .then(() => {
                  expect(seasonsDataFile.writeData.callCount).to.equal(0)
                })
            })
          })

          it('deletes the data', () => {
            return request(app)
              .delete('/api/v1/seasons/2/competitions/2')
              .set('Accept', 'application/json')
              .expect(200)
              .then(() => {
                const newData = cloneExpectedData()
                newData.seasons[2].competitions.splice(2, 1)
                expect(seasonsDataFile.writeData).to.be.calledWith(newData)
              })
          })
        })

        context('writing data fails', () => {
          beforeEach(() => {
            seasonsDataFile.writeData.throws(error500)
          })

          it('returns 500', () => {
            return request(app)
              .delete('/api/v1/seasons/2/competitions/2')
              .set('Accept', 'application/json')
              .expect(500)
              .then(() => {
                const newData = cloneExpectedData()
                newData.seasons[2].competitions.splice(2, 1)
                expect(seasonsDataFile.writeData).to.be.calledWith(newData)
              })
          })
        })
      })

      context('reading data fails', () => {
        beforeEach(() => {
          seasonsDataFile.readData.throws(error500)
        })

        it('returns 500', () => {
          return request(app)
            .delete('/api/v1/seasons/2/competitions/2')
            .set('Accept', 'application/json')
            .expect(500)
        })
      })
    })
  })

  describe('/seasons/:seasonId/competitions/:competitionId/fixtures', () => {
    describe('/get', () => {
      context('reading data succeeds', () => {
        context('seasonId is invalid', () => {
          it('returns 400', () => {
            return request(app)
              .get('/api/v1/seasons/a/competitions/2/fixtures')
              .set('Accept', 'application/json')
              .expect(400)
          })
        })

        context('competitionId is invalid', () => {
          it('returns 400', () => {
            return request(app)
              .get('/api/v1/seasons/2/competitions/a/fixtures')
              .set('Accept', 'application/json')
              .expect(400)
          })
        })

        context('season does not exist', () => {
          it('returns 404', () => {
            return request(app)
              .get('/api/v1/seasons/1000/competitions/2/fixtures')
              .set('Accept', 'application/json')
              .expect(404)
          })
        })

        context('competition does not exist', () => {
          it('returns 404', () => {
            return request(app)
              .get('/api/v1/seasons/2/competitions/1000/fixtures')
              .set('Accept', 'application/json')
              .expect(404)
          })
        })

        it('returns the data', () => {
          return request(app)
            .get('/api/v1/seasons/2/competitions/2/fixtures')
            .set('Accept', 'application/json')
            .expect('Content-Type', /application\/json/)
            .expect(200)
            .then(res => {
              expect(JSON.stringify(res.body)).to.equal(JSON.stringify(expectedData.seasons[2].competitions[2].fixtures))
            })
        })
      })

      context('reading data fails', () => {
        beforeEach(() => {
          seasonsDataFile.readData.throws(error500)
        })

        it('returns 500', () => {
          return request(app)
            .get('/api/v1/seasons/2/competitions/2/fixtures')
            .set('Accept', 'application/json')
            .expect(500)
        })
      })
    })
    describe('/post', () => {
      context('reading data succeeds', () => {
        context('writing data succeeds', () => {
          context('season does not exist', () => {
            it('returns 404', () => {
              return request(app)
                .post('/api/v1/seasons/1000/competitions/2/fixtures')
                .send({
                  date: 'Fri 31-Jan-20',
                  venue: 'Venue 1',
                  adjudicator: ''
                })
                .set('Accept', 'application/json')
                .expect(404)
                .then(res => {
                  expect(seasonsDataFile.writeData.callCount).to.equal(0)
                })
            })
          })

          context('competition does not exist', () => {
            it('returns 404', () => {
              return request(app)
                .post('/api/v1/seasons/2/competitions/1000/fixtures')
                .send({
                  date: 'Fri 31-Jan-20',
                  venue: 'Venue 1',
                  adjudicator: ''
                })
                .set('Accept', 'application/json')
                .expect(404)
                .then(res => {
                  expect(seasonsDataFile.writeData.callCount).to.equal(0)
                })
            })
          })

          context('fixture is missing', () => {
            it('returns 400', () => {
              return request(app)
                .post('/api/v1/seasons/2/competitions/2/fixtures')
                .set('Accept', 'application/json')
                .expect(400)
            })
          })

          context('date is missing', () => {
            it('returns 400', () => {
              return request(app)
                .post('/api/v1/seasons/2/competitions/2/fixtures')
                .send({
                  venue: 'Venue 1',
                  adjudicator: 'teamName1'
                })
                .set('Accept', 'application/json')
                .expect(400)
            })
          })

          context('date is zero length', () => {
            it('returns 400', () => {
              return request(app)
                .post('/api/v1/seasons/2/competitions/2/fixtures')
                .send({
                  date: '',
                  venue: 'Venue 1',
                  adjudicator: 'teamName1'
                })
                .set('Accept', 'application/json')
                .expect(400)
            })
          })

          context('venue is missing', () => {
            it('returns 400', () => {
              return request(app)
                .post('/api/v1/seasons/2/competitions/2/fixtures')
                .send({
                  date: 'Fri 31-Jan-20',
                  adjudicator: 'teamName1'
                })
                .set('Accept', 'application/json')
                .expect(400)
            })
          })

          context('venue is zero length', () => {
            it('returns 400', () => {
              return request(app)
                .post('/api/v1/seasons/2/competitions/2/fixtures')
                .send({
                  date: 'Fri 31-Jan-20',
                  venue: '',
                  adjudicator: 'teamName1'
                })
                .set('Accept', 'application/json')
                .expect(400)
            })
          })

          context('adjudicator is missing', () => {
            it('returns the new id', () => {
              return request(app)
                .post('/api/v1/seasons/2/competitions/2/fixtures')
                .send({
                  date: 'Fri 31-Jan-20',
                  venue: 'Venue 1'
                })
                .set('Accept', 'application/json')
                .expect(200)
                .then(res => {
                  expect(JSON.stringify(res.body)).to.equal(JSON.stringify({ id: 5 }))
                  const newData = cloneExpectedData()
                  newData.seasons[2].competitions[2].fixtures.push({
                    id: 5,
                    date: 'Fri 31-Jan-20',
                    venue: 'Venue 1',
                    matches: []
                  })
                  expect(seasonsDataFile.writeData).to.be.calledWith(newData)
                })
            })
          })

          context('adjudicator is zero length', () => {
            it('returns the new id', () => {
              return request(app)
                .post('/api/v1/seasons/2/competitions/2/fixtures')
                .send({
                  date: 'Fri 31-Jan-20',
                  venue: 'Venue 1',
                  adjudicator: ''
                })
                .set('Accept', 'application/json')
                .expect(200)
                .then(res => {
                  expect(JSON.stringify(res.body)).to.equal(JSON.stringify({ id: 5 }))
                  const newData = cloneExpectedData()
                  newData.seasons[2].competitions[2].fixtures.push({
                    id: 5,
                    date: 'Fri 31-Jan-20',
                    venue: 'Venue 1',
                    matches: []
                  })
                  expect(seasonsDataFile.writeData).to.be.calledWith(newData)
                })
            })
          })

          context('adjudicator team does not exist', () => {
            it('returns 400', () => {
              return request(app)
                .post('/api/v1/seasons/2/competitions/2/fixtures')
                .send({
                  date: 'Fri 31-Jan-20',
                  venue: 'Venue 1',
                  adjudicator: 'teamName4'
                })
                .set('Accept', 'application/json')
                .expect(400)
            })
          })

          context('posted data is not JSON', () => {
            it('returns 400', () => {
              return request(app)
                .post('/api/v1/seasons/2/competitions/2/fixtures')
                .send('name=fixture')
                .set('Accept', 'application/json')
                .expect(400)
            })
          })

          it('returns the new id', () => {
            return request(app)
              .post('/api/v1/seasons/2/competitions/2/fixtures')
              .send({
                date: 'Fri 31-Jan-20',
                venue: 'Venue 1',
                adjudicator: 'teamName1'
              })
              .set('Accept', 'application/json')
              .expect('Content-Type', /application\/json/)
              .expect(200)
              .then(res => {
                expect(JSON.stringify(res.body)).to.equal(JSON.stringify({ id: 5 }))
                const newData = cloneExpectedData()
                newData.seasons[2].competitions[2].fixtures.push({
                  id: 5,
                  date: 'Fri 31-Jan-20',
                  venue: 'Venue 1',
                  adjudicator: 1,
                  matches: []
                })
                expect(seasonsDataFile.writeData).to.be.calledWith(newData)
              })
          })
        })

        context('writing data fails', () => {
          beforeEach(() => {
            seasonsDataFile.writeData.throws(error500)
          })

          it('returns 500', () => {
            return request(app)
              .post('/api/v1/seasons/2/competitions/2/fixtures')
              .send({
                date: 'Fri 31-Jan-20',
                venue: 'Venue 1',
                adjudicator: 'teamName1'
              })
              .set('Accept', 'application/json')
              .expect(500)
              .then(() => {
                const newData = cloneExpectedData()
                newData.seasons[2].competitions[2].fixtures.push({
                  id: 5,
                  date: 'Fri 31-Jan-20',
                  venue: 'Venue 1',
                  adjudicator: 1,
                  matches: []
                })
                expect(seasonsDataFile.writeData).to.be.calledWith(newData)
              })
          })
        })
      })

      context('reading data fails', () => {
        beforeEach(() => {
          seasonsDataFile.readData.throws(error500)
        })

        it('returns 500', () => {
          return request(app)
            .post('/api/v1/seasons/2/competitions/2/fixtures')
            .send({
              date: 'Fri 31-Jan-20',
              venue: 'Venue 1',
              adjudicator: ''
            })
            .set('Accept', 'application/json')
            .expect(500)
            .then(() => {
              expect(seasonsDataFile.writeData.callCount).to.equal(0)
            })
        })
      })
    })
  })

  describe('/seasons/:seasonId/competitions/:competitionId/fixtures/:fixtureId', () => {
    describe('/get', () => {
      context('reading data succeeds', () => {
        context('seasonId is invalid', () => {
          it('returns 400', () => {
            return request(app)
              .get('/api/v1/seasons/a/competitions/2/fixtures/2')
              .set('Accept', 'application/json')
              .expect(400)
          })
        })

        context('competitionId is invalid', () => {
          it('returns 400', () => {
            return request(app)
              .get('/api/v1/seasons/2/competitions/a/fixtures/2')
              .set('Accept', 'application/json')
              .expect(400)
          })
        })

        context('fixtureId is invalid', () => {
          it('returns 400', () => {
            return request(app)
              .get('/api/v1/seasons/2/competitions/2/fixtures/a')
              .set('Accept', 'application/json')
              .expect(400)
          })
        })

        context('season does not exist', () => {
          it('returns 404', () => {
            return request(app)
              .get('/api/v1/seasons/1000/competitions/2/fixtures/2')
              .set('Accept', 'application/json')
              .expect(404)
          })
        })

        context('competition does not exist', () => {
          it('returns 404', () => {
            return request(app)
              .get('/api/v1/seasons/2/competitions/1000/fixtures/2')
              .set('Accept', 'application/json')
              .expect(404)
          })
        })

        context('fixture does not exist', () => {
          it('returns 404', () => {
            return request(app)
              .get('/api/v1/seasons/2/competitions/2/fixtures/1000')
              .set('Accept', 'application/json')
              .expect(404)
          })
        })

        it('returns the data', () => {
          return request(app)
            .get('/api/v1/seasons/2/competitions/2/fixtures/2')
            .set('Accept', 'application/json')
            .expect('Content-Type', /application\/json/)
            .expect(200)
            .then(res => {
              expect(JSON.stringify(res.body)).to.equal(JSON.stringify(expectedData.seasons[2].competitions[2].fixtures[2]))
            })
        })
      })

      context('reading data fails', () => {
        beforeEach(() => {
          seasonsDataFile.readData.throws(error500)
        })

        it('returns 500', () => {
          return request(app)
            .get('/api/v1/seasons/2/competitions/2/fixtures/2/')
            .set('Accept', 'application/json')
            .expect(500)
        })
      })
    })
    describe('/put', () => {
      context('reading data succeeds', () => {
        context('writing data succeeds', () => {
          context('seasonId is invalid', () => {
            it('returns 400', () => {
              return request(app)
                .put('/api/v1/seasons/a/competitions/2/fixtures/2')
                .set('Accept', 'application/json')
                .expect(400)
            })
          })

          context('competitionId is invalid', () => {
            it('returns 400', () => {
              return request(app)
                .put('/api/v1/seasons/2/competitions/a/fixtures/2')
                .set('Accept', 'application/json')
                .expect(400)
            })
          })

          context('fixtureId is invalid', () => {
            it('returns 400', () => {
              return request(app)
                .put('/api/v1/seasons/2/competitions/2/fixtures/a')
                .set('Accept', 'application/json')
                .expect(400)
            })
          })

          context('fixture is missing', () => {
            it('returns 400', () => {
              return request(app)
                .put('/api/v1/seasons/2/competitions/2/fixtures/2')
                .set('Accept', 'application/json')
                .expect(400)
            })
          })

          context('date is missing', () => {
            it('returns 400', () => {
              return request(app)
                .put('/api/v1/seasons/2/competitions/2/fixtures/2')
                .send({
                  venue: 'Venue 1',
                  adjudicator: 'teamName1'
                })
                .set('Accept', 'application/json')
                .expect(400)
            })
          })

          context('date is zero length', () => {
            it('returns 400', () => {
              return request(app)
                .put('/api/v1/seasons/2/competitions/2/fixtures/2')
                .send({
                  date: '',
                  venue: 'Venue 1',
                  adjudicator: 'teamName1'
                })
                .set('Accept', 'application/json')
                .expect(400)
            })
          })

          context('venue is missing', () => {
            it('returns 400', () => {
              return request(app)
                .put('/api/v1/seasons/2/competitions/2/fixtures/2')
                .send({
                  date: 'Fri 31-Jan-20',
                  adjudicator: 'teamName1'
                })
                .set('Accept', 'application/json')
                .expect(400)
            })
          })

          context('venue is zero length', () => {
            it('returns 400', () => {
              return request(app)
                .put('/api/v1/seasons/2/competitions/2/fixtures/2')
                .send({
                  date: 'Fri 31-Jan-20',
                  venue: '',
                  adjudicator: 'teamName1'
                })
                .set('Accept', 'application/json')
                .expect(400)
            })
          })

          context('adjudicator is missing', () => {
            it('returns the new fixture', () => {
              return request(app)
                .put('/api/v1/seasons/2/competitions/2/fixtures/2')
                .send({
                  date: 'Fri 31-Jan-20',
                  venue: 'Venue 1'
                })
                .set('Accept', 'application/json')
                .expect(200)
                .then(res => {
                  const newData = cloneExpectedData()
                  newData.seasons[2].competitions[2].fixtures[2] = {
                    id: 2,
                    date: 'Fri 31-Jan-20',
                    venue: 'Venue 1',
                    matches: newData.seasons[2].competitions[2].fixtures[2].matches
                  }
                  expect(JSON.stringify(res.body)).to.equal(JSON.stringify(newData.seasons[2].competitions[2].fixtures[2]))
                  expect(seasonsDataFile.writeData).to.be.calledWith(newData)
                })
            })
          })

          context('adjudicator is zero length', () => {
            it('returns the new id', () => {
              return request(app)
                .put('/api/v1/seasons/2/competitions/2/fixtures/2')
                .send({
                  date: 'Fri 31-Jan-20',
                  venue: 'Venue 2',
                  adjudicator: ''
                })
                .set('Accept', 'application/json')
                .expect(200)
                .then(res => {
                  const newData = cloneExpectedData()
                  newData.seasons[2].competitions[2].fixtures[2] = {
                    id: 2,
                    date: 'Fri 31-Jan-20',
                    venue: 'Venue 2',
                    matches: newData.seasons[2].competitions[2].fixtures[2].matches
                  }
                  expect(JSON.stringify(res.body)).to.equal(JSON.stringify(newData.seasons[2].competitions[2].fixtures[2]))
                  expect(seasonsDataFile.writeData).to.be.calledWith(newData)
                })
            })
          })

          context('adjudicator team does not exist', () => {
            it('returns 400', () => {
              return request(app)
                .put('/api/v1/seasons/2/competitions/2/fixtures/2')
                .send({
                  date: 'Fri 31-Jan-20',
                  venue: 'Venue 1',
                  adjudicator: 'teamName4'
                })
                .set('Accept', 'application/json')
                .expect(400)
            })
          })

          context('posted data is not JSON', () => {
            it('returns 400', () => {
              return request(app)
                .put('/api/v1/seasons/2/competitions/2/fixtures/2')
                .send('name=competitionName2')
                .set('Accept', 'application/json')
                .expect(400)
            })
          })

          context('season does not exist', () => {
            it('returns 404', () => {
              return request(app)
                .put('/api/v1/seasons/1000/competitions/2/fixtures/2')
                .send({
                  date: 'Fri 31-Jan-20',
                  venue: 'Venue 2'
                })
                .set('Accept', 'application/json')
                .expect(404)
                .then(res => {
                  expect(seasonsDataFile.writeData.callCount).to.equal(0)
                })
            })
          })

          context('competition does not exist', () => {
            it('returns 404', () => {
              return request(app)
                .put('/api/v1/seasons/2/competitions/1000/fixtures/2')
                .send({
                  date: 'Fri 31-Jan-20',
                  venue: 'Venue 2'
                })
                .set('Accept', 'application/json')
                .expect(404)
                .then(res => {
                  expect(seasonsDataFile.writeData.callCount).to.equal(0)
                })
            })
          })

          context('fixture does not exist', () => {
            it('returns 404', () => {
              return request(app)
                .put('/api/v1/seasons/2/competitions/2/fixtures/1000')
                .send({
                  date: 'Fri 31-Jan-20',
                  venue: 'Venue 2'
                })
                .set('Accept', 'application/json')
                .expect(404)
                .then(res => {
                  expect(seasonsDataFile.writeData.callCount).to.equal(0)
                })
            })
          })

          context('removing an adjudicator', () => {
            it('returns the new fixture', () => {
              return request(app)
                .put('/api/v1/seasons/2/competitions/2/fixtures/2')
                .send({
                  date: 'Fri 31-Jan-20',
                  venue: 'Venue 2'
                })
                .set('Accept', 'application/json')
                .expect('Content-Type', /application\/json/)
                .expect(200)
                .then(res => {
                  const newData = cloneExpectedData()
                  newData.seasons[2].competitions[2].fixtures[2] = {
                    id: 2,
                    date: 'Fri 31-Jan-20',
                    venue: 'Venue 2',
                    matches: newData.seasons[2].competitions[2].fixtures[2].matches
                  }
                  expect(JSON.stringify(res.body)).to.equal(JSON.stringify(newData.seasons[2].competitions[2].fixtures[2]))
                  expect(seasonsDataFile.writeData).to.be.calledWith(newData)
                })
            })
          })

          it('returns the new fixture', () => {
            return request(app)
              .put('/api/v1/seasons/2/competitions/2/fixtures/2')
              .send({
                date: 'Fri 31-Jan-20',
                venue: 'Venue 2',
                adjudicator: 'teamName1'
              })
              .set('Accept', 'application/json')
              .expect('Content-Type', /application\/json/)
              .expect(200)
              .then(res => {
                const newData = cloneExpectedData()
                newData.seasons[2].competitions[2].fixtures[2] = {
                  id: 2,
                  date: 'Fri 31-Jan-20',
                  venue: 'Venue 2',
                  adjudicator: 1,
                  matches: newData.seasons[2].competitions[2].fixtures[2].matches
                }
                expect(JSON.stringify(res.body)).to.equal(JSON.stringify(newData.seasons[2].competitions[2].fixtures[2]))
                expect(seasonsDataFile.writeData).to.be.calledWith(newData)
              })
          })
        })

        context('writing data fails', () => {
          beforeEach(() => {
            seasonsDataFile.writeData.throws(error500)
          })

          it('returns 500', () => {
            return request(app)
              .put('/api/v1/seasons/2/competitions/2/fixtures/2')
              .send({
                date: 'Fri 31-Jan-20',
                venue: 'Venue 2',
                adjudicator: 'teamName3'
              })
              .set('Accept', 'application/json')
              .expect(500)
              .then(() => {
                const newData = cloneExpectedData()
                newData.seasons[2].competitions[2].fixtures[2] = {
                  id: 2,
                  date: 'Fri 31-Jan-20',
                  venue: 'Venue 2',
                  adjudicator: 3,
                  matches: newData.seasons[2].competitions[2].fixtures[2].matches
                }
                expect(seasonsDataFile.writeData).to.be.calledWith(newData)
              })
          })
        })
      })

      context('reading data fails', () => {
        beforeEach(() => {
          seasonsDataFile.readData.throws(error500)
        })

        it('returns 500', () => {
          return request(app)
            .put('/api/v1/seasons/2/competitions/2/fixtures/2')
            .send({
              date: 'Fri 31-Jan-20',
              venue: 'Venue 2',
              adjudicator: 'teamName3'
            })
            .set('Accept', 'application/json')
            .expect(500)
            .then(() => {
              expect(seasonsDataFile.writeData.callCount).to.equal(0)
            })
        })
      })
    })
    describe('/delete', () => {
      context('reading data succeeds', () => {
        context('writing data succeeds', () => {
          context('seasonId is invalid', () => {
            it('returns 400', () => {
              return request(app)
                .delete('/api/v1/seasons/a/competitions/2/fixtures/2')
                .set('Accept', 'application/json')
                .expect(400)
            })
          })

          context('season does not exist', () => {
            it('returns 404', () => {
              return request(app)
                .delete('/api/v1/seasons/1000/competitions/2/fixtures/2')
                .set('Accept', 'application/json')
                .expect(404)
                .then(() => {
                  expect(seasonsDataFile.writeData.callCount).to.equal(0)
                })
            })
          })

          context('competitionId is invalid', () => {
            it('returns 400', () => {
              return request(app)
                .delete('/api/v1/seasons/2/competitions/a/fixtures/2')
                .set('Accept', 'application/json')
                .expect(400)
            })
          })

          context('competition does not exist', () => {
            it('returns 200', () => {
              return request(app)
                .delete('/api/v1/seasons/2/competitions/1000/fixtures/2')
                .set('Accept', 'application/json')
                .expect(404)
                .then(() => {
                  expect(seasonsDataFile.writeData.callCount).to.equal(0)
                })
            })
          })

          context('fixtureId is invalid', () => {
            it('returns 400', () => {
              return request(app)
                .delete('/api/v1/seasons/2/competitions/2/fixtures/a')
                .set('Accept', 'application/json')
                .expect(400)
            })
          })

          context('fixture does not exist', () => {
            it('returns 200', () => {
              return request(app)
                .delete('/api/v1/seasons/2/competitions/2/fixtures/1000')
                .set('Accept', 'application/json')
                .expect(200)
                .then(() => {
                  expect(seasonsDataFile.writeData.callCount).to.equal(0)
                })
            })
          })

          it('deletes the data', () => {
            return request(app)
              .delete('/api/v1/seasons/2/competitions/2/fixtures/2')
              .set('Accept', 'application/json')
              .expect(200)
              .then(() => {
                const newData = cloneExpectedData()
                newData.seasons[2].competitions[2].fixtures.splice(2, 1)
                expect(seasonsDataFile.writeData).to.be.calledWith(newData)
              })
          })
        })

        context('writing data fails', () => {
          beforeEach(() => {
            seasonsDataFile.writeData.throws(error500)
          })

          it('returns 500', () => {
            return request(app)
              .delete('/api/v1/seasons/2/competitions/2/fixtures/2')
              .set('Accept', 'application/json')
              .expect(500)
              .then(() => {
                const newData = cloneExpectedData()
                newData.seasons[2].competitions[2].fixtures.splice(2, 1)
                expect(seasonsDataFile.writeData).to.be.calledWith(newData)
              })
          })
        })
      })

      context('reading data fails', () => {
        beforeEach(() => {
          seasonsDataFile.readData.throws(error500)
        })

        it('returns 500', () => {
          return request(app)
            .delete('/api/v1/seasons/2/competitions/2/fixtures/2')
            .set('Accept', 'application/json')
            .expect(500)
        })
      })
    })
  })

  describe('/seasons/:seasonId/competitions/:competitionId/fixtures/:fixtureId/matches', () => {
    describe('/get', () => {
      context('reading data succeeds', () => {
        context('seasonId is invalid', () => {
          it('returns 400', () => {
            return request(app)
              .get('/api/v1/seasons/a/competitions/2/fixtures/2/matches')
              .set('Accept', 'application/json')
              .expect(400)
          })
        })

        context('competitionId is invalid', () => {
          it('returns 400', () => {
            return request(app)
              .get('/api/v1/seasons/2/competitions/a/fixtures/2/matches')
              .set('Accept', 'application/json')
              .expect(400)
          })
        })

        context('fixtureId is invalid', () => {
          it('returns 400', () => {
            return request(app)
              .get('/api/v1/seasons/2/competitions/2/fixtures/a/matches')
              .set('Accept', 'application/json')
              .expect(400)
          })
        })

        context('season does not exist', () => {
          it('returns 404', () => {
            return request(app)
              .get('/api/v1/seasons/1000/competitions/2/fixtures/2/matches')
              .set('Accept', 'application/json')
              .expect(404)
          })
        })

        context('competition does not exist', () => {
          it('returns 404', () => {
            return request(app)
              .get('/api/v1/seasons/2/competitions/1000/fixtures/2/matches')
              .set('Accept', 'application/json')
              .expect(404)
          })
        })

        context('fixture does not exist', () => {
          it('returns 404', () => {
            return request(app)
              .get('/api/v1/seasons/2/competitions/2/fixtures/1000/matches')
              .set('Accept', 'application/json')
              .expect(404)
          })
        })

        it('returns the data', () => {
          return request(app)
            .get('/api/v1/seasons/2/competitions/2/fixtures/2/matches')
            .set('Accept', 'application/json')
            .expect('Content-Type', /application\/json/)
            .expect(200)
            .then(res => {
              expect(JSON.stringify(res.body)).to.equal(JSON.stringify(expectedData.seasons[2].competitions[2].fixtures[2].matches))
            })
        })
      })

      context('reading data fails', () => {
        beforeEach(() => {
          seasonsDataFile.readData.throws(error500)
        })

        it('returns 500', () => {
          return request(app)
            .get('/api/v1/seasons/2/competitions/2/fixtures/2/matches')
            .set('Accept', 'application/json')
            .expect(500)
        })
      })
    })
    describe('/post', () => {
      context('reading data succeeds', () => {
        context('writing data succeeds', () => {
          context('season does not exist', () => {
            it('returns 404', () => {
              return request(app)
                .post('/api/v1/seasons/1000/competitions/2/fixtures/2/matches')
                .send({ time: '22:00', homeTeam: 'teamName2', awayTeam: 'teamName3', refTeam: 'teamName1' })
                .set('Accept', 'application/json')
                .expect(404)
                .then(res => {
                  expect(seasonsDataFile.writeData.callCount).to.equal(0)
                })
            })
          })

          context('competition does not exist', () => {
            it('returns 404', () => {
              return request(app)
                .post('/api/v1/seasons/2/competitions/1000/fixtures/2/matches')
                .send({ time: '22:00', homeTeam: 'teamName2', awayTeam: 'teamName3', refTeam: 'teamName1' })
                .set('Accept', 'application/json')
                .expect(404)
                .then(res => {
                  expect(seasonsDataFile.writeData.callCount).to.equal(0)
                })
            })
          })

          context('fixture does not exist', () => {
            it('returns 404', () => {
              return request(app)
                .post('/api/v1/seasons/2/competitions/2/fixtures/1000/matches')
                .send({ time: '22:00', homeTeam: 'teamName2', awayTeam: 'teamName3', refTeam: 'teamName1' })
                .set('Accept', 'application/json')
                .expect(404)
                .then(res => {
                  expect(seasonsDataFile.writeData.callCount).to.equal(0)
                })
            })
          })

          context('match is missing', () => {
            it('returns 400', () => {
              return request(app)
                .post('/api/v1/seasons/2/competitions/2/fixtures/2/matches')
                .set('Accept', 'application/json')
                .expect(400)
            })
          })

          context('time is missing', () => {
            it('returns 400', () => {
              return request(app)
                .post('/api/v1/seasons/2/competitions/2/fixtures/2/matches')
                .send({ homeTeam: 'teamName2', awayTeam: 'teamName3', refTeam: 'teamName1' })
                .set('Accept', 'application/json')
                .expect(400)
            })
          })

          context('time is zero length', () => {
            it('returns 400', () => {
              return request(app)
                .post('/api/v1/seasons/2/competitions/2/fixtures/2/matches')
                .send({ time: '', homeTeam: 'teamName2', awayTeam: 'teamName3', refTeam: 'teamName1' })
                .set('Accept', 'application/json')
                .expect(400)
            })
          })

          context('homeTeam is missing', () => {
            it('returns 400', () => {
              return request(app)
                .post('/api/v1/seasons/2/competitions/2/fixtures/2/matches')
                .send({ time: '22:00', awayTeam: 'teamName3', refTeam: 'teamName1' })
                .set('Accept', 'application/json')
                .expect(400)
            })
          })

          context('homeTeam is zero length', () => {
            it('returns 400', () => {
              return request(app)
                .post('/api/v1/seasons/2/competitions/2/fixtures/2/matches')
                .send({ time: '22:00', homeTeam: '', awayTeam: 'teamName3', refTeam: 'teamName1' })
                .set('Accept', 'application/json')
                .expect(400)
            })
          })

          context('homeTeam does not exist', () => {
            it('returns 400', () => {
              return request(app)
                .post('/api/v1/seasons/2/competitions/2/fixtures/2/matches')
                .send({ time: '22:00', homeTeam: 'NoSuchTeam', awayTeam: 'teamName3', refTeam: 'teamName1' })
                .set('Accept', 'application/json')
                .expect(400)
            })
          })

          context('awayTeam is missing', () => {
            it('returns 400', () => {
              return request(app)
                .post('/api/v1/seasons/2/competitions/2/fixtures/2/matches')
                .send({ time: '22:00', homeTeam: 'teamName2', refTeam: 'teamName1' })
                .set('Accept', 'application/json')
                .expect(400)
            })
          })

          context('awayTeam is zero length', () => {
            it('returns 400', () => {
              return request(app)
                .post('/api/v1/seasons/2/competitions/2/fixtures/2/matches')
                .send({ time: '22:00', homeTeam: 'teamName2', awayTeam: '', refTeam: 'teamName1' })
                .set('Accept', 'application/json')
                .expect(400)
            })
          })

          context('awayTeam does not exist', () => {
            it('returns 400', () => {
              return request(app)
                .post('/api/v1/seasons/2/competitions/2/fixtures/2/matches')
                .send({ time: '22:00', homeTeam: 'teamName2', awayTeam: 'NoSuchTeam', refTeam: 'teamName1' })
                .set('Accept', 'application/json')
                .expect(400)
            })
          })

          context('refTeam is missing', () => {
            it('returns the new id', () => {
              return request(app)
                .post('/api/v1/seasons/2/competitions/2/fixtures/2/matches')
                .send({ time: '22:00', homeTeam: 'teamName2', awayTeam: 'teamName3' })
                .set('Accept', 'application/json')
                .expect(200)
                .then(res => {
                  expect(JSON.stringify(res.body)).to.equal(JSON.stringify({ id: 4 }))
                  const newData = cloneExpectedData()
                  newData.seasons[2].competitions[2].fixtures[2].matches.push({ id: 4, time: '22:00', homeTeam: 2, awayTeam: 3 })
                  expect(seasonsDataFile.writeData).to.be.calledWith(newData)
                })
            })
          })

          context('refTeam is zero length', () => {
            it('returns the new id', () => {
              return request(app)
                .post('/api/v1/seasons/2/competitions/2/fixtures/2/matches')
                .send({ time: '22:00', homeTeam: 'teamName2', awayTeam: 'teamName3', refTeam: '' })
                .set('Accept', 'application/json')
                .expect(200)
                .then(res => {
                  expect(JSON.stringify(res.body)).to.equal(JSON.stringify({ id: 4 }))
                  const newData = cloneExpectedData()
                  newData.seasons[2].competitions[2].fixtures[2].matches.push({ id: 4, time: '22:00', homeTeam: 2, awayTeam: 3 })
                  expect(seasonsDataFile.writeData).to.be.calledWith(newData)
                })
            })
          })

          context('refTeam team does not exist', () => {
            it('returns 400', () => {
              return request(app)
                .post('/api/v1/seasons/2/competitions/2/fixtures/2/matches')
                .send({ time: '22:00', homeTeam: 'teamName2', awayTeam: 'teamName3', refTeam: 'NoSuchTeam' })
                .set('Accept', 'application/json')
                .expect(400)
            })
          })

          context('posted data is not JSON', () => {
            it('returns 400', () => {
              return request(app)
                .post('/api/v1/seasons/2/competitions/2/fixtures/2/matches')
                .send('name=match')
                .set('Accept', 'application/json')
                .expect(400)
            })
          })

          it('returns the new id', () => {
            return request(app)
              .post('/api/v1/seasons/2/competitions/2/fixtures/2/matches')
              .send({ time: '22:00', homeTeam: 'teamName2', awayTeam: 'teamName3', refTeam: 'teamName1' })
              .set('Accept', 'application/json')
              .expect('Content-Type', /application\/json/)
              .expect(200)
              .then(res => {
                expect(JSON.stringify(res.body)).to.equal(JSON.stringify({ id: 4 }))
                const newData = cloneExpectedData()
                newData.seasons[2].competitions[2].fixtures[2].matches.push({ id: 4, time: '22:00', homeTeam: 2, awayTeam: 3, refTeam: 1 })
                expect(seasonsDataFile.writeData).to.be.calledWith(newData)
              })
          })
        })

        context('writing data fails', () => {
          beforeEach(() => {
            seasonsDataFile.writeData.throws(error500)
          })

          it('returns 500', () => {
            return request(app)
              .post('/api/v1/seasons/2/competitions/2/fixtures/2/matches')
              .send({ time: '22:00', homeTeam: 'teamName2', awayTeam: 'teamName3', refTeam: 'teamName1' })
              .set('Accept', 'application/json')
              .expect(500)
              .then(() => {
                const newData = cloneExpectedData()
                newData.seasons[2].competitions[2].fixtures[2].matches.push({ id: 4, time: '22:00', homeTeam: 2, awayTeam: 3, refTeam: 1 })
                expect(seasonsDataFile.writeData).to.be.calledWith(newData)
              })
          })
        })
      })

      context('reading data fails', () => {
        beforeEach(() => {
          seasonsDataFile.readData.throws(error500)
        })

        it('returns 500', () => {
          return request(app)
            .post('/api/v1/seasons/2/competitions/2/fixtures/2/matches')
            .send({ time: '22:00', homeTeam: 'teamName2', awayTeam: 'teamName3', refTeam: 'teamName1' })
            .set('Accept', 'application/json')
            .expect(500)
            .then(() => {
              expect(seasonsDataFile.writeData.callCount).to.equal(0)
            })
        })
      })
    })
  })

  describe('/seasons/:seasonId/competitions/:competitionId/fixtures/:fixtureId/matches/:matchId', () => {
    describe('/get', () => {
      context('reading data succeeds', () => {
        context('seasonId is invalid', () => {
          it('returns 400', () => {
            return request(app)
              .get('/api/v1/seasons/a/competitions/2/fixtures/2/matches/2')
              .set('Accept', 'application/json')
              .expect(400)
          })
        })

        context('competitionId is invalid', () => {
          it('returns 400', () => {
            return request(app)
              .get('/api/v1/seasons/2/competitions/a/fixtures/2/matches/2')
              .set('Accept', 'application/json')
              .expect(400)
          })
        })

        context('fixtureId is invalid', () => {
          it('returns 400', () => {
            return request(app)
              .get('/api/v1/seasons/2/competitions/2/fixtures/a/matches/2')
              .set('Accept', 'application/json')
              .expect(400)
          })
        })

        context('matchId is invalid', () => {
          it('returns 400', () => {
            return request(app)
              .get('/api/v1/seasons/2/competitions/2/fixtures/2/matches/a')
              .set('Accept', 'application/json')
              .expect(400)
          })
        })

        context('season does not exist', () => {
          it('returns 404', () => {
            return request(app)
              .get('/api/v1/seasons/1000/competitions/2/fixtures/2/matches/2')
              .set('Accept', 'application/json')
              .expect(404)
          })
        })

        context('competition does not exist', () => {
          it('returns 404', () => {
            return request(app)
              .get('/api/v1/seasons/2/competitions/1000/fixtures/2/matches/2')
              .set('Accept', 'application/json')
              .expect(404)
          })
        })

        context('fixture does not exist', () => {
          it('returns 404', () => {
            return request(app)
              .get('/api/v1/seasons/2/competitions/2/fixtures/1000/matches/2')
              .set('Accept', 'application/json')
              .expect(404)
          })
        })

        context('match does not exist', () => {
          it('returns 404', () => {
            return request(app)
              .get('/api/v1/seasons/2/competitions/2/fixtures/2/matches/1000')
              .set('Accept', 'application/json')
              .expect(404)
          })
        })

        it('returns the data', () => {
          return request(app)
            .get('/api/v1/seasons/2/competitions/2/fixtures/2/matches/2')
            .set('Accept', 'application/json')
            .expect('Content-Type', /application\/json/)
            .expect(200)
            .then(res => {
              expect(JSON.stringify(res.body)).to.equal(JSON.stringify(expectedData.seasons[2].competitions[2].fixtures[2].matches[2]))
            })
        })
      })

      context('reading data fails', () => {
        beforeEach(() => {
          seasonsDataFile.readData.throws(error500)
        })

        it('returns 500', () => {
          return request(app)
            .get('/api/v1/seasons/2/competitions/2/fixtures/2/matches/2')
            .set('Accept', 'application/json')
            .expect(500)
        })
      })
    })
    describe('/put', () => {
      context('reading data succeeds', () => {
        context('writing data succeeds', () => {
          context('seasonId is invalid', () => {
            it('returns 400', () => {
              return request(app)
                .put('/api/v1/seasons/a/competitions/2/fixtures/2/matches/2')
                .set('Accept', 'application/json')
                .send({ time: '', homeTeam: 'teamName1', awayTeam: 'teamName2', refTeam: 'teamName3' })
                .expect(400)
            })
          })

          context('competitionId is invalid', () => {
            it('returns 400', () => {
              return request(app)
                .put('/api/v1/seasons/2/competitions/a/fixtures/2/matches/2')
                .set('Accept', 'application/json')
                .expect(400)
            })
          })

          context('fixtureId is invalid', () => {
            it('returns 400', () => {
              return request(app)
                .put('/api/v1/seasons/2/competitions/2/fixtures/a/matches/2')
                .set('Accept', 'application/json')
                .expect(400)
            })
          })

          context('matchId is invalid', () => {
            it('returns 400', () => {
              return request(app)
                .put('/api/v1/seasons/2/competitions/2/fixtures/2/matches/a')
                .set('Accept', 'application/json')
                .expect(400)
            })
          })

          context('match is missing', () => {
            it('returns 400', () => {
              return request(app)
                .put('/api/v1/seasons/2/competitions/2/fixtures/2/matches/2')
                .set('Accept', 'application/json')
                .expect(400)
            })
          })

          context('time is missing', () => {
            it('returns 400', () => {
              return request(app)
                .put('/api/v1/seasons/2/competitions/2/fixtures/2/matches/2')
                .set('Accept', 'application/json')
                .send({ homeTeam: 'teamName1', awayTeam: 'teamName2', refTeam: 'teamName3' })
                .expect(400)
            })
          })

          context('time is zero length', () => {
            it('returns 400', () => {
              return request(app)
                .put('/api/v1/seasons/2/competitions/2/fixtures/2/matches/2')
                .set('Accept', 'application/json')
                .send({ time: '', homeTeam: 'teamName1', awayTeam: 'teamName2', refTeam: 'teamName3' })
                .expect(400)
            })
          })

          context('homeTeam is missing', () => {
            it('returns 400', () => {
              return request(app)
                .put('/api/v1/seasons/2/competitions/2/fixtures/2/matches/2')
                .set('Accept', 'application/json')
                .send({ time: '21:20', awayTeam: 'teamName2', refTeam: 'teamName3' })
                .expect(400)
            })
          })

          context('homeTeam is zero length', () => {
            it('returns 400', () => {
              return request(app)
                .put('/api/v1/seasons/2/competitions/2/fixtures/2/matches/2')
                .set('Accept', 'application/json')
                .send({ time: '21:20', homeTeam: '', awayTeam: 'teamName2', refTeam: 'teamName3' })
                .expect(400)
            })
          })

          context('awayTeam is missing', () => {
            it('returns 400', () => {
              return request(app)
                .put('/api/v1/seasons/2/competitions/2/fixtures/2/matches/2')
                .set('Accept', 'application/json')
                .send({ time: '21:20', homeTeam: 'teamName1', refTeam: 'teamName3' })
                .expect(400)
            })
          })

          context('awayTeam is zero length', () => {
            it('returns 400', () => {
              return request(app)
                .put('/api/v1/seasons/2/competitions/2/fixtures/2/matches/2')
                .set('Accept', 'application/json')
                .send({ time: '21:20', homeTeam: 'teamName1', awayTeam: '', refTeam: 'teamName3' })
                .expect(400)
            })
          })

          context('refTeam is missing', () => {
            it('returns the new match', () => {
              return request(app)
                .put('/api/v1/seasons/2/competitions/2/fixtures/2/matches/2')
                .set('Accept', 'application/json')
                .send({ time: '21:20', homeTeam: 'teamName1', awayTeam: 'teamName2' })
                .expect(200)
                .then(res => {
                  const newData = cloneExpectedData()
                  newData.seasons[2].competitions[2].fixtures[2].matches[2] = { id: 2, time: '21:20', homeTeam: 1, awayTeam: 2 }
                  expect(JSON.stringify(res.body)).to.equal(JSON.stringify(newData.seasons[2].competitions[2].fixtures[2].matches[2]))
                  expect(seasonsDataFile.writeData).to.be.calledWith(newData)
                })
            })
          })

          context('refTeam is zero length', () => {
            it('returns the new id', () => {
              return request(app)
                .put('/api/v1/seasons/2/competitions/2/fixtures/2/matches/2')
                .set('Accept', 'application/json')
                .send({ time: '21:20', homeTeam: 'teamName2', awayTeam: 'teamName3', refTeam: '' })
                .expect(200)
                .then(res => {
                  const newData = cloneExpectedData()
                  newData.seasons[2].competitions[2].fixtures[2].matches[2] = { id: 2, time: '21:20', homeTeam: 2, awayTeam: 3 }
                  expect(JSON.stringify(res.body)).to.equal(JSON.stringify(newData.seasons[2].competitions[2].fixtures[2].matches[2]))
                  expect(seasonsDataFile.writeData).to.be.calledWith(newData)
                })
            })
          })

          context('refTeam team does not exist', () => {
            it('returns 400', () => {
              return request(app)
                .put('/api/v1/seasons/2/competitions/2/fixtures/2/matches/2')
                .set('Accept', 'application/json')
                .send({ time: '21:20', homeTeam: 'teamName1', awayTeam: 'teamName2', refTeam: 'NoSuchTeam' })
                .expect(400)
            })
          })

          context('posted data is not JSON', () => {
            it('returns 400', () => {
              return request(app)
                .put('/api/v1/seasons/2/competitions/2/fixtures/2/matches/2')
                .set('Accept', 'application/json')
                .send('name=match2')
                .expect(400)
            })
          })

          context('season does not exist', () => {
            it('returns 404', () => {
              return request(app)
                .put('/api/v1/seasons/1000/competitions/2/fixtures/2/matches/2')
                .set('Accept', 'application/json')
                .send({ time: '21:20', homeTeam: 'teamName1', awayTeam: 'teamName2', refTeam: 'teamName3' })
                .expect(404)
                .then(res => {
                  expect(seasonsDataFile.writeData.callCount).to.equal(0)
                })
            })
          })

          context('competition does not exist', () => {
            it('returns 404', () => {
              return request(app)
                .put('/api/v1/seasons/2/competitions/1000/fixtures/2/matches/2')
                .set('Accept', 'application/json')
                .send({ time: '21:20', homeTeam: 'teamName1', awayTeam: 'teamName2', refTeam: 'teamName3' })
                .expect(404)
                .then(res => {
                  expect(seasonsDataFile.writeData.callCount).to.equal(0)
                })
            })
          })

          context('fixture does not exist', () => {
            it('returns 404', () => {
              return request(app)
                .put('/api/v1/seasons/2/competitions/2/fixtures/1000/matches/2')
                .set('Accept', 'application/json')
                .send({ time: '21:20', homeTeam: 'teamName1', awayTeam: 'teamName2', refTeam: 'teamName3' })
                .expect(404)
                .then(res => {
                  expect(seasonsDataFile.writeData.callCount).to.equal(0)
                })
            })
          })

          context('match does not exist', () => {
            it('returns 404', () => {
              return request(app)
                .put('/api/v1/seasons/2/competitions/2/fixtures/2/matches/1000')
                .set('Accept', 'application/json')
                .send({ time: '21:20', homeTeam: 'teamName1', awayTeam: 'teamName2', refTeam: 'teamName3' })
                .expect(404)
                .then(res => {
                  expect(seasonsDataFile.writeData.callCount).to.equal(0)
                })
            })
          })

          it('returns the new fixture', () => {
            return request(app)
              .put('/api/v1/seasons/2/competitions/2/fixtures/2/matches/2')
              .set('Accept', 'application/json')
              .send({ time: '21:20', homeTeam: 'teamName1', awayTeam: 'teamName2', refTeam: 'teamName3' })
              .expect('Content-Type', /application\/json/)
              .expect(200)
              .then(res => {
                const newData = cloneExpectedData()
                newData.seasons[2].competitions[2].fixtures[2].matches[2] = { id: 2, time: '21:20', homeTeam: 1, awayTeam: 2, refTeam: 3 }
                expect(JSON.stringify(res.body)).to.equal(JSON.stringify(newData.seasons[2].competitions[2].fixtures[2].matches[2]))
                expect(seasonsDataFile.writeData).to.be.calledWith(newData)
              })
          })
        })

        context('writing data fails', () => {
          beforeEach(() => {
            seasonsDataFile.writeData.throws(error500)
          })

          it('returns 500', () => {
            return request(app)
              .put('/api/v1/seasons/2/competitions/2/fixtures/2/matches/2')
              .set('Accept', 'application/json')
              .send({ time: '21:20', homeTeam: 'teamName1', awayTeam: 'teamName2', refTeam: 'teamName3' })
              .expect(500)
              .then(() => {
                const newData = cloneExpectedData()
                newData.seasons[2].competitions[2].fixtures[2].matches[2] = { id: 2, time: '21:20', homeTeam: 1, awayTeam: 2, refTeam: 3 }
                expect(seasonsDataFile.writeData).to.be.calledWith(newData)
              })
          })
        })
      })

      context('reading data fails', () => {
        beforeEach(() => {
          seasonsDataFile.readData.throws(error500)
        })

        it('returns 500', () => {
          return request(app)
            .put('/api/v1/seasons/2/competitions/2/fixtures/2/matches/2')
            .set('Accept', 'application/json')
            .send({ time: '21:20', homeTeam: 'teamName1', awayTeam: 'teamName2', refTeam: 'teamName3' })
            .expect(500)
            .then(() => {
              expect(seasonsDataFile.writeData.callCount).to.equal(0)
            })
        })
      })
    })
    describe('/delete', () => {
      context('reading data succeeds', () => {
        context('writing data succeeds', () => {
          context('seasonId is invalid', () => {
            it('returns 400', () => {
              return request(app)
                .delete('/api/v1/seasons/a/competitions/2/fixtures/2/matches/2')
                .set('Accept', 'application/json')
                .expect(400)
            })
          })

          context('season does not exist', () => {
            it('returns 404', () => {
              return request(app)
                .delete('/api/v1/seasons/1000/competitions/2/fixtures/2/matches/2')
                .set('Accept', 'application/json')
                .expect(404)
                .then(() => {
                  expect(seasonsDataFile.writeData.callCount).to.equal(0)
                })
            })
          })

          context('competitionId is invalid', () => {
            it('returns 400', () => {
              return request(app)
                .delete('/api/v1/seasons/2/competitions/a/fixtures/2/matches/2')
                .set('Accept', 'application/json')
                .expect(400)
            })
          })

          context('competition does not exist', () => {
            it('returns 200', () => {
              return request(app)
                .delete('/api/v1/seasons/2/competitions/1000/fixtures/2/matches/2')
                .set('Accept', 'application/json')
                .expect(404)
                .then(() => {
                  expect(seasonsDataFile.writeData.callCount).to.equal(0)
                })
            })
          })

          context('fixtureId is invalid', () => {
            it('returns 400', () => {
              return request(app)
                .delete('/api/v1/seasons/2/competitions/2/fixtures/a/matches/2')
                .set('Accept', 'application/json')
                .expect(400)
            })
          })

          context('fixture does not exist', () => {
            it('returns 200', () => {
              return request(app)
                .delete('/api/v1/seasons/2/competitions/2/fixtures/1000/matches/2')
                .set('Accept', 'application/json')
                .expect(404)
                .then(() => {
                  expect(seasonsDataFile.writeData.callCount).to.equal(0)
                })
            })
          })

          context('matchId is invalid', () => {
            it('returns 400', () => {
              return request(app)
                .delete('/api/v1/seasons/2/competitions/2/fixtures/2/matches/a')
                .set('Accept', 'application/json')
                .expect(400)
            })
          })

          context('match does not exist', () => {
            it('returns 200', () => {
              return request(app)
                .delete('/api/v1/seasons/2/competitions/2/fixtures/2/matches/1000')
                .set('Accept', 'application/json')
                .expect(200)
                .then(() => {
                  expect(seasonsDataFile.writeData.callCount).to.equal(0)
                })
            })
          })

          it('deletes the data', () => {
            return request(app)
              .delete('/api/v1/seasons/2/competitions/2/fixtures/2/matches/2')
              .set('Accept', 'application/json')
              .expect(200)
              .then(() => {
                const newData = cloneExpectedData()
                newData.seasons[2].competitions[2].fixtures[2].matches.splice(2, 1)
                expect(seasonsDataFile.writeData).to.be.calledWith(newData)
              })
          })
        })

        context('writing data fails', () => {
          beforeEach(() => {
            seasonsDataFile.writeData.throws(error500)
          })

          it('returns 500', () => {
            return request(app)
              .delete('/api/v1/seasons/2/competitions/2/fixtures/2/matches/2')
              .set('Accept', 'application/json')
              .expect(500)
              .then(() => {
                const newData = cloneExpectedData()
                newData.seasons[2].competitions[2].fixtures[2].matches.splice(2, 1)
                expect(seasonsDataFile.writeData).to.be.calledWith(newData)
              })
          })
        })
      })

      context('reading data fails', () => {
        beforeEach(() => {
          seasonsDataFile.readData.throws(error500)
        })

        it('returns 500', () => {
          return request(app)
            .delete('/api/v1/seasons/2/competitions/2/fixtures/2/matches/2')
            .set('Accept', 'application/json')
            .expect(500)
        })
      })
    })
  })

  describe('/seasons/:seasonId/competitions/:competitionId/teams', () => {
    describe('/get', () => {
      context('reading data succeeds', () => {
        context('seasonId is invalid', () => {
          it('returns 400', () => {
            return request(app)
              .get('/api/v1/seasons/a/competitions/2/teams')
              .set('Accept', 'application/json')
              .expect(400)
          })
        })

        context('competitionId is invalid', () => {
          it('returns 400', () => {
            return request(app)
              .get('/api/v1/seasons/2/competitions/a/teams')
              .set('Accept', 'application/json')
              .expect(400)
          })
        })

        context('season does not exist', () => {
          it('returns 404', () => {
            return request(app)
              .get('/api/v1/seasons/1000/competitions/2/teams')
              .set('Accept', 'application/json')
              .expect(404)
          })
        })

        context('competition does not exist', () => {
          it('returns 404', () => {
            return request(app)
              .get('/api/v1/seasons/2/competitions/1000/teams')
              .set('Accept', 'application/json')
              .expect(404)
          })
        })

        it('returns the data', () => {
          return request(app)
            .get('/api/v1/seasons/2/competitions/2/teams')
            .set('Accept', 'application/json')
            .expect('Content-Type', /application\/json/)
            .expect(200)
            .then(res => {
              expect(JSON.stringify(res.body)).to.equal(JSON.stringify(expectedData.seasons[2].competitions[2].teams))
            })
        })
      })

      context('reading data fails', () => {
        beforeEach(() => {
          seasonsDataFile.readData.throws(error500)
        })

        it('returns 500', () => {
          return request(app)
            .get('/api/v1/seasons/2/competitions/2/teams')
            .set('Accept', 'application/json')
            .expect(500)
        })
      })
    })
    describe('/post', () => {
      context('reading data succeeds', () => {
        context('writing data succeeds', () => {
          context('season does not exist', () => {
            it('returns 404', () => {
              return request(app)
                .post('/api/v1/seasons/1000/competitions/2/teams')
                .send({ name: 'teamName2' })
                .set('Accept', 'application/json')
                .expect(404)
                .then(res => {
                  expect(seasonsDataFile.writeData.callCount).to.equal(0)
                })
            })
          })

          context('competition does not exist', () => {
            it('returns 404', () => {
              return request(app)
                .post('/api/v1/seasons/2/competitions/1000/teams')
                .send({ name: 'teamName2' })
                .set('Accept', 'application/json')
                .expect(404)
                .then(res => {
                  expect(seasonsDataFile.writeData.callCount).to.equal(0)
                })
            })
          })

          context('teamName is missing', () => {
            it('returns 400', () => {
              return request(app)
                .post('/api/v1/seasons/2/competitions/2/teams')
                .set('Accept', 'application/json')
                .expect(400)
            })
          })

          context('teamName is zero length', () => {
            it('returns 400', () => {
              return request(app)
                .post('/api/v1/seasons/2/competitions/2/teams')
                .send({ name: '' })
                .set('Accept', 'application/json')
                .expect(400)
            })
          })

          context('posted data is not JSON', () => {
            it('returns 400', () => {
              return request(app)
                .post('/api/v1/seasons/2/competitions/2/teams')
                .send('name=teamName2')
                .set('Accept', 'application/json')
                .expect(400)
            })
          })

          context('team already exists', () => {
            it('returns the existing id', () => {
              return request(app)
                .post('/api/v1/seasons/2/competitions/2/teams')
                .send({ name: 'teamName2' })
                .set('Accept', 'application/json')
                .expect('Content-Type', /application\/json/)
                .expect(200)
                .then(res => {
                  expect(JSON.stringify(res.body)).to.equal(JSON.stringify({ id: 2 }))
                  expect(seasonsDataFile.writeData.callCount).to.equal(0)
                })
            })
          })

          it('returns the new id', () => {
            return request(app)
              .post('/api/v1/seasons/2/competitions/2/teams')
              .send({ name: 'NewTeam' })
              .set('Accept', 'application/json')
              .expect('Content-Type', /application\/json/)
              .expect(200)
              .then(res => {
                expect(JSON.stringify(res.body)).to.equal(JSON.stringify({ id: 4 }))
                const newData = cloneExpectedData()
                newData.seasons[2].competitions[2].teams.push({ id: 4, name: 'NewTeam', contacts: [] })
                expect(seasonsDataFile.writeData).to.be.calledWith(newData)
              })
          })
        })

        context('writing data fails', () => {
          beforeEach(() => {
            seasonsDataFile.writeData.throws(error500)
          })

          it('returns 500', () => {
            return request(app)
              .post('/api/v1/seasons/2/competitions/2/teams')
              .send({ name: 'NewTeam' })
              .set('Accept', 'application/json')
              .expect(500)
              .then(() => {
                const newData = cloneExpectedData()
                newData.seasons[2].competitions[2].teams.push({ id: 4, name: 'NewTeam', contacts: [] })
                expect(seasonsDataFile.writeData).to.be.calledWith(newData)
              })
          })
        })
      })

      context('reading data fails', () => {
        beforeEach(() => {
          seasonsDataFile.readData.throws(error500)
        })

        it('returns 500', () => {
          return request(app)
            .post('/api/v1/seasons/2/competitions/2/teams')
            .send({ name: 'NewCompetition' })
            .set('Accept', 'application/json')
            .expect(500)
            .then(() => {
              expect(seasonsDataFile.writeData.callCount).to.equal(0)
            })
        })
      })
    })
  })

  describe('/seasons/:seasonId/competitions/:competitionId/teams/:teamId', () => {
    describe('/get', () => {
      context('reading data succeeds', () => {
        context('seasonId is invalid', () => {
          it('returns 400', () => {
            return request(app)
              .get('/api/v1/seasons/a/competitions/2/teams/2')
              .set('Accept', 'application/json')
              .expect(400)
          })
        })

        context('competitionId is invalid', () => {
          it('returns 400', () => {
            return request(app)
              .get('/api/v1/seasons/2/competitions/a/teams/2')
              .set('Accept', 'application/json')
              .expect(400)
          })
        })

        context('fixtureId is invalid', () => {
          it('returns 400', () => {
            return request(app)
              .get('/api/v1/seasons/2/competitions/2/teams/a')
              .set('Accept', 'application/json')
              .expect(400)
          })
        })

        context('season does not exist', () => {
          it('returns 404', () => {
            return request(app)
              .get('/api/v1/seasons/1000/competitions/2/teams/2')
              .set('Accept', 'application/json')
              .expect(404)
          })
        })

        context('competition does not exist', () => {
          it('returns 404', () => {
            return request(app)
              .get('/api/v1/seasons/2/competitions/1000/teams/2')
              .set('Accept', 'application/json')
              .expect(404)
          })
        })

        context('team does not exist', () => {
          it('returns 404', () => {
            return request(app)
              .get('/api/v1/seasons/2/competitions/2/teams/1000')
              .set('Accept', 'application/json')
              .expect(404)
          })
        })

        it('returns the data', () => {
          return request(app)
            .get('/api/v1/seasons/2/competitions/2/teams/2')
            .set('Accept', 'application/json')
            .expect('Content-Type', /application\/json/)
            .expect(200)
            .then(res => {
              expect(JSON.stringify(res.body)).to.equal(JSON.stringify(expectedData.seasons[2].competitions[2].teams[2]))
            })
        })
      })

      context('reading data fails', () => {
        beforeEach(() => {
          seasonsDataFile.readData.throws(error500)
        })

        it('returns 500', () => {
          return request(app)
            .get('/api/v1/seasons/2/competitions/2/teams/2')
            .set('Accept', 'application/json')
            .expect(500)
        })
      })
    })
    describe('/put', () => {
      context('reading data succeeds', () => {
        context('writing data succeeds', () => {
          context('seasonId is invalid', () => {
            it('returns 400', () => {
              return request(app)
                .put('/api/v1/seasons/a/competitions/2/teams/2')
                .set('Accept', 'application/json')
                .expect(400)
            })
          })

          context('competitionId is invalid', () => {
            it('returns 400', () => {
              return request(app)
                .put('/api/v1/seasons/2/competitions/a/teams/2')
                .set('Accept', 'application/json')
                .expect(400)
            })
          })

          context('teamId is invalid', () => {
            it('returns 400', () => {
              return request(app)
                .put('/api/v1/seasons/2/competitions/2/teams/a')
                .set('Accept', 'application/json')
                .expect(400)
            })
          })

          context('teamName is missing', () => {
            it('returns 400', () => {
              return request(app)
                .put('/api/v1/seasons/2/competitions/2/teams/2')
                .set('Accept', 'application/json')
                .expect(400)
            })
          })

          context('teamName is zero length', () => {
            it('returns 400', () => {
              return request(app)
                .put('/api/v1/seasons/2/competitions/2/teams/2')
                .send({ name: '' })
                .set('Accept', 'application/json')
                .expect(400)
            })
          })

          context('posted data is not JSON', () => {
            it('returns 400', () => {
              return request(app)
                .put('/api/v1/seasons/2/competitions/2/teams/2')
                .send('name=competitionName2')
                .set('Accept', 'application/json')
                .expect(400)
            })
          })

          context('season does not exist', () => {
            it('returns 404', () => {
              return request(app)
                .put('/api/v1/seasons/1000/competitions/2/teams/2')
                .send({ name: 'NewTeam2Name' })
                .set('Accept', 'application/json')
                .expect(404)
                .then(res => {
                  expect(seasonsDataFile.writeData.callCount).to.equal(0)
                })
            })
          })

          context('competition does not exist', () => {
            it('returns 404', () => {
              return request(app)
                .put('/api/v1/seasons/2/competitions/1000/teams/2')
                .send({ name: 'NewTeam2Name' })
                .set('Accept', 'application/json')
                .expect(404)
                .then(res => {
                  expect(seasonsDataFile.writeData.callCount).to.equal(0)
                })
            })
          })

          context('team does not exist', () => {
            it('returns 404', () => {
              return request(app)
                .put('/api/v1/seasons/2/competitions/2/teams/1000')
                .send({ name: 'NewTeam2Name' })
                .set('Accept', 'application/json')
                .expect(404)
                .then(res => {
                  expect(seasonsDataFile.writeData.callCount).to.equal(0)
                })
            })
          })

          context('teamName already used', () => {
            it('returns 409', () => {
              return request(app)
                .put('/api/v1/seasons/2/competitions/2/teams/2')
                .send({ name: 'teamName1' })
                .set('Accept', 'application/json')
                .expect(409)
                .then(res => {
                  expect(seasonsDataFile.writeData.callCount).to.equal(0)
                })
            })
          })

          it('returns the new id', () => {
            return request(app)
              .put('/api/v1/seasons/2/competitions/2/teams/2')
              .send({ name: 'NewTeam2Name' })
              .set('Accept', 'application/json')
              .expect('Content-Type', /application\/json/)
              .expect(200)
              .then(res => {
                const newData = cloneExpectedData()
                newData.seasons[2].competitions[2].teams[2].name = 'NewTeam2Name'
                expect(JSON.stringify(res.body)).to.equal(JSON.stringify(newData.seasons[2].competitions[2].teams[2]))
                expect(seasonsDataFile.writeData).to.be.calledWith(newData)
              })
          })
        })

        context('writing data fails', () => {
          beforeEach(() => {
            seasonsDataFile.writeData.throws(error500)
          })

          it('returns 500', () => {
            return request(app)
              .put('/api/v1/seasons/2/competitions/2/teams/2')
              .send({ name: 'NewTeam2Name' })
              .set('Accept', 'application/json')
              .expect(500)
              .then(() => {
                const newData = cloneExpectedData()
                newData.seasons[2].competitions[2].teams[2].name = 'NewTeam2Name'
                expect(seasonsDataFile.writeData).to.be.calledWith(newData)
              })
          })
        })
      })

      context('reading data fails', () => {
        beforeEach(() => {
          seasonsDataFile.readData.throws(error500)
        })

        it('returns 500', () => {
          return request(app)
            .put('/api/v1/seasons/2/competitions/2/teams/2')
            .send({ name: 'NewTeam2Name' })
            .set('Accept', 'application/json')
            .expect(500)
            .then(() => {
              expect(seasonsDataFile.writeData.callCount).to.equal(0)
            })
        })
      })
    })
    describe('/delete', () => {
      context('reading data succeeds', () => {
        context('writing data succeeds', () => {
          context('seasonId is invalid', () => {
            it('returns 400', () => {
              return request(app)
                .delete('/api/v1/seasons/a/competitions/2/teams/2')
                .set('Accept', 'application/json')
                .expect(400)
            })
          })

          context('season does not exist', () => {
            it('returns 404', () => {
              return request(app)
                .delete('/api/v1/seasons/1000/competitions/2/teams/2')
                .set('Accept', 'application/json')
                .expect(404)
                .then(() => {
                  expect(seasonsDataFile.writeData.callCount).to.equal(0)
                })
            })
          })

          context('competitionId is invalid', () => {
            it('returns 400', () => {
              return request(app)
                .delete('/api/v1/seasons/2/competitions/a/teams/2')
                .set('Accept', 'application/json')
                .expect(400)
            })
          })

          context('competition does not exist', () => {
            it('returns 200', () => {
              return request(app)
                .delete('/api/v1/seasons/2/competitions/1000/teams/2')
                .set('Accept', 'application/json')
                .expect(404)
                .then(() => {
                  expect(seasonsDataFile.writeData.callCount).to.equal(0)
                })
            })
          })

          context('teamId is invalid', () => {
            it('returns 400', () => {
              return request(app)
                .delete('/api/v1/seasons/2/competitions/2/teams/a')
                .set('Accept', 'application/json')
                .expect(400)
            })
          })

          context('team does not exist', () => {
            it('returns 200', () => {
              return request(app)
                .delete('/api/v1/seasons/2/competitions/2/teams/1000')
                .set('Accept', 'application/json')
                .expect(200)
                .then(() => {
                  expect(seasonsDataFile.writeData.callCount).to.equal(0)
                })
            })
          })

          it('deletes the data', () => {
            return request(app)
              .delete('/api/v1/seasons/2/competitions/2/teams/2')
              .set('Accept', 'application/json')
              .expect(200)
              .then(() => {
                const newData = cloneExpectedData()
                newData.seasons[2].competitions[2].teams.splice(2, 1)
                expect(seasonsDataFile.writeData).to.be.calledWith(newData)
              })
          })
        })

        context('writing data fails', () => {
          beforeEach(() => {
            seasonsDataFile.writeData.throws(error500)
          })

          it('returns 500', () => {
            return request(app)
              .delete('/api/v1/seasons/2/competitions/2/teams/2')
              .set('Accept', 'application/json')
              .expect(500)
              .then(() => {
                const newData = cloneExpectedData()
                newData.seasons[2].competitions[2].teams.splice(2, 1)
                expect(seasonsDataFile.writeData).to.be.calledWith(newData)
              })
          })
        })
      })

      context('reading data fails', () => {
        beforeEach(() => {
          seasonsDataFile.readData.throws(error500)
        })

        it('returns 500', () => {
          return request(app)
            .delete('/api/v1/seasons/2/competitions/2/teams/2')
            .set('Accept', 'application/json')
            .expect(500)
        })
      })
    })
  })

  describe('/seasons/:seasonId/competitions/:competitionId/teams/:teamId/contacts', () => {
    describe('/get', () => {
      context('reading data succeeds', () => {
        context('seasonId is invalid', () => {
          it('returns 400', () => {
            return request(app)
              .get('/api/v1/seasons/a/competitions/2/teams/2/contacts')
              .set('Accept', 'application/json')
              .expect(400)
          })
        })

        context('competitionId is invalid', () => {
          it('returns 400', () => {
            return request(app)
              .get('/api/v1/seasons/2/competitions/a/teams/2/contacts')
              .set('Accept', 'application/json')
              .expect(400)
          })
        })

        context('fixtureId is invalid', () => {
          it('returns 400', () => {
            return request(app)
              .get('/api/v1/seasons/2/competitions/2/teams/a/contacts')
              .set('Accept', 'application/json')
              .expect(400)
          })
        })

        context('season does not exist', () => {
          it('returns 404', () => {
            return request(app)
              .get('/api/v1/seasons/1000/competitions/2/teams/2/contacts')
              .set('Accept', 'application/json')
              .expect(404)
          })
        })

        context('competition does not exist', () => {
          it('returns 404', () => {
            return request(app)
              .get('/api/v1/seasons/2/competitions/1000/teams/2/contacts')
              .set('Accept', 'application/json')
              .expect(404)
          })
        })

        context('team does not exist', () => {
          it('returns 404', () => {
            return request(app)
              .get('/api/v1/seasons/2/competitions/2/teams/1000/contacts')
              .set('Accept', 'application/json')
              .expect(404)
          })
        })

        it('returns the data', () => {
          return request(app)
            .get('/api/v1/seasons/2/competitions/2/teams/2/contacts')
            .set('Accept', 'application/json')
            .expect('Content-Type', /application\/json/)
            .expect(200)
            .then(res => {
              expect(JSON.stringify(res.body)).to.equal(JSON.stringify(expectedData.seasons[2].competitions[2].teams[2].contacts))
            })
        })
      })

      context('reading data fails', () => {
        beforeEach(() => {
          seasonsDataFile.readData.throws(error500)
        })

        it('returns 500', () => {
          return request(app)
            .get('/api/v1/seasons/2/competitions/2/teams/2/contacts')
            .set('Accept', 'application/json')
            .expect(500)
        })
      })
    })
    describe('/post', () => {
      context('reading data succeeds', () => {
        context('writing data succeeds', () => {
          context('season does not exist', () => {
            it('returns 404', () => {
              return request(app)
                .post('/api/v1/seasons/1000/competitions/2/teams/2/contacts')
                .send({ email: 'contact4@teamName2' })
                .set('Accept', 'application/json')
                .expect(404)
                .then(res => {
                  expect(seasonsDataFile.writeData.callCount).to.equal(0)
                })
            })
          })

          context('competition does not exist', () => {
            it('returns 404', () => {
              return request(app)
                .post('/api/v1/seasons/2/competitions/1000/teams/2/contacts')
                .send({ email: 'teamName2' })
                .set('Accept', 'application/json')
                .expect(404)
                .then(res => {
                  expect(seasonsDataFile.writeData.callCount).to.equal(0)
                })
            })
          })

          context('team does not exist', () => {
            it('returns 404', () => {
              return request(app)
                .post('/api/v1/seasons/2/competitions/2/teams/1000/contacts')
                .send({ email: 'contact4@teamName2' })
                .set('Accept', 'application/json')
                .expect(404)
                .then(res => {
                  expect(seasonsDataFile.writeData.callCount).to.equal(0)
                })
            })
          })

          context('contactAddress is missing', () => {
            it('returns 400', () => {
              return request(app)
                .post('/api/v1/seasons/2/competitions/2/teams/2/contacts')
                .set('Accept', 'application/json')
                .expect(400)
            })
          })

          context('contactAddress is zero length', () => {
            it('returns 400', () => {
              return request(app)
                .post('/api/v1/seasons/2/competitions/2/teams/2/contacts')
                .send({ email: '' })
                .set('Accept', 'application/json')
                .expect(400)
            })
          })

          context('posted data is not JSON', () => {
            it('returns 400', () => {
              return request(app)
                .post('/api/v1/seasons/2/competitions/2/teams/2/contacts')
                .send('email=contact4@teamName2')
                .set('Accept', 'application/json')
                .expect(400)
            })
          })

          context('team already exists', () => {
            it('returns the existing id', () => {
              return request(app)
                .post('/api/v1/seasons/2/competitions/2/teams/2/contacts')
                .send({ email: 'contact2@teamName2' })
                .set('Accept', 'application/json')
                .expect('Content-Type', /application\/json/)
                .expect(200)
                .then(res => {
                  expect(JSON.stringify(res.body)).to.equal(JSON.stringify({ id: 2 }))
                  expect(seasonsDataFile.writeData.callCount).to.equal(0)
                })
            })
          })

          it('returns the new id', () => {
            return request(app)
              .post('/api/v1/seasons/2/competitions/2/teams/2/contacts')
              .send({ email: 'NewContact@teamName2' })
              .set('Accept', 'application/json')
              .expect('Content-Type', /application\/json/)
              .expect(200)
              .then(res => {
                expect(JSON.stringify(res.body)).to.equal(JSON.stringify({ id: 4 }))
                const newData = cloneExpectedData()
                newData.seasons[2].competitions[2].teams[2].contacts.push({ id: 4, email: 'NewContact@teamName2' })
                expect(seasonsDataFile.writeData).to.be.calledWith(newData)
              })
          })
        })

        context('writing data fails', () => {
          beforeEach(() => {
            seasonsDataFile.writeData.throws(error500)
          })

          it('returns 500', () => {
            return request(app)
              .post('/api/v1/seasons/2/competitions/2/teams/2/contacts')
              .send({ email: 'NewContact@teamName2' })
              .set('Accept', 'application/json')
              .expect(500)
              .then(() => {
                const newData = cloneExpectedData()
                newData.seasons[2].competitions[2].teams[2].contacts.push({ id: 4, email: 'NewContact@teamName2' })
                expect(seasonsDataFile.writeData).to.be.calledWith(newData)
              })
          })
        })
      })

      context('reading data fails', () => {
        beforeEach(() => {
          seasonsDataFile.readData.throws(error500)
        })

        it('returns 500', () => {
          return request(app)
            .post('/api/v1/seasons/2/competitions/2/teams/2/contacts')
            .send({ email: 'NewCompetition' })
            .set('Accept', 'application/json')
            .expect(500)
            .then(() => {
              expect(seasonsDataFile.writeData.callCount).to.equal(0)
            })
        })
      })
    })
  })

  describe('/seasons/:seasonId/competitions/:competitionId/teams/:teamId/contacts/:contactId', () => {
    describe('/get', () => {
      context('reading data succeeds', () => {
        context('seasonId is invalid', () => {
          it('returns 400', () => {
            return request(app)
              .get('/api/v1/seasons/a/competitions/2/teams/2/contacts/2')
              .set('Accept', 'application/json')
              .expect(400)
          })
        })

        context('competitionId is invalid', () => {
          it('returns 400', () => {
            return request(app)
              .get('/api/v1/seasons/2/competitions/a/teams/2/contacts/2')
              .set('Accept', 'application/json')
              .expect(400)
          })
        })

        context('fixtureId is invalid', () => {
          it('returns 400', () => {
            return request(app)
              .get('/api/v1/seasons/2/competitions/2/teams/a/contacts/2')
              .set('Accept', 'application/json')
              .expect(400)
          })
        })

        context('contactId is invalid', () => {
          it('returns 400', () => {
            return request(app)
              .get('/api/v1/seasons/2/competitions/2/teams/2/contacts/a')
              .set('Accept', 'application/json')
              .expect(400)
          })
        })

        context('season does not exist', () => {
          it('returns 404', () => {
            return request(app)
              .get('/api/v1/seasons/1000/competitions/2/teams/2/contacts/2')
              .set('Accept', 'application/json')
              .expect(404)
          })
        })

        context('competition does not exist', () => {
          it('returns 404', () => {
            return request(app)
              .get('/api/v1/seasons/2/competitions/1000/teams/2/contacts/2')
              .set('Accept', 'application/json')
              .expect(404)
          })
        })

        context('team does not exist', () => {
          it('returns 404', () => {
            return request(app)
              .get('/api/v1/seasons/2/competitions/2/teams/1000/contacts/2')
              .set('Accept', 'application/json')
              .expect(404)
          })
        })

        context('contact does not exist', () => {
          it('returns 404', () => {
            return request(app)
              .get('/api/v1/seasons/2/competitions/2/teams/2/contacts/1000')
              .set('Accept', 'application/json')
              .expect(404)
          })
        })

        it('returns the data', () => {
          return request(app)
            .get('/api/v1/seasons/2/competitions/2/teams/2/contacts/2')
            .set('Accept', 'application/json')
            .expect('Content-Type', /application\/json/)
            .expect(200)
            .then(res => {
              expect(JSON.stringify(res.body)).to.equal(JSON.stringify(expectedData.seasons[2].competitions[2].teams[2].contacts[2]))
            })
        })
      })

      context('reading data fails', () => {
        beforeEach(() => {
          seasonsDataFile.readData.throws(error500)
        })

        it('returns 500', () => {
          return request(app)
            .get('/api/v1/seasons/2/competitions/2/teams/2/contacts/2')
            .set('Accept', 'application/json')
            .expect(500)
        })
      })
    })
    describe('/put', () => {
      context('reading data succeeds', () => {
        context('writing data succeeds', () => {
          context('seasonId is invalid', () => {
            it('returns 400', () => {
              return request(app)
                .put('/api/v1/seasons/a/competitions/2/teams/2/contacts/2')
                .set('Accept', 'application/json')
                .expect(400)
            })
          })

          context('competitionId is invalid', () => {
            it('returns 400', () => {
              return request(app)
                .put('/api/v1/seasons/2/competitions/a/teams/2/contacts/2')
                .set('Accept', 'application/json')
                .expect(400)
            })
          })

          context('teamId is invalid', () => {
            it('returns 400', () => {
              return request(app)
                .put('/api/v1/seasons/2/competitions/2/teams/a/contacts/2')
                .set('Accept', 'application/json')
                .expect(400)
            })
          })

          context('contactId is invalid', () => {
            it('returns 400', () => {
              return request(app)
                .put('/api/v1/seasons/2/competitions/2/teams/2/contacts/a')
                .set('Accept', 'application/json')
                .expect(400)
            })
          })

          context('contactAddress is missing', () => {
            it('returns 400', () => {
              return request(app)
                .put('/api/v1/seasons/2/competitions/2/teams/2/contacts/2')
                .set('Accept', 'application/json')
                .expect(400)
            })
          })

          context('contactAddress is zero length', () => {
            it('returns 400', () => {
              return request(app)
                .put('/api/v1/seasons/2/competitions/2/teams/2/contacts/2')
                .send({ email: '' })
                .set('Accept', 'application/json')
                .expect(400)
            })
          })

          context('posted data is not JSON', () => {
            it('returns 400', () => {
              return request(app)
                .put('/api/v1/seasons/2/competitions/2/teams/2/contacts/2')
                .send('email=competitionName2')
                .set('Accept', 'application/json')
                .expect(400)
            })
          })

          context('season does not exist', () => {
            it('returns 404', () => {
              return request(app)
                .put('/api/v1/seasons/1000/competitions/2/teams/2/contacts/2')
                .send({ email: 'NewTeam2Name' })
                .set('Accept', 'application/json')
                .expect(404)
                .then(res => {
                  expect(seasonsDataFile.writeData.callCount).to.equal(0)
                })
            })
          })

          context('competition does not exist', () => {
            it('returns 404', () => {
              return request(app)
                .put('/api/v1/seasons/2/competitions/1000/teams/2/contacts/2')
                .send({ email: 'NewTeam2Name' })
                .set('Accept', 'application/json')
                .expect(404)
                .then(res => {
                  expect(seasonsDataFile.writeData.callCount).to.equal(0)
                })
            })
          })

          context('team does not exist', () => {
            it('returns 404', () => {
              return request(app)
                .put('/api/v1/seasons/2/competitions/2/teams/1000/contacts/2')
                .send({ email: 'NewTeam2Name' })
                .set('Accept', 'application/json')
                .expect(404)
                .then(res => {
                  expect(seasonsDataFile.writeData.callCount).to.equal(0)
                })
            })
          })

          context('contact does not exist', () => {
            it('returns 404', () => {
              return request(app)
                .put('/api/v1/seasons/2/competitions/2/teams/2/contacts/1000')
                .send({ email: 'NewTeam2Name' })
                .set('Accept', 'application/json')
                .expect(404)
                .then(res => {
                  expect(seasonsDataFile.writeData.callCount).to.equal(0)
                })
            })
          })

          context('contactAddress already used', () => {
            it('returns 409', () => {
              return request(app)
                .put('/api/v1/seasons/2/competitions/2/teams/2/contacts/2')
                .send({ email: 'contact3@teamName2' })
                .set('Accept', 'application/json')
                .expect(409)
                .then(res => {
                  expect(seasonsDataFile.writeData.callCount).to.equal(0)
                })
            })
          })

          it('returns the new id', () => {
            return request(app)
              .put('/api/v1/seasons/2/competitions/2/teams/2/contacts/2')
              .send({ email: 'newContact2@teamName2' })
              .set('Accept', 'application/json')
              .expect('Content-Type', /application\/json/)
              .expect(200)
              .then(res => {
                const newData = cloneExpectedData()
                newData.seasons[2].competitions[2].teams[2].contacts[2].email = 'newContact2@teamName2'
                expect(JSON.stringify(res.body)).to.equal(JSON.stringify(newData.seasons[2].competitions[2].teams[2].contacts[2]))
                expect(seasonsDataFile.writeData).to.be.calledWith(newData)
              })
          })
        })

        context('writing data fails', () => {
          beforeEach(() => {
            seasonsDataFile.writeData.throws(error500)
          })

          it('returns 500', () => {
            return request(app)
              .put('/api/v1/seasons/2/competitions/2/teams/2/contacts/2')
              .send({ email: 'newContact2@teamName2' })
              .set('Accept', 'application/json')
              .expect(500)
              .then(() => {
                const newData = cloneExpectedData()
                newData.seasons[2].competitions[2].teams[2].contacts[2].email = 'newContact2@teamName2'
                expect(seasonsDataFile.writeData).to.be.calledWith(newData)
              })
          })
        })
      })

      context('reading data fails', () => {
        beforeEach(() => {
          seasonsDataFile.readData.throws(error500)
        })

        it('returns 500', () => {
          return request(app)
            .put('/api/v1/seasons/2/competitions/2/teams/2/contacts/2')
            .send({ email: 'newContact2@teamName2' })
            .set('Accept', 'application/json')
            .expect(500)
            .then(() => {
              expect(seasonsDataFile.writeData.callCount).to.equal(0)
            })
        })
      })
    })
    describe('/delete', () => {
      context('reading data succeeds', () => {
        context('writing data succeeds', () => {
          context('seasonId is invalid', () => {
            it('returns 400', () => {
              return request(app)
                .delete('/api/v1/seasons/a/competitions/2/teams/2/contacts/2')
                .set('Accept', 'application/json')
                .expect(400)
            })
          })

          context('season does not exist', () => {
            it('returns 404', () => {
              return request(app)
                .delete('/api/v1/seasons/1000/competitions/2/teams/2/contacts/2')
                .set('Accept', 'application/json')
                .expect(404)
                .then(() => {
                  expect(seasonsDataFile.writeData.callCount).to.equal(0)
                })
            })
          })

          context('competitionId is invalid', () => {
            it('returns 400', () => {
              return request(app)
                .delete('/api/v1/seasons/2/competitions/a/teams/2/contacts/2')
                .set('Accept', 'application/json')
                .expect(400)
            })
          })

          context('competition does not exist', () => {
            it('returns 200', () => {
              return request(app)
                .delete('/api/v1/seasons/2/competitions/1000/teams/2/contacts/2')
                .set('Accept', 'application/json')
                .expect(404)
                .then(() => {
                  expect(seasonsDataFile.writeData.callCount).to.equal(0)
                })
            })
          })

          context('teamId is invalid', () => {
            it('returns 400', () => {
              return request(app)
                .delete('/api/v1/seasons/2/competitions/2/teams/a/contacts/2')
                .set('Accept', 'application/json')
                .expect(400)
            })
          })

          context('team does not exist', () => {
            it('returns 200', () => {
              return request(app)
                .delete('/api/v1/seasons/2/competitions/2/teams/1000/contacts/2')
                .set('Accept', 'application/json')
                .expect(404)
                .then(() => {
                  expect(seasonsDataFile.writeData.callCount).to.equal(0)
                })
            })
          })

          context('contactId is invalid', () => {
            it('returns 400', () => {
              return request(app)
                .delete('/api/v1/seasons/2/competitions/2/teams/2/contacts/a')
                .set('Accept', 'application/json')
                .expect(400)
            })
          })

          context('contact does not exist', () => {
            it('returns 200', () => {
              return request(app)
                .delete('/api/v1/seasons/2/competitions/2/teams/2/contacts/1000')
                .set('Accept', 'application/json')
                .expect(200)
                .then(() => {
                  expect(seasonsDataFile.writeData.callCount).to.equal(0)
                })
            })
          })

          it('deletes the data', () => {
            return request(app)
              .delete('/api/v1/seasons/2/competitions/2/teams/2/contacts/2')
              .set('Accept', 'application/json')
              .expect(200)
              .then(() => {
                const newData = cloneExpectedData()
                newData.seasons[2].competitions[2].teams[2].contacts.splice(2, 1)
                expect(seasonsDataFile.writeData).to.be.calledWith(newData)
              })
          })
        })

        context('writing data fails', () => {
          beforeEach(() => {
            seasonsDataFile.writeData.throws(error500)
          })

          it('returns 500', () => {
            return request(app)
              .delete('/api/v1/seasons/2/competitions/2/teams/2/contacts/2')
              .set('Accept', 'application/json')
              .expect(500)
              .then(() => {
                const newData = cloneExpectedData()
                newData.seasons[2].competitions[2].teams[2].contacts.splice(2, 1)
                expect(seasonsDataFile.writeData).to.be.calledWith(newData)
              })
          })
        })
      })

      context('reading data fails', () => {
        beforeEach(() => {
          seasonsDataFile.readData.throws(error500)
        })

        it('returns 500', () => {
          return request(app)
            .delete('/api/v1/seasons/2/competitions/2/teams/2/contacts/2')
            .set('Accept', 'application/json')
            .expect(500)
        })
      })
    })
  })

  describe('/reminders/email', () => {
    describe('get', () => {

    })

    describe('put', () => {

    })
  })

  describe('/reminders/email/body', () => {
    describe('get', () => {

    })

    describe('put', () => {

    })
  })

  describe('/reminders/email/smtp', () => {
    describe('get', () => {

    })

    describe('put', () => {

    })
  })

  describe('/reminders/email/next', () => {
    describe('get', () => {

    })
  })
})
