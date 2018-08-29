import Vue from 'vue'
import App from './App.vue'
import router from './router'
import server from './server'
import Loading from './common/ui/Loading'
import store from './store'
import viewport from './common/lib/viewport'
import KsHeader from './common/components/Header.vue'
import Toast from './common/ui/Toast'

Vue.config.productionTip = false
viewport.init()
Vue.prototype.$server = server
Vue.prototype.$loading = Loading
Vue.prototype.$toast = Toast
Vue.component('KsHeader', KsHeader)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
