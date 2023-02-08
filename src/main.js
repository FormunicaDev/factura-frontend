import '@/plugins/vue-composition-api'
import '@/styles/styles.scss'
import axios from 'axios'
import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'
import store from './store'

axios.defaults.baseURL = 'http://localhost:5144'

// axios.defaults.baseURL = 'http://10.10.0.16:8085'
axios.defaults.headers.common.Authorization = sessionStorage.getItem('tokenFormunica')

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App),
}).$mount('#app')
