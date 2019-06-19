import Vue from 'vue'
import Router from 'vue-router'
// import IndexHome from '../components/index/Home.vue'
// import EnergyHome from '../components/energy/Home.vue'
Vue.use(Router)

export default new Router({
  routes: [
    { path:'/',name: 'guideHome', component:()=> import('../components/Guide/Home.vue') },
    { path:'/bim',name: 'BIMHome', component:()=> import('../components/BIM/Home.vue') },
    { path:'/energy',name: 'EnergyHome', component:()=> import('../components/energy/Home.vue')}
  ]
})