// 收案路由
import Layout from '@/views/layout/index' // 登录后的页面视图容器

const collectCase = [
  {
    path: '/collectCase',
    component: Layout,
    redirect: '/collectCase/waitReview',
    name: 'nested',
    title: '收案审查',
    meta: {
      title: '',
      icon: 'appstore',
      premisson: [1, 2]
    },
    children: [
      {
        path: '/collectCase/waitReview',
        name: 'waitReview',
        title: '预立案待审查',
        component: () => import('@/views/acceptCase/waitReview')
      },
      {
        path: '/collectCase/readyCase',
        name: 'readyCase',
        title: '预立案',
        component: () => import('@/views/acceptCase/readyCase')
      },
      {
        path: '/collectCase/waitCase',
        name: 'waitCase',
        title: '待正式立案',
        component: () => import('@/views/acceptCase/waitCase/index.vue')
      },
      {
        path: '/collectCase/waitSend',
        name: 'waitSend',
        title: '已立案待送达',
        component: () => import('@/views/acceptCase/waitSend/index.vue')
      }
    ]
  },
  {
    path: '/collectCase',
    component: Layout,
    name: 'collectCase',
    title: '审查',
    hidden: true,
    meta: {
      title: '',
      icon: 'el-icon-location',
      premisson: [1, 2]
    },
    children: [
      {
        path: '/collectCase/reivew',
        name: 'reivew',
        title: '审查',
        hidden: true,
        component: () => import('@/views/review/index')
      }
    ]
  }
]

export default collectCase
