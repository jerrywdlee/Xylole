var rewire = require("rewire");
var expect = require('chai').expect;
require('mocha-sinon');

describe('regReplaceJs', function () {
  let regReplaceJs, newScript, result;
  before(function() {
    var log = console.log;
    this.sinon.stub(console, 'log', function() {
      return log.apply(log, arguments);
    });
  });
  it('should log var serverSiteUrl = "http://localhost:8080"', function() {
    regReplaceJs = rewire("../DemonstrationScripts/regReplaceJs.js");
    regReplaceJs.__set__("pathToScript", "src/scripts/xylole-client.js");
    newScript = regReplaceJs.__get__('newScript')
    result = newScript
    expect( console.log.calledOnce ).to.be.true;
    expect( console.log.calledWith('var serverSiteUrl = "http://localhost:8080"') ).to.be.true;
  });
  it('regReplaceJs should return newScript as string', function () {
    expect(result).to.be.a('string');
  })
  it('regReplaceJs should have http://google.com', function () {
    expect(result).to.contain(`var serverSiteUrl = "${'http://google.com'}"`)
  })
})

describe('regSwitch', function () {
  let regSwitch, matchOrSwitch, reg, strJs, strCss;
  before(function () {
    regSwitch = rewire("../DemonstrationScripts/regSwitch.js");
    matchOrSwitch = regSwitch.__get__('matchOrSwitch')
    reg = regSwitch.__get__('reg')
    strJs = regSwitch.__get__('strJs')
    strCss = regSwitch.__get__('strCss')
  })
  beforeEach(function() {
    var log = console.log;
    this.sinon.stub(console, 'log', function() {
      return log.apply(log, arguments);
    });
  });
  it('Load js Call 5 times log', function () {
    matchOrSwitch(strJs, reg)
    expect(console.log.callCount).to.equal(5)
  })
  it('load js Should have "load", "js", "https"', function () {
    matchOrSwitch(strJs, reg)
    expect(console.log.calledWith('load')).to.be.true;
    expect(console.log.calledWith('js')).to.be.true;
    expect(console.log.calledWith('https')).to.be.true;
  })
  it('load css Should have "load", "css", "https"', function () {
    matchOrSwitch(strCss, reg)
    expect(console.log.calledWith('load')).to.be.true;
    expect(console.log.calledWith('css')).to.be.true;
    expect(console.log.calledWith('https')).to.be.true;
  })
  it('load nothing Should call one and log "Not Match"', function () {
    matchOrSwitch('nothing', reg)
    expect(console.log.callCount).to.equal(1)
    expect(console.log.calledWith('Not Match')).to.be.true;
  })
})
