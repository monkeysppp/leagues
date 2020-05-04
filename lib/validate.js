'use strict'

const log = require('../lib/logging').getLogger('validate')
const jwt = require('jsonwebtoken')
let jwtSecret
let jwtIssuer

function setSecret (secret) {
  jwtSecret = secret
}

function setIssuer (issuer) {
  jwtIssuer = issuer
}

function signToken (tokenData) {
  tokenData.iss = jwtIssuer
  const dateNow = new Date()
  const timeNow = dateNow.getTime()
  const timeExp = timeNow + (86400000)
  tokenData.exp = timeExp

  return jwt.sign(tokenData, jwtSecret)
}

function validateToken (token) {
  const tokenObj = jwt.verify(token, jwtSecret)
  const dateNow = new Date()
  const timeNow = dateNow.getTime()
  if (timeNow > tokenObj.exp) {
    return false
  }

  return tokenObj
}

function isJwtPresent (req) {
  return (req.cookies && req.cookies.jwt)
}

function getUsername (req) {
  if (isJwtPresent(req)) {
    try {
      const token = validateToken(req.cookies.jwt, jwtSecret)
      return token.username
    } catch (err) {
      return null
    }
  } else {
    return null
  }
}

function excludeUserChecks (excludeDirs) {
  const dirs = excludeDirs

  function contains (arr, val) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === val) {
        return true
      }
    }

    return false
  }

  return function (req, res, next) {
    const url = req.originalUrl
    let msg

    if (contains(dirs, url)) {
      log.debug('Ignoring user validation checks for url ' + url)
      next()
      return
    }

    if (!isJwtPresent(req)) {
      msg = Error('Authentication Error')
      log.error('No JWT present')
      next(msg)
      return
    }

    try {
      if (!validateToken(req.cookies.jwt)) {
        msg = Error('Authentication Error')
        log.error('Expired token')
        next(msg)
        return
      }
    } catch (err) {
      msg = Error('Authentication Error')
      log.error(err)
      next(msg)
      return
    }

    log.debug('Request passes user validation checks')
    next()
  }
}

function excludeRequestChecks (excludeDirs) {
  const dirs = excludeDirs

  function contains (arr, val) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === val) {
        return true
      }
    }

    return false
  }

  return function (req, res, next) {
    const url = req.originalUrl
    let msg

    if (contains(dirs, url)) {
      log.debug('Ignoring csrf validation checks for url ' + url)
      next()
      return
    }

    if (!req.cookies['X-CSRF-Token']) {
      msg = Error('Authentication Error')
      log.error('Missing CSRF token cookie')
      next(msg)
      return
    }

    if (!req.headers['x-csrf-token']) {
      msg = Error('Authentication Error')
      log.error('Missing CSRF token header')
      next(msg)
      return
    }

    if (req.cookies['X-CSRF-Token'] !== req.headers['x-csrf-token']) {
      msg = Error('Authentication Error')
      log.error('CSRF token cookie and header do not match')
      next(msg)
      return
    }

    log.debug('Request passes csrf checks')
    next()
  }
}

function validationErrorRedirect (err, req, res, next) {
  log.warn('Redirecting to login page')
  res.cookie('nextUrl', req.originalUrl, { httpOnly: true, secure: true })
  res.redirect('/ui/login')
  next(err)
}

module.exports = {
  setSecret: setSecret,
  setIssuer: setIssuer,
  signToken: signToken,
  validateToken: validateToken,
  isJwtPresent: isJwtPresent,
  getUsername: getUsername,
  excludeUserChecks: excludeUserChecks,
  excludeRequestChecks: excludeRequestChecks,
  validationErrorRedirect: validationErrorRedirect
}
