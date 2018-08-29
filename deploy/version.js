const childProcess = require('child_process')
const ora = require('ora')

const update = (deployType) => {
  let cmd = deployType === 'test' ? 'npm version prerelease': 'npm version prepatch'
  const spinner = ora()
  return new Promise((resolve, reject) => {
    childProcess.exec(cmd, function (err) {
      if (err) {
        reject(err.message)
        spinner.fail(`项目版本更新失败： ${err.cmd}`)
        spinner.fail('请查看是不是git有未commit的内容；如果有，请先commit，然后再次运行脚本')
      } else {
        resolve(deployType)
      }
      const PKG = require('../package.json')
      spinner.info(`当前版本:${PKG.version}`)
    })
  })
}

module.exports = {
  update
}