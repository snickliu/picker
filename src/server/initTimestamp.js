/*
  获取服务器时间戳
*/
import axios from 'axios'
import config from './config'
import api from './api'
import store from '../store'

export default () => {
  const _now = Date.now()
  return new Promise((resolve, reject) => {
    axios.post(api.timestamp, {timeout: config.timeout}).then(res => {
      try {
        store.commit('UPDATE_TIMESTAMPDELAY', res.data.data.timestamp - _now)
        resolve()
      } catch (err) {
        reject(res)
      }
    }).catch(err => {
      reject(err)
    })
  })
}
