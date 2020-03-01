import axios from 'axios'

// 导入token
import {
    getToken
} from '@/utilis/token.js'
// 克隆对象
let bussnessObj = axios.create({
    baseURL: process.env.VUE_APP_URL,
    withCredentials: true
})

// ajax拦截请求
bussnessObj.interceptors.request.use(function (config) {
    // console.log(config);
    // 在发送请求之前做些什么
    config.headers.token = getToken()
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});


// 获取企业列表接口
export function bussnessList(params) {
    return bussnessObj({
        url: '/enterprise/list',
        method: 'get',
        params
    })
}

// 获取企业状态码接口
export function changeStatus(data) {
    return bussnessObj({
        url: '/enterprise/status',
        method: 'post',
        data
    })
}

// 企业添加接口
export function addBussiness(data){
    return bussnessObj({
        url:'/enterprise/add',
        method:'post',
        data
    })
}

// 企业编辑接口
export function editoBussiness(data){
    return bussnessObj({
        url:'/enterprise/edit',
        method:'post',
        data
    })
}

// 企业删除接口
export function delBussiness(data){
    return bussnessObj({
        url:'/enterprise/remove',
        method:'post',
        data
    })
}