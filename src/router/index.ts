import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
    meta: { title: '首页' }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { title: 'User Login' }
  },
  {
    path: '/timeline',
    name: 'Timeline',
    component: () => import('@/views/Timeline.vue'),
    meta: { title: '时间轴' }
  },

  {
    path: '/map',
    name: 'Map',
    component: () => import('@/views/Map.vue'),
    meta: { title: '地图' }
  },
  {
    path: '/tours',
    name: 'Tours',
    component: () => import('@/views/Tours.vue'),
    meta: { title: '导览路线' }
  },
  {
    path: '/building/:id',
    name: 'BuildingDetail',
    component: () => import('@/views/BuildingDetail.vue'),
    meta: { title: '建筑详情' }
  },

  {
    path: '/archive',
    name: 'Archive',
    component: () => import('@/views/Archive.vue'),
    meta: { title: '档案室' }
  },
  {
    path: '/dialogue',
    name: 'Dialogue',
    component: () => import('@/views/Dialogue.vue'),
    meta: { title: '对话' }
  },
  {
    path: '/learning',
    name: 'Learning',
    component: () => import('@/views/Learning.vue'),
    meta: { title: '学习中心' }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/views/Profile.vue'),
    meta: { title: '用户档案' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

import { useUserStore } from '@/stores/useUserStore'
import { message } from 'ant-design-vue'
router.beforeEach((to, from, next) => {
  // Update Title
  document.title = to.meta.title ? `${to.meta.title as string} - 近代日本建筑探索馆` : '近代日本建筑探索馆'

  // Auth Guard
  const userStore = useUserStore()
  const publicRoutes = ['/', '/login', '/register']

  // If user is logged in and tries to go to login, redirect to home
  if (userStore.isLoggedIn && to.path === '/login') {
    next('/')
    return
  }

  // If route is public, allow
  if (publicRoutes.includes(to.path)) {
    next()
    return
  }

  // If route is protected and user is NOT logged in, redirect to login
  if (!userStore.isLoggedIn) {
    message.error({
      content: '请先前往登录',
      class: 'brutalist-message'
    })
    next('/login')
    return
  }

  // Otherwise proceed
  next()
})

export default router

