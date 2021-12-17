// 案件管理

const sfCase = [
  {
    path: '/sfCaseManage',
    component: () => import('@/views/layout/index.vue'),
    redirect: '/sfCaseManage/addCaseList',
    name: 'sfCaseManage',
    title: '案件管理',
    meta: {
      title: '',
      icon: 'el-icon-location',
      premisson: [1, 2]
    },
    children: [
      {
        path: '/sfCaseManage/addCaseList',
        name: 'sfAddCaseList',
        title: '登记',
        meta: {
          isKeep: true
        },
        component: () => import('@/views/sfCaseList/addCaseList.vue')
      },
      {
        path: '/sfCaseManage/review',
        name: 'sfCaseReview',
        title: '待审核',
        meta: {
          isKeep: true
        },
        component: () => import('@/views/sfCaseList/reviewList.vue')
      },
      {
        path: '/sfCaseManage/assign',
        name: 'sfCaseAssign',
        title: '待指派调解',
        meta: {
          isKeep: true
        },
        component: () => import('@/views/sfCaseList/assignList.vue')
      },
      {
        path: '/sfCaseManage/mediation',
        name: 'mediationList',
        title: '调解中',
        meta: {
          isKeep: true
        },
        component: () => import('@/views/sfCaseList/mediationList.vue')
      },
      {
        path: '/sfCaseManage/waitAssign',
        name: 'sfWaitAssign',
        title: '联动中待指派',
        component: () => import('@/views/waitAssign/index.vue')
      },
      {
        path: '/sfCaseManage/coordination',
        name: 'sfCoordination',
        title: '联动中',
        component: () => import('@/views/coordination/index.vue')
      },
      {
        path: '/sfCaseManage/moveCourtList1',
        name: 'moveCourtList1',
        title: '申请司法确认',
        meta: {
          isKeep: true
        },
        component: () => import('@/views/sfCaseList/moveCourtList.vue')
      },
      {
        path: '/sfCaseManage/moveCourtList2',
        name: 'moveCourtList2',
        title: '申请立案',
        meta: {
          isKeep: true
        },
        component: () => import('@/views/sfCaseList/moveCourtList.vue')
      },
      {
        path: '/sfCaseManage/caseClose',
        name: 'caseCloseList',
        title: '已结案',
        meta: {
          isKeep: true
        },
        component: () => import('@/views/sfCaseList/caseCloseList.vue')
      }

    ]
  }
]

export default sfCase
