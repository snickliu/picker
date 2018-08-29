const config = require('./index')
const utils = require('./utils')

/*
  设置打包之后文件路径
*/
const setPublicPath = (webpackConfig, config) => {
  const isDeploy = process.argv[3] === 'deploy'
  const dirName = process.argv[4]
  let _path = ''
  if (isDeploy) {
    _path = config.deploy.publicPath + dirName
  }
  webpackConfig.output.publicPath(_path + '/')
}

const initDefault = (webpackConfig) => {

  // 配置 简称
  let webpackChain = webpackConfig.resolve.alias.delete('@').set('vue$', 'vue/dist/vue.js')
  if (config.alias) {
    for (let key in config.alias) {
      webpackChain.set(key, utils.resolveDir(config.alias[key]))
    }
  }
}

/*
  配置开发环境
*/
const initDevelopment = (webpackConfig) => {
  // 修改source-map方式
  webpackConfig.devtool('cheap-module-source-map')
}

/*
  配置线上环境
*/
const initProduction = (webpackConfig) => {
  // publicpath
  setPublicPath(webpackConfig, config)
  webpackConfig.devtool(false)

  // 配置js路径
  webpackConfig.output.filename(utils.assetsPath('js/[name].[chunkhash:8].js'))
  webpackConfig.output.chunkFilename(utils.assetsPath('js/[id].[chunkhash:8].js'))

  // 配置图片路径
  webpackConfig.module.rule('images').use('url-loader').tap(opt => {
    opt.name = utils.assetsPath('img/[name].[hash:8].[ext]')
    return opt
  })

  // 配置字体路径
  webpackConfig.module.rule('fonts').use('url-loader').tap(opt => {
    opt.name = utils.assetsPath('fonts/[name].[hash:8].[ext]')
    return opt
  })

  // 配置css路径
  webpackConfig.plugin('extract-css').tap((opt) => {
    return [{
      filename: utils.assetsPath('css/[name].[chunkhash:8].css'),
      allChunks: true
    }]
  })

  webpackConfig.plugin('copy').tap(opt => {
    return [[{
      from: utils.resolveDir('../public'),
      to: utils.resolveDir('../dist/static'),
      ignore: ['index.html', '.DS_Store']
    }]]
  })
}

const init = (webpackConfig) => {
  initDefault(webpackConfig)
  if (process.env.NODE_ENV === 'production') {
    initProduction(webpackConfig)
  } else {
    initDevelopment(webpackConfig)
  }
}

module.exports = {
  init
}
