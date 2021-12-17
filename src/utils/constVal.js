export const FILE_SIZE = '20' // 上传文件大小限制 最大20M
export const callerCode = '2c9bbe697c0519ea017c77d90aee0de52c9bbe697c0519ea' // 闽政通登录授权码
let url = location.origin
if (location.hostname === 'localhost') { // 如果是本地
  url = 'https://xatjtest.olcourt.cn'
}
export const ORIGIN = url // 域名

const httpurl = 'http://' + location.host
if (location.hostname === 'localhost') { // 如果是本地
  url = 'http://xatjtest.olcourt.cn'
}
export const ORIGINHTTP = httpurl // 域名(http)
