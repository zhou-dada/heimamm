import axios from 'axios'

// 发送手机验证码请求
export function sendSMS(data){
   return axios({
        url:process.env.VUE_APP_URL+'/sendsms',
        method:'post',
        data,
        withCredentials:true
    })
}



// 注册帐号接口的请求
export function register(data){
    return axios({
        url:process.env.VUE_APP_URL+'/register',
        method:'post',
        data,
        withCredentials:true
    })
}