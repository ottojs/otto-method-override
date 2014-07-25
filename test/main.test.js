
'use strict';

// Modules
require('should');
var supertest   = require('supertest');
var express     = require('express');

// Subject
var otto_method_override = require('../lib/index.js');

// New Express App
var app = express();

// Add Method Override
app.use(otto_method_override);

// POST Request
app.post('/method-override', function (req, res) {
  res.locals = { action : 'posted' };
  res.send(200, res.locals);
});

// DELETE Request
app.delete('/method-override', function (req, res) {
  res.locals = { action : 'deleted' };
  res.send(200, res.locals);
});

// Bind SuperTest
var request = supertest(app);

describe('Method Override', function () {

  describe('POST /method-override', function () {

    it('should respond with 200 and { action : "posted" }', function (done) {
      request.post('/method-override')
        .set('Accept', 'application/json')
        .send({ data : 'test' })
        .expect('Content-Type', /json/)
        .expect(200)
        .expect({ action : 'posted' })
        .end(done);
    });

    it('should respond with 200 and { action : "deleted" } when ?_method=DELETE', function (done) {
      request.post('/method-override?_method=DELETE')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .expect({ action : 'deleted' })
        .end(done);
    });

  });

  describe('DELETE /method-override', function () {

    it('should respond with 200 and { action : "deleted" }', function (done) {
      request.del('/method-override')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .expect({ action : 'deleted' })
        .end(done);
    });

  });

});
