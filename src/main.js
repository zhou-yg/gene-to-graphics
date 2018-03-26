import Vue from 'vue'
import App from './App.vue'
import e from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import api from './api.js';

Vue.config.productionTip = false

Vue.use(e)

Vue.use(api);

new Vue({
  render: h => h(App)
}).$mount('#app')
