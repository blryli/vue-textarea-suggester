import Vue from 'vue'
import App from './App.vue'
import VueTextSuggester from './lib'
import MdEditor2 from 'md-editor2'

import 'md-editor2/dist/css/index.css'

Vue.use(VueTextSuggester)
Vue.use(MdEditor2)

new Vue({
  el: '#app',
  render: h => h(App)
})
