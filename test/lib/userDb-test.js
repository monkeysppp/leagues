'use strict'

const chai = require('chai')
const expect = chai.expect
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
chai.use(sinonChai)
const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
const proxyquire = require('proxyquire')

const mysql = require('mysql')
const UserDb = require('../../lib/userDb.js')

describe('userDb', () => {
  const hostname = 'db.example.com'
  const database = 'userDb'
  const dbUser = 'dbUser'
  const dbPass = 'dbPassword'
  const username = 'username'
  const password = 'somePassword'
  const passwordHash = 'somehash'

  describe('constructor', () => {
    context('when no hostname is given', () => {
      it('throws', () => {
        expect(() => { const userDb = new UserDb(); userDb.saltHashAndStore() }).to.throw(Error, 'Database hostname not set')
      })
    })

    context('when no database name is given', () => {
      it('throws', () => {
        expect(() => { const userDb = new UserDb(hostname); userDb.saltHashAndStore() }).to.throw(Error, 'Database dbName not set')
      })
    })

    context('when no db username is given', () => {
      it('throws', () => {
        expect(() => { const userDb = new UserDb(hostname, database); userDb.saltHashAndStore() }).to.throw(Error, 'Database username not set')
      })
    })

    context('when no db password is given', () => {
      it('throws', () => {
        expect(() => { const userDb = new UserDb(hostname, database, dbUser); userDb.saltHashAndStore() }).to.throw(Error, 'Database password not set')
      })
    })

    it('stores the connection details', () => {
      const userDb = new UserDb(hostname, database, dbUser, dbPass)
      expect(userDb.dbHost).to.equal(hostname)
      expect(userDb.dbName).to.equal(database)
      expect(userDb.dbUser).to.equal(dbUser)
      expect(userDb.dbPass).to.equal(dbPass)
    })
  })

  describe('_storePassword', () => {
    let connectionObject

    beforeEach(() => {
      connectionObject = {
        destroy: sinon.stub(),
        query: sinon.stub().yields()
      }
      sinon.stub(mysql, 'createConnection').returns(connectionObject)
    })

    afterEach(() => {
      mysql.createConnection.restore()
    })

    context('creating a connection fails', () => {
      beforeEach(() => {
        mysql.createConnection.throws(new Error('createConnection Bang!'))
      })

      it('rejects', async () => {
        const userDb = new UserDb(hostname, database, dbUser, dbPass)
        await expect(userDb._storePassword(username, passwordHash)).to.be.rejectedWith(Error, 'createConnection Bang!')
        expect(mysql.createConnection).to.be.calledWith({
          host: hostname,
          database: database,
          user: dbUser,
          password: dbPass
        })
        expect(connectionObject.query.callCount).to.be.equal(0)
        expect(connectionObject.destroy.callCount).to.equal(0)
      })
    })

    context('original table creation fails', () => {
      beforeEach(() => {
        connectionObject.query.yields(new Error('createTable Bang!'))
      })

      it('rejects', async () => {
        const userDb = new UserDb(hostname, database, dbUser, dbPass)
        await expect(userDb._storePassword(username, passwordHash)).to.be.rejectedWith(Error, 'createTable Bang!')
        expect(mysql.createConnection).to.be.calledWith({
          host: hostname,
          database: database,
          user: dbUser,
          password: dbPass
        })
        expect(connectionObject.query).to.be.calledWith('CREATE TABLE IF NOT EXISTS `users` ' +
          '(`username` varchar(100) NOT NULL UNIQUE, `identity` varchar(280) NOT NULL)')
        expect(connectionObject.destroy.callCount).to.equal(1)
      })
    })

    context('inserting entry into table fails', () => {
      beforeEach(() => {
        connectionObject.query.onCall(1).yields(new Error('insert Bang!'))
      })

      it('rejects', async () => {
        const userDb = new UserDb(hostname, database, dbUser, dbPass)
        await expect(userDb._storePassword(username, passwordHash)).to.be.rejectedWith(Error, 'insert Bang!')
        expect(mysql.createConnection).to.be.calledWith({
          host: hostname,
          database: database,
          user: dbUser,
          password: dbPass
        })
        expect(connectionObject.query).to.be.calledWith('CREATE TABLE IF NOT EXISTS `users` ' +
          '(`username` varchar(100) NOT NULL UNIQUE, `identity` varchar(280) NOT NULL)')
        expect(connectionObject.query).to.be.calledWith('INSERT INTO users SET ?', { username: username, identity: passwordHash })
        expect(connectionObject.destroy.callCount).to.equal(1)
      })
    })

    context('the user is inserted successfully', () => {
      it('resolves', async () => {
        const userDb = new UserDb(hostname, database, dbUser, dbPass)
        await userDb._storePassword(username, passwordHash)
        expect(mysql.createConnection).to.be.calledWith({
          host: hostname,
          database: database,
          user: dbUser,
          password: dbPass
        })
        expect(connectionObject.query).to.be.calledWith('CREATE TABLE IF NOT EXISTS `users` ' +
          '(`username` varchar(100) NOT NULL UNIQUE, `identity` varchar(280) NOT NULL)')
        expect(connectionObject.query).to.be.calledWith('INSERT INTO users SET ?', { username: username, identity: passwordHash })
        expect(connectionObject.destroy.callCount).to.equal(1)
      })
    })
  })

  describe('deleteUser', () => {
    let connectionObject

    beforeEach(() => {
      delete process.env.NODE_SKIP_PASSWORD_CHECK
      connectionObject = {
        destroy: sinon.stub(),
        query: sinon.stub().yields()
      }
      sinon.stub(mysql, 'createConnection').returns(connectionObject)
    })

    afterEach(() => {
      mysql.createConnection.restore()
    })

    context('creating a connection fails', () => {
      beforeEach(() => {
        mysql.createConnection.throws(new Error('createConnection Bang!'))
      })

      it('rejects', async () => {
        const userDb = new UserDb(hostname, database, dbUser, dbPass)
        await expect(userDb.deleteUser(username)).to.be.rejectedWith(Error, 'createConnection Bang!')
        expect(mysql.createConnection).to.be.calledWith({
          host: hostname,
          database: database,
          user: dbUser,
          password: dbPass
        })
      })
    })

    context('deleting entry from table fails', () => {
      beforeEach(() => {
        connectionObject.query.yields(new Error('delete Bang!'))
      })

      it('rejects', async () => {
        const userDb = new UserDb(hostname, database, dbUser, dbPass)
        await expect(userDb.deleteUser(username)).to.be.rejectedWith(Error, 'delete Bang!')
        expect(mysql.createConnection).to.be.calledWith({
          host: hostname,
          database: database,
          user: dbUser,
          password: dbPass
        })
        expect(connectionObject.query).to.be.calledWith('DELETE FROM `users` WHERE `username` = ?', [username])
        expect(connectionObject.destroy.callCount).to.equal(1)
      })
    })

    context('the user is deleted successfully', () => {
      it('resolves', async () => {
        const userDb = new UserDb(hostname, database, dbUser, dbPass)
        await userDb.deleteUser(username)
        expect(mysql.createConnection).to.be.calledWith({
          host: hostname,
          database: database,
          user: dbUser,
          password: dbPass
        })
        expect(connectionObject.query).to.be.calledWith('DELETE FROM `users` WHERE `username` = ?', [username])
        expect(connectionObject.destroy.callCount).to.equal(1)
      })
    })
  })

  describe('saltHashAndStore', () => {
    let userDb
    let hashStub

    beforeEach(() => {
      hashStub = sinon.stub().yields(undefined, passwordHash)
      const ProxyUserDb = proxyquire('../../lib/userDb.js', {
        'password-hash-and-salt': () => {
          return {
            hash: hashStub
          }
        }
      })
      userDb = new ProxyUserDb(hostname, database, dbUser, dbPass)
      userDb._storePassword = sinon.stub().resolves()
    })

    context('when hashing fails', () => {
      beforeEach(() => {
        hashStub.yields(new Error('hash Bang!'))
      })

      it('rejects', async () => {
        await expect(userDb.saltHashAndStore(username, password)).to.be.rejectedWith(Error, 'hash Bang!')
        expect(userDb._storePassword.callCount).to.equal(0)
      })
    })

    context('when storing the user credentials fails', () => {
      beforeEach(() => {
        userDb._storePassword.rejects(new Error('store Bang!'))
      })

      it('rejects', async () => {
        await expect(userDb.saltHashAndStore(username, password)).to.be.rejectedWith(Error, 'store Bang!')
        expect(userDb._storePassword).to.be.calledWith(username, passwordHash)
      })
    })

    it('resolves', async () => {
      await userDb.saltHashAndStore(username, password)
        .then(() => {
          expect(userDb._storePassword).to.be.calledWith(username, passwordHash)
        })
    })
  })

  describe('checkPassword', () => {
    let userDb
    let verifyAgainstStub
    let connectionObject

    beforeEach(() => {
      delete process.env.NODE_SKIP_PASSWORD_CHECK
      verifyAgainstStub = sinon.stub().yields(undefined, true)
      const ProxyUserDb = proxyquire('../../lib/userDb.js', {
        'password-hash-and-salt': () => {
          return {
            verifyAgainst: verifyAgainstStub
          }
        }
      })
      userDb = new ProxyUserDb(hostname, database, dbUser, dbPass)
      userDb._storePassword = sinon.stub().resolves()
      connectionObject = {
        destroy: sinon.stub(),
        query: sinon.stub().yields(undefined, [{ username: username, identity: 'someIdentity' }])
      }
      sinon.stub(mysql, 'createConnection').returns(connectionObject)
    })

    afterEach(() => {
      mysql.createConnection.restore()
    })

    context('when checking is disabled (for local development)', () => {
      it('resolves to a testUser', async () => {
        process.env.NODE_SKIP_PASSWORD_CHECK = '1'
        const user = await userDb.checkPassword(username, password)
        expect(user).to.deep.equal({ username: 'testUser' })
        expect(mysql.createConnection.callCount).to.equal(0)
        expect(connectionObject.query.callCount).to.equal(0)
        expect(connectionObject.destroy.callCount).to.equal(0)
      })
    })

    context('creating a connection fails', () => {
      beforeEach(() => {
        mysql.createConnection.throws(new Error('createConnection Bang!'))
      })

      it('rejects', async () => {
        await expect(userDb.checkPassword(username, password)).to.be.rejectedWith(Error, 'createConnection Bang!')
        expect(mysql.createConnection).to.be.calledWith({
          host: hostname,
          database: database,
          user: dbUser,
          password: dbPass
        })
      })
    })

    context('querying a user fails', () => {
      beforeEach(() => {
        connectionObject.query.yields(new Error('lookup Bang!'))
      })

      it('rejects', async () => {
        await expect(userDb.checkPassword(username, password)).to.be.rejectedWith(Error, 'lookup Bang!')
        expect(mysql.createConnection).to.be.calledWith({
          host: hostname,
          database: database,
          user: dbUser,
          password: dbPass
        })
        expect(connectionObject.query).to.be.calledWith('SELECT * FROM `users` WHERE `username` = ?', [username])
        expect(connectionObject.destroy.callCount).to.equal(1)
      })
    })

    context('a user cannot be found', () => {
      beforeEach(() => {
        connectionObject.query.yields(undefined, [])
      })

      it('resolves to undefined', async () => {
        const user = await userDb.checkPassword(username, password)
        expect(mysql.createConnection).to.be.calledWith({
          host: hostname,
          database: database,
          user: dbUser,
          password: dbPass
        })
        expect(connectionObject.query).to.be.calledWith('SELECT * FROM `users` WHERE `username` = ?', [username])
        expect(connectionObject.destroy.callCount).to.equal(1)
        expect(user).to.equal(undefined)
      })
    })

    context('verifying a user errors', () => {
      beforeEach(() => {
        verifyAgainstStub.yields(new Error('verify Bang!'))
      })

      it('rejects', async () => {
        await expect(userDb.checkPassword(username, password)).to.be.rejectedWith(Error, 'verify Bang!')
        expect(mysql.createConnection).to.be.calledWith({
          host: hostname,
          database: database,
          user: dbUser,
          password: dbPass
        })
        expect(connectionObject.query).to.be.calledWith('SELECT * FROM `users` WHERE `username` = ?', [username])
        expect(connectionObject.destroy.callCount).to.equal(1)
        expect(verifyAgainstStub).to.be.calledWith('someIdentity')
      })
    })

    context('user verification fails', () => {
      beforeEach(() => {
        verifyAgainstStub.yields(undefined, false)
      })

      it('rejects', async () => {
        await expect(userDb.checkPassword(username, password)).to.be.rejectedWith(Error, 'Password failed to validate')
        expect(mysql.createConnection).to.be.calledWith({
          host: hostname,
          database: database,
          user: dbUser,
          password: dbPass
        })
        expect(connectionObject.query).to.be.calledWith('SELECT * FROM `users` WHERE `username` = ?', [username])
        expect(connectionObject.destroy.callCount).to.equal(1)
        expect(verifyAgainstStub).to.be.calledWith('someIdentity')
      })
    })

    it('resolves', async () => {
      const user = await userDb.checkPassword(username, password)
      expect(mysql.createConnection).to.be.calledWith({
        host: hostname,
        database: database,
        user: dbUser,
        password: dbPass
      })
      expect(connectionObject.query).to.be.calledWith('SELECT * FROM `users` WHERE `username` = ?', [username])
      expect(connectionObject.destroy.callCount).to.equal(1)
      expect(verifyAgainstStub).to.be.calledWith('someIdentity')
      expect(user).to.deep.equal({ username: username })
    })
  })
})
