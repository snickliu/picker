const ora = require('ora')
const utils = require('./utils')

function upload({deployType, ossDir, sourceDir, ossClient}) {
  const sourceFiles = utils.getSourceFiles(sourceDir)
  let total = sourceFiles.length
  let done = 0
  const time = Date.now()
  const spinner = ora('上传OSS...').start()
  return new Promise((resolve, reject) => {
    sourceFiles.forEach(fileName => {
      const ossFileName = fileName.replace(sourceDir, ossDir + '/' + deployType)
      console.log(ossFileName)
      ossClient.put(ossFileName, fileName).then(res => {
        spinner.text = `==> ${++done / total * 100}%`
        if (done === total) {
          spinner.succeed(`上传完成！耗时:${Date.now() - time}ms`)
          resolve()
        }
      }).catch (err => {
        spinner.fail('上传OSS错误')
        reject(err)
      })
    })
  })
}

module.exports = upload