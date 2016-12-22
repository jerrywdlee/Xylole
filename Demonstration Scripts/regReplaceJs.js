var reg = /var serverSiteUrl \= \"(?:.*?)\"/
var fs = require('fs');
var script = fs.readFileSync('../src/scripts/remoteScript.js').toString()
var newScript = script.replace(reg, function (match) {
  console.log(match);
  let newUrl = `var serverSiteUrl = "${'http://google.com'}"`
  return newUrl
})
console.log(newScript);
