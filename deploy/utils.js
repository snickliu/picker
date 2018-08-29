const crypto = require('crypto')
const key = 'Picker'
const fs = require('fs')

const cipher = (data, cb) => {
  let encrypted = ''
  const cip = crypto.createCipher('aes-256-cbc', key)
  encrypted += cip.update(data, 'binary', 'hex')
  encrypted += cip.final('hex')
  !!cb && cb(encrypted)
}

const decipher = (encrypted, cb) => {
  let decrypted = ''
  const decipher = crypto.createDecipher('aes-256-cbc', key)
  decrypted += decipher.update(encrypted, 'hex', 'binary')
  decrypted += decipher.final('binary')
  !!cb && cb(decrypted)
}

const getSourceFiles = (source) => {
  let res = []
  const files = fs.readdirSync(source)
  files.forEach(function (file) {
    const pathname = source + '/' + file
    const stat = fs.lstatSync(pathname)
    if (!stat.isDirectory()) {
      res.push(pathname)
    } else {
      res = res.concat(getSourceFiles(pathname))
    }
  })
  return res
}

module.exports = {
  getSourceFiles,
  cipher,
  decipher
}