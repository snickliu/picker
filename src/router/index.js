import Vue from 'vue'
import Router from 'vue-router'


import Index from '../pages/Index.vue'
import PlayRule from  '../pages/PlayRule.vue'
import BonusInfo from  '../pages/BonusInfo.vue'
import DetailSetting from  '../pages/DetailSetting.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: '',
      component: Index
    },
    {
      path: '/bonusInfo',
      name: 'bonusInfo',
      component: BonusInfo
    },
    {
      path: '/playRule',
      name: 'playRule',
      component: PlayRule
    },
    {
      path: '/detailSetting',
      name: 'detailSetting',
      component: DetailSetting
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})