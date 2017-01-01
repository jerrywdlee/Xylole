/*
var expect = require('chai').expect;
require('mocha-sinon');

// Function to test, can also be in another file and as long as it's
// being called through some public interface it should be testable.
// If it's not in any way exposed/exported, testing will be problematic.
function privateFunction (time) {
  if (time < 12) { console.log('Good morning'); }
  if (time >= 12 && time <19) { console.log('Good afternoon'); }
  else { console.log('Good night!'); }
}

describe('privateFunction()', function() {

  beforeEach(function() {
    var log = console.log;
    this.sinon.stub(console, 'log', function() {
      return log.apply(log, arguments);
    });
  });

  it('should log "Good morning" for hours < 12', function() {
    privateFunction(5);
    expect( console.log.calledOnce ).to.be.true;
    expect( console.log.calledWith('Good morning') ).to.be.true;
  });

  it('should log "Good afternoon" for hours >= 12 and < 19', function() {
    privateFunction(15);
    expect( console.log.calledOnce ).to.be.true;
    expect( console.log.calledWith('Good afternoon') ).to.be.true;
  });

  it('should log "Good night!" for hours >= 19', function() {
    privateFunction(20);
    expect( console.log.calledOnce ).to.be.true;
    expect( console.log.calledWith('Good night!') ).to.be.true;
  });

});
*/
