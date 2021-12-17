// 预立案登记路由
import Layout from '@/views/layout/rtcIndex' // 登录后的页面视图容器

const rtcrouter = [
  {
    path: '/rtc',
    component: Layout,
    title: '调解室',
    hidden: true,
    redirect: '/rtc/index',
    children: [
      {
        path: '/rtc/index',
        name: 'rtcIndex',
        title: '调解室',
        component: () => import('@/views/rtc/index')
      },
      {
        path: '/rtc/consultRoom',
        name: 'consultRoom',
        title: '咨询室',
        component: () => import('@/views/consultRoom/index')
      }
    ]
  }
]
export default rtcrouter
