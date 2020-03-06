import Vue from 'vue'
import App from './App.vue'
// 导入路由对象 默认会优先找js文件
import router from './router/index'
// 导入vuex对象
import store from '@/store/index.js'
// 导入全局过滤器
// 我们这个文件只需要保证能够执行里面的代码就行了
// 所以就只是简单导入
import '@/filter/filter.js'

// 导入学科组件
import subjectSelect from './components/subjectSelect.vue'
Vue.component('subjectSelect',subjectSelect)
// 导入企业组件
import businessSelect from './components/businessSelect.vue'
Vue.component('businessSelect',businessSelect)

// 导入element-ui
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);
// 导入全局样式css
import './style/base.css'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
