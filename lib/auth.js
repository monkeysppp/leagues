'use strict'

const express = require('express')
const log = require('../lib/logging').getLogger('auth')
const router = express.Router()
const passport = require('passport')
// const config = require('../lib/config')
const validator = require('../lib/validate')
const uuid = require('uuid4')

/* GET home page. */
// router.get('/', function (req, res) {
//   res.render('index', { title: config.title, username: validator.getUsername(req) })
// })

// router.get('/login', function (req, res) {
//   res.render('login', { title: config.title })
// })

// Authenticate using the 'local' strategy
router.post('/login', function (req, res, next) {
  passport.authenticate('local', function (err, user) {
    if (err) {
      return next(err)
    }

    if (!user) {
      return res.json(401, { error: 'message' })
    }

    // User has authenticated correctly. Create a JWT token
    log.debug('User <' + user.username + '> authenticated okay')
    const token = validator.signToken({ username: user.username })
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
})

router.get('/logout', function (req, res) {
  if (validator.isJwtPresent(req)) {
    try {
      var token = validator.validateToken(req.cookies.jwt)
      log.info('User <' + token.username + '> logged out')
    } catch (err) {
      log.error('Invalid JWT token')
    }
  } else {
    log.info('logout called, but user doesn\'t appear to be logged in')
  }

  log.info('loggin the user out')
  res.clearCookie('user')
  res.clearCookie('jwt')
  res.clearCookie('X-CSRF-Token')
  res.clearCookie('nextUrl')
  res.redirect('/ui/')
})

module.exports = router
