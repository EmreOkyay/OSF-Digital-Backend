const signin = require('../routes/index.js');
const secretKey = '$2a$08$wurKWjXAIBE8zHmIsC8wPONR5Dk6X/Ov4zdrR6Rr0BQT5kqQtIq5m';

const request = require('supertest');
const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use('auth/signin', signin);

describe('POST /auth/signin', function() {
	it('responds with json', function(done) {
		request(app)
		.post('/auth/signin')
		.send({
			secretKey: secretKey,
			email: 'aaa@gmail.com',
			password: '123456'
		})
		.expect('Content-Type', 'text/html; charset=utf-8')
		.expect(200)
		.end(function(err, res) {
			if (err) return done(err);
			return done();
		});
	});
});