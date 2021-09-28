const signup = require('../routes/auth.js');
const secretKey = '$2a$08$wurKWjXAIBE8zHmIsC8wPONR5Dk6X/Ov4zdrR6Rr0BQT5kqQtIq5m';

const request = require('supertest');
const express = require('express');
const app = express();
var bodyParser = require('body-parser')

app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use('/auth/signup', signup);

const data = {
    secretKey: secretKey,
    name: 'aaaa',
    email: 'aaaaaaa@hotmail.com',
    password: '123456'
}

describe("POST /auth/signup", () => {
	it('Should signup properly', async function () {
		await request(app)
			.post('/auth/signup')
			.send( data )
			.expect(200);
	});
  })