import axios from 'axios'

const userObj = axios.create({
    baseURL: process.env.VUE_APP_URL,
    withCredentials: true
})

// 导入token
import {
    getToken
} from '@/utilis/token.js'

// 添加请求拦截器
userObj.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    config.headers.token = getToken()
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// import axios from '@/utilis/request.js'


// 获取用户列表接口
export function userList(params) {
    return userObj({
        url: '/user/list',
        method: 'get',
        params
    })
}

// 获取新增用户接口
export function userAdd(data) {
    return userObj({
        url: '/user/add',
        method: 'post',
        data
    })
}

// 获取设置用户状态接口
export function userStatus(data) {
    return userObj({
        url: '/user/status',
        method: 'post',
        data
    })
}

// 获取删除用户接口
export function userDel(data){
    return userObj({
        url:'/user/remove',
        method:'post',
        data
    })
}

// 获取编辑用户接口
export function userEditor(data){
    return userObj({
        url:'/user/edit',
        method:'post',
        data
    })
}