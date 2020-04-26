'use strict'

const chai = require('chai')
const expect = chai.expect
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
chai.use(sinonChai)
const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)

// const userDb = require('../../lib/userDb.js');
// const mysql = require('mysql');

const command = require('../../lib/command.js')
const addUser = require('../../lib/addUser.js')

describe('leagues commands', () => {
  let args

  beforeEach(() => {
    args = [process.argv[0], process.argv[1]]
  })

  context('called with run', () => {
    beforeEach(() => {
      args.push('run')
    })

    context('call succeeds', () => {
      beforeEach(() => {
      })

      it('resolves', () => {
      })
    })

    context('call fails', () => {
      it('rejects', () => {
      })
    })
  })

  context('called with addUser', () => {
    beforeEach(() => {
      args.push('addUser')
      args.push('dbName')
      args.push('dbUser')
      args.push('username')

      sinon.stub(addUser, 'addUser')
    })

    afterEach(() => {
      addUser.addUser.restore()
    })

    context('call succeeds', () => {
      beforeEach(() => {
        addUser.addUser.resolves()
      })

      it('resolves', () => {
        return command.run(args)
          .then(() => {
            expect(addUser.addUser.callCount).to.equal(1)
            expect(addUser.addUser).to.be.calledWith('dbName', 'dbUser', 'username')
          })
      })
    })

    context('call fails', () => {
      beforeEach(() => {
        addUser.addUser.rejects(new Error('AddUser Failed'))
      })

      it('rejects', () => {
        return expect(command.run(args)).to.be.rejectedWith(Error, 'AddUser Failed')
          .then(() => {
            expect(addUser.addUser.callCount).to.equal(1)
            expect(addUser.addUser).to.be.calledWith('dbName', 'dbUser', 'username')
          })
      })
    })
  })
})
