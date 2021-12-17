// 当事人信息库
import Layout from '@/views/layout/index' // 登录后的页面视图容器

const informationBase = [
  {
    path: '/informationBase',
    component: Layout,
    redirect: '/informationBase',
    name: 'informationBase',
    title: '当事人信息库',
    meta: {
      title: '',
      icon: 'usergroup-add',
      premisson: [1, 2]
    },
    children: [
      {
        path: '/informationBase',
        name: 'informationBase',
        title: '当事人信息库',
        component: () => import('@/views/informationBase/index.vue')
      }
    ]
  }
]

export default informationBase
