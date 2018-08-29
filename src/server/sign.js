import md5 from 'md5'

import isArray from 'lodash/isArray'
import isObject from 'lodash/isObject'

// 排序并且序列化字符串
const sortNstringify = (data, str = '') => {
  if (isObject(data)) {
    Object.keys(data).sort().forEach(key => {
      str += ',"' + key + '":' + sortNstringify(data[key])
    })
    return '{' + str.substr(1) + '}'
  } else if (isArray(data)) {
    data.forEach(item => {
      str += ',' + sortNstringify(item)
    })
    return '[' + str.substr(1) + ']'
  } else {
    return JSON.stringify(data)
  }
}

export default (data, timestamp) => {
  let sign = ''
  Object.keys({
    ...data,
    timestamp,
    nonce: timestamp
  }).sort().forEach(key => {
    // 空数据 就不加入
    if (typeof data[key] !== 'undefined' && data[key] !== '') {
      sign += `&${key}=${sortNstringify(data[key])}`
    }
  })
  sign = sign.substr(1)

  return md5(sign + process.env.VUE_APP_SING_KEY)
}
