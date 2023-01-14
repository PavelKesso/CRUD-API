const assert = require('assert');
const request = require('supertest');
const server = require('../build/server.js');
const { User } = require('../build/user.js');
const { parseUser, parseUserJSON, arraysEqual } = require('./utils.js');

describe('third case:', function () {

    const testServer = new server.UserServer(5553)
    const testUser1 = new User("Fernando", 22, ['reading', 'walking'])
    const testUser2 = new User("Fernando2", 33, ['reading2', 'walking2'])
    const testUser3 = new User("Fernando3", 44, ['reading2', 'walking2'])
    

    let createdUser1
    let createdUser2
    let createdUser3

    this.beforeAll(function () {
        testServer.run()
    })

    this.afterAll(function () {
        testServer.stop()
    })

    it('server data is empty', function(done) {
        request('http://localhost:5553')
            .get('/api/users')
            .expect('Content-Length', '2')
            .expect(200)
            .end(function (err, res) {
                if (err) throw err;
                assert(res.body, '{}')
                done()
            })
    })

    it('POST new user: success', function(done) {
        request('http://localhost:5553')
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

    it('POST new user: success', function(done) {
        request('http://localhost:5553')
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

    it('POST new user: success', function(done) {
        request('http://localhost:5553')
            .post('/api/users')
            .send(JSON.stringify(testUser3))
            .expect(201)
            .end(function (err, res) {
                if (err) throw err;

                createdUser3 = parseUserJSON(res.text)

                assert(createdUser3.name == testUser3.name)
                assert(createdUser3.age == testUser3.age)
                assert(arraysEqual(createdUser3.hobbies, testUser3.hobbies))
                assert(createdUser3.id)

                done()
            })
    })

    it('GET contains new users', function(done) {
        request('http://localhost:5553')
            .get('/api/users')
            .expect(200)
            .end(function (err, res) {
                if (err) throw err;
                
                const answer = JSON.parse(res.text)
                const user1 = parseUser(answer[0])
                const user2 = parseUser(answer[1])
                const user3 = parseUser(answer[2])

                assert(user1.id == createdUser1.id)
                assert(user2.id == createdUser2.id)
                assert(user3.id == createdUser3.id)

                done()
            })
    })

    it('DELETE user: success', function(done) {
        request('http://localhost:5553')
            .delete('/api/users/' + createdUser1.id)
            .expect(200)
            .end(function (err, res) {
                if (err) throw err;
                done()
            })
    })

    it('DELETE user: success', function(done) {
        request('http://localhost:5553')
            .delete('/api/users/' + createdUser2.id)
            .expect(200)
            .end(function (err, res) {
                if (err) throw err;
                done()
            })
    })

    it('DELETE user: success', function(done) {
        request('http://localhost:5553')
            .delete('/api/users/' + createdUser3.id)
            .expect(200)
            .end(function (err, res) {
                if (err) throw err;
                done()
            })
    })

    it('server data is empty', function(done) {
        request('http://localhost:5553')
            .get('/api/users')
            .expect('Content-Length', '2')
            .expect(200)
            .end(function (err, res) {
                if (err) throw err;
                assert(res.body, '{}')
                done()
            })
    })
})