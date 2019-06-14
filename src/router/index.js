import Vue from 'vue'
import Router from 'vue-router'
import IndexHome from '../components/index/Home.vue'
import EnergyHome from '../components/energy/Home.vue'
Vue.use(Router)

export default new Router({
  routes: [
    { path:'/',name: 'IndexHome',component:IndexHome },
    { path:'/energy',name: 'EnergyHome',component: EnergyHome}
  ]
})
