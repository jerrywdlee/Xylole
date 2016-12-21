// alert("remoteScript!")

console.log(location.href); // URL
console.log(document.querySelector('title').innerText); // title

var socketIoScript = document.createElement('script')
socketIoScript.src='https://cdn.socket.io/socket.io-1.4.5.js';
document.body.appendChild(socketIoScript);
socketIoScript.onload = function() {
  console.log('Socket Loaded!');
  var ioDomain = prompt("Please Set IO Server's Domain", "http://localhost:8080");
  if (ioDomain) {
    var socket = io(ioDomain);
    socket.on('chat', function (data) {
      console.log(data);
      setTimeout(function () {
        socket.emit('chat', { msg: 'data',at: Date.now() });
      }, 2000);
    });
  }
}
