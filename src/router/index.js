import Vue from 'vue'
import VueRouter from 'vue-router'
import menu from './menu'
import sfmenu from './sfMenu'
import home from './home'
import Layout from '@/views/layout/index' // 登录后的页面视图容器

Vue.use(VueRouter)
const routes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/disputeAnalysis',
    name: 'DisputeAnalysis',
    component: () => import('@/views/visualize/disputeAnalysis.vue')
  },
  {
    path: '/login2',
    name: 'Login',
    component: () => import('@/views/login/index2.vue')
  },
  // {
  //   path: '/disputeBreaker',
  //   name: 'DisputeBreaker',
  //   component: () => import('@/views/home/disputeBreaker.vue')
  // },
  // {
  //   path: '/disputeResolutionOrganization',
  //   name: 'DisputeResolutionOrganization',
  //   component: () => import('@/views/home/disputeResolutionOrganization.vue')
  // },

  // {
  //   path: '/formFillingGuide',
  //   name: 'FormFillingGuide',
  //   component: () => import('@/views/home/formFillingGuide.vue')
  // },
  // {
  //   path: '/disputeResolution',
  //   name: 'DisputeResolution',
  //   component: () => import('@/views/home/disputeResolution.vue')
  // },
  // {
  //   path: '/examplesPopularization',
  //   name: 'ExamplesPopularization',
  //   component: () => import('@/views/home/examplesPopularization.vue')
  // },
  // {
  //   path: '/examplesPopularizationDetails',
  //   name: 'ExamplesPopularizationDetails',
  //   component: () => import('@/views/home/examplesPopularizationDetails.vue')
  // },
  // {
  //   path: '/lawsRegulations',
  //   name: 'LawsRegulations',
  //   component: () => import('@/views/home/lawsRegulations.vue')
  // },
  // {
  //   path: '/lawsRegulationsDetails',
  //   name: 'LawsRegulationsDetails',
  //   component: () => import('@/views/home/lawsRegulationsDetails.vue')
  // },
  {
    path: '/login4',
    name: 'Login',
    component: () => import('@/views/login/index3.vue')
  },
  // {
  //   path: '/login',
  //   name: 'Login',
  //   component: () => import('@/views/login/index3.vue')
  // },
  {
    path: '/login3',
    name: 'Login',
    component: () => import('@/views/login/index3.vue')
  },
  {
    path: '/login1',
    name: 'Login',
    component: () => import('@/views/login/index1.vue')
  },
  {
    path: '/edit',
    name: 'editFile',
    component: () => import('@/views/editFile/index.vue')
  },
  {
    path: '/editlawsuitbook',
    name: 'editlawsuitbook',
    component: () => import('@/views/editFile/lawsuitBook.vue')
  },
  { // 诉非签字
    path: '/mobile/handWrite',
    name: 'handWrite',
    component: () => import('@/views/mobile/handWrite.vue')
  },
  { // 查看送达文书
    path: '/mobile/sendFile',
    name: 'sendFile',
    component: () => import('@/views/mobile/sendFile.vue')
  },
  { // 查看送达文书
    path: '/mobile/courtSendFile',
    name: 'sendFile',
    component: () => import('@/views/mobile/courtSendFile.vue')
  },
  {
    path: '/visualize/strength',
    name: 'strength',
    component: () => import('@/views/visualize/strength.vue')
  },
  {
    path: '/visualize/dispute',
    name: 'dispute',
    component: () => import('@/views/visualize/dispute.vue')
  },
  {
    path: '/visualize/warning',
    name: 'warning',
    component: () => import('@/views/visualize/warning.vue')
  },
  {
    path: '/visualize/help',
    name: 'help',
    component: () => import('@/views/visualize/help.vue')
  },
  {
    path: '/:path(.*)*',
    name: 'ErrorPage',
    component: Layout,
    children: [
      {
        path: '/:path(.*)*',
        component: () => import('@/views/errorPage/404.vue')
      }
    ]
  }
]
const router = new VueRouter({
  mode: 'history',
  // base: process.env.BASE_URL,
  scrollBehavior: () => ({
    y: 0
  }),
  routes: [...menu, ...sfmenu, ...home, ...routes]
})

export default router
