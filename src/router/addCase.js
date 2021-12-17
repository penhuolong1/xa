// 预立案登记路由
import Layout from '@/views/layout/index' // 登录后的页面视图容器

const addCaserouter = [
  {
    path: '/addCase',
    component: Layout,
    redirect: '/addCase/index',
    name: 'nested',
    title: '立案登记',
    hidden: true,
    children: [
      {
        path: '/addCase/index',
        name: 'acceptCaseIndex',
        title: '立案登记',
        component: () => import('@/views/addCase/index'),
        redirect: '/addCase/step1',
        children: [
          {
            path: '/addCase/step1',
            name: 'addCaseStep1',
            title: '立案登记',
            component: () => import('@/views/addCase/step1/index')
          },
          {
            path: '/addCase/step2',
            name: 'addCaseStep2',
            title: '立案登记',
            component: () => import('@/views/addCase/step2/index')
          },
          {
            path: '/addCase/step3',
            name: 'addCaseStep3',
            title: '立案登记',
            component: () => import('@/views/addCase/step3/index')
          },
          {
            path: '/addCase/step4',
            name: 'addCaseStep4',
            title: '立案登记',
            component: () => import('@/views/addCase/step4/index')
          }
        ]
      }
    ]
  },
  {
    path: '/sfaddCase',
    component: Layout,
    redirect: '/sfaddCase/index',
    name: 'sfaddCase',
    title: '收案',
    hidden: true,
    children: [
      {
        path: '/sfaddCase/index',
        name: 'sfacceptCaseIndex',
        title: '收案',
        component: () => import('@/views/sfAddcase/index'),
        redirect: '/sfaddCase/step1',
        children: [
          {
            path: '/sfaddCase/step1',
            name: 'sfAddCaseStep1',
            title: '纠纷登记',
            component: () => import('@/views/sfAddcase/step1/index')
          },
          {
            path: '/sfaddCase/step2',
            name: 'sfAddCaseStep2',
            title: '纠纷登记',
            component: () => import('@/views/sfAddcase/step2/index')
          },
          {
            path: '/sfaddCase/step3',
            name: 'sfAddCaseStep3',
            title: '纠纷登记',
            component: () => import('@/views/sfAddcase/step3/index')
          },
          {
            path: '/sfaddCase/step4',
            name: 'sfAddCaseStep4',
            title: '纠纷登记',
            component: () => import('@/views/sfAddcase/step4/index')
          }
        ]
      }
    ]
  }
]
export default addCaserouter
