// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios'
import 'style/reset.css'

Vue.use(ElementUI)
var resorceIp = window.location.origin
var viewer;

Vue.config.productionTip = false
Vue.prototype.axios = axios
Vue.prototype.viewer = viewer
Vue.prototype.resorceIp = resorceIp
Vue.prototype.reqIp = 'http://192.168.8.111:8080/bim'

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
