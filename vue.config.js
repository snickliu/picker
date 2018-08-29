const fs = require('fs')
const webpackConfig = require('./config/webpack')
const userConfig = require('./config')

let scssData = ''
userConfig.globalScss.forEach(file => {
  scssData += fs.readFileSync(file, 'utf-8')
})

module.exports = {
  lintOnSave: 'error',
  productionSourceMap: false,

  css: {
    loaderOptions: {
      sass: {
        data: scssData
      }
    }
  },

  // 代理
  devServer: {
    proxy: {
      '/api': {
        target: 'https://www.baidu.com/',
        changeOrigin: true
      }
    }
  },

  chainWebpack: config => {
    webpackConfig.init(config)
  }
}
