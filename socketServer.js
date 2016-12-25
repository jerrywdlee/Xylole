
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
// load configs from
const configs = require(__dirname + '/package.json');
const YAML = require('yamljs');
var customCommands = YAML.load(__dirname+'/customCommands.yml');
// console.log(customCommands)
// printTags('from')
console.log(initInfos(configs))
console.log('\n')

const port = process.argv[2] || '8080'
const express = require('express')
const app = express()
app.use(express.static('src/scripts'))
app.use(express.static('demoPages'))
app.use(express.static('min'))
const server = require('http').createServer(app)
server.listen(process.env.PORT||port,function () {
  // console.log('Listening on port %d', server.address().port);
  // printTags('from')
  console.log(color.b+'Server On : http://localhost:'+server.address().port+color.e)
  // console.log()
})

// open port on Internet
var ngrok
try {
  ngrok = require('ngrok');
} catch (e) {

}
const qrcode = require('qrcode-terminal');
var ngrokUrl = ''
var clientsIdArray = [] // save connected sockets' ids
if (ngrok) {
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
      console.error(err)
      // if ngrok errored, use localhost
      ngrokUrl = `http://localhost:${server.address().port}`
      showConnectOptions(ngrokUrl)
    }else {
      ngrokUrl = url
      console.log(color.g + "\nPlease input url below into prompt shown in page :" + color.e)
      console.log(ngrokUrl)
      // console.log('\n')
      showConnectOptions(url)
      // qrcode.generate(insertUrl)
    }
  });
} else {
  ngrokUrl = `http://localhost:${server.address().port}`
  showConnectOptions(ngrokUrl)
}


// send Dynamic js
const fs = require('fs');
const script = fs.readFileSync( __dirname +'/src/scripts/xylole-client.js').toString()
const changeUrlReg = /var serverSiteUrl \= \"(?:.*?)\"/ // replace serverSiteUrl Dynamicly

app.get('/js', function (req, res) {
  // res.type(mime.lookup(file));
  let newScript = script.replace(changeUrlReg, function (match) {
    // console.log(match);
    let newUrl = `var serverSiteUrl = "${ngrokUrl}"`
    return newUrl
  })

  res.send(newScript)
})

// slience
const changeToSlientReg = /var ioDomain \= prompt\((?:.*?)\)/
app.get('/jss', function (req, res) {
  // res.type(mime.lookup(file));
  // var ioDomain =
  /*let newScript = script.replace(changeUrlReg, function (match) {
    // console.log(match);
    let newUrl = `var serverSiteUrl = "${ngrokUrl ? ngrokUrl : ('http://localhost:'+port)}"`
    return newUrl
  })*/
  let newScript = script.replace(changeToSlientReg, function (match) {
    let ioDomain = `var ioDomain = "${ngrokUrl}"`
    return ioDomain
  })
  res.send(newScript)
})

// const socketReg = /var socketIoScript \= loadAsset\((?:.*?)\)/
// CSP(Content Security Policy) measures
app.get('/csp', function (req, res) {
  // if CSP setting not allow script cross Domains
  // use ajax
  //
  res.set({
    'Content-Type': 'text/plain',
    'Access-Control-Allow-Origin': '*'
    // 'Content-Length': '123',
    // 'ETag': '12345'
  })
  let script = fs.readFileSync( __dirname +'/src/scripts/xylole-client-csp.js').toString()
  let newScript = script.replace(changeUrlReg, function (match) {
    let newUrl = `var serverSiteUrl = "${ngrokUrl}"`
    return newUrl
  })
  res.send(newScript)
})
const socketIoScript = fs.readFileSync( __dirname +'/src/scripts/socket.io-1.4.5.js').toString()
app.get('/socket', function (req, res) {
  res.set({
    'Content-Type': 'text/plain',
    'Access-Control-Allow-Origin': '*',
  })
  // let socketIoScript = fs.readFileSync( __dirname +'/src/scripts/socket.io-1.4.5.js').toString()
  res.send(socketIoScript)
})

// var app = require('http').createServer();
// app.listen(port);
const io = require('socket.io')(server)
// var ifOnConnection = false // connection flag

io.on('connection', function (socket) {
  console.log(color.c+"connection on "+socket.request.connection.remoteAddress+color.e);
  clientsIdArray.push(socket.id) // add a new id
  // socket.emit('chat',{msg:'Hello',at:Date.now()})
  let pageTitle = ''
  socket.emit('siteInfo',Date.now())
  socket.on('siteInfo', (siteInfo) => {
    pageTitle = siteInfo.title.substr(0, 15)
    if (siteInfo.title.trim().length > 23) {
      pageTitle = siteInfo.title.trim().substr(0, 15) + '...' + siteInfo.title.trim().slice(-5)
    } else {
      pageTitle = siteInfo.title.trim()
    }
    // console.log('\n'+color.m+`[${pageTitle}] <<< `+ color.y + '~~~ Page Info ~~~' + color.y)
    printTags('from', pageTitle)
    process.stdout.write(color.y + '~~~ Page Info ~~~')
    printTags('from', pageTitle)
    process.stdout.write(color.y + 'Page Title: ' + siteInfo.title)
    printTags('from', pageTitle)
    process.stdout.write(color.y + 'URL       : ' + siteInfo.url)
    printTags('from', pageTitle)
    process.stdout.write(color.y + 'User Agent: ' + siteInfo.userAgent)
    printTags('from', pageTitle)
    process.stdout.write(color.y + 'Languages : ' + siteInfo.languages)
    printTags('from', pageTitle)
    process.stdout.write(color.y + 'jQuery Ver: ' + siteInfo.jquery)
    printTags('from', pageTitle)
    process.stdout.write(color.y + 'Delay     : ' + (siteInfo.delay * 2) + 'ms' + color.e + '\n')
    // process.stdout.write(color.g+`[${pageTitle}] >>> ` +color.e);
    printTags('to', pageTitle)
  })

  socket.on('disconnect', function() {
    printTags('from', pageTitle)
    console.log(color.r+'Disconnected!!'+color.e)
    process.stdin.removeListener('data', stdinHandler) // remove input listener
    clientsIdArray.splice(clientsIdArray.indexOf(socket.id), 1) // delete id when Disconnected
    if (!clientsIdArray.length) {
      printTags('to', 'Local')
    }
    return
  });

  /*
  socket.on('chat', function(data) {
    printTags('from', pageTitle)
    // console.log('\n'+color.m+`[${pageTitle}] <<< `+color.e + JSON.stringify(data));
    console.log(JSON.stringify(data))
    printTags('to', pageTitle)
    // process.stdout.write(color.g+`[${pageTitle}] >>> `+color.e);
    return
  })
  */

  socket.on('result', function(data) {
    printTags('from', pageTitle)
    data['localTime'] = (new Date(data.at)).toLocaleString()
    console.log(JSON.stringify(data))
    return printTags('to', pageTitle)
  })
  socket.on('error', function(data) {
    printTags('from', pageTitle)
    console.log(color.r + 'ERROR! ' + color.e + JSON.stringify(data))
    return printTags('to', pageTitle)
  })

  // define RegExps
  // input like
  // "load js https://code.jquery.com/jquery-1.11.1.min.js"
  // "load css https://code.jquery.com/mobile/1.4.5/jquery.mobile-1.4.5.min.css"
  // will load an asset
  // Cannot use load command if Site not allow cross site scripts
  let loadReg = /^(load|Load) (script|style|js|css) (https?|ftp)(:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+)/

  // input pageInfo, pageinfo, info, Info will show pageInfo again
  let pageInfoReg = /^(pageInfo|pageinfo|PageInfo|info|Info)$/

  // local commands
  let loacalCommands = /^[H|h]elp|[U|u]seage|[C|c]ommand|[C|c]opyright|[L|l]icense|[Q|q][R|r]|qr\-[em|sm|cdn|csp|csp\-jq]$/

  // customCommands
  let customCommandsReg = generateCustomCommandsReg(customCommands)

  let stdinHandler = function(data) {
    // console.log(data.toString().match(/<<</));
    // if (data.toString().match(/<<</)) {

    // }
    // process.stdout.write(color.g+`[${pageTitle}] >>> `+color.e);
    var msg;
    msg = data.replace(/[\r\n]/g, '')
    if (msg.length < 1) {
      return printTags('to', pageTitle)
    } else {
      switch (true) {
        case loadReg.test(msg) :
          // let scriptUri = RegExp.$2 + RegExp.$3
          let asset = {
            type: RegExp.$2,
            uri: RegExp.$3 + RegExp.$4
          }
          socket.emit('load', asset)
          return printTags('to', pageTitle)
        case pageInfoReg.test(msg) :
          socket.emit('siteInfo',Date.now())
          return printTags('to', pageTitle)
        case /^disconnect$/.test(msg) :
          socket.emit('disconnect')
          return // printTags('to', `Local`)
        case loacalCommands.test(msg) :
          // if loacalCommands, do nothing here
          return // printTags('to', `Local`)
        case /^close$/.test(msg) :
          {
            let commandObj = {
              // close window remote
              command: `window.open('about:blank','_self').close();`
            }
            printTags('from', pageTitle)
            console.log(color.r + 'Closing Remote Web Page...' + color.e)
            socket.emit('exec', commandObj)
          }
          return
        case customCommandsReg.test(msg) :
          // console.log(RegExp.$1)
          let cmd = getCustomCommand(RegExp.$1, customCommands)
          printTags('to', pageTitle)
          console.log(cmd)
          // getCustomCommand(RegExp.$1, customCommands)
          // console.log(RegExp.$1)
          {
            let commandObj = {
              command: cmd
            }
            socket.emit('exec', commandObj)
          }
          return
          break;
        default:
          {
            let commandObj = {
              command: msg
            }
            socket.emit('exec', commandObj)
          }
          /*
          socket.emit('chat', {
            msg: msg,
            at: Date.now()
          })
          */
          return // printTags('to', pageTitle)
      }
    }
  }
  process.stdin.setEncoding('utf8')
  process.stdin.on('data', stdinHandler)
})

function printTags(type, pageTitle) {
  switch (type) {
    case 'from':
      process.stdout.write('\n'+color.m+`[${color.w + pageTitle + color.m}] <<< `+color.e)
      break
    case 'to':
      process.stdout.write(color.g+`[${color.w + pageTitle + color.g}] >>> `+color.e);
      break
    case 'error':
    case 'err':
      process.stdout.write('\n'+color.r+`[${color.w + pageTitle + color.r}] >>> `+color.e);
      break
    default:

  }
}

function showHelp() {
  let license = configs['license']
  let copyrightReg = /\[Copyright (?:.*?)\]/
  console.log('Help')
  showConnectOptions(ngrokUrl||('http://localhost:'+server.address().port))
  // console.log(`\n`);
  console.log(`${color.y}Type "help", "command", or "license" for more information.${color.e}`)

}

function showCommands() {
  console.log(color.b + '\nLocal Commands' + color.e);
  console.log(color.y + ' Command: '+ color.w + '"help"' +color.e)
  console.log('  Show help')
  console.log(color.y + ' Command: '+ color.w + '"command"' +color.e)
  console.log('  Show this message')
  console.log(color.y + ' Command: '+ color.w + '"license"' +color.e)
  console.log('  Show Copyright and License')
  console.log(color.y + ' Command: '+ color.w + '"qr"' +color.e)
  console.log('  Show QR code of this server\'s URL')
  console.log(color.y + ' Command: '+ color.w + '"qr-[cdn|em|sm|csp|csp-jq]"' +color.e)
  console.log('  Show QR code of scripts from CDN/Local Server in Explicit Mode or Slient Mode')

  console.log(color.b + '\nRemote Commands' + color.e);
  console.log(color.y + ' Command: '+ color.w + '"load [js|css] [URL]"' +color.e)
  console.log('  Load an asset from URL')
  console.log(color.y + ' Command: '+ color.w + '"disconnect"' +color.e)
  console.log('  Disconnect from remote web page')
  console.log(color.y + ' Command: '+ color.w + '"close"' +color.e)
  console.log('  Close remote web page')

  console.log(color.b + '\nCustom Commands' + color.e);
  customCommands.forEach((x, i, self) => {
    console.log(color.y + ' Command: '+ color.w + `"${x.command}"` +color.e)
    console.log('  ' + x.description)
  })
}

function generateCustomCommandsReg(customCommands) {
  let commandArry = []
  customCommands.forEach((x, i, self) => {
    commandArry.push(x.command)
  })
  let commandReg = new RegExp('(' + commandArry.join('|') + ')');
  return commandReg
}

function getCustomCommand(command, customCommands) {
  let code = ''
  customCommands.forEach((x, i, self) => {
    if (x.command === command) {
      code = x.code
      return
    }
  })
  return code
}

function initInfos(configs) {
  return `
  ${color.y}Xylole ${configs.version}, Author: ${configs.author}
  Type "help", "command", or "license" for more information.${color.e}`
}

var cdnScriptUrl = ''
var insertUrlExplicit = ''
var insertUrlSlient = ''
var cspScriptUrl = ''
var cspScriptUrlJquery =''
function showConnectOptions(url) {
  // show prompt
  insertUrlExplicit = `javascript:(function(d){var s=d.createElement('script');s.src='${url}/js';d.body.appendChild(s)})(document)`
  // hide prompt
  insertUrlSlient = `javascript:(function(d){var s=d.createElement('script');s.src='${url}/jss';d.body.appendChild(s)})(document)`
  //from cdn (show prompt only)
  cdnScriptUrl = `javascript:(function(d){var s=d.createElement('script');s.src='${configs['cdnScriptUrl']}';d.body.appendChild(s)})(document)`
  console.log('\n\n' + color.g+ 'To insert Script, input code below in Address Bar' + color.e);
  console.log(color.y + 'Use Scripts From This Server: ' + color.e)
  console.log(color.y + ' Explicit Mode: ' + color.e)
  console.log('  ' + insertUrlExplicit + '')
  console.log(color.g + " Type " + color.w + "\"qr-em\""+ color.g +" show QR code of Explicit Mode Script" + color.e)

  console.log(color.y + ' Slient Mode: ' + color.e)
  console.log('  ' + insertUrlSlient + '')
  console.log(color.g + " Type " + color.w + "\"qr-sm\""+ color.g +" show QR code of Slient Mode Script" + color.e)

  console.log(color.y + '\nUse Scripts From CDN: ' + color.e)
  console.log(color.y + ' Explicit Mode Only: ' + color.e)
  console.log('  ' + cdnScriptUrl + '')
  console.log(color.g + " Type " + color.w + "\"qr-cdn\""+ color.g +" show QR code of CDN Script" + color.e)

  cspScriptUrlJquery = `javascript:($.get('${url}/csp',function(d){eval(d)}))`
  console.log(color.y + '\nIf target web page not allow Cross Domain Scripts: ' + color.e)
  console.log(color.y + ' If target page has jQuery (Explicit Mode Only): ' + color.e)
  console.log('  ' + cspScriptUrlJquery + '')
  console.log(color.g + " Type " + color.w + "\"qr-csp-jq\""+ color.g +" show QR code of CDN Script" + color.e)
  cspScriptUrl = `javascript:(()=>{var x=new XMLHttpRequest();x.onreadystatechange=()=>{if(x.readyState==4&&x.status==200){eval(x.responseText)}};x.open("GET","${url}/csp",true);x.send()})()`
  console.log(color.y + ' If target page has '+color.r+'NO'+color.y+' jQuery (Explicit Mode Only): ' + color.e)
  console.log('  ' + cspScriptUrl + '')
  console.log(color.g + " Type " + color.w + "\"qr-csp\""+ color.g +" show QR code of Slient Mode Script" + color.e)

  console.log(`\n${color.r}Attention!!${color.e}
  Some browser like Chrome and Firefox will delete keyword "javascript:" when pasting codes into Address Bar.
  You'd better type keyword "javascript:" and paste codes above.`)
  // console.log(color.g + "Or Use QR code below :" + color.e)

  // qrcode.generate(url)

  console.log('\n')
  if (!clientsIdArray.length) {
    printTags('to', 'Local')
  }
}

var localStdinHandler = function (data) {
  let msg;
  let ifOnConnection = clientsIdArray.length
  msg = data.replace(/[\r\n]/g, '')
  if (msg.length < 1) {
    return ifOnConnection?0:printTags('to', 'Local')
    /*
    if (!ifOnConnection) {
      return printTags('to', 'Local')
    } else {
      return
    }*/
  } else {
    let helpReg = /^[H|h]elp|[U|u]seage$/
    let licenseReg = /^[C|c]opyright|[L|l]icense$/
    let commandReg = /^[C|c]ommand$/
    let qrReg = /^[Q|q][R|r]$/
    switch (true) {
      case helpReg.test(msg):
        showHelp()
        break
      case licenseReg.test(msg):
        console.log();
        console.log(initInfos(configs))
        break
      case commandReg.test(msg):
        showCommands()
        break
      case qrReg.test(msg):
        console.log(color.g + "\nPlease input url below into prompt shown in page :" + color.e)
        console.log(ngrokUrl)
        console.log('\n')
        console.log(color.g + "Or Use QR code below :" + color.e)
        qrcode.generate(ngrokUrl)
        break
      case /^qr\-(em|sm|cdn|csp|csp\-jq)$/.test(msg):
        let scriptUrl = ''
        switch (RegExp.$1) {
          case 'em':
            scriptUrl = insertUrlExplicit
            console.log(color.y + 'Use Scripts From This Server: ' + color.e)
            console.log(color.y + ' Explicit Mode: ' + color.e)
            break;
          case 'sm':
            scriptUrl = insertUrlSlient
            console.log(color.y + 'Use Scripts From This Server: ' + color.e)
            console.log(color.y + ' Slient Mode: ' + color.e)
            break
          case 'cdn':
            scriptUrl = cdnScriptUrl
            console.log(color.y + '\nUse Scripts From CDN: ' + color.e)
            console.log(color.y + ' Explicit Mode Only: ' + color.e)
            break
          case 'csp':
            scriptUrl = cspScriptUrl
            console.log(color.y + '\nIf target web page not allow Cross Domain Scripts: ' + color.e)
            console.log(color.y + ' If target page has '+color.r+'NO'+color.y+' jQuery (Explicit Mode Only): ' + color.e)
            break;
          case 'csp-jq':
            scriptUrl = cspScriptUrlJquery
            console.log(color.y + '\nIf target web page not allow Cross Domain Scripts: ' + color.e)
            console.log(color.y + ' If target page has jQuery (Explicit Mode Only): ' + color.e)
            break;
          default:

        }
        console.log('  ' + scriptUrl + '\n')
        console.log(color.g + "Or Use QR code below :" + color.e)
        qrcode.generate(scriptUrl)
        break
      default:

    }
    return ifOnConnection?0:printTags('to', 'Local')
  }
}
process.stdin.setEncoding('utf8')
process.stdin.on('data', localStdinHandler)
