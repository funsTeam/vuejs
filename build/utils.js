// 使用 Nodejs 自带的文件路径工具
const path = require('path')

// 获取 config/index.js 的默认配置
const config = require('../config')

// 使用 extract-text-webpack-plugin 打包成单个 css 文件
const ExtractTextPlugin = require('extract-text-webpack-plugin')

// 输出静态资源文件路径
exports.assetsPath = _path => {
  let assetsSubDirectory = process.env.NODE_ENV === 'production'
    ? config.build.assetsSubDirectory
    : config.dev.assetsSubDirectory
  return path.posix.join(assetsSubDirectory, _path)
}

// 输出 .vue 文件样式 loader 方式
exports.cssLoaders = options => {
  options = options || {}
  // generate loader string to be used with extract text plugin
  let generateLoaders = loaders => {
    let sourceLoader = loaders.map(loader => {
      let extraParamChar
      if (/\?/.test(loader)) {
        loader = loader.replace(/\?/, '-loader?')
        extraParamChar = '&'
      } else {
        loader = loader + '-loader'
        extraParamChar = '?'
      }
      return loader + (options.sourceMap ? `${extraParamChar}sourceMap` : '')
    }).join('!')

    // Extract CSS when that option is specified
    // (which is the case during production build)
    if (options.extract) {
      return ExtractTextPlugin.extract('vue-style-loader', sourceLoader)
    } else {
      return ['vue-style-loader', sourceLoader].join('!')
    }
  }

  // http://vuejs.github.io/vue-loader/en/configurations/extract-css.html
  return {
    css: generateLoaders(['css']),
    postcss: generateLoaders(['css']),
    less: generateLoaders(['css', 'less']),
    sass: generateLoaders(['css', 'sass?indentedSyntax']),
    scss: generateLoaders(['css', 'sass']),
    stylus: generateLoaders(['css', 'stylus']),
    styl: generateLoaders(['css', 'stylus'])
  }
}

// Generate loaders for standalone style files (outside of .vue)
// 输出 .vue 文件以外的文件样式 loader 方式
exports.styleLoaders = options => {
  let output = []
  let loaders = exports.cssLoaders(options)
  for (let extension in loaders) {
    let loader = loaders[extension]
    output.push({
      test: new RegExp(`\\.${extension}$`),
      loader: loader
    })
  }
  return output
}
