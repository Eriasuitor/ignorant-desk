import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './router/router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue'
import iView from 'iview';
import 'iview/dist/styles/iview.css';
import landingShip from './api'

import VueQuillEditor from 'vue-quill-editor'
// require styles 引入样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import './assets/icon/iconfont.css'

const router = new VueRouter({
  routes,
  mode: 'history',
})

Vue.prototype.landingShip = landingShip
Vue.prototype.landingMat = 'http://120.78.93.110:8090'

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(VueRouter)
Vue.use(iView)
Vue.use(VueQuillEditor)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
