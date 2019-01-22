/* jshint esversion: 6 */
import Suggester from './suggester';

const components = [
  Suggester
];

const VueTextSuggester = function (Vue, opts = {}) {
  components.forEach(component => {
    Vue.component(component.name, component);
  });

}

if (typeof window !== 'undefined' && window.Vue) {
  VueTextSuggester(window.Vue);
}

export default VueTextSuggester
