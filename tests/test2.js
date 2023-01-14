const assert = require('assert');
const request = require('supertest');
const server = require('../build/server.js');
const { User } = require('../build/user.js');


const parseUserJSON = (text) => {
    const json = JSON.parse(text)
    const createdUser = new User(
        json.name,
        json.age,
        json.hobbies
    )
    createdUser.id = json.id
    return createdUser
}

const parseUser = (user) => {
    const createdUser = new User(
        user.name,
        user.age,
        user.hobbies
    )
    createdUser.id = user.id
    return createdUser
}

const arraysEqual = (a, b) => {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;

  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

describe('second case:', function () {

    const testServer = new server.UserServer(5552)
    const testUser1 = new User("Fernando", 22, ['reading', 'walking'])
    const testUser2 = new User("Fernando2", 222, ['reading2', 'walking2'])
    const newName1 = 'new Fernando'
    const newName2 = 'Benito'

    let createdUser1
    let createdUser2

    this.beforeAll(function () {
        testServer.run()
    })

    this.afterAll(function () {
        testServer.stop()
    })

    it('server data is empty', function (done) {
        request('http://localhost:5552')
            .get('/api/users')
            .expect('Content-Length', '2')
            .expect(200)
            .end(function (err, res) {
                if (err) throw err;
                assert(res.body, '{}')
                done()
            })
    })

    it('POST new user: success', function (done) {
        request('http://localhost:5552')
            .post('/api/users')
            .send(JSON.stringify(testUser1))
            .expect(201)
            .end(function (err, res) {
                if (err) throw err;

                createdUser1 = parseUserJSON(res.text)

                assert(createdUser1.name == testUser1.name)
                assert(createdUser1.age == testUser1.age)
                assert(arraysEqual(createdUser1.hobbies, testUser1.hobbies))
                assert(createdUser1.id)

                done()
            })
    })


    it('POST new user: success', function (done) {
        request('http://localhost:5552')
            .post('/api/users')
            .send(JSON.stringify(testUser2))
            .expect(201)
            .end(function (err, res) {
                if (err) throw err;

                createdUser2 = parseUserJSON(res.text)

                assert(createdUser2.name == testUser2.name)
                assert(createdUser2.age == testUser2.age)
                assert(arraysEqual(createdUser2.hobbies, testUser2.hobbies))
                assert(createdUser2.id)

                done()
            })
    })

    it('server data contains new users', function (done) {
        request('http://localhost:5552')
            .get('/api/users')
            .expect(200)
            .end(function (err, res) {
                if (err) throw err;
                
                const answer = JSON.parse(res.text)
                const user1 = parseUser(answer[0])
                const user2 = parseUser(answer[1])

                assert(user1.id == createdUser1.id)
                assert(user2.id == createdUser2.id)

                done()
            })
    })

    it('PUT update existing users', function (done) {
        request('http://localhost:5552')
            .put('/api/users/' + createdUser1.id)
            .send('{"name": "' + newName1 + '"}')
            .expect(200)
            .end(function (err, res) {
                if (err) throw err;
                const changedUser1 = parseUserJSON(res.text)

                assert(changedUser1.name == newName1)
                createdUser1.name = newName1

                done()
            })
    })

    it('PUT update existing users', function (done) {
        request('http://localhost:5552')
            .put('/api/users/' + createdUser2.id)
            .send('{"name": "' + newName2 + '"}')
            .expect(200)
            .end(function (err, res) {
                if (err) throw err;
                const changedUser2 = parseUserJSON(res.text)

                assert(changedUser2.name == newName2)
                createdUser2.name = newName2

                done()
            })
    })

    it('server data contains updated users', function (done) {
        request('http://localhost:5552')
            .get('/api/users')
            .expect(200)
            .end(function (err, res) {
                if (err) throw err;
                
                const answer = JSON.parse(res.text)
                const user1 = parseUser(answer[0])
                const user2 = parseUser(answer[1])

                assert(user1.id == createdUser1.id)
                assert(user2.id == createdUser2.id)

                done()
            })
    })
})