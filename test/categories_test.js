const index = require('../routes/index.js');

const request = require('supertest');
const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use("/categories", index);
app.use("/categories/parent/:id", index);
app.use("/categories/:id", index);   

// All Categories Test
describe('GET /categories', function() {
    it('should load category data and redirect to category page', function(done) {
      request(app)
        .get('/categories')
        .expect('Content-Type', "text/html; charset=UTF-8")
        .expect(function(res) {
            res.body = {};
            res.method = 'GET';
          })
        .expect(301, done);
    });
});

// Categories by Id Test
describe('GET /categories/:id', function() {
    it('should load category data by Id and redirect to category page', function(done) {
      request(app)
        .get('/categories/:id')
        .expect('Content-Type', "text/html; charset=UTF-8")
        .expect(function(res) {
            res.body = {};
            res.method = 'GET';
          })
        .expect(301, done);
    });
});

// Categories by Parent Id Test
describe('GET /categories/parent/:id', function() {
    it('should load category data by Parent Id and redirect to category page', function(done) {
      request(app)
        .get('/categories/parent/:id')
        .expect('Content-Type', "text/html; charset=UTF-8")
        .expect(function(res) {
            res.body = {};
            res.method = 'GET';
          })
        .expect(301, done);
    });
});