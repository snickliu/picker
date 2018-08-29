import axios from 'axios'
import api from './api'
import initTimestamp from './initTimestamp'
import signData from './sign'
import config from './config'
import store from '../store'

const randomString = (type) => {
  return type.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}


const fetch = (apiName, data = {}) => {
  return new Promise((resolve, reject) => {
    const _url = api[apiName]

    if (!apiName || !_url) {
      reject(new Error('请输入请求正确的地址'))
      return false
    }

    const timestamp = Date.now() + store.state.timeStampDelay
    const nonce = timestamp + randomString('-xxyxxyxx')
    const sign = signData(data, timestamp, nonce)

    const headers = {
      Sign: sign
    }

    if (store.state.token) {
      headers['Auth-Token'] = store.state.token
    }

    if (store.state.identity) {
      headers['Auth-Identity'] = store.state.identity
    }

    axios({
      timeout: config['timeout'],
      withCredentials: config['withCredentials'],
      url: _url,
      method: 'post',
      headers,
      data: {
        ...data,
        timestamp,
        nonce
      }
    }).then(res => {
      if (res.status === config.successCode || res.data.errorcode === config.successCode) {
        resolve(res.data.data)
      } else {
        reject(res)
      }
    }).catch(err => {
      reject(err)
    })
  })
}

export default {
  fetch,
  initTimestamp
}
