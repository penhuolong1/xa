// 案件管理

const sfCase = [
  {
    path: '/team',
    component: () => import('@/views/layout/index.vue'),
    redirect: '/team/center',
    name: 'team',
    title: '队伍管理',
    meta: {
      title: '',
      icon: 'el-icon-location',
      premisson: [1, 2]
    },
    children: [
      {
        path: '/team/center',
        name: 'teamCenter',
        title: '分流中心',
        component: () => import('@/views/team/center.vue')
      },
      {
        path: '/team/unit',
        name: 'teamUnit',
        title: '联动单位',
        component: () => import('@/views/team/unit.vue')
      },
      {
        path: '/team/org',
        name: 'teamOrg',
        title: '调解组织',
        component: () => import('@/views/team/org.vue')
      },
      {
        path: '/team/med',
        name: 'teamMed',
        title: '调解员',
        component: () => import('@/views/team/med.vue')
      }
    ]
  }
]

export default sfCase
