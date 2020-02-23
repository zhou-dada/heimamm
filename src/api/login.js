import axios from  'axios'

// 登录验证码接口
export function login(params){
    return axios({
        url:process.env.VUE_APP_URL+'/captcha?type=login',
        method:'get',
        params
    })
}