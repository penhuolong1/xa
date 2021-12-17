import router from './router/'
import store from './store/'

const whiteList = ['/mobile/filesList', '/mobile/court/file', '/mobile/sf/file',
  '/mobile/handWrite', '/mobile/sendFile', '/mobile/courtSendFile', '/login', '/home', '/login1',
  '/login2', '/login4', '/disputeResolution', '/serviceInformation/disputeResolutionGuide',
  '/disputeResolution/organization', '/disputeResolution/solver', '/disputeResolution/linkageUnit',
  '/trends/popularization', '/trends/details', '/examples/popularization', '/examples/details', '/laws/regulations', '/lawsRegulations/details'] // 不重定向白名单
// main.js 路由守卫
router.beforeEach(async(to, from, next) => {
  // let href = location.href
  // console.log(from)
  // if (href.indexOf('sstj') != -1 && to.path != '/system') {
  //   next('/system')
  //   return
  // }
  // console.log("路由拦截", to.path);
  const roleType = store.getters.getUserInfo?.roles
  const token = localStorage.getItem('xaTokan') || ''
  next()
  // 判断是否有角色身份（代表已登录）
  if (token) {
    // console.log("已登录，有角色身份");
    if (to.path === '/login') {
      // console.log("有角色身份 , 将要去登录页,强制转到后台首页");
      next({
        path: '/home'
      })
    } else {
      // console.log("有角色身份 , 不是去登录页,");
      await store.dispatch('GetUserInfo')
      next()
    }
  } else {
    // console.log("无角色身份");
    if (whiteList.indexOf(to.path) !== -1) {
      // 在免登录白名单，直接进入
      // console.log("在免登录白名单，直接进入");
      next()
    } else {
      // console.log("不在免登录白名单，跳转登录页");
      // 不在免登录白名单，跳转登录页
      if (to.path == '/login') {
        next()
      } else {
        next('/login')
      }
    }
  }
})
