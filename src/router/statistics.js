// 案件管理
import Layout from '@/views/layout/index' // 登录后的页面视图容器

const statistics = [
  {
    path: '/statistics',
    component: Layout,
    redirect: '/statistics/case',
    name: 'statistics',
    title: '统计报表',
    meta: {
      title: '',
      icon: 'bar-chart',
      premisson: [1, 2]
    },
    children: [
      {
        path: '/statistics/case',
        name: 'statisticsCase',
        title: '诉前案件统计',
        component: () => import('@/views/statistics/case/index.vue')
      },
      {
        path: '/statistics/mediator',
        name: 'mediator',
        title: '调解员调解情况统计',
        component: () => import('@/views/statistics/mediator/index.vue')
      },
      {
        path: '/statistics/brief',
        name: 'statisticsBrief',
        redirect: '/statistics/brief/accept',
        title: '收案案由统计',
        component: () => import('@/views/statistics/brief/index.vue'),
        children: [
          {
            path: '/statistics/brief/accept',
            name: 'acceptBrief',
            title: '收案案由统计',
            component: () => import('@/views/statistics/brief/accept.vue')
          },
          {
            path: '/statistics/brief/resolve',
            name: 'resolveBrief',
            title: '化解案由统计',
            component: () => import('@/views/statistics/brief/resolve.vue')
          }
        ]
      },
      {
        path: '/statistics/schedule',
        name: 'statisticsSchedule',
        title: '开庭统计',
        component: () => import('@/views/statistics/schedule/index.vue')
      },
      {
        path: '/statistics/identification',
        name: 'identification',
        title: '鉴定案件统计',
        component: () => import('@/views/statistics/identification/index.vue')
      },
      {
        path: '/statistics/preservation',
        name: 'preservation',
        title: '诉前保全案件统计',
        component: () => import('@/views/statistics/preservation/index.vue')
      },
      {
        path: '/statistics/send',
        name: 'statisticsSend',
        redirect: '/statistics/brief/accept',
        title: '送达质效',
        component: () => import('@/views/statistics/send/index.vue'),
        children: [
          {
            path: '/statistics/send/business',
            name: 'business',
            title: '送达业务综合统计',
            component: () => import('@/views/statistics/send/business.vue')
          },
          {
            path: '/statistics/send/way',
            name: 'way',
            title: '送达方式综合统计',
            component: () => import('@/views/statistics/send/way.vue')
          },
          {
            path: '/statistics/send/undone',
            name: 'undone',
            title: '未完成送达案件统计',
            component: () => import('@/views/statistics/send/undone.vue')
          }
        ]
      }
    ]
  }
]

export default statistics
