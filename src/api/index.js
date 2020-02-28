import axios from 'axios'
import {getToken} from '@/utilis/token.js'


//! 克隆axios对象    axios.create就是创建一个axios实例对象   
// 这里克隆的axios对象就自动带有配置好的属性  不需要再写  可以分别给其他的axios用共同的属性

let indexQ =axios.create({
    // 基地址配置
    baseURL:process.env.VUE_APP_URL,
    // // 请求头
    // headers:{
    //     token:getToken()  // 调用去token方法获取到token的值
    // }


     /* 因为 */
})

// axios请求拦截
indexQ.interceptors.request.use(function (config) {
    // console.log(config);
    // 在发送请求之前做些什么  config 是被拦截下来的请求的配置
    config.headers.token=getToken()  // 这句话代表每次首页发送请求都会被拦截下来被加上一个token
    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  });


// 获取用户登录信息方法 
export function get_user(){
    // return axios({
    //     url:process.env.VUE_APP_URL+'/info',
    //     method:'post',
    //     // 携带请求头发送请求
    //     headers:{
    //         token: getToken()  // 调用token方法获取token值
    //     }
    // })

    return indexQ({
        url:'/info',
        method:'get'
    })

}

// 退出登录方法
export function exitLogin(){
    // return axios({
    //     url:process.env.VUE_APP_URL+'/logout',
    //     method:'get',
    //     headers:{
    //         token: getToken()  // 调用token方法获取token值
    //     }
    // })

    return indexQ({
        url:'/logout',
        method:'get'
    })
}