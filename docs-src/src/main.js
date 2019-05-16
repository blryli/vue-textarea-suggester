import Vue from 'vue'
import App from './App.vue'
import VueTextSuggester from '../../'
import MdEditor2 from 'md-editor2'

import '../../dist/vue-textarea-suggester.css'
import 'md-editor2/dist/css/index.css'

Vue.config.productionTip = false

Vue.use(VueTextSuggester)
Vue.use(MdEditor2)

new Vue({
  el: '#app',
  render: h => h(App)
})
