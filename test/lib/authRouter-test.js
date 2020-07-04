'use strict'

const chai = require('chai')
const expect = chai.expect
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
chai.use(sinonChai)
const proxyquire = require('proxyquire')
const supertest = require('supertest')
const passport = require('passport')
const express = require('express')
const cookieParser = require('cookie-parser')
const log = require('../../lib/logging').getLogger('auth')

describe('authRoutes', () => {
  describe('POST /login', () => {
    let AuthenticatorStub
    let signTokenStub
    let isJwtPresentStub
    let validateTokenStub
    let authRouter
    let app

    beforeEach(() => {
      signTokenStub = sinon.stub().returns('someToken')
      isJwtPresentStub = sinon.stub().returns(true)
      validateTokenStub = sinon.stub().returns({ username: 'someUser' })
      AuthenticatorStub = sinon.stub().returns({
        signToken: signTokenStub,
        isJwtPresent: isJwtPresentStub,
        validateToken: validateTokenStub
      })
      authRouter = proxyquire('../../lib/authRouter.js', {
        '../lib/authenticator.js': AuthenticatorStub
      })
      app = express()
      app.use(cookieParser())
      app.use(authRouter)
      app.use((err, req, res, next) => { if (err) res.sendStatus(401) })
      sinon.stub(passport, 'authenticate')
        .callsFake((zone, callback) => {
          return (req, res, next) => {
            callback(undefined, { username: 'someUser' })
          }
        })
    })

    afterEach(() => {
      passport.authenticate.restore()
    })

    context('when the login fails validation', () => {
      beforeEach(() => {
        passport.authenticate.callsFake((zone, callback) => {
          return (req, res, next) => {
            callback(new Error('auth error'))
          }
        })
      })

      it('errors and does not do anything else', (done) => {
        supertest(app)
          .post('/login')
          .send({ username: 'user', password: 'pass' })
          .expect(401)
          .expect(() => {
            expect(signTokenStub.callCount).to.equal(0)
          })
          .end(err => { done(err) })
      })
    })

    context('when the login user is unknown', () => {
      beforeEach(() => {
        passport.authenticate.callsFake((zone, callback) => {
          return (req, res, next) => {
            callback(undefined, undefined)
          }
        })
      })

      it('errors and does not do anything else', (done) => {
        supertest(app)
          .post('/login')
          .send({ username: 'user', password: 'pass' })
          .expect(401)
          .expect(() => {
            expect(signTokenStub.callCount).to.equal(0)
          })
          .end(err => { done(err) })
      })
    })

    context('when the nextUrl cookie is set', () => {
      it('sets the authentication tokens and redirects to nextUrl', (done) => {
        supertest(app)
          .post('/login')
          .send({ username: 'user', password: 'pass' })
          .set('Cookie', ['nextUrl=/ui/foo/bar'])
          .expect(302)
          .expect(res => {
            expect(signTokenStub.callCount).to.equal(1)
            expect(signTokenStub).to.be.calledWith({ username: 'someUser' })
            expect(res.headers['set-cookie']).to.include('jwt=someToken; Path=/; HttpOnly')
            expect(res.headers['set-cookie'].some(elem => /X-CSRF-Token=[a-z0-9-]*; Path=\//.test(elem))).to.equal(true)
            expect(res.headers['set-cookie']).to.include('user=someUser; Path=/')
            expect(res.headers.location).to.equal('/ui/foo/bar')
          })
          .end(err => { done(err) })
      })
    })

    it('sets the authentication tokens and redirects to /ui', (done) => {
      supertest(app)
        .post('/login')
        .send({ username: 'user', password: 'pass' })
        .expect(302)
        .expect(res => {
          expect(signTokenStub.callCount).to.equal(1)
          expect(signTokenStub).to.be.calledWith({ username: 'someUser' })
          expect(res.headers['set-cookie']).to.include('jwt=someToken; Path=/; HttpOnly')
          expect(res.headers['set-cookie'].some(elem => /X-CSRF-Token=[a-z0-9-]*; Path=\//.test(elem))).to.equal(true)
          expect(res.headers['set-cookie']).to.include('user=someUser; Path=/')
          expect(res.headers.location).to.equal('/ui')
        })
        .end(err => { done(err) })
    })
  })

  describe('GET /logout', () => {
    let AuthenticatorStub
    let signTokenStub
    let isJwtPresentStub
    let validateTokenStub
    let authRouter
    let app

    beforeEach(() => {
      signTokenStub = sinon.stub().returns('someToken')
      isJwtPresentStub = sinon.stub().returns(true)
      validateTokenStub = sinon.stub().returns({ username: 'someUser' })
      AuthenticatorStub = sinon.stub().returns({
        signToken: signTokenStub,
        isJwtPresent: isJwtPresentStub,
        validateToken: validateTokenStub
      })
      authRouter = proxyquire('../../lib/authRouter.js', {
        '../lib/authenticator.js': AuthenticatorStub
      })
      app = express()
      app.use(cookieParser())
      app.use(authRouter)
      app.use((err, req, res, next) => { if (err) res.sendStatus(401) })
      sinon.stub(passport, 'authenticate')
        .callsFake((zone, callback) => {
          return (req, res, next) => {
            callback(undefined, { username: 'someUser' })
          }
        })
    })

    afterEach(() => {
      passport.authenticate.restore()
    })

    context('when a JWT is present', () => {
      context('when the JWT is invalid', () => {
        beforeEach(() => {
          validateTokenStub.throws(new Error('invalidJwt'))
        })

        it('logs the user out anyway', (done) => {
          supertest(app)
            .get('/logout')
            .expect(302)
            .expect(res => {
              expect(res.headers['set-cookie']).to.include('jwt=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT')
              expect(res.headers['set-cookie']).to.include('X-CSRF-Token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT')
              expect(res.headers['set-cookie']).to.include('user=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT')
              expect(res.headers['set-cookie']).to.include('nextUrl=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT')
              expect(res.headers.location).to.equal('/ui')
            })
            .end(err => { done(err) })
        })
      })

      context('when the JWT is valid', () => {
        it('logs the user out', (done) => {
          supertest(app)
            .get('/logout')
            .expect(302)
            .expect(res => {
              expect(res.headers['set-cookie']).to.include('jwt=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT')
              expect(res.headers['set-cookie']).to.include('X-CSRF-Token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT')
              expect(res.headers['set-cookie']).to.include('user=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT')
              expect(res.headers['set-cookie']).to.include('nextUrl=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT')
              expect(res.headers.location).to.equal('/ui')
            })
            .end(err => { done(err) })
        })
      })
    })

    context('when a JWT is not present', () => {
      beforeEach(() => {
        isJwtPresentStub.returns(false)
      })

      it('logs the user out anyway', (done) => {
        supertest(app)
          .get('/logout')
          .expect(302)
          .expect(res => {
            expect(res.headers['set-cookie']).to.include('jwt=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT')
            expect(res.headers['set-cookie']).to.include('X-CSRF-Token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT')
            expect(res.headers['set-cookie']).to.include('user=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT')
            expect(res.headers['set-cookie']).to.include('nextUrl=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT')
            expect(res.headers.location).to.equal('/ui')
          })
          .end(err => { done(err) })
      })
    })
  })

  context('when the jwt issuer and secret are not set', () => {
    let AuthenticatorStub

    beforeEach(() => {
      sinon.spy(log, 'error')
      AuthenticatorStub = sinon.stub()
      proxyquire('../../lib/authRouter.js', {
        './config.js': {
          jwtSecret: undefined,
          jwtIssuer: undefined
        },
        '../lib/authenticator.js': AuthenticatorStub
      })
    })

    afterEach(() => {
      log.error.restore()
    })

    it('logs error messages', () => {
      expect(AuthenticatorStub).to.be.calledWith('changeThisIssuer', 'changeThisSecret')
      expect(log.error).to.be.calledWith('Using an insecure secret for JWT.  You will want to change this!')
      expect(log.error).to.be.calledWith('Using JWT without defining an issuer.  You will want to change this!')
    })
  })
})
