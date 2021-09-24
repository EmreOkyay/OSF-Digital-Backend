const signup = require('../routes/index.js');
const secretKey = '$2a$08$wurKWjXAIBE8zHmIsC8wPONR5Dk6X/Ov4zdrR6Rr0BQT5kqQtIq5m';

const request = require('supertest');
const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use('/auth/signup', signup);

const data = {
           secretKey: secretKey,
           name: 'aaa',
           email: 'aaa@hotmail.com',
           password: '123456'
};

describe('POST /auth/signup', function() {
it('responds with json', function(done) {
    request(app)
    .post('/auth/signup')
    .send({ data })
    .expect('Content-Type', 'text/html; charset=utf-8')
    .expect(200)
    .end(function(err, res) {
        if (err) return done(err);
        return done();
    });
});
});