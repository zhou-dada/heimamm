// 导入Vue
import Vue from 'vue'

// 导入路由
import VueRouter from 'vue-router'

// 注册路由
Vue.use(VueRouter)
// 导入vuex实例对象
import store from '@/store/index.js'

// 导入NProgress进度条包
import NProgress from 'nprogress'
import 'nprogress/nprogress.css' //NProgress的css样式  必须引入

// 单独引用消息提示框
import {
  Message
} from 'element-ui';

// 调用获取页面详情接口
import {
  get_user
} from '@/api/index.js'

// 删除token
import {
  removeToken
} from '@/utilis/token.js'

// 导入子路由组件
import childrenRouter from './childrenRouter'

// 准备组件
import login from '../views/login/login.vue'
import index from '../views/index/index.vue'

// 这只路由规则
const routes = [{
    path: '/login',
    component: login,
    meta: {
      title: '登录',
      roles: ['超级管理员', '管理员', '老师', '学生']
    }
  },
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/index',
    component: index,
    meta: {
      title: '首页',
      roles: ['超级管理员', '管理员', '老师', '学生']
    },
    children: childrenRouter
  },
]

// 创建路由对象
const router = new VueRouter({
  routes
})


// 定义白名单
let whiteUrl = ['/login', '/zhuce', '.guanggao']

// 导航守卫 在跳转路由之前调用的钩子
router.beforeEach((to, from, next) => {
  NProgress.start() // 开始滚动条
  // 路由白名单，里面存放了一些不需要做权限验证的路径，遇到这些白名单里的路径就直接跳转
  if (whiteUrl.includes(to.path)) {
    next()
  } else {
    // 判断token是否正确
    get_user().then(res => {
      if (res.data.code == 200) {
        console.log(res);
        // 判断是否有权限 
        if (res.data.data.status == 1) {
          // 这里不是vue 所以不能用this.$store.commit()  所以我们需要导入vuex
          // 如果token正确的话  将头像地址存入 vuex仓库中
          store.commit('changeAvatar', process.env.VUE_APP_URL + '/' + res.data.data.avatar)
          // 将用户姓名存入到全局vuex仓库中
          store.commit('changeUsername', res.data.data.username)
          // 将角色存入到全局vuex仓库中
          store.commit('changeRole', res.data.data.role)


          // 从登录跳过来的，才提示登录成功
          if (from.path == '/login') {

            Message.success('登录成功')
          }
          // 判断有没有权限访问某些界面
          if (to.meta.roles.includes(res.data.data.role)) {
            next()
          } else {
            Message.warning('该页面,您无法访问')
            // 手动在这里把进度条完成
            NProgress.done();
            next(from.path)
          }
        } else {
          Message.error('你的权限已被禁止,请去找管理员')
          next('/login')
          // 手动在这里把进度条完成
          NProgress.done();
        }

      } else {
        // this.$message.error('登录状态有问题，请重新登录')
        Message.error('登录状态有问题，请重新登录！')

        //删除本地token
        removeToken();

        // 手动在这里把进度条完成
        NProgress.done();

        //打回登录页
        next('/login')
      }
    })
  }
})
// 在跳转之后调用的钩子

// to  要往哪里去
router.afterEach((to) => {
  NProgress.done()

  // 取出当前要去页面的标签  设置给title
  document.title = to.meta.title
})

// 暴露出去
export default router