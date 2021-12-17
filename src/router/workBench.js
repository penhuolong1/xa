// 法院工作台

const workBench = [
  {
    path: '/workBench',
    name: 'workBench',
    title: '工作台',
    component: () => import('@/views/layout/index.vue'),
    hidden: true,
    redirect: '/workBench/index',
    meta: {
      title: '',
      premisson: [1, 2]
    },
    children: [
      {
        path: '/workBench/index',
        name: 'workBench',
        title: '工作台',
        component: () => import('@/views/workBench/index.vue')
      }
    ]
  }
]
export default workBench
