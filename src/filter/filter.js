import Vue from 'vue'
import moment from 'moment'
// 全局过滤器
// 参数1  过滤器名字
// 参数2  过滤器的具体实现
Vue.filter('filterTime',function(val){
    // val是一个日期 要处理成年-月-日形式的
    return moment(val).format("YYYY-MM-DD")
})