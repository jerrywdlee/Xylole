<h1 align="center">Xylole.js</h1>
<p align="center"><a href="https://github.com/jerrywdlee/Xylole" target="_blank"><img width="300"src=""/></a></p>

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
$ node socketServer.js
```
> Demo Page on http://localhost:8080

### Mount to Pages
When `socketServer.js` started, it will show message like:


```
javascript:(function(d){var s=d.createElement('script');s.src='https://rawgit.com/jerrywdlee/Xylole/master/src/scripts/remoteScript.js';d.body.appendChild(s)})(document)
```
## Waring
Xylole.js also can be use as a terrible **crack tool**, DO NOT AGAINST LAWS!

## License
**[MIT](http://opensource.org/licenses/MIT)**  
[Copyright (c) 2016~2017 Jerry Lee](https://github.com/jerrywdlee/Xylole/blob/master/LICENSE)
