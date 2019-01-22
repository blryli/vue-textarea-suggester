import Suggester from './suggester';

/* istanbul ignore next */
Suggester.install = function(Vue) {
  Vue.component(Suggester.name, Suggester);
};

export default Suggester;
