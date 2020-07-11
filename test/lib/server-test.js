'use strict'

const chai = require('chai')
const expect = chai.expect
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
chai.use(sinonChai)
const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
const proxyquire = require('proxyquire').noCallThru()

describe('server', () => {
  let onStub
  let onError
  let onListening
  let onClose
  let createServerStub
  let listenStub
  let readFileSyncStub
  let server
  let startPromise

  beforeEach(() => {
    onStub = sinon.stub()
    onStub.withArgs('error').callsFake((_, cb) => { onError = cb })
    onStub.withArgs('listening').callsFake((_, cb) => { onListening = cb })
    onStub.withArgs('close').callsFake((_, cb) => { onClose = cb })
    listenStub = sinon.stub()
    startPromise = new Promise((resolve, reject) => {
      listenStub.callsFake(resolve)
    })
    createServerStub = sinon.stub().returns({ on: onStub, listen: listenStub })
    readFileSyncStub = sinon.stub().returns('someKey')
    server = proxyquire('../../lib/server.js', {
      './app.js': { some: 'app' },
      https: { createServer: createServerStub },
      fs: { readFileSync: readFileSyncStub }
    })
  })

  describe('runApp', () => {
    beforeEach(() => {
      sinon.stub(server.internal, 'onError')
    })

    afterEach(() => {
      server.internal.onError.restore()
    })

    it('starts a https listener and attaches event handlers', async () => {
      server.runApp()
      await startPromise
      expect(readFileSyncStub.callCount).to.equal(2)
      expect(readFileSyncStub).to.be.calledWith('cert/key.pem')
      expect(readFileSyncStub).to.be.calledWith('cert/cert.pem')
      expect(createServerStub.callCount).to.equal(1)
      expect(createServerStub).to.be.calledWith({ key: 'someKey', cert: 'someKey' }, { some: 'app' })
      expect(onStub.callCount).to.equal(3)
      expect(onStub).to.be.calledWith('error')
      expect(typeof onError).to.equal('function')
      expect(onStub).to.be.calledWith('listening')
      expect(typeof onListening).to.equal('function')
      expect(onStub).to.be.calledWith('close')
      expect(typeof onClose).to.equal('function')
      onListening()
      onClose()
    })

    it('resolves if the app shuts down cleanly', async () => {
      const runAppPromise = server.runApp()
      await startPromise
      onListening()
      onClose()
      await runAppPromise
    })

    it('rejects if the app shuts down uncleanly', async () => {
      const runAppPromise = server.runApp()
      await startPromise
      onListening()
      server.internal.shutdownError = new Error('some error')
      onError()
      onClose()
      expect(server.internal.onError.callCount).to.equal(1)
      return expect(runAppPromise).to.be.rejectedWith(Error, 'some error')
    })
  })

  describe('onError', () => {
    let error
    beforeEach(() => {
      error = new Error('some basic error')
    })

    context('there is not a listener error', () => {
      it('stores the error as is', () => {
        server.internal.onError(error)
        expect(server.internal.shutdownError).to.equal(error)
      })
    })

    context('there is an EACCES error', () => {
      beforeEach(() => {
        error.syscall = 'listen'
        error.code = 'EACCES'
      })

      it('stores the error as is', () => {
        server.internal.onError(error)
        expect(server.internal.shutdownError).to.equal(error)
      })
    })

    context('there is an EADDRINUSE error', () => {
      beforeEach(() => {
        error.syscall = 'listen'
        error.code = 'EADDRINUSE'
      })

      it('stores the error as is', () => {
        server.internal.onError(error)
        expect(server.internal.shutdownError).to.equal(error)
      })
    })

    context('there is another kind of error', () => {
      beforeEach(() => {
        error.syscall = 'listen'
        error.code = 'FOO'
      })

      it('stores the error as is', () => {
        server.internal.onError(error)
        expect(server.internal.shutdownError).to.equal(error)
      })
    })
  })
})
