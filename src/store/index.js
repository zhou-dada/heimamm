import Vue from 'vue'

// // 导入vuex
import Vuex from 'vuex'
Vue.use(Vuex) // 使用vuex


/* 路由前调用一次用户信息  加载时调用一次用户信息 
   为了优化代码 使用vuex全局仓库
   在路由的时候将信息保存到这里  加载的时候直接调用 
*/

// 创建vuex对象
const store = new Vuex.Store({
  state: {
    // 头像
    avatar: '',
    // 用户名
    username: '',
    // 角色
    role:''
  },
  mutations: {
    // 专门修改头像的方法
    changeAvatar(state, val) {
      state.avatar = val
    },
    // 专门修改用户名的方法
    changeUsername(state, val) {
      state.username = val
    },
    // 专门修改角色的方法
    changeRole(state,val){
      state.role=val
    }
  }
})

// 暴露出去
export default store