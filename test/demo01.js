/*
var assert = require('assert');
describe('Array', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
      assert.equal(-1, [1,2,3].indexOf(4));
    });
  });
});
*/

var expect = require('chai').expect
  , foo = 'bar'
  , beverages = { tea: [ 'chai', 'matcha', 'oolong' ] };

describe('Test String', function () {
  describe('# String foo="bar"', function () {
    it('Should be String', function () {
      expect(foo).to.be.a('string');
    })
    it('Should be "bar"', function () {
      expect(foo).to.equal('bar');
    })
    it('Should have 3 letters', function () {
      expect(foo).to.have.length(3);
    })
  })
})

describe('Tea Array', function () {
  it('Tea Array should have 3 elements', function () {
    expect(beverages).to.have.property('tea').with.length(3);
  })
})
