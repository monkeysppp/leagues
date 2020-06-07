'use strict'

const chai = require('chai')
const expect = chai.expect
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
chai.use(sinonChai)
const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
const proxyquire = require('proxyquire')

const inquirer = require('inquirer')

describe('users', () => {
  let users
  let userDbStub
  let saltHasAndStoreStub
  let deleteUserStub
  const username = 'luser'
  const password = 'passrods'

  beforeEach(() => {
    userDbStub = sinon.stub().callsFake(() => {
      return {
        saltHashAndStore: saltHasAndStoreStub,
        deleteUser: deleteUserStub
      }
    })
    saltHasAndStoreStub = sinon.stub().resolves()
    deleteUserStub = sinon.stub().resolves()
    users = proxyquire('../../lib/users.js', {
      './userDb.js': userDbStub
    })
    sinon.stub(inquirer, 'prompt').resolves({ password: password })
  })

  afterEach(() => {
    inquirer.prompt.restore()
  })

  describe('validatePassword', () => {
    context('when password is too short', () => {
      it('returns a string', () => {
        expect(users.internal.validatePassword('tooshrt')).to.equal('Password must be at least 8 characters long')
      })
    })

    it('returns true', () => {
      expect(users.internal.validatePassword('this-is-a-long-enough-password')).to.equal(true)
    })
  })

  describe('addUser', () => {
    context('when creating a UserDb instance fails', () => {
      beforeEach(() => {
        userDbStub.throws(new Error('constructor Bang!'))
      })

      it('rejects', async () => {
        await expect(users.addUser(username)).to.be.rejectedWith('constructor Bang!')
        expect(inquirer.prompt.callCount).to.equal(0)
        expect(saltHasAndStoreStub.callCount).to.equal(0)
      })
    })

    context('when asking for a password fails', () => {
      beforeEach(() => {
        inquirer.prompt.rejects(new Error('inquirer Bang!'))
      })

      it('rejects', async () => {
        await expect(users.addUser(username)).to.be.rejectedWith('inquirer Bang!')
        expect(inquirer.prompt.callCount).to.equal(1)
        expect(saltHasAndStoreStub.callCount).to.equal(0)
      })
    })

    context('when storing the password fails', () => {
      beforeEach(() => {
        saltHasAndStoreStub.rejects(new Error('salt-n-Bang!'))
      })

      it('rejects', async () => {
        await expect(users.addUser(username)).to.be.rejectedWith('salt-n-Bang!')
        expect(inquirer.prompt.callCount).to.equal(1)
        expect(saltHasAndStoreStub.callCount).to.equal(1)
        expect(saltHasAndStoreStub).to.be.calledWith(username, password)
      })
    })

    it('stores the username and password in the user database', async () => {
      await users.addUser(username)
      expect(inquirer.prompt.callCount).to.equal(1)
      expect(saltHasAndStoreStub.callCount).to.equal(1)
      expect(saltHasAndStoreStub).to.be.calledWith(username, password)
    })
  })

  describe('deleteUser', () => {
    context('when creating a UserDb instance fails', () => {
      beforeEach(() => {
        userDbStub.throws(new Error('constructor Bang!'))
      })

      it('rejects', async () => {
        await expect(users.deleteUser(username)).to.be.rejectedWith('constructor Bang!')
        expect(deleteUserStub.callCount).to.equal(0)
      })
    })

    context('when deleting the user fails', () => {
      beforeEach(() => {
        deleteUserStub.rejects(new Error('deleteUser Bang!'))
      })

      it('rejects', async () => {
        await expect(users.deleteUser(username)).to.be.rejectedWith('deleteUser Bang!')
        expect(deleteUserStub.callCount).to.equal(1)
        expect(deleteUserStub).to.be.calledWith(username)
      })
    })

    it('delete the username from the user database', async () => {
      await users.deleteUser(username)
      expect(deleteUserStub.callCount).to.equal(1)
      expect(deleteUserStub).to.be.calledWith(username)
    })
  })
})
