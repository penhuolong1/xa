// 预立案登记路由
import Layout from '@/views/layout/index' // 登录后的页面视图容器

const caserouter = [
  {
    path: '/case',
    component: Layout,
    title: '案件',
    hidden: true,
    children: [
      {
        path: '/case/litigant',
        name: 'litigantDetail',
        title: '当事人基本信息',
        component: () => import('@/views/litigantDetail/index')
      },
      { // 案件详情
        path: '/case/detail',
        name: 'caseDetail',
        title: '案件详情',
        component: () => import('@/views/caseDetail/index')
      },
      { // 诉非案件详情
        path: '/sfcase/detail',
        name: 'sfcaseDetail',
        title: '案件详情',
        component: () => import('@/views/sfcaseDetail/index')
      },
      { // 综合送达
        path: '/case/compresend',
        name: 'compresend',
        meta: {
          isKeep: false
        },
        title: '综合送达',
        component: () => import('@/views/SeverdManage/compresend/index')
      }
    ]
  }
]
export default caserouter
