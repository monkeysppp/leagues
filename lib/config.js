'use strict'

const nodeEnv = (process.env.NODE_ENV) ? process.env.NODE_ENV : 'production'
module.exports = require('../config/' + nodeEnv + '.json')
