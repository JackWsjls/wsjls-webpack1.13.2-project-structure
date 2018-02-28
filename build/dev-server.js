require('./check-versions')();
var config = require('../config');
// process模块用来与当前进程互动，
// 可以通过全局变量process访问，
// 不必使用require命令加载。
// 它是一个EventEmitter对象的实例。
// process对象提供一系列属性，用于返回系统信息。

// process.pid：当前进程的进程号。
// process.version：Node的版本，比如v0.10.18。
// process.platform：当前系统平台，比如Linux。
// process.title：默认值为“node”，可以自定义该值。
// process.argv：当前进程的命令行参数数组。
// process.env：指向当前shell的环境变量，比如process.env.HOME。
// process.execPath：运行当前进程的可执行文件的绝对路径。
// process.stdout：指向标准输出。
// process.stdin：指向标准输入。
// process.stderr：指向标准错误。
// 摘自: http://www.css88.com/archives/4548
if (!process.env.NODE_ENV) process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
var path = require('path');
var express = require('express');
var webpack = require('webpack');
var opn =require('opn');
// http-proxy-middleware 代理中间件 for (connect, express, browser-sync)
var proxyMiddleware = require('http-proxy-middleware');
var webpackConfig = require('./webpack.dev.conf')

// default port where dev server listens for incoming traffic
var port = process.env.PORT || config.dev.port
// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware

var proxyTable = config.dev.proxyTable;

var app = express()
var compiler = webpack(webpackConfig)

// webpack使用webpack-dev-middleware进行热重载
// 需要学习 https://www.cnblogs.com/dreamless/p/6008362.html
var devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  stats: {
    colors: true,
    chunks: false
  }
})

var hotMiddleware = require('webpack-hot-middleware')(compiler)
// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({ action: 'reload' })
    cb()
  })
})

// proxy api requests
Object.keys(proxyTable).forEach(function (context) {
  var options = proxyTable[context]
  if (typeof options === 'string') {
    options = { target: options }
  }
  app.use(proxyMiddleware(context, options))
})

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')())

// serve webpack bundle output
app.use(devMiddleware)

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware)

// serve pure static assets
var staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
app.use(staticPath, express.static('./static'))

module.exports = app.listen(port, function (err) {
  if (err) {
    console.log(err)
    return
  }
  var uri = 'http://localhost:' + port
  console.log('Listening at ' + uri + '\n')

  // when env is testing, don't need open it
  if (process.env.NODE_ENV !== 'testing') {
    opn(uri)
  }
})