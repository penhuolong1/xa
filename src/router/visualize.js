// 当事人信息库
import Layout from '@/views/layout/index' // 登录后的页面视图容器

const visualize = [
  {
    path: '/visualize',
    name: 'Visualize',
    title: '数助决策',
    component: () => import('@/views/visualize/index.vue'),
    meta: {
      title: '',
      icon: 'pie-chart',
      premisson: [1, 2]
    },
    children: [
      {
        path: '/visualize/index',
        name: 'visualizeIndex',
        title: '数助决策',
        component: () => import('@/views/visualize/index.vue')
      }
    ]
  }
]

export default visualize
