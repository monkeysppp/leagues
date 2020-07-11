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
    port = process.env.HTTP_PORT || config.httpsPort || '3001'

    const httpsServer = https.createServer({
      key: fs.readFileSync('cert/key.pem'),
      cert: fs.readFileSync('cert/cert.pem')
    }, app)

    httpsServer.on('error', module.exports.internal.onError)
    httpsServer.on('listening', () => { log.info(`Listening on port ${port}`) })
    httpsServer.on('close', () => {
      if (module.exports.internal.shutdownError) {
        log.error('Shutting down server with error')
        return reject(module.exports.internal.shutdownError)
      }
      log.info('Shutting down server successfully')
      resolve()
    })
    httpsServer.listen(port)
  })
}

/**
 * Event listener for HTTP server "error" event.
 */
function onError (error) {
  if (error.syscall !== 'listen') {
    module.exports.internal.shutdownError = error
    return
  }

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      log.error(`Port ${port} requires elevated privileges`)
      module.exports.internal.shutdownError = error
      break
    case 'EADDRINUSE':
      log.error(`Port ${port} is already in use`)
      module.exports.internal.shutdownError = error
      break
    default:
      module.exports.internal.shutdownError = error
  }
}

module.exports = {
  runApp: runApp,
  internal: {
    onError: onError,
    shutdownError: shutdownError
  }
}
