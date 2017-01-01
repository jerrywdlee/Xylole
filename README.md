<h1 align="center">Xylole.js</h1>
<p align="center"><a href="https://github.com/jerrywdlee/Xylole" target="_blank"><img width="300" src="https://cdn.rawgit.com/jerrywdlee/Xylole/master/src/assets/xylole.js2.png"/></a></p>

## Intro
Xylole.js is a remote console tool for developing web pages on devices which have no console terminals like Chrome's or Firefox's PC versions.

## About Name
**Xylole** is the name of **[xylene](https://en.wikipedia.org/wiki/Xylene)** (a kind of aromatic compounds)  in German language. I named it because *Xylole* looks like a combination of *"Cross"("X")* and *"Console"*.  
Beside, as we know, **Hexagon** is the symbol of **[Node.js](https://nodejs.org/en/)**, and hexagon is also the symbol of typical aromatic compounds, like **[benzene](https://en.wikipedia.org/wiki/Benzene)**.

## Useage
### Install
```sh
# Need node.js > v6
$ git clone https://github.com/jerrywdlee/Xylole.git
$ cd Xylole
$ npm install
$ npm run xylole
```
> Demo Page on http://localhost:8080

### Mount to Pages
When **Xylole Server** started, it will show message like:

```sh
Server On : http://localhost:8080

Please input url below into prompt shown in page :
https://[RANDOM].ap.ngrok.io

To insert Script, input code below in Address Bar
Use Scripts From This Server:
 Explicit Mode:
  javascript:(function(d){var s=d.createElement('script');s.src='https://[RANDOM].ap.ngrok.io/js';d.body.appendChild(s)})(document)
 Type "qr-em" show QR code of Explicit Mode Script
 Slient Mode:
  javascript:(function(d){var s=d.createElement('script');s.src='https://[RANDOM].ap.ngrok.io/jss';d.body.appendChild(s)})(document)
 Type "qr-sm" show QR code of Slient Mode Script

Use Scripts From CDN:
 Explicit Mode Only:
  javascript:(function(d){var s=d.createElement('script');s.src='https://cdn.rawgit.com/jerrywdlee/Xylole/master/min/xylole-client.min.js';d.body.appendChild(s)})(document)
 Type "qr-cdn" show QR code of CDN Script

If target web page not allow Cross Domain Scripts:
 If target page has jQuery (Explicit Mode Only):
  javascript:($.get('https://[RANDOM].ap.ngrok.io/csp',function(d){eval(d)}))
 Type "qr-csp-jq" show QR code of CDN Script
 If target page has NO jQuery (Explicit Mode Only):
  javascript:(()=>{var x=new XMLHttpRequest();x.onreadystatechange=()=>{if(x.readyState==4&&x.status==200){eval(x.responseText)}};x.open("GET","https://[RANDOM].ap.ngrok.io/csp",true);x.send()})()
 Type "qr-csp" show QR code of Slient Mode Script

Attention!!
  Some browser like Chrome and Firefox will delete keyword "javascript:" when pasting codes into Address Bar.
  You'd better type keyword "javascript:" and paste codes above.
```
Follow the messages and have fun ;)

## Commands
Xylole.js has a lot of Commands which may help you send codes faster. Type `command` will show all usable commands.
### Official Commands
#### Local Commands
*  **Command: "help"**  
  Show help
* **Command: "command"**  
  Show commands
* **Command: "license"**  
  Show Copyright and License
* **Command: "qr"**  
  Show QR code of this server's URL
* **Command: "qr-[cdn|em|sm|csp|csp-jq]"**  
  Show QR code of scripts from CDN/Local Server in Explicit Mode or Slient Mode

#### Remote Commands
* **Command: "load [js|css] [URL]"**  
  Load an asset from URL
* **Command: "disconnect"**  
  Disconnect from remote web page
* **Command: "close"**  
  Close remote web page
### Custom Commands
You can create your own special commands by edting `customCommands.yml`, There are 2 demo commands for test this function.  
All changes of `customCommands.yml` may need you restart Xylole Server.

* **Command: "border"**  
  Show border of boxes on remote web page
* **Command: "black-background"**  
  Let background go black
## Waring
Xylole.js also can be use as a terrible **Crack Tool**, DO NOT AGAINST LAWS!

## License
**[MIT](http://opensource.org/licenses/MIT)**  
[Copyright (c) 2016~2017 Jerry Lee](https://github.com/jerrywdlee/Xylole/blob/master/LICENSE)
