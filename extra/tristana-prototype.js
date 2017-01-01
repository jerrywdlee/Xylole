var app = require('express')();
// var proxy = require('http-proxy-middleware');
var vhost = require('vhost')

server = app
        .use(vhost('c813f5de.ngrok.io', require('./hosts/github-host.js').app)) // use your own host!
        .listen(3040,()=>{
          console.log('Listening on port %d', server.address().port);
        });
