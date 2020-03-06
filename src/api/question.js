import request from '@/utilis/request.js'

// 创建题目接口
export function questionAdd(data){
    return request({
        url:'/question/add',
        method:'post',
        data
    })
}

// 获取题目信息
export function questionInfo(data){
    return request({
        url:'/question/one',
        method:'post',
        data
    })
}

// 设置题目状态
export function questionStatus(data){
    return request({
        url:'/question/status',
        method:'post',
        data
    })
}

// 删除题目
export function questionRemove(data){
    return request({
        url:'/question/remove',
        method:'post',
        data
    })
}

// 编辑题目接口
export function questionEdit(data){
    return request({
        url:'/question/edit',
        method:'post',
        data
    })
}

// 题目列表
export function questionList(params){
    return request({
        url:'/question/list',
        method:'get',
        params
    })
}
