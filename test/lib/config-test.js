'use strict'

const chai = require('chai')
const expect = chai.expect
const proxyquire = require('proxyquire')

describe('config', () => {
  context('when NODE_ENV is set', () => {
    let config

    beforeEach(() => {
      process.env.NODE_ENV = 'development'
      config = proxyquire('../../lib/config', {
        '../config/development.json': {
          key: 'value-dev'
        }
      })
    })

    it('uses the value', () => {
      expect(config.key).to.equal('value-dev')
    })
  })

  context('when NODE_ENV is not set', () => {
    let config
    beforeEach(() => {
      delete process.env.NODE_ENV
      config = proxyquire('../../lib/config', {
        '../config/production.json': {
          key: 'value-prod'
        }
      })
    })

    it('defaults to production', () => {
      expect(config.key).to.equal('value-prod')
    })
  })
})
