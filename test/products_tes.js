const products = require('../routes/index.js');

const request = require('supertest');
const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use('/products/product_search', products);  

// Products Test
describe('GET /products/product_search', function() {
    it('should load product data and redirect to product page', function(done) {
      request(app)
        .get('/products/product_search')
        .expect('Content-Type', "text/html; charset=UTF-8")
        .expect(function(res) {
            res.body = {};
            res.method = 'GET';
            res.Data = typeof Object;
          })
        .expect(301, done);
    });
});