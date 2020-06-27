/** @module lib/server */

'use strict'

const https = require('https')
const fs = require('fs')
const app = require('./app.js')
const log = require('./logging').getLogger('server')
const config = require('./config')

let port
let shutdownError

/**
 * runApp - description
 *
 * @return {Promise} A Promise to have run the application
 */
function runApp () {
  return new Promise((resolve, reject) => {
    port = normalizePort(process.env.HTTP_PORT || config.httpsPort || '3001')

    const httpsServer = https.createServer({
      key: fs.readFileSync('cert/key.pem'),
      cert: fs.readFileSync('cert/cert.pem')
    }, app)

    httpsServer.on('error', onError)
    httpsServer.on('listening', onListening)
    httpsServer.on('close', () => {
      if (shutdownError) {
        log.error('Shutting down server with error')
        return reject(shutdownError)
      }
      log.info('Shutting down server successfully')
      resolve()
    })
    httpsServer.listen(port)
  })
}

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort (val) {
  const port = parseInt(val, 10)

  if (isNaN(port)) {
    return val // named pipe
  } else if (port >= 0) {
    return port // port number
  }
  return false
}

/**
 * Event listener for HTTP server "error" event.
 */
function onError (error) {
  if (error.syscall !== 'listen') {
    shutdownError = error
    return
  }

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      log.error(`Port ${port} requires elevated privileges`)
      shutdownError = error
      break
    case 'EADDRINUSE':
      log.error(`Port ${port} is already in use`)
      shutdownError = error
      break
    default:
      shutdownError = error
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening () {
  log.info(`Listening on port ${port}`)
}

module.exports = {
  runApp: runApp,
  internal: {
    normalizePort: normalizePort,
    onError: onError,
    onListening: onListening
  }
}
