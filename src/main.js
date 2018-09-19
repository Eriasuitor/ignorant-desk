import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './router/router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue'
import iView from 'iview';
import 'iview/dist/styles/iview.css';

const router = new VueRouter({
  routes,
  mode: 'history',
})

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(VueRouter)
Vue.use(iView);

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
