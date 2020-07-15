import Vue from 'vue'

// import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
// import 'bootstrap-vue/dist/bootstrap-vue.css'

import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'

import Multiselect from 'vue-multiselect'

import VueNumberInput from '@chenfengyuan/vue-number-input'

import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/default.css'

// import SelectComponent from './components/SelectComponent.vue'

import App from './App.vue'
import store from './store/dataStore.js'
import vuetify from './plugins/vuetify'

import { Line } from 'vue-chartjs'

// Vue.use(BootstrapVue)
Vue.config.productionTip = false

Vue.component('v-line', Line)

Vue.component('v-select', vSelect)

Vue.component('v-number-input', VueNumberInput)

Vue.component('v-multiselect', Multiselect)

Vue.component('v-slider', VueSlider)

new Vue({
  render: (h) => h(App),
  vuetify,
  store: store,
}).$mount('#app')
