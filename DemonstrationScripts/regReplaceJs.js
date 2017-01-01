var reg = /var serverSiteUrl \= \"(?:.*?)\"/
var fs = require('fs');
const path = require('path');
var pathToScript = path.join(__dirname, '../src/scripts/xylole-client.js');
var script = fs.readFileSync(pathToScript).toString()
var newScript = script.replace(reg, function (match) {
  console.log(match);
  let newUrl = `var serverSiteUrl = "${'http://google.com'}"`
  return newUrl
})
// console.log(newScript);
