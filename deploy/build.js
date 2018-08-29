const ora = require('ora')
const childProcess = require('child_process')

function build(deployType) {
  const time = Date.now()
  const spinner = ora('正在打包...').start()
  return new Promise((resolve, reject) => {
    childProcess.exec(`vue-cli-service build deploy ${deployType}`, function (err) {
      if (err) {
        spinner.fail('打包报错，请重新打包')
        reject(err.message)
      } else {
        spinner.succeed(`打包完成，耗时:${Date.now() - time}ms`)
        resolve(deployType)
      }
    })
  })
}

module.exports = build