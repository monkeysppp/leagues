/** @module lib/auth */

'use strict'

const express = require('express')
const config = require('./config.js')
const log = require('../lib/logging').getLogger('auth')
const router = express.Router()
const passport = require('passport')
const Authenticator = require('../lib/authenticator.js')
const uuid = require('uuid4')

let jwtSecret = config.jwtSecret
if (!jwtSecret) {
  log.error('Using an insecure secret for JWT.  You will want to change this!')
  jwtSecret = 'changeThisSecret'
}

let jwtIssuer = config.jwtIssuer
if (!jwtIssuer) {
  log.error('Using JWT without defining an issuer.  You will want to change this!')
  jwtIssuer = 'changeThisIssuer'
}

const authenticator = new Authenticator(jwtIssuer, jwtSecret)

/**
 * handleLogin - description
 *
 * @param  {type} req  description
 * @param  {type} res  description
 * @param  {type} next description
 * @return {type}      description
 */
function handleLogin (req, res, next) {
  log.info('handling  login')
  // Authenticate using the 'local' strategy
  passport.authenticate('local', function (err, user) {
    if (err) {
      return next(err)
    }

    if (!user) {
      return res.json(401, { error: 'message' })
    }

    // User has authenticated correctly. Create a JWT token
    log.debug('User <' + user.username + '> authenticated okay')
    const token = authenticator.signToken({ username: user.username })
    log.info('User <' + user.username + '> logged in')

    const csrfToken = uuid()
    res.cookie('jwt', token, { httpOnly: true, secure: false })
    res.cookie('X-CSRF-Token', csrfToken, { secure: false })
    res.cookie('user', user.username)

    // res.cookie('nextUrl', req.originalUrl, { httpOnly: true, secure: true })
    if (req.cookies && req.cookies.nextUrl) {
      res.clearCookie('nextUrl')
      // res.redirect(req.cookies.nextUrl)
      res.redirect('/ui')
    } else {
      res.redirect('/ui')
    }
  })(req, res, next)
}

/**
 * handleLogout - description
 *
 * @param  {type} req description
 * @param  {type} res description
 * @return {type}     description
 */
function handleLogout (req, res) {
  log.info('handling  logout')
  if (authenticator.isJwtPresent(req)) {
    try {
      var token = authenticator.validateToken(req.cookies.jwt)
      log.info('User <' + token.username + '> logged out')
    } catch (err) {
      log.error('Invalid JWT token')
    }
  } else {
    log.info('logout called, but user doesn\'t appear to be logged in')
  }

  log.info('logging the user out')
  res.clearCookie('user')
  res.clearCookie('jwt')
  res.clearCookie('X-CSRF-Token')
  res.clearCookie('nextUrl')
  res.redirect('/ui/')
}

router.post('/login', handleLogin)

router.get('/logout', handleLogout)

module.exports = router
