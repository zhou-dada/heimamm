import request from '@/utilis/request.js'


// 面板数据接口
export function getTop(){
    return request({
        url:'/data/title',
        method:'post'
    })
}

// 企业题目数据统计
export function statistics(){
    return request({
        url:'/data/statistics',
        method:'post'
    })
}
