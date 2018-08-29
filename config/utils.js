const path = require('path')

const resolveDir = (dir) => {
  return path.join(__dirname, dir)
}

const assetsPath = (_path) => {
  return path.posix.join('static', _path)
}

module.exports = {
  resolveDir,
  assetsPath
}
