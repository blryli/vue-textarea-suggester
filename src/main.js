import Vue from 'vue'
import App from './App.vue'
import VueTextSuggester from './lib'

Vue.use(VueTextSuggester)

new Vue({
  el: '#app',
  render: h => h(App)
})
