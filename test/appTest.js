const assert = require('chai').assert;

const app = require('../app');

describe('starting()', function() {
  it('log of start should return string', function() {
    let result = app.starting();
    assert.typeOf(result, 'string');
  });
});

describe('port()', function() {
  it('port not start on 8888', function() {
    let result = app.port();
    assert.equal(result, 8888);
  });
});

describe('addNumbers()', function() {
  it('addNumbers should return number', function() {
    let result = app.addNumbers(2, 4);
    assert.typeOf(result, 'number');
  })
});

describe('addNumbers()', function() {
  it('addNumbers should be above 5', function() {
    let result = app.addNumbers(3, 3);
    assert.isAbove(result, 5);
  })
});

