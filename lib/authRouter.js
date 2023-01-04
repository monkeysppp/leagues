'use strict'

const express = require('express')
const config = require('./config.js')
const log = require('../lib/logging').getLogger('auth')
const router = express.Router()
const passport = require('passport')
const Authenticator = require('../lib/authenticator.js')
const uuid = require('uuid4')

const jwtSecret = config.jwtSecret
if (!jwtSecret) {
  log.error('Configuration file does not set a value for jwtSecret!')
  process.exit(1)
}

const jwtIssuer = config.jwtIssuer
if (!jwtIssuer) {
  log.error('Configuration file does not set a value for jwtIssuer!')
  process.exit(1)
}

const authenticator = new Authenticator(jwtIssuer, jwtSecret)

router.post('/login', (req, res, next) => {
  log.info('handling login')
  // Authenticate using the 'local' strategy
  passport.authenticate('local', function (err, user) {
    if (err) {
      return next(err)
    }

    if (!user) {
      return res.status(401).json({ error: 'message' })
    }

    // User has authenticated correctly. Create a JWT token
    log.debug('User <' + user.username + '> authenticated okay')
    const token = authenticator.signToken({ username: user.username })
    log.info('User <' + user.username + '> logged in')

    const csrfToken = uuid()
    res.cookie('jwt', token, { httpOnly: true, secure: false })
    res.cookie('X-CSRF-Token', csrfToken, { secure: false })
    res.cookie('user', user.username)

    if (req.cookies && req.cookies.nextUrl) {
      res.clearCookie('nextUrl')
      log.debug('redirecting user back to ' + req.cookies.nextUrl)
      res.redirect(req.cookies.nextUrl)
    } else {
      res.redirect('/ui')
    }
  })(req, res, next)
})

router.get('/logout', (req, res) => {
  log.info('handling  logout')
  if (authenticator.isJwtPresent(req)) {
    try {
      const token = authenticator.validateToken(req.cookies.jwt)
      log.info('User <' + token.username + '> logged out')
    } catch (err) {
      log.error('Invalid JWT token')
    }
  } else {
    log.info('logout called, but user doesn\'t appear to be logged in')
  }

  log.info('logging the user out')
  res.clearCookie('jwt')
  res.clearCookie('X-CSRF-Token')
  res.clearCookie('user')
  res.clearCookie('nextUrl')
  res.redirect('/ui')
})

module.exports = router
