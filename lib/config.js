'use strict'

const nodeEnv = (process.env.NODE_ENV) ? process.env.NODE_ENV : 'production'
console.log(`Loading config using mode ${nodeEnv}`)
module.exports = require('../config/' + nodeEnv + '.json')
