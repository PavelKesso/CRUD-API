const { assert } = require('console');
const request = require('supertest');
const server = require('../build/server.js')

describe('fiest case: error handling.', function () {

    const testServer = new server.UserServer(5551)

    this.beforeAll(function () {
        testServer.run()
    })

    this.afterAll(function () {
        testServer.stop()
    })

    it('server data is empty', function (done) {
        request('http://localhost:5551')
            .get('/api/users')
            .expect('Content-Length', '2')
            .expect(200)
            .end(function (err, res) {
                if (err) throw err;
                assert(res.body, '{}')
                done()
            })
    })

    it('GET user with wrong uuid: false', function (done) {
        request('http://localhost:5551')
            .get('/api/users/wrong-uuid')
            .expect(400)
            .end(function (err, res) {
                if (err) throw err;
                done()
            })
    })

    it('GET user with unexisting uuid: false', function (done) {
        request('http://localhost:5551')
            .get('/api/users/d9428888-122b-11e1-b85c-61cd3cbb3210')
            .expect(404)
            .end(function (err, res) {
                if (err) throw err;
                done()
            })
    })

    it('POST user without username: failed', function (done) {
        request('http://localhost:5551')
            .post('/api/users')
            .send('{"age": 22, "hobbies": [ "reading", "walking"]}')
            .expect(400)
            .end(function (err, res) {
                if (err) throw err;
                done()
            })
    })

    it('POST user without age failed', function (done) {
        request('http://localhost:5551')
            .post('/api/users')
            .send('{"username": "Fernando", "hobbies": [ "reading", "walking"]}')
            .expect(400)
            .end(function (err, res) {
                if (err) throw err;
                done()
            })
    })

    it('POST user without hobbies: failed', function (done) {
        request('http://localhost:5551')
            .post('/api/users')
            .send('{"username": "Fernando", "age": 22 }')
            .expect(400)
            .end(function (err, res) {
                if (err) throw err;
                done()
            })
    })

    it('POST user with wrong name type: failed', function (done) {
        request('http://localhost:5551')
            .post('/api/users')
            .send('{"username": {}, "age": 22, "hobbies": [ "reading", "walking"]}')
            .expect(400)
            .end(function (err, res) {
                if (err) throw err;
                done()
            })
    })

    it('POST user with wrong age type: failed', function (done) {
        request('http://localhost:5551')
            .post('/api/users')
            .send('{"username": "Fernando", "age": "22", "hobbies": [ "reading", "walking"]}')
            .expect(400)
            .end(function (err, res) {
                if (err) throw err;
                done()
            })
    })

    it('POST user with wrong hobbies type: failed', function (done) {
        request('http://localhost:5551')
            .post('/api/users')
            .send('{"username": "Fernando", "age": 22, "hobbies": [ 12, 22]}')
            .expect(400)
            .end(function (err, res) {
                if (err) throw err;
                done()
            })
    })

    it('PUT user with wrong uid: failed', function (done) {
        request('http://localhost:5551')
            .put('/api/users/wrong-uid')
            .send('{"username": "Fernando", "age": 22, "hobbies": [ "reading", "walking"]}')
            .expect(400)
            .end(function (err, res) {
                if (err) throw err;
                done()
            })
    })

    it('PUT user with unexisting uid: failed', function (done) {
        request('http://localhost:5551')
            .put('/api/users/d9428888-122b-11e1-b85c-61cd3cbb3210')
            .send('{"username": "Fernando", "age": 22, "hobbies": [ "reading", "walking"]}')
            .expect(404)
            .end(function (err, res) {
                if (err) throw err;
                done()
            })
    })

    it('DELETE user with wrong uid: failed', function (done) {
        request('http://localhost:5551')
            .delete('/api/users/wrong-uid')
            .expect(400)
            .end(function (err, res) {
                if (err) throw err;
                done()
            })
    })

    it('DELETE user with unexisting uid: failed', function (done) {
        request('http://localhost:5551')
            .delete('/api/users/d9428888-122b-11e1-b85c-61cd3cbb3210')
            .expect(404)
            .end(function (err, res) {
                if (err) throw err;
                done()
            })
    })

    it('server data is empty', function (done) {
        request('http://localhost:5551')
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