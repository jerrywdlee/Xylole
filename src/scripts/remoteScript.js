// alert("remoteScript!")
/*
// fake jQuery
var $ = {
  fn: {
    jquery: 'N/A'
  }
};
*/

(function() {
  var serverSiteUrl = "http://localhost:8080"
  console.log('URL: '+location.href); // URL
  console.log('Title: '+checkTitle()); // title
  console.log('jQuery Ver: '+checkJquery())
  function checkJquery() {
    try {
      return ($ && $.fn && $.fn.jquery) || 'No jQuery'
    } catch (e) {
      return 'No jQuery'
    }
  }
  function checkTitle() {
    try {
      return document.querySelector('title').innerText
    } catch (e) {
      return 'No Title'
    }
  }
  function loadAsset(elementType, url, srcOrHref, parentElement) {
    parentElement = parentElement || document.body
    var assetElement = document.createElement(elementType)
    if (srcOrHref === 'href') {
      assetElement.href = url
    } else {
      assetElement.src = url
    }
    parentElement.appendChild(assetElement);
    return assetElement
  }
  // var socketIoScript = document.createElement('script')
  // socketIoScript.src='https://cdn.socket.io/socket.io-1.4.5.js';
  // document.body.appendChild(socketIoScript);
  var socketIoScript = loadAsset('script', 'https://cdn.socket.io/socket.io-1.4.5.js')
  socketIoScript.onload = function() {
    console.log('Socket Loaded!');
    var ioDomain = prompt("Please Set IO Server's Domain", serverSiteUrl);
    if (ioDomain) {
      var socket = io(ioDomain);
      socket.on('siteInfo', function (time) {
        // var title = document.querySelector('title')
        var siteInfo = {
          url: location.href,
          title: checkTitle(),
          jquery: checkJquery(),
          delay: Date.now() - time // one-way delay
        }
        console.log(siteInfo)
        socket.emit('siteInfo', siteInfo)
      })
      socket.on('load', function (asset) {
        console.log(asset)
        var elementType = asset.type.match(/^style|css$/) ? 'link' : 'script'
        var insertedAssert
        try {
          if (elementType === 'link') {
            insertedAssert = loadAsset(elementType, asset.uri, 'href')
          } else {
            insertedAssert = loadAsset(elementType, asset.uri)
          }
          // console.log(insertedAssert)
          var result = {
            message: insertedAssert.outerHTML + ' Inserted!'
          }
          socket.emit('result', result)
        } catch (e) {
          console.log(e);
          socket.emit('error', e)
        }
      })
      socket.on('exec', function (data) {
        console.log(data)
        try {
          var returnedMessage = eval(data.command)
          var result = {
            returns: returnedMessage,
            message: 'Executed!',
            at: Date.now()
          }
          socket.emit('result', result)
        } catch (e) {
          socket.emit('error', e)
        }
      })
      /*
      socket.on('chat', function (data) {
        console.log(data);
        setTimeout(function () {
          socket.emit('chat', { msg: 'data',at: Date.now() })
        }, 2000)
      })
      */
    }
  }
})()
