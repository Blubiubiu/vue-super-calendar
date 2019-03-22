import Vue from 'vue'
import App from './App.vue'

import FastClick from 'fastclick'

if ('addEventListener' in document) { 
     document.addEventListener('DOMContentLoaded', function() { 
         FastClick.attach(document.body);
      }, false);  
} 

Vue.config.productionTip = false
new Vue({
  render: h => h(App),
}).$mount('#app')
