import Toast from './Toast.vue'
import Vue from 'vue'

let toastPool = []

export default (params) => {
  let options = {}
  if (typeof params === 'string') {
    options.message = params
  } else if (typeof params === 'object') {
    options = params
  }

  if (options.type === 'loading') {
    options.duration = 0
  }

  let _toast
  if (!toastPool.length) {
    const Instance = new Vue({
      render (h) {
        return h(Toast)
      }
    })

    const component = Instance.$mount()
    document.body.appendChild(component.$el)
    _toast = Instance.$children[0]
  } else {
    _toast = toastPool.pop()
  }

  return new Promise((resolve) => {
    _toast.show(options).then(() => {
      toastPool.push(_toast)
      resolve()
    })
  })
}
