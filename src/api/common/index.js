import axiosConfig from '@/utils/axios.js'
import { ORIGIN } from '@/utils/constVal.js'
// 创建正式用例接口基础配置
const service = axiosConfig.ajax()

/**
 * 文件预览
 * @param {String} url 预览的地址
 */
// export function getPreviewUrl(url, str = 'read') {
//   if (url.indexOf('http') === -1) {
//     url = ORIGIN + url
//   }
//   return service({
//     url: 'https://doc.olcourt.cn/wps/v1/api/file/getViewUrlWebPath?fileUrl=' + encodeURI(url) + '&permission=' + str,
//     method: 'post'
//   })
// }
export function getPreviewUrl(url, str = 'read') {
  if (url.indexOf('http') === -1) {
    url = ORIGIN + url
  }
  url = encodeURI(url)
  return service({
    url: 'https://doc.olcourt.cn/wps/v1/api/file/getViewUrlWebPath?fileUrl=' + url + '&permission=' + str,
    notNeedToken: true,
    method: 'get'
  })
}

/**
 * 获取编辑后的文件
 * @param {String} url 预览的地址
 */
export function getFile(id) {
  return service({
    url: 'https://doc.olcourt.cn/wps/v1/api/file/getFile/' + id,
    method: 'get'
  })
}
/**
 * 注册手机验证码
 * @params {string} phone 手机号
 */
export function codeOfRegister(params) {
  return service({
    url: '/system/info/codeOfRegister',
    method: 'post',
    data: params
  })
}

/**
 * 登录手机验证码
 * @params {string} phone 手机号
 */
export function codeOfLogin(params) {
  return service({
    url: '/system/info/codeOfLogin',
    method: 'post',
    data: params
  })
}

/**
 * 忘记密码
 * @params {string} phone 手机号
 */
export function codeOfResetPwd(params) {
  return service({
    url: '/system/info/codeOfResetPwd',
    method: 'post',
    data: params
  })
}

export function appraisalCase(params) {
  return fetch({
    url: '/court/appraisal/export/all/appraisalCase',
    method: 'post',
    data: params
  })
}
