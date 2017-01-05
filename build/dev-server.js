// 检查 Node 和 npm 版本
require('./check-versions')()

// 获取 config/index.js 的默认配置
const config = require('../config')

// 如果 Node 的环境无法判断当前是 dev / product 环境
// 使用 config.dev.env.NODE_ENV 作为当前的环境
if (!process.env.NODE_ENV) process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)

// 使用 NodeJS 自带的文件路径工具
const path = require('path')

// 使用 express 搭建 Node 服务器
const express = require('express')

// 使用 webpack
const webpack = require('webpack')

// 一个可以强制打开浏览器并跳转到指定 url 的插件
const opn = require('opn')

// 使用 proxyTable 代理
const proxyMiddleware = require('http-proxy-middleware')

// 使用 dev 环境的 webpack 配置
const webpackConfig = require('./webpack.dev.conf')

// 如果没有指定运行端口，使用 config.dev.port 作为运行端口
const port = process.env.PORT || config.dev.port

// 使用 config.env.proxyTable 的配置作为 proxyTable 的代理配置
const proxyTable = config.dev.proxyTable

// 使用 express 启动一个服务
const app = express()

// 启动 webpack 进行编译
const compiler = webpack(webpackConfig)

// 启动 webpack-dev-middleware，将编译后的文件暂存到内存中
const devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  quiet: true
})

// 启动 webpack-hot-middleware，Hot-reload
const hotMiddleware = require('webpack-hot-middleware')(compiler, {
  log: () => {}
})

// 当 html-webpack-plugin 模板更改时强制页面重新加载
compiler.plugin('compilation', compilation => {
  compilation.plugin('html-webpack-plugin-after-emit', (data, cb) => {
    hotMiddleware.publish({ action: 'reload' })
    cb()
  })
})

// 将 proxyTable 中的请求配置挂载到启动的 express 服务上
Object.keys(proxyTable).forEach(context => {
  let options = proxyTable[context]
  if (typeof options === 'string') {
    options = { target: options }
  }
  app.use(proxyMiddleware(context, options))
})

// 使用 connect-history-api-fallback 匹配资源，如果不匹配就可以重定向指定地址
app.use(require('connect-history-api-fallback')())

// 将暂存到内存中的 webpack 编译后的文件挂载到 express 服务上
app.use(devMiddleware)

// 将 Hot-reload 挂载到 express 服务上
app.use(hotMiddleware)

// 拼接 static 文件夹的静态资源路径
const staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)

// 为静态资源提供响应服务
app.use(staticPath, express.static('./static'))

// 访问路径
const uri = 'http://localhost:' + port

// 在捆绑包有效或再次有效之后执行回调
devMiddleware.waitUntilValid(() => {
  console.log('> Listening at ' + uri + '\n')
})

// 让我们这个 express 服务监听 port 的请求，并且将此服务作为 dev-server.js 的接口暴露
module.exports = app.listen(port, err => {
  if (err) {
    console.log(err)
    return
  }

  // when env is testing, don't need open it
  // 如果不是测试环境，自动打开浏览器并跳到我们的开发地址
  if (process.env.NODE_ENV !== 'testing') {
    opn(uri)
  }
})
