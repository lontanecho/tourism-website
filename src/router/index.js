// src/router/index.js (Vite + Vue 3 + Vue Router 4 专用)
import { createRouter, createWebHistory } from 'vue-router'
// 注意：Vite 中 @ 别名需要配置，新手先用相对路径更稳妥
import Home from '../views/Home.vue'
import Community from '../views/Community.vue'
import Sign_up from '../views/Sign_up.vue'
import Sign_in from '../views/Sign_in.vue'
import User from '../views/User.vue'
import Publish from '../views/Publish.vue'
import SearchPage from '../views/SearchPage.vue'
import AIcreate from '../views/AIcreate.vue'
import FoodRecommend from '../views/FoodRecommend.vue'

// Vite 用 import.meta.env.BASE_URL 替代 process.env.BASE_URL
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/community',
      name: 'Community',
      component: Community
    },
    {
      path:'/sign_up',
      name:'Sign_up',
      component: Sign_up
    },
    {
      path:'/sign_in',
      name:'Sign_in',
      component: Sign_in
    },
    {
      path:'/user',
      name:'User',
      component: User
    },
    {
      path:'/publish',
      name:'Publish',
      component: Publish
    },
    {
      path:'/searchpage',
      name:'SearchPage',
      component: SearchPage
    },
    {
      path:'/aicreate',
      name:'AIcreate',
      component: AIcreate
    },// router/index.js
    {
      path:'/foodrecommend',
      name:'FoodRecommend',
      component: FoodRecommend
    },
    {
      path: '/spot-detail/:id',
      component: () => import('@/views/SpotDetail.vue')
    },
    {
      path: '/article/detail/:id',
      component: () => import('../views/DiaryCard.vue')
    },
    {
      path: '/food-detail/:id',
      component: () => import('../views/FoodDetail.vue')
    }    
  ]
})

export default router