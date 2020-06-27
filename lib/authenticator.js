'use strict'

const log = require('../lib/logging').getLogger('validate')
const jwt = require('jsonwebtoken')

/**
 * Authenticate user JWTs and create new JWTs
 */
class Authenticator {
  /**
   * constructor - Create an Authenticator, which can create user JWTs when they log in
   * and validate those JWTs.
   *
   * @param  {string} jwtIssuer The "issuer" field for the JWT; usually the domain name of the site
   * @param  {string} jwtSecret The secret for signing the JWT with (using HMAC algorithm)
   */
  constructor (jwtIssuer, jwtSecret) {
    if (!jwtIssuer) {
      throw new Error('jwtIssuer not set')
    }
    if (!jwtSecret) {
      throw new Error('jwtSecret not set')
    }

    this.jwtIssuer = jwtIssuer
    this.jwtSecret = jwtSecret
  }

  /**
  * isJwtPresent - Checks whether a JWT is present in the req object
  *
  * @param  {object} req A http req object
  * @return {boolean} Whether a JWT is present or not
  */
  isJwtPresent (req) {
    console.log('checkJwt')
    if (req.cookies && req.cookies.jwt) {
      console.log('checkJwt true')
      return true
    }
    console.log('checkJwt false')
    return false
  }

  /**
  * signToken - Takes in the payload body for the JWT and creates a full signed JWT.
  *
  * @param  {object} tokenData The payload for the JWT
  * @throws Exception thrown when signing the JWT fails
  * @return {string} The signed JWT
  */
  signToken (tokenData) {
    tokenData.iss = this.jwtIssuer
    const dateNow = new Date()
    tokenData.exp = dateNow.getTime() + 86400000
    return jwt.sign(tokenData, this.jwtSecret)
  }

  /**
  * validateToken - Takes in a JWT and validates the signature.  If the token is valid
  * then the original payload is returned, otherwise an error is thrown.
  *
  * @param  {string} token The JWT to validate
  * @throws Expection thrown when the JWT is invalid
  * @return {object} The original payload in the JWT
  */
  validateToken (token) {
    const tokenObj = jwt.verify(token, this.jwtSecret)
    const dateNow = new Date()
    const timeNow = dateNow.getTime()
    if (timeNow > tokenObj.exp) {
      throw new Error('Token has expired')
    }

    return tokenObj
  }

  /**
  * validateCall - A middleware function that checks the incoming req for a valid
  * JWT and the double-submit CSRF tokens.  If the call is valid then next() is called;
  * if the call is invalid then next is called with an error object.
  *
  * @param  {object} req  A HTTP req object
  * @param  {object} res  A HTTP res object
  * @param  {function} next The next function in the Express call stack
  * @throws Exception when the call is invalid
  */
  validateCall (req, res, next) {
    const failCall = message => {
      const err = new Error(`Authentication Error: ${message}`)
      log.error(err.message)
      next(err)
    }

    if (!this.isJwtPresent(req)) {
      return failCall('No JWT present')
    }

    try {
      this.validateToken(req.cookies.jwt)
    } catch (err) {
      return failCall(`Invalid token: ${err.message}`)
    }

    if (!req.cookies['X-CSRF-Token']) {
      return failCall('Missing CSRF token cookie')
    }

    if (!req.headers['x-csrf-token']) {
      return failCall('Missing CSRF token header')
    }

    if (req.cookies['X-CSRF-Token'] !== req.headers['x-csrf-token']) {
      return failCall('CSRF token cookie and header do not match')
    }

    log.info('Request passed validation checks')
    next()
  }

  /**
  * handleValidationError - An error handling middleware function.  If the original
  * call was for a /ui/* endpoint, the call is redirected to /ui/login and the "nextUrl"
  * cookie is set to the original URL.  For all other calls, a 401 error is returned.
  *
  * @param  {object} err  The error function
  * @param  {object} req  A HTTP req object
  * @param  {object} res  A HTTP res object
  * @param  {function} next The next function in the Express call stack
  */
  handleValidationError (err, req, res, next) {
    if (req.originalUrl.match(/^\/ui\/./)) {
      log.warn(`Call to UI endpoint ${req.originalUrl}. Redirecting to login page: ${err.message}`)
      res.cookie('nextUrl', req.originalUrl, { httpOnly: true, secure: true })
      res.redirect('/ui/login')
    } else {
      log.error(`Unauthorized call to ${req.originalUrl}: ${err.message}`)
      res.sendStatus(401)
    }
  }
}

module.exports = Authenticator
