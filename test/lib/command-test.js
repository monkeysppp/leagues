'use strict'

const chai = require('chai')
const expect = chai.expect
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
chai.use(sinonChai)
const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)

const command = require('../../lib/command.js')
const users = require('../../lib/users.js')
const server = require('../../lib/server.js')

describe('leagues commands', () => {
  let args

  beforeEach(() => {
    args = [process.argv[0], process.argv[1]]
  })

  context('called with run', () => {
    beforeEach(() => {
      args.push('run')
      sinon.stub(server, 'runApp')
    })

    afterEach(() => {
      server.runApp.restore()
    })

    context('call succeeds', () => {
      beforeEach(() => {
        server.runApp.resolves()
      })

      it('resolves', () => {
        return command.run(args)
          .then(() => {
            expect(server.runApp.callCount).to.equal(1)
          })
      })
    })

    context('call fails', () => {
      beforeEach(() => {
        server.runApp.rejects(new Error('RunApp Failed'))
      })

      it('rejects', () => {
        return expect(command.run(args)).to.be.rejectedWith(Error, 'RunApp Failed')
          .then(() => {
            expect(server.runApp.callCount).to.equal(1)
          })
      })
    })
  })

  context('called with addUser', () => {
    beforeEach(() => {
      args.push('addUser')
      args.push('username')
      sinon.stub(users, 'addUser')
    })

    afterEach(() => {
      users.addUser.restore()
    })

    context('call succeeds', () => {
      beforeEach(() => {
        users.addUser.resolves()
      })

      it('resolves', () => {
        return command.run(args)
          .then(() => {
            expect(users.addUser.callCount).to.equal(1)
            expect(users.addUser).to.be.calledWith('username')
          })
      })
    })

    context('call fails', () => {
      beforeEach(() => {
        users.addUser.rejects(new Error('AddUser Failed'))
      })

      it('rejects', () => {
        return expect(command.run(args)).to.be.rejectedWith(Error, 'AddUser Failed')
          .then(() => {
            expect(users.addUser.callCount).to.equal(1)
            expect(users.addUser).to.be.calledWith('username')
          })
      })
    })
  })

  context('called with deleteUser', () => {
    beforeEach(() => {
      args.push('deleteUser')
      args.push('username')
      sinon.stub(users, 'deleteUser')
    })

    afterEach(() => {
      users.deleteUser.restore()
    })

    context('call succeeds', () => {
      beforeEach(() => {
        users.deleteUser.resolves()
      })

      it('resolves', () => {
        return command.run(args)
          .then(() => {
            expect(users.deleteUser.callCount).to.equal(1)
            expect(users.deleteUser).to.be.calledWith('username')
          })
      })
    })

    context('call fails', () => {
      beforeEach(() => {
        users.deleteUser.rejects(new Error('DeleteUser Failed'))
      })

      it('rejects', () => {
        return expect(command.run(args)).to.be.rejectedWith(Error, 'DeleteUser Failed')
          .then(() => {
            expect(users.deleteUser.callCount).to.equal(1)
            expect(users.deleteUser).to.be.calledWith('username')
          })
      })
    })
  })
})
