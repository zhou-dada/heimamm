// 导入Vue
import Vue from 'vue'

// 导入路由
import VueRouter from 'vue-router'

// 注册路由
Vue.use(VueRouter)

// 导入NProgress进度条包
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'  //NProgress的css样式  必须引入

// 准备组件
import login from '../views/login/login.vue'
import index from '../views/index/index.vue'

// 子路由
import user from '../views/index/user/user.vue'
import chart from '../views/index/chart/chart.vue'
import question from '../views/index/question/question.vue'
import business from '../views/index/business/business.vue'
import subject from '../views/index/subject/subject.vue'

// 这只路由规则
const routes = [{
    path: '/',
    component: login
  },
  {
    path: '/index',
    component: index,
    children: [
      {
      // 子路由一般不加/
      path: 'user',
      component: user
    },
    {
      path: 'question',
      component: question
    },
    {
      path: 'chart',
      component: chart
    },
    {
      path: 'subject',
      component: subject
    },
    {
      path: 'business',
      component: business
    },
  
  ]
  },
]

// 创建路由对象
const router = new VueRouter({
  routes
})

// 导航守卫 在跳转路由之前调用的钩子
router.beforeEach((to, from, next) => {
  next()  // 允许放行
  NProgress.start()
})
// 在跳转之后调用的钩子
router.afterEach(() => {
  NProgress.done()
})

// 暴露出去
export default router