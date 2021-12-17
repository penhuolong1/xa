// 案件管理
import Layout from '@/views/layout/index' // 登录后的页面视图容器

const caseHandle = [
  {
    path: '/caseHandle',
    component: Layout,
    redirect: '/caseHandle/reassigned',
    name: 'caseHandle',
    title: '案件办理',
    meta: {
      title: '',
      icon: 'solution',
      premisson: [1, 2]
    },
    children: [
      {
        path: '/caseHandle/myCase',
        name: 'myCase',
        title: '我的案件',
        component: () => import('@/views/myCase/index.vue')
      },
      {
        path: '/caseHandle/preientation',
        name: 'preientation',
        title: '诉前调查中',
        component: () => import('@/views/preientation/index.vue')
      },
      {
        path: '/caseHandle/reassigned',
        name: 'reassigned',
        title: '待指派调解员',
        component: () => import('@/views/reassigned/index.vue')
      },
      {
        path: '/caseHandle/mediating',
        name: 'mediating',
        title: '调解中',
        component: () => import('@/views/mediating/index.vue')
      },
      {
        path: '/caseHandle/waitAssign',
        name: 'waitAssign',
        title: '待指派联动员',
        component: () => import('@/views/waitAssign/index.vue')
      },
      {
        path: '/caseHandle/coordination',
        name: 'coordination',
        title: '联动中',
        component: () => import('@/views/coordination/index.vue')
      }
    ]
  }
]

export default caseHandle
