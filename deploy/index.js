const inquirer = require('inquirer')
const OSS = require('ali-oss')

const version = require('./version')
const build = require('./build')
const upload = require('./upload')

const config = require('./config')

const Q = [{
    type: 'list',
    name: 'type',
    message: `选择您要发布的的版本`,
    choices: config.deployTypes,
    default: config.deployTypes[0]
}]
const ossClient = new OSS.Wrapper(config.oss)

let deployType = ''

inquirer.prompt(Q).then(answers => {
  deployType = answers.type
  return build(deployType)
}).then(() => {
  return upload({
    deployType: deployType,
    ossDir: config.ossDir,
    sourceDir: config.sourceDir,
    ossClient
  })
}).then(() => {
  return version.update(deployType)
}).catch(err => {
  console.log(err)
  process.exit(1)
})
