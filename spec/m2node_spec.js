var vows = require('vows');
var assert = require('assert');
var http = require('http');

vows.describe('m2node').addBatch({
  'smoke test': {
    topic: function () {
      var callback = this.callback;
      var req = http.request({
        host: 'localhost',
        port: 9000,
        method: 'GET',
        path: '/'
      }, function (response) {
        response.on('data', function (chunk) {
          callback(null, {
            status: response.statusCode,
            headers: response.headers,
            body: chunk
          })
        });
      });
      req.end();
    },

    'is successful': function (err, response) {
      assert.equal(response.status, '200');
      assert.equal(response.body.toString(), 'Hello World\n');
    }
  },

  'request headers': {
    topic: function () {
      var callback = this.callback;
      var req = http.request({
        host: 'localhost',
        port: 9000,
        method: 'GET',
        path: '/echo_headers',
        headers: {'X-Testing': 'm2node'}
      }, function (response) {
        response.on('data', function (chunk) {
          callback(null, {
            status: response.statusCode,
            headers: response.headers,
            body: chunk
          })
        });
      });
      req.end();
    },

    'are all passed to the server': function (err, response) {
      assert.equal(response.status, '200');
      assert.equal(JSON.parse(response.body.toString())['x-testing'], 'm2node');
    }
  },

  'response headers': {
    topic: function () {
      var callback = this.callback;
      var req = http.request({
        host: 'localhost',
        port: 9000,
        method: 'GET',
        path: '/set_response_header'
      }, function (response) {
        response.on('data', function (chunk) {
          callback(null, {
            status: response.statusCode,
            headers: response.headers,
            body: chunk
          })
        });
      });
      req.end();
    },

    'are all passed back': function (err, response) {
      assert.equal(response.status, '200');
      assert.equal(response.headers['x-customresponseheader'], 'm2node');
    }
  },

  'request body': {
    topic: function () {
      var callback = this.callback;
      var postData = 'foo=bar&body_echoed=true';
      var req = http.request({
        host: 'localhost',
        port: 9000,
        method: 'POST',
        path: '/echo_body',
        headers: {'Content-Length': postData.length}
      }, function (response) {
        response.on('data', function (chunk) {
          callback(null, {
            status: response.statusCode,
            headers: response.headers,
            body: chunk
          })
        });
      });
      req.write(postData);
      req.end();
    },

    'are all passed back': function (err, response) {
      assert.equal(response.status, '200');
      assert.equal(response.body.toString(), 'foo=bar&body_echoed=true');
    }
  }
}).export(module)
