import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
export default new Vuex.Store({
  state:{
    titlestArr: [],
    nowBuild:'',
  },
  mutations: {
    setTitlest (state, data) {
      state.titlestArr.push(data)
    },
    setnowBuild (state, data) {
      state.nowBuild = data
    }
  }
})