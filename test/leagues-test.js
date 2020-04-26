'use strict'

const chai = require('chai')
const expect = chai.expect
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
chai.use(sinonChai)
const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)

const command = require('../lib/command.js')

describe('leagues CLI', () => {
  beforeEach(() => {
    sinon.stub(process, 'exit').resolves()
    sinon.stub(command, 'run').resolves()
  })

  afterEach(() => {
    command.run.restore()
    process.exit.restore()
    delete require.cache[require.resolve('../leagues.js')]
  })

  context('call succeeds', () => {
    it('resolves', () => {
      require('../leagues.js')
      expect(command.run.callCount).to.equal(1)
      expect(process.exit.callCount).to.equal(0)
    })
  })

  context('call fails', () => {
    beforeEach(() => {
      command.run.rejects(new Error('Command Error'))
      sinon.spy(console, 'log')
    })

    afterEach(() => {
      console.log.restore()
    })

    it('rejects and logs', (done) => {
      process.exit.callsFake((code) => {
        try {
          expect(command.run.callCount).to.equal(1)
          expect(console.log).to.be.calledWith(sinon.match(/Exiting with .* Command Error/))
          expect(code).to.equal(1)
          done()
        } catch (e) {
          done(e)
        }
      })
      require('../leagues.js')
    })
  })
})
