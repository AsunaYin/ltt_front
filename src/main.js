import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import './plugins/element.js'
import axios from 'axios'

// 全局配置
Vue.prototype.$axios = axios
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: function (h) {
    return h(App)
  }
}).$mount('#app')
