const signup = require('../routes/auth.js');
const base_url = 'https://osf-digital-backend-academy.herokuapp.com/api/';
const secretKey = '$2a$08$wurKWjXAIBE8zHmIsC8wPONR5Dk6X/Ov4zdrR6Rr0BQT5kqQtIq5m';

const request = require('supertest');
const express = require('express');
const app = express();
const expect = require('chai').expect;
var bodyParser = require('body-parser')

app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use('/auth/signup', signup);

const data = {
    secretKey: secretKey,
    name: 'aaaaaa',
    email: 'aaaaaaaaaa@hotmail.com',
    password: '123456'
}

describe("POST /auth/signup", () => {
	it('Should signup properly', function (done) {
		request(app)
			.post(`/${base_url}/auth/signup`)
			.set('Accept', 'application/json')
			.set('Content-Type', 'application/json')
			.send( data )
		.expect('Content-Type', "text/html; charset=utf-8")
		.expect(function(response) {
			expect(response.body).to.be.an('object');
		})
		.end(done);
	});
})