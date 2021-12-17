// 案件管理
import Layout from '@/views/layout/index' // 登录后的页面视图容器
console.log(Layout)
const caseManage = [
  {
    path: '/caseManage',
    component: Layout,
    redirect: '/caseManage/',
    name: 'nested',
    title: '案件管理',
    meta: {
      title: '',
      icon: 'profile',
      premisson: [1, 2]
    },
    children: [
      {
        path: '/caseManage/wholecaseline',
        name: 'wholecaseline',
        title: '全院案件',
        component: () => import('@/views/wholecaseline/index.vue')
      },
      // {
      //   path: '/caseManage/linkage',
      //   name: 'linkage',
      //   title: '联动单位案件列表',
      //   component: () => import('@/views/linkage/index.vue')
      // },
      {
        path: '/caseManage/appraisalcase',
        name: 'appraisalcase',
        title: '鉴定案件管理',
        component: () => import('@/views/appraisalcase/index.vue')

      },
      {
        path: '/caseManage/savecase',
        name: 'savecase',
        title: '保全案件管理',
        component: () => import('@/views/savecase/index.vue')
      },
      {
        path: '/caseManage/listIntranetInfo',
        name: 'listIntranetInfo',
        title: '同步榕基',
        component: () => import('@/views/listIntranetInfo/index.vue')
      }
    ]
  }
]

export default caseManage
