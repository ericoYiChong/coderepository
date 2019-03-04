import Vue from 'vue'
import Router from 'vue-router'
import dragList from '@/components/dragList'

Vue.use(Router)

export default new Router({
    routes: [{
        path: '/',
        name: 'dragList',
        component: dragList
    }]
})