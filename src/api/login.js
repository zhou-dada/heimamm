import axios from  'axios'

// 登录验证码接口
export function login(data){
    return axios({
        url:process.env.VUE_APP_URL+'/login',
        method:'post',
        data,
        withCredentials:true
    })
}