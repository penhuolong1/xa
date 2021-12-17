const home = [
  // 首页
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/views/home/index.vue')
  },
  // 普法动态
  {
    path: '/trends/popularization',
    name: 'TrendsPopularization',
    component: () => import('@/views/home/cloudPopularization/trends/index.vue')
  },
  {
    path: '/trends/details',
    name: 'TrendsDetails',
    component: () => import('@/views/home/cloudPopularization/trends/details.vue')
  },
  // 普法实例
  {
    path: '/examples/popularization',
    name: 'ExamplesPopularization',
    component: () => import('@/views/home/cloudPopularization/examples/index.vue')
  },
  {
    path: '/examples/details',
    name: 'ExamplesDetails',
    component: () => import('@/views/home/cloudPopularization/examples/details.vue')
  },
  //   法律法规
  {
    path: '/laws/regulations',
    name: 'LawsRegulations',
    component: () => import('@/views/home/cloudPopularization/lawsRegulations/index.vue')
  },
  {
    path: '/lawsRegulations/details',
    name: 'LawsRegulationsDetails',
    component: () => import('@/views/home/cloudPopularization/lawsRegulations/details.vue')
  },
  // 联动单位
  {
    path: '/disputeResolution/linkageUnit',
    name: 'DisputeResolutionLinkageUnit',
    component: () => import('@/views/home/disputeResolution/linkageUnit/index.vue')
  },
  // 解纷组织
  {
    path: '/disputeResolution/organization',
    name: 'DisputeResolutionOrganization',
    component: () => import('@/views/home/disputeResolution/organization/index.vue')
  },
  // 解纷员
  {
    path: '/disputeResolution/solver',
    name: 'DisputeResolutionSolver',
    component: () => import('@/views/home/disputeResolution/solver/index.vue')
  },
  // 解纷指南
  {
    path: '/serviceInformation/disputeResolutionGuide',
    name: 'ServiceInformationDisputeResolutionGuide',
    component: () => import('@/views/home/serviceInformation/disputeResolutionGuide/index.vue')
  }
]
export default home
