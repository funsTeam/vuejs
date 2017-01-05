// 使用 NodeJS 自带的文件路径工具
const path = require('path')

// 获取 config/index.js 的默认配置
const config = require('../config')

// 使用一些小工具
const utils = require('./utils')

// 拼接工作区路径为一个绝对路径
const projectRoot = path.resolve(__dirname, '../')

// 将 NodeJS 环境作为我们的编译环境
const env = process.env.NODE_ENV

// check env & config/index.js to decide whether to enable CSS source maps for the
// various preprocessor loaders added to vue-loader at the end of this file

// 是否在 dev 环境下开启 cssSourceMap ，在 config/index.js 中可配置
const cssSourceMapDev = (env === 'development' && config.dev.cssSourceMap)

// 是否在 production 环境下开启 cssSourceMap ，在 config/index.js 中可配置
const cssSourceMapProd = (env === 'production' && config.build.productionSourceMap)

// 最终是否使用 cssSourceMap
const useCssSourceMap = cssSourceMapDev || cssSourceMapProd

module.exports = {
  entry: {
    // 编译文件入口
    app: './src/main.js'
  },
  output: {
    // 编译输出的根路径
    path: config.build.assetsRoot,

    // 正式发布环境下编译输出的发布路径
    publicPath: process.env.NODE_ENV === 'production' ? config.build.assetsPublicPath : config.dev.assetsPublicPath,
    
    // 编译输出的文件名
    filename: '[name].js'
  },
  resolve: {
    // 自动补全的扩展名
    extensions: ['', '.js', '.vue', '.json'],

    // 不进行自动补全或处理的文件或者文件夹
    fallback: [path.join(__dirname, '../node_modules')],

    // 默认路径代理，例如 import Vue from 'vue'，会自动到 'vue/dist/vue.common.js'中寻找
    alias: {
      'vue$': 'vue/dist/vue.common.js',
      'src': path.resolve(__dirname, '../src'),
      'assets': path.resolve(__dirname, '../src/assets'),
      'components': path.resolve(__dirname, '../src/components')
    }
  },
  resolveLoader: {
    fallback: [path.join(__dirname, '../node_modules')]
  },
  module: {
    loaders: [
      // 需要处理的文件及使用的 loader
      {
        test: /\.vue$/,
        loader: 'vue'
      },
      {
        test: /\.js$/,
        loader: 'babel',
        include: [
          path.join(projectRoot, 'src')
        ],
        exclude: /node_modules/
      },
      {
        test: /\.json$/,
        loader: 'json'
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url',
        query: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url',
        query: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  vue: {
    // .vue 文件配置 loader 及工具 (autoprefixer)
    loaders: utils.cssLoaders({ sourceMap: useCssSourceMap }),
    postcss: [
      require('autoprefixer')({
        browsers: ['last 2 versions']
      })
    ]
  }
}
