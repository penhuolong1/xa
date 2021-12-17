// 送达管理
import Layout from '@/views/layout/index' // 登录后的页面视图容器

const servedManage = [
  {
    path: '/servedManage',
    component: Layout,
    redirect: '/servedManage/reassigned',
    name: 'caseHandle',
    title: '送达管理',
    meta: {
      title: '',
      icon: 'audit',
      premisson: [1, 2]
    },
    children: [
      {
        path: '/caseHandle/print',
        name: 'print',
        title: '材料生成',
        component: () => import('@/views/SeverdManage/print/index.vue')
      },
      {
        path: '/servedManage/schedule',
        redirect: '/servedManage/schedule/prosecution',
        name: 'schedule',
        title: '排期管理',
        component: () => import('@/views/schedule/index.vue'),
        children: [
          {
            path: '/servedManage/schedule/prosecution',
            name: 'prosecution',
            title: '诉前排期',
            component: () => import('@/views/schedule/prosecution/index.vue')
          },
          {
            path: '/servedManage/schedule/calendar',
            name: 'calendar',
            title: '诉前排期日历',
            component: () => import('@/views/schedule/calendar/index.vue')
          },
          {
            path: '/servedManage/schedule/palace',
            name: 'palace',
            title: '排庭',
            component: () => import('@/views/schedule/palace/index.vue')
          },
          {
            path: '/servedManage/schedule/palaceCalendar',
            name: 'palaceCalendar',
            title: '排庭日历',
            component: () => import('@/views/schedule/palaceCalendar/index.vue')
          }
        ]
      },
      {
        path: '/servedManage/reassigned',
        name: 'reassigned',
        title: '待指派送达员',
        component: () => import('@/views/SeverdManage/reAssignSeverd/index.vue')
      },
      {
        path: '/servedManage/servicing',
        name: 'servicing',
        title: '送达中',
        component: () => import('@/views/SeverdManage/servicing/index.vue')
      },
      {
        path: '/servedManage/visiting',
        name: 'visiting',
        title: '上门送达',
        component: () => import('@/views/SeverdManage/visiting/index.vue')
      },
      {
        path: '/servedManage/waitReviewed',
        name: 'waitReviewed',
        title: '送达待复核',
        component: () => import('@/views/SeverdManage/waitReviewed/index.vue')
      },
      {
        path: '/servedManage/courtroom',
        name: 'courtroom',
        title: '待庭室接收',
        component: () => import('@/views/SeverdManage/courtroom/index.vue')
      }

    ]
  }
]

export default servedManage
