# はじめに
この記事は[Javascript Advent Calendar](http://qiita.com/advent-calendar/2016/javascript) 23日の記事です。

　[Xylole.js](https://github.com/jerrywdlee/Xylole)はリモートでウェブページをコンソールで操作できる開発用ツールです。勉強と遊びのために、実験的な機能も複数実装しています。

#シリーズ一覧
|No.|記事|キーワード|
|:-----------|------------:|------------:|
|Chapter 00|[Xylole.js開発手記（第０章）(本記事)]()|使い方・原理|
|Chapter 01|[Xylole.js開発手記（第１章）]()|Bookmarkletと即時関数|
|Chapter 02|[Xylole.js開発手記（第２章）]()|jQueryの頼らないコーディング|
|Chapter 03|[Xylole.js開発手記（第３章）]()|改行しないNode.jsのconsole|
|Chapter 04|[Xylole.js開発手記（第４章）]()|Socket.io備忘録|
|Chapter 05|[Xylole.js開発手記（第５章）]()|JSの正規表現備忘録|
|Chapter 06|[Xylole.js開発手記（第６章）]()|テスト諸々|

# 本編
## きっかけ
　私はウェブのセキュリティ問題に対して、普通のエンジニア以上な興味を持っているわけではないが、Xylole.jsが利用した原理が極めてシンプルで、フロント・Node.js界隈のエンジニアであれば、誰でも簡単にできそうであって、勉強と遊びを兼ねて、作っちゃいました。  

## 名前について
　Xylole(キシロール)は[芳香族化合物](https://ja.wikipedia.org/wiki/%E8%8A%B3%E9%A6%99%E6%97%8F%E5%8C%96%E5%90%88%E7%89%A9)の一種、[キシレン](https://ja.wikipedia.org/wiki/%E3%82%AD%E3%82%B7%E3%83%AC%E3%83%B3)のドイツ語です。
芳香族といえば、[ベンゼン](https://ja.wikipedia.org/wiki/%E3%83%99%E3%83%B3%E3%82%BC%E3%83%B3)の亀の甲のような六角形(６員環)は、とても典型的なシンボルと思います。ちょうどNode.jsのシンボルマークも六角形であるため、芳香族化合物の名前で命名しました。
　また、Xyloleを選んだ理由としては、「Cross(X)」と「Console」が組合わせて形成した単語とも見なせるので、その名前にしました。

## 注意
　Xylole.jsは一部コンソールを持たないブラウザ（例えばスマホ版のChromeやほぼ全てのアプリ内ブラウザ）に対して、デバグをより便利にするように開発したツールではありますが、使い方によって不正アクセスに転用することが可能です。ご利用くださった皆様に、公序良俗を害しない使い方で利用しましょう。間違った使い方によって起こした民事または刑事責任は、作者の私は負いかねます。

## ハンズオン
　早速ですが、実際に動かしてみましょう！

* **まずは、最新の推奨版Node.jsをインストールしましょう**
　書きやすいために、サーバー側(Node.js側)では、一部ES2015の書き方で書いていたので、古いバージョン(4.0以下)のNode.jsで使えない可能性があります。
Node.jsのインストールは、[オフィシャルサイト](https://nodejs.org/ja/)でダウンロードしてインストールしてもいいし、バージョン管理ツール[nvm](https://github.com/creationix/nvm)を利用してもいいです。

* **ソースコードのクローン＆パッケージのインストール**  

```sh
$ git clone https://github.com/jerrywdlee/Xylole.git
$ cd Xylole
$ npm install
```

* **サービスの起動**

```sh
$ node socketServer.js
# デフォルトはport:8080を使用するが、下記の書き方で別ポートも使えます
$ node socketServer.js 3000
```  

* **ウェブページにスクリプトを入れる**  
　`localhost:8080`に接続すると、デモページが立ち上がり、その中のリンクをクリックすると、簡単に接続できます。別のページにマウントさせる場合は、以下のスクリプトをアドレス欄に流すとできます。
　ただし、注意点がいくつあります。まず、Safari(PC,スマホ共通)では、安全上な理由でアドレス欄にJavaScriptを実行できないようになっています。Safariでマウントしたい場合は、Bookmarklet化するか、リンクにするかのどちらじゃないと難しいです。
そしてFireFoxとChromeについては、`javascript:`から始まる文言をアドレス欄に貼られた場合、こっそり`javascript:`を取り除くようにしています(PC,スマホ共通)。その時、手動で`javascript:
`を入力すると、普通にマウントできます。

```
javascript:(function(d){var s=d.createElement('script');s.src='https://rawgit.com/jerrywdlee/Xylole/master/src/scripts/remoteScript.js';d.body.appendChild(s)})(document)
```


* **立ち上がったサーバーとつなぐ**  
　もしスクリプトが正しくマウントされたら、```Please Set IO Server's Domain```と入力を促すPromptが出現します。入力する値について、先ほどサーバーを立ち上がった時、```Please input url below into prompt shown in page :```という文言のすぐ下のURLを入れてください。
サーバー再起動するたびに、URLが変わります。
　成功にサーバーとつながった場合、サーバーのコンソール画面につないだページの`Page Info`が黄色で表示されます。一番下の緑色の矢印のところに、JavaScriptの関数等を入力すれば、そのページで実行されます。


## 原理
　Xylole.jsのコアな原理は三つあります。

1. **JavaScriptによるスクリプトの動的追加**  
先ほどアドレス欄に入力したものができたことは、```body```の一番最後に、```<script>```タグを追加し、特殊なJavaScriptファイル一点を読み込んでいました。つまり、これは立派な[XSS(クロスサイトスクリプティング)](https://ja.wikipedia.org/wiki/%E3%82%AF%E3%83%AD%E3%82%B9%E3%82%B5%E3%82%A4%E3%83%88%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%97%E3%83%86%E3%82%A3%E3%83%B3%E3%82%B0)です

2. **Socket.ioによる二方向通信**
　[Socket.io](http://socket.io/)はWeb Socket技術を用いて、サーバーとクライアントの間で二方向通信を実現しました。それで、サーバー側(Node.js側)で、Web Pageを操ることができました。

3. **eval関数による文字列のソースコード変換**
　JavaScriptなどスクリプト言語では、文字列を実行可能なソースコードに変換させ、実行する機能を有しています。Socket.ioによる通信は、基本文字列しか送れません、[eval関数](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/eval)のおかげで、送信された文字列をソースコードに変換され、実行できました。その実行結果は戻り値の```{"result"}```の中に入っています(戻り値のない関数は```{"result"}```が存在しません)。　

## おまけ
* **リソース導入コマンド**
　JavaScriptまたはCSSの導入は、`load`コマンドを使うと便利です。

```sh
# JavaScriptの導入例：
>>> load js https://code.jquery.com/jquery-1.11.1.min.js

# CSSの導入例
>>> load css https://code.jquery.com/mobile/1.4.5/jquery.mobile-1.4.5.min.css
```

* **ページ情報の確認**
　Web Pageとつないだ時、黄色文字でページ情報が表示されます。そのページ情報をもう一度確認したい時は、`info`コマンドが有用です。

```sh
>>> info
<<< ~~~ Page Info ~~~
<<< Page Title: リモート簡易JSコンソール　Xylole.js　開発手記（第０章） - Qiita # ページタイトル
<<< URL       : http://qiita.com/jerrywdlee/private/d8dd49bac43c3b282fdd # ページURL
<<< jQuery Ver: 2.1.4 # jQueryのバージョン、ない時は「No jQuery」が表示されます
<<< Delay     : 148ms # ウェブページとサーバーの間の通信ラグ(往復)
```

* **全ての要素の境界線を表示**
　要素が占める領域の大きさが想定外である理由で、ページレイアウトが崩れることがたまにあります。下記のコマンドを流せば、全ての要素の境界線が見えるようになれます。

```js
// jQuery必要・古いブラウザにも対応
[].forEach.call($("*"),function(a){a.style.outline="1px solid #"+(~~(Math.random()*(1<<24))).toString(16)})

// jQuery不要、IE9以上が必要
document.querySelectorAll("*").forEach(function(a){a.style.outline="1px solid #"+(~~(Math.random()*(1<<24))).toString(16)})
```