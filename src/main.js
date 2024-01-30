import Vue from 'vue'
import ElementUI from 'element-ui';
import axios from './axios'
import 'element-ui/lib/theme-chalk/index.css';
import dataV from '@jiaminghi/data-view'
import router from './router.js';
import { website } from '@/config.js'
import draggable from '@/views/components/draggable'
import { loadScript } from '@/utils/utils'
import App from './App.vue'
import './styles/common.scss'
import '@/utils/es6'
// import '@/mock/'
//导入主题文件
import '@/theme/index.js'

// 自定义按钮权限指令
import permission from "@/directive/permission";
Vue.use(permission)
//eventBus挂载
Vue.prototype.$eventBus = new Vue()

import i18n from './lang' // internationalization
const jnpf = require('./utils/jnpf').default
Vue.use(ElementUI, {
  size: jnpf.storageGet('size') || 'small', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value)
})

// 批量引入组件
import components from './components'
Vue.use(components)

// 添加实例属性
Object.assign(Vue.prototype, {
  // define: require('./utils/define'), // 常量
  jnpf, // 公共方法
  // formValidate: require('./utils/formValidate').default, // 表单验证
  // $message: message
})

Vue.config.productionTip = false
window.axios = axios;
window.$loadScript = loadScript;
document.title = website.title
// Vue.use(ElementUI);
Vue.use(window.AVUE);
Vue.component('avue-draggable', draggable)
Vue.prototype.$website = website;
Vue.use(dataV)
new Vue({
  router,
  i18n,
  render: h => h(App)
}).$mount('#app')
