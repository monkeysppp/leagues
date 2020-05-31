/*
 * Unit tests for controllers/SeasonsService.js
 */

'use strict'

const chai = require('chai')
const expect = chai.expect
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
chai.use(sinonChai)
const fs = require('fs')
const path = require('path')

const dataFile = require('../../../api/v1/emailRemindersConfigFile.js')

const configDataFile = path.join(__dirname, '..', '..', '..', 'data', 'emailRemindersConfig.json')
const sampleData = {
  enabled: true,
  reminderDays: 6,
  reminderTime: '10:00',
  email: {
    leader: 'leader\n\ntext',
    tailer: '\ntailer\ntext'
  }
}

describe('dataFile', () => {
  beforeEach(() => {
    sinon.stub(fs, 'readFileSync').returns(sampleData)
    sinon.stub(fs, 'writeFileSync').returns()
    sinon.stub(fs, 'mkdirSync').returns()
  })

  afterEach(() => {
    fs.readFileSync.restore()
    fs.writeFileSync.restore()
    fs.mkdirSync.restore()
  })

  describe('writeData', () => {
    context('when writing succeeds', () => {
      it('succeeds', () => {
        dataFile.writeData(sampleData)
        expect(fs.writeFileSync).to.be.calledWith(configDataFile, JSON.stringify(sampleData), 'utf-8')
      })
    })

    context('when writing fails', () => {
      beforeEach(() => {
        fs.writeFileSync.throws(new Error('BANG!'))
      })

      it('throws with status 500', () => {
        expect(() => { dataFile.writeData(sampleData) }).to.throw(/BANG!/).with.property('status', 500)
        expect(fs.writeFileSync).to.be.calledWith(configDataFile, JSON.stringify(sampleData), 'utf-8')
      })
    })
  })

  describe('readData', () => {
    context('when the file does not exist', () => {
      beforeEach(() => {
        const err = new Error('BANG!')
        err.code = 'ENOENT'
        fs.readFileSync.throws(err)
      })

      context('when creating the file fails', () => {
        beforeEach(() => {
          fs.writeFileSync.throws(new Error('BANG!'))
        })

        it('returns a 500 error', () => {
          expect(() => { dataFile.readData() }).to.throw(/Failed to write new data file/).with.property('status', 500)
          expect(fs.readFileSync).to.be.calledWith(configDataFile, 'utf-8')
          expect(fs.writeFileSync).to.be.calledWith(configDataFile, JSON.stringify({ enabled: false, reminderDays: 6, reminderTime: '10:00', email: { leader: '', tailer: '' } }), 'utf-8')
        })
      })

      context('when creating the file succeeds', () => {
        it('succeeds', () => {
          expect(JSON.stringify(dataFile.readData())).to.equal(JSON.stringify({ enabled: false, reminderDays: 6, reminderTime: '10:00', email: { leader: '', tailer: '' } }))
          expect(fs.readFileSync).to.be.calledWith(configDataFile, 'utf-8')
          expect(fs.writeFileSync).to.be.calledWith(configDataFile, JSON.stringify({ enabled: false, reminderDays: 6, reminderTime: '10:00', email: { leader: '', tailer: '' } }), 'utf-8')
        })
      })
    })

    context('when accessing the file fails', () => {
      beforeEach(() => {
        const err = new Error('BANG!')
        fs.readFileSync.throws(err)
      })

      it('returns a 500 error', () => {
        expect(() => { dataFile.readData() }).to.throw(/Failed to read data file/).with.property('status', 500)
        expect(fs.readFileSync).to.be.calledWith(configDataFile, 'utf-8')
        expect(fs.writeFileSync.callCount).to.equal(0)
      })
    })

    context('when the file does not contain JSON', () => {
      beforeEach(() => {
        fs.readFileSync.returns('this is not JSON')
      })

      it('returns a 500 error', () => {
        expect(() => { dataFile.readData() }).to.throw(/Couldn't interpret the stored data as JSON/).with.property('status', 500)
        expect(fs.readFileSync).to.be.calledWith(configDataFile, 'utf-8')
        expect(fs.writeFileSync.callCount).to.equal(0)
      })
    })

    context('when the file contains JSON', () => {
      beforeEach(() => {
        fs.readFileSync.returns(JSON.stringify(sampleData))
      })

      it('succeeds', () => {
        expect(JSON.stringify(dataFile.readData())).to.equal(JSON.stringify(sampleData))
        expect(fs.readFileSync).to.be.calledWith(configDataFile, 'utf-8')
        expect(fs.writeFileSync.callCount).to.equal(0)
      })
    })
  })
})
