import Vue from 'vue'
import Vuex from 'vuex'

import PITCHER_SETTING from './pitcherSetting'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    PITCHER_SETTING,
    PITCHER_DATA: [],
    PITCHER_ERROR: true
  },
  mutations: {
    UPDATE_PITCHER_DATA (state, payload) {
      state.PITCHER_DATA = payload
    },
    UPDATE_PITCHER_ERROR (state, payload) {
      state.PITCHER_ERROR = payload
    }
  },
  actions: {
    REGISTER_PITCHER_DATA ({ commit }, payload) {
      localStorage.setItem('PITCHER_DATA', JSON.stringify(payload))
      commit('UPDATE_PITCHER_DATA', payload)
    }
  }
})
