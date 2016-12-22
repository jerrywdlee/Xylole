
const color = {
  red     : '\u001b[31m',
  green   : '\u001b[32m',
  blue    : '\u001b[34m',
  cyan    : '\u001b[36m',
  magenta : '\u001b[35m',
  yellow  : '\u001b[33m',
  black   : '\u001b[30m',
  white   : '\u001b[37m',
  end     : '\u001b[0m',

  r       :  '\u001b[31m',
  g       :  '\u001b[32m',
  b       :  '\u001b[34m',
  c       :  '\u001b[36m',
  m       :  '\u001b[35m',
  y       :  '\u001b[33m',
  k       :  '\u001b[30m',
  w       :  '\u001b[37m',
  e       :  '\u001b[0m',
}

const port = process.argv[2] || '8080'
const express = require('express')
const app = express()
app.use(express.static('src/scripts'))
app.use(express.static('demoPages'))
const server = require('http').createServer(app)
server.listen(process.env.PORT||port,function () {
  // console.log('Listening on port %d', server.address().port);
  console.log(color.b+'Server On : http://localhost:'+server.address().port+color.e)
})
// send Dynamic js
const fs = require('fs');
const script = fs.readFileSync( __dirname +'/src/scripts/remoteScript.js').toString()
const changeUrlReg = /var serverSiteUrl \= \"(?:.*?)\"/ // replace serverSiteUrl Dynamicly
const changeToSlientReg = /var ioDomain \= prompt\((?:.*?)\)/

// open port on Internet
const ngrok = require('ngrok');
const qrcode = require('qrcode-terminal');
var ngrokUrl = ''

ngrok.connect({
  proto: 'http', // http|tcp|tls
  addr: port, // port or network address
  //auth: 'user:pwd', // http basic authentication for tunnel
  //subdomain: ngrok_domain, // only paid plan can use this
  //authtoken: '12345', // your authtoken from ngrok.com
  region: 'ap' // one of ngrok regions (us, eu, au, ap), defaults to us
}, function (err, url) {
  if (err) {
    printTags('err')
    console.error(err);
  }else {
    ngrokUrl = url

    console.log(color.g + "Please input url below into prompt shown in page :" + color.e)
    console.log(url)
    qrcode.generate(url)

    // show prompt
    let insertUrlExplicit = `javascript:(function(d){var s=d.createElement('script');s.src='${url}/js';d.body.appendChild(s)})(document)`
    // hide prompt
    let insertUrlSlient = `javascript:(function(d){var s=d.createElement('script');s.src='${url}/jss';d.body.appendChild(s)})(document)`
    console.log('\n\n' + color.g+ 'To insert Script, input code below in Address Bar' + color.e);
    console.log(color.y + 'Explicit Mode: ' + color.e)
    console.log(' ' + insertUrlExplicit + '\n')
    console.log(color.y + 'Slient Mode: ' + color.e)
    console.log(' ' + insertUrlSlient + '\n')

    // qrcode.generate(insertUrl)
  }
});

app.get('/js', function (req, res) {
  // res.type(mime.lookup(file));
  let newScript = script.replace(changeUrlReg, function (match) {
    // console.log(match);
    let newUrl = `var serverSiteUrl = "${ngrokUrl ? ngrokUrl : ('http://localhost:'+port)}"`
    return newUrl
  })
  res.send(newScript)
})

// slience
app.get('/jss', function (req, res) {
  // res.type(mime.lookup(file));
  // var ioDomain =
  /*let newScript = script.replace(changeUrlReg, function (match) {
    // console.log(match);
    let newUrl = `var serverSiteUrl = "${ngrokUrl ? ngrokUrl : ('http://localhost:'+port)}"`
    return newUrl
  })*/
  newScript = script.replace(changeToSlientReg, function (match) {
    let ioDomain = `var ioDomain = "${ngrokUrl ? ngrokUrl : ('http://localhost:'+port)}"`
    return ioDomain
  })
  res.send(newScript)
})

// var app = require('http').createServer();
// app.listen(port);
const io = require('socket.io')(server)

io.on('connection', function (socket) {
  console.log(color.c+"connection on "+socket.request.connection.remoteAddress+color.e);
  socket.emit('chat',{msg:'Hello',at:Date.now()})
  let pageTitle = ''
  socket.emit('siteInfo',Date.now())
  socket.on('siteInfo', (siteInfo) => {
    pageTitle = siteInfo.title.substr(0, 15)
    // console.log('\n'+color.m+`[${pageTitle}] <<< `+ color.y + '~~~ Page Info ~~~' + color.y)
    printTags('from')
    process.stdout.write(color.y + '~~~ Page Info ~~~')
    printTags('from')
    process.stdout.write(color.y + 'Page Title: ' + siteInfo.title)
    printTags('from')
    process.stdout.write(color.y + 'URL       : ' + siteInfo.url)
    printTags('from')
    process.stdout.write(color.y + 'jQuery Ver: ' + siteInfo.jquery)
    printTags('from')
    process.stdout.write(color.y + 'Delay     : ' + (siteInfo.delay * 2) + 'ms' + color.e + '\n')
    // process.stdout.write(color.g+`[${pageTitle}] >>> ` +color.e);
    printTags('to')
  })

  socket.on('disconnect', function() {
    printTags('from')
    console.log(color.r+'Disconnected!!'+color.e)
    return
  });

  socket.on('chat', function(data) {
    printTags('from')
    // console.log('\n'+color.m+`[${pageTitle}] <<< `+color.e + JSON.stringify(data));
    console.log(JSON.stringify(data))
    printTags('to')
    // process.stdout.write(color.g+`[${pageTitle}] >>> `+color.e);
    return
  })

  socket.on('result', function(data) {
    printTags('from')
    data['localTime'] = (new Date(data.at)).toLocaleString()
    console.log(JSON.stringify(data))
    return printTags('to')
  })
  socket.on('error', function(data) {
    printTags('from')
    console.log(color.r + 'ERROR! ' + color.e + JSON.stringify(data))
    return printTags('to')
  })

  process.stdin.setEncoding('utf8')
  process.stdin.on('data', function(data) {
    // console.log(data.toString().match(/<<</));
    // if (data.toString().match(/<<</)) {

    // }
    // process.stdout.write(color.g+`[${pageTitle}] >>> `+color.e);
    var msg;
    msg = data.replace(/[\r\n]/g, '')
    if (msg.length < 1) {
      return printTags('to')
    } else {
      // input like
      // "load js https://code.jquery.com/jquery-1.11.1.min.js"
      // "load css https://code.jquery.com/mobile/1.4.5/jquery.mobile-1.4.5.min.css"
      // will load an asset
      let loadReg = /^(load|Load) (script|style|js|css) (https?|ftp)(:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+)/

      // input pageInfo, pageinfo, info, Info will show pageInfo again
      let pageInfoReg = /^(pageInfo|pageinfo|PageInfo|info|Info)$/

      switch (true) {
        case loadReg.test(msg) :
          // let scriptUri = RegExp.$2 + RegExp.$3
          let asset = {
            type: RegExp.$2,
            uri: RegExp.$3 + RegExp.$4
          }
          socket.emit('load', asset)
          return printTags('to')
        case pageInfoReg.test(msg) :
          socket.emit('siteInfo',Date.now())
          return printTags('to')
        default:
          let commandObj = {
            command: msg
          }
          socket.emit('exec', commandObj)
          /*
          socket.emit('chat', {
            msg: msg,
            at: Date.now()
          })
          */
          return // printTags('to')
      }
    }
  })

  function printTags(type) {
    switch (type) {
      case 'from':
        process.stdout.write('\n'+color.m+`[${color.w + pageTitle + color.m}] <<< `+color.e)
        break
      case 'to':
        process.stdout.write(color.g+`[${color.w + pageTitle + color.g}] >>> `+color.e);
        break
      case 'error':
      case 'err':
        process.stdout.write('\n'+color.r+`[${color.w + pageTitle||'Local' + color.r}] >>> `+color.e);
        break
      default:

    }
  }
})
