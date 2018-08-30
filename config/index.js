module.exports = {
  // 打包路径配置
  deploy: {
    publicPath: ''
  },

  // 全局scss文件
  globalScss: [
    // '../src/assets/styles/var.scss',
    // '../src/assets/styles/border.scss'
  ],

  // alias 简写
  alias: {
    'SRC': '../src',
    'ASSETS': '../src/assets',
    'STYLES': '../src/assets/styles',
    'IMAGES': '../src/assets/images',
    'LIB': '../src/common/lib',
    'UI': '../src/common/ui',
    'COMPONENTS': '../src/common/components'
  }
}
