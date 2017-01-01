var rewire = require("rewire");
var expect = require('chai').expect;
require('mocha-sinon');

describe('socketServer.js', function () {
  let socketServer, color, configs
  before(function () {
    socketServer = rewire('../socketServer.js')
    color = socketServer.__get__('color')
    configs = socketServer.__get__('configs')
  })

  describe('#local functions', function () {
    let initInfos, printTags, showHelp, showConnectOptions
    ,showCommands
    before(function () {
      initInfos = socketServer.__get__('initInfos')
      printTags = socketServer.__get__('printTags')
      showHelp = socketServer.__get__('showHelp')
      showConnectOptions = socketServer.__get__('showConnectOptions')
      showCommands = socketServer.__get__('showCommands')
    })
    beforeEach(function() {
      var log = console.log;
      this.sinon.stub(console, 'log', function() {
        return log.apply(log, arguments);
      });
    });
    it('initInfos return string from configs, have "help" and "command"', function () {
      let result = initInfos(configs)
      expect(result).to.be.a('string');
      expect(result).to.contain('Xylole')
      expect(result).to.contain('"help"')
      expect(result).to.contain('"command"')
    })
    it('showConnectOptions should print urls with QR', function () {
      // let showConnectOptions = socketServer.__get__('showConnectOptions')
      showConnectOptions("https://localhost:8080")
      expect(console.log.callCount > 5).to.be.true;
      // expect(console.log.calledWith('QR')).to.be.true;
      // expect(console.log.calledWith(color.e)).to.be.true;
      // expect(console.log.calledWith('javascript')).to.be.true;
      // expect(console.log.calledWith('https://localhost:8080')).to.be.true
    })
    it('printTags from should have no console.log', function () {
      printTags('from', 'remote')
      expect(console.log.callCount > 1).to.be.false;
      expect(console.log.calledWith('remote')).to.be.false;
      expect(console.log.calledWith('<<<')).to.be.false;
    })
    it('showHelp', function () {
      showHelp()
      expect(console.log.callCount > 1).to.be.true;
      expect(console.log.calledWith('Help')).to.be.true;
      // expect(console.log.calledWith('"command"')).to.be.true;
    })
    it('showCommands', function () {
      showCommands()
      expect(console.log.callCount > 10).to.be.true;
      expect(console.log.calledWith('  Show help')).to.be.true;
      expect(console.log.calledWith('  Show QR code of this server\'s URL')).to.be.true;
    })
  })
})
