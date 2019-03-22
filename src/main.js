import Vue from 'vue'
import App from './App.vue'
import vueCalender from './lib/index'
// 注册组件库
Vue.use(vueCalender)
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
