import Vue from 'vue'
import App from './App.vue'
import '@babel/polyfill'
import router from './router'
import store from './store'
import 'ant-design-vue/dist/antd.css'
import Print from 'vue-print-nb'
import moment from 'moment'
import '@/style/index.less'
import 'viewerjs/dist/viewer.css'
import VueViewer from 'v-viewer'
import { formatDate } from '@/utils/format.js'

// import '@/svgIcon/index.js'
import './permission' // 路由守卫即页面权限和按钮权限
import {
  message,
  Modal
} from 'ant-design-vue'

Vue.use(Modal)
Vue.use(Print)
Vue.use(VueViewer)
Vue.prototype.$message = message
Vue.prototype.$moment = moment
Vue.prototype.format = formatDate
Vue.prototype.$confirm = Modal.confirm
Vue.config.productionTip = false
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
