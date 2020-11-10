import Vue from 'vue'
import App from './App.vue'
import abkIntro from './build'
Vue.config.productionTip = false
Vue.use(abkIntro)
new Vue({
  render: h => h(App),
}).$mount('#app')
