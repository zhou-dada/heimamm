
const TOKENKEY = 'mmToken'


// 获取token
export function getToken(){
    return  window.localStorage.getItem(TOKENKEY)
}

// 设置token
export function  setToken(tokenValue){
    return  window.localStorage.setItem(TOKENKEY,tokenValue)
}

// 删除token
export function  removeToken(){
    return  window.localStorage.removeItem(TOKENKEY)
}