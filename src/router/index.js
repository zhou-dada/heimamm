import VueRouter from   'vue-router'
import Vue from 'vue'

import son from '../components/son'
Vue.use(VueRouter)
const router =new VueRouter({
    routes:[{
        path:'/',
        component:son
    }]
})

export default router