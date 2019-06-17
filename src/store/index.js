import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
export default new Vuex.Store({
  state:{
    titlestArr: [],
    nowBuild:{
      id:"30fe9d0f506849349e6b20f685b69dfb",
    },
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