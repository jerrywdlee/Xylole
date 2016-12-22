var strJs = "load js https://cdn.socket.io/socket.io-1.4.5.js"
var strCss = "load css https://code.jquery.com/mobile/1.4.5/jquery.mobile-1.4.5.min.css"
var reg = /^(load|Load) (script|style|js|css) (https?|ftp)(:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+)/

function matchOrSwitch(str, reg) {
  switch (true) {
    case reg.test(str):
      console.log(RegExp.$0);
      console.log(RegExp.$1);
      console.log(RegExp.$2);
      console.log(RegExp.$3);
      console.log(RegExp.$4);
      break;
    default:
      console.log('Not Match');
  }
}

matchOrSwitch(str, reg)
