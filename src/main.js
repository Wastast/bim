// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios'
import 'style/reset.css'
import store from './store';
import Cesium from 'cesium/Cesium'
import 'cesium/Widgets/widgets.css'


Vue.use(ElementUI)
var resorceIp = window.location.origin
var viewer = null;

window.viewer = viewer
window.Cesium = Cesium

Vue.config.productionTip = false
Vue.prototype.axios = axios
// Vue.prototype.Cesium = Cesium
Vue.prototype.resorceIp = resorceIp
Vue.prototype.reqIp = 'http://192.168.8.111:8080/bim'

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
