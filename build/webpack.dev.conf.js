// 获取 config/index.js 的默认配置
const config = require('../config')

// 使用 webpack
const webpack = require('webpack')

// 使用 webpack 配置合并插件
const merge = require('webpack-merge')

// 使用一些小工具
const utils = require('./utils')

// 加载 webpack.base.conf 基本配置
const baseWebpackConfig = require('./webpack.base.conf')

// 使用 html-webpack-plugin 插件，可自动生成 html 并注入到 .html 文件中
const HtmlWebpackPlugin = require('html-webpack-plugin')

// 使用 friendly-errors-webpack-plugin 插件友好的提示错误信息
const FriendlyErrors = require('friendly-errors-webpack-plugin')

// 将 Hol-reload 相对路径添加到 webpack.base.conf 的对应 entry 前
Object.keys(baseWebpackConfig.entry).forEach(name => {
  baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name])
})

// 将 webpack.dev.conf 的配置和 webpack.base.conf 的配置合并
module.exports = merge(baseWebpackConfig, {
  module: {
    // 使用 styleLoaders
    loaders: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap })
  },

  // eval-source-map 加快开发速度
  // 使用 #eval-source-map 模式作为开发工具
  devtool: '#eval-source-map',

  plugins: [
    // definePlugin 接收字符串插入到代码当中
    new webpack.DefinePlugin({
      'process.env': config.dev.env
    }),
    
    // 为组件分配 ID ，通过这个插件 webpack 可以分析和优先考虑使用最多的模块，并为它们分配最小的 ID
    new webpack.optimize.OccurrenceOrderPlugin(),

    // HotModule 插件在页面进行变更的时候只会重回对应的页面模块，不会重绘整个 html 文件
    new webpack.HotModuleReplacementPlugin(),

    // 使用了 NoErrorsPlugin 后页面中的报错不会阻塞，但会在编译结束后报错
    new webpack.NoErrorsPlugin(),

    // https://github.com/ampedandwired/html-webpack-plugin
    // 将 index.html 作为入口，注入 html 代码后生成 index.html 文件
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    }),

    // 友好的提示错误信息
    new FriendlyErrors()
  ]
})
