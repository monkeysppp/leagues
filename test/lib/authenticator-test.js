'use strict'

const chai = require('chai')
const expect = chai.expect
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
chai.use(sinonChai)
const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)

const Authenticator = require('../../lib/authenticator.js')
const jwt = require('jsonwebtoken')

describe('authenticator', () => {
  const jwtIssuer = 'someIssuer'
  const jwtSecret = 'someSecret'

  describe('constructor', () => {
    context('when no jwtIssuer is given', () => {
      it('throws', () => {
        expect(() => { const authenticator = new Authenticator(); authenticator.isJwtPresent() }).to.throw(Error, 'jwtIssuer not set')
      })
    })

    context('when no jwtSecret is given', () => {
      it('throws', () => {
        expect(() => { const authenticator = new Authenticator(jwtIssuer); authenticator.isJwtPresent() }).to.throw(Error, 'jwtSecret not set')
      })
    })

    it('stores the jwt settings', () => {
      const authenticator = new Authenticator(jwtIssuer, jwtSecret)
      expect(authenticator.jwtIssuer).to.equal(jwtIssuer)
      expect(authenticator.jwtSecret).to.equal(jwtSecret)
    })
  })

  describe('isJwtPresent', () => {
    let authenticator

    beforeEach(() => {
      authenticator = new Authenticator(jwtIssuer, jwtSecret)
    })

    context('when there are no cookies', () => {
      it('returns false', () => {
        expect(authenticator.isJwtPresent({})).to.equal(false)
      })
    })

    context('when there is no JWT', () => {
      it('returns false', () => {
        expect(authenticator.isJwtPresent({ cookies: {} })).to.equal(false)
      })
    })

    context('when a JWT is present', () => {
      it('returns true', () => {
        expect(authenticator.isJwtPresent({ cookies: { jwt: {} } })).to.equal(true)
      })
    })
  })

  describe('signToken', () => {
    let authenticator
    let clock

    beforeEach(() => {
      authenticator = new Authenticator(jwtIssuer, jwtSecret)
      sinon.stub(jwt, 'sign').returns('fakeJWT')
      clock = sinon.useFakeTimers()
    })

    afterEach(() => {
      jwt.sign.restore()
      clock.restore()
    })

    context('when signing a JWT fails', () => {
      beforeEach(() => {
        jwt.sign.throws(new Error('Failed to sign JWT'))
      })

      it('throws', () => {
        expect(() => { authenticator.signToken({}) }).to.throw(Error, 'Failed to sign JWT')
      })
    })

    it('adds the issuer and expiry to the token data, and signs the JWT', () => {
      const tokenData = {
        foo: 'bar'
      }
      const token = authenticator.signToken(tokenData)
      expect(token).to.equal('fakeJWT')
      expect(jwt.sign).to.be.calledWith(tokenData, jwtSecret)
      expect(tokenData.iss).to.equal(jwtIssuer)
      expect(tokenData.exp).to.equal(86400000)
    })
  })

  describe('validateToken', () => {
    const tokenData = {
      foo: 'bar',
      exp: 100
    }
    const token = 'fakeJWT'
    let authenticator
    let clock

    beforeEach(() => {
      authenticator = new Authenticator(jwtIssuer, jwtSecret)
      sinon.stub(jwt, 'verify').returns(tokenData)
      clock = sinon.useFakeTimers()
    })

    afterEach(() => {
      jwt.verify.restore()
      clock.restore()
    })

    context('when verifying a JWT fails', () => {
      beforeEach(() => {
        jwt.verify.throws(new Error('Failed to verify JWT'))
      })

      it('throws', () => {
        expect(() => { authenticator.validateToken(token) }).to.throw(Error, 'Failed to verify JWT')
      })
    })

    context('when the JWT has expired', () => {
      beforeEach(() => {
        clock.tick(101)
      })

      it('throws', () => {
        expect(() => { authenticator.validateToken(token) }).to.throw(Error, 'Token has expired')
      })
    })

    it('returns the token claims as an object', () => {
      const validatedToken = authenticator.validateToken(token)
      expect(validatedToken).to.equal(tokenData)
      expect(jwt.verify).to.be.calledWith(token, jwtSecret)
    })
  })

  describe('validateCall', () => {
    const res = {}
    let req
    let authenticator
    let next

    beforeEach(() => {
      authenticator = new Authenticator(jwtIssuer, jwtSecret)
      sinon.stub(authenticator, 'isJwtPresent').returns(true)
      sinon.stub(authenticator, 'validateToken').returns({})
      req = {
        cookies: { 'X-CSRF-Token': 'abc' },
        headers: { 'x-csrf-token': 'abc' }
      }
      next = sinon.stub()
    })

    afterEach(() => {
      authenticator.isJwtPresent.restore()
      authenticator.validateToken.restore()
    })

    context('when the JWT is missing', () => {
      beforeEach(() => {
        authenticator.isJwtPresent.returns(false)
      })

      it('calls next with an error', () => {
        authenticator.validateCall(req, res, next)
        const err = next.getCall(0).args[0]
        expect(err).to.be.instanceOf(Error)
        expect(err.message).to.equal('Authentication Error: No JWT present')
      })
    })

    context('when the JWT is invalid', () => {
      beforeEach(() => {
        authenticator.validateToken.throws(new Error('invalid'))
      })

      it('calls next with an error', () => {
        authenticator.validateCall(req, res, next)
        const err = next.getCall(0).args[0]
        expect(err).to.be.instanceOf(Error)
        expect(err.message).to.equal('Authentication Error: Invalid token: invalid')
      })
    })

    context('when the CSRF cookie is missing', () => {
      beforeEach(() => {
        delete req.cookies['X-CSRF-Token']
      })

      it('calls next with an error', () => {
        authenticator.validateCall(req, res, next)
        const err = next.getCall(0).args[0]
        expect(err).to.be.instanceOf(Error)
        expect(err.message).to.equal('Authentication Error: Missing CSRF token cookie')
      })
    })

    context('when the CSRF header is missing', () => {
      beforeEach(() => {
        delete req.headers['x-csrf-token']
      })

      it('calls next with an error', () => {
        authenticator.validateCall(req, res, next)
        const err = next.getCall(0).args[0]
        expect(err).to.be.instanceOf(Error)
        expect(err.message).to.equal('Authentication Error: Missing CSRF token header')
      })
    })

    context('when the CSRF header and cookie do not match', () => {
      beforeEach(() => {
        req.headers['x-csrf-token'] = 'something different'
      })

      it('calls next with an error', () => {
        authenticator.validateCall(req, res, next)
        const err = next.getCall(0).args[0]
        expect(err).to.be.instanceOf(Error)
        expect(err.message).to.equal('Authentication Error: CSRF token cookie and header do not match')
      })
    })

    it('calls next', () => {
      authenticator.validateCall(req, res, next)
      expect(next.callCount).to.equal(1)
      expect(authenticator.isJwtPresent.callCount).to.equal(1)
      expect(authenticator.validateToken.callCount).to.equal(1)
      expect(next).to.be.calledWith()
    })
  })

  describe('handleValidationError', () => {
    const err = new Error('authentication error')
    const next = sinon.stub()
    let authenticator
    let req
    let res

    beforeEach(() => {
      authenticator = new Authenticator(jwtIssuer, jwtSecret)
      req = {}
      res = {
        cookie: sinon.stub(),
        redirect: sinon.stub(),
        sendStatus: sinon.stub()
      }
    })

    context('when the call is to a ui URL', () => {
      beforeEach(() => {
        req.originalUrl = '/ui/something'
      })

      it('redirects to /ui/login', () => {
        authenticator.handleValidationError(err, req, res, next)
        expect(res.cookie).to.be.calledWith('nextUrl', req.originalUrl, { httpOnly: true, secure: true })
        expect(res.redirect).to.be.calledWith('/ui/login')
        expect(res.sendStatus.callCount).to.equal(0)
      })
    })

    context('when the call is to any other URL', () => {
      beforeEach(() => {
        req.originalUrl = '/api/v1/not/the/ui/but/something/else'
      })

      it('returns a 401', () => {
        authenticator.handleValidationError(err, req, res, next)
        expect(res.cookie.callCount).to.equal(0)
        expect(res.redirect.callCount).to.equal(0)
        expect(res.sendStatus).to.be.calledWith(401)
      })
    })
  })
})
