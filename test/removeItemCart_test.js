const cart = require('../routes/cart.js');
const base_url = '<baseUrl>';
const secretKey = '<secretKey>';
let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxNTI3ODEyYzU4YzBjMDAyNDc3NDRkMCIsImlhdCI6MTYzMjk1MzI3NCwiZXhwIjoxNjMzMDM5Njc0fQ.K-luCvjZWbUCcT2V8XLasNk9asO_uKS3gXoz6_975hw';

const request = require('supertest');
const express = require('express');
const app = express();
const expect = require('chai').expect;
var bodyParser = require('body-parser');

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use('/cart/removeItem', cart);

describe("DELETE /cart/removeItem", () => {
	it('Should remove item from the cart properly', function (done) {
		request(app)
			.delete(`/${base_url}/cart/removeItem`)
			.set('Accept', 'application/json')
			.set('Content-Type', 'application/json')
            .set('API-Key', token)
            .send({
                secretKey: secretKey,
                productId: "M1355",
                variantId: "842204063326",
                quantity: 3
            })
		.expect('Content-Type', "text/html; charset=utf-8")
		.expect(function(response) {
			expect(response.body).to.be.an('object');
		})
		.end(done);
	});
})
