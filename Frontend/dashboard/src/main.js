import Vue from 'vue'

import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'

import Multiselect from 'vue-multiselect'

import VueNumberInput from '@chenfengyuan/vue-number-input'

// import SelectComponent from './components/SelectComponent.vue'

import App from './App.vue'
import store from './store/dataStore.js'

Vue.use(BootstrapVue)
Vue.config.productionTip = false

Vue.component('v-select', vSelect)

Vue.component('v-number-input', VueNumberInput)

Vue.component('v-multiselect', Multiselect)

new Vue({
  render: h => h(App),
  store: store
}).$mount('#app')
