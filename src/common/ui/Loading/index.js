import Loading from './Loading.vue'
import Vue from 'vue'

const Instance = new Vue({
  render (h) {
    return h(Loading)
  }
})

const component = Instance.$mount()
document.body.appendChild(component.$el)
const $loading = Instance.$children[0]

export default $loading
