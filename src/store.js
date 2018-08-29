import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    timeStampDelay: 0,
    token: null,
    identity: null
  },

  getters: {
    token: state => state.token,
    identity: state => state.identity
  },

  mutations: {
    UPDATE_TIMESTAMPDELAY (state, timeStampDelay) {
      state.timeStampDelay = timeStampDelay
    },

    UPDATE_ACCESSINFO (state, {token, identity}) {
      state.token = token
      state.identity = identity
    }
  }
})
