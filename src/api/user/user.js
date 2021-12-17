import axiosConfig from '@/utils/axios.js'
// 创建正式用例接口基础配置
const service = axiosConfig.ajax()

// 登陆改版
export function login(params) {
  return service({
    url: '/login',
    method: 'post',
    data: params
  })
}

// 闽政通登录
export function goLogin(params) {
  return service({
    url: '/goLogin',
    method: 'get',
    params
  })
}

// pc获取参数回调
export function mztBackUrl(params) {
  return service({
    url: '/mztBackUrl',
    method: 'get',
    params
  })
}

// 查看用户信息
export const userInfo = () => {
  return service({
    url: '/getInfo',
    method: 'get'
  })
}

// 退出
export const loginOut = () => {
  return service({
    url: '/logout',
    method: 'get'
  })
}
/**
 * 注册自然人
 */
export const registerOfPerson = (params) => {
  return service({
    url: '/system/info/registerOfPerson',
    method: 'post',
    data: params
  })
}

/**
 * 注册法人
 */
export const registerOfUint = (params) => {
  return service({
    url: '/system/info/registerOfUint',
    method: 'post',
    data: params
  })
}

/**
 * 重置密码
 */
export const resetPwd = (params) => {
  return service({
    url: '/system/info/resetPwd',
    method: 'post',
    data: params
  })
}

/**
 * 律师认证
 */
export const agentLegalize = (params) => {
  return service({
    url: '/system/info/agentLegalize',
    method: 'post',
    data: params
  })
}

/**
 * 账号登录多机构选择
 */
export const chooseDept = (params, token) => {
  console.log(token)
  return service({
    url: '/system/dept/chooseDept',
    method: 'post',
    token,
    data: params
  })
}

/**
 * 查看是否有多个角色
 */
export const listOtherRoleOfSf = () => {
  return service({
    url: '/listOtherRoleOfSf',
    method: 'get'
  })
}

/**
 * 切换角色
 * @returns
 */
export const changeRole = (params) => {
  return service({
    url: '/changeRole',
    method: 'post',
    data: params
  })
}
