import Vue from 'vue';
// eslint-disable-next-line
import VueScrollTo from './vue-scrollto3/index.js';
import App from './App.vue';

Vue.config.productionTip = false;

Vue.use(VueScrollTo);

new Vue({
  render: h => h(App),
}).$mount('#app');
