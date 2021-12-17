// 诉非工作台

const sfworkBench = [
  {
    path: '/sfworkBench',
    name: 'workBench',
    title: '工作台',
    component: () => import('@/views/layout/index.vue'),
    redirect: '/sfworkBench/index',
    meta: {
      title: '',
      premisson: [1, 2]
    },
    children: [
      {
        path: '/sfworkBench/index',
        name: 'workBench',
        title: '工作台',
        component: () => import('@/views/sfworkBench/index.vue')
      }
    ]
  }
]
export default sfworkBench
