## https://github.com

```
default-src 'none';
base-uri 'self';
block-all-mixed-content;
child-src render.githubusercontent.com;
connect-src 'self' uploads.github.com status.github.com collector.githubapp.com api.github.com www.google-analytics.com github-cloud.s3.amazonaws.com wss://live.github.com;
font-src assets-cdn.github.com;
form-action 'self' github.com gist.github.com;
frame-ancestors 'none';
frame-src render.githubusercontent.com;
img-src 'self' data: assets-cdn.github.com identicons.github.com collector.githubapp.com github-cloud.s3.amazonaws.com *.githubusercontent.com;
media-src 'none';
script-src assets-cdn.github.com;
style-src 'unsafe-inline' assets-cdn.github.com
```

## https://www.zhihu.com

```
default-src *;
img-src * data: blob:;
frame-src 'self' *.zhihu.com getpocket.com note.youdao.com read.amazon.cn;
script-src 'self' *.zhihu.com *.google-analytics.com res.wx.qq.com 'unsafe-eval';
style-src 'self' *.zhihu.com 'unsafe-inline';
connect-src * wss:;
```
