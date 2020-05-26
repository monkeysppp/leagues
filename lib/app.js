'use strict'

const bodyParser = require('body-parser')
const config = require('./config.js')
const cookieParser = require('cookie-parser')
const express = require('express')
const helmet = require('helmet')
const nocache = require('nocache')
const LocalStrategy = require('passport-local').Strategy
const log = require('./logging').getLogger('app')
const passport = require('passport')
const path = require('path')
const authRoutes = require('./auth.js')
const userDb = require('./userDb.js')
const reminderEmails = require('./reminderEmails.js')

const apiv1Routes = require('../api/v1/routes.js')
const validator = require('./validate')

const dbName = process.env.DATABASE_NAME || config.dbName
const dbUser = process.env.DATABASE_USER || config.dbUser
const dbPass = process.env.DATABASE_PASS || config.dbPass
userDb.setDBParameters(dbName, dbUser, dbPass)

let jwtSecret = config.jwtSecret
if (!jwtSecret) {
  log.error('Using an insecure secret for JWT.  You will want to change this!')
  jwtSecret = 'changeThisSecret'
}

validator.setSecret(jwtSecret)

let jwtIssuer = config.jwtIssuer
if (!jwtIssuer) {
  log.error('Using JWT without defining an issuer.  You will want to change this!')
  jwtIssuer = 'changeThisIssuer'
}

validator.setIssuer(jwtIssuer)

var app = express()

app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-inline'"],
    styleSrc: ["'self'", "'unsafe-inline'"]
  }
}))
app.use(helmet.xssFilter())
app.use(helmet.frameguard())
app.use(helmet.hsts({ maxAge: 7776000000 }))
app.use(helmet.hidePoweredBy())
app.use(helmet.ieNoOpen())
app.use(helmet.noSniff())
app.use(helmet.dnsPrefetchControl())
app.use(nocache())

app.use((req, res, next) => {
  log.info('Call to ' + req.method + ' ' + req.originalUrl)

  if (req.headers) {
    log.debug('Headers: ' + JSON.stringify(req.headers))
  }

  next()
})

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
// app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())

app.get('/', (req, res) => {
  log.info('redirecting to /ui')
  res.redirect('/ui/')
})

app.use(passport.initialize())
passport.use('local', new LocalStrategy(
  (username, password, done) => {
    // Here, the done() function is the callback function we passed to passport.authenticate
    log.debug('About to check for user <' + username + '> in the userDb')
    userDb.checkPassword(username, password, (err, user) => {
      if (err) {
        log.error(err)
        return done(err)
      }

      if (!user) {
        log.error('No such user <' + username + '>')
        return done(null, false, 'Incorrect username.')
      }

      log.info('User <' + username + '> validated')
      return done(null, user)
    })
  }
))

app.use('/ui', express.static(path.join(__dirname, '..', 'build')))
app.use('/ui', express.static(path.join(__dirname, '..', 'public')))

app.use('/api/v1', apiv1Routes) // TODO - move this after authentication
app.use('/auth', authRoutes)
app.use(validator.excludeUserChecks([
  '/ui/',
  '/ui/login',
  '/ui/logout',
  '/auth/login',
  '/auth/logout'
]))
app.use(validator.excludeRequestChecks([
  '/ui/',
  '/ui/login',
  '/ui/logout',
  '/login',
  '/logout'
]))

app.use(validator.validationErrorRedirect)

reminderEmails.initialise()

// Catch a shutdown and run cleanup
process.on('exit', cleanup.bind(null, true))
process.on('SIGINT', cleanup.bind(null, false))
process.on('uncaughtException', function (err) {
  log.fatal(err)
  cleanup.bind(null, false)
})

function cleanup (clean) {
  if (clean) {
    process.exit(0)
  }

  process.exit(1)
}

module.exports = app
