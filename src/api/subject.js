import axios from 'axios'

//克隆对象
let subjectObj = axios.create({
    baseURL:process.env.VUE_APP_URL,
    withCredentials:true  // 允许携带cookie

})

// 导入token
import {getToken} from '@/utilis/token.js'

// js代码在项目一加载就会执行  请求头要放在axios拦截中
// 添加请求拦截器
subjectObj.interceptors.request.use(function (config) {
    // console.log(config);
    // 在发送请求之前做些什么
    config.headers.token=getToken()
    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  });


// 获取学科列表
export function subjectList(params){
    return subjectObj({
        url:'/subject/list',
        method:'get',
        params
    })
}

// 学科状态设置接口
export function changeStatus(data){
    return subjectObj({
        url:'/subject/status',
        method:'post',
        data

    })
}

// 新增学科接口
export function addSubject(data){
    return subjectObj({
        url:'/subject/add',
        method:'post',
        data
    })
}

// 编辑学科接口
export function editorSubject(data){
    return subjectObj({
        url:'/subject/edit',
        method:'post',
        data
    })
}

// 删除学科接口
export function delSubject(data){
    return subjectObj({
        url:'/subject/remove',
        method:'post',
        data
    })
}