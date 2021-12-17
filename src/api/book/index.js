import axiosConfig from '@/utils/axios.js'
// 创建正式用例接口基础配置
const service = axiosConfig.ajax()

/**
 * 获取卷宗目录
 * @params {string} name 案由名字
 */
export function queryAllContents(params) {
  return service({
    url: '/court/archive/queryAllContents',
    method: 'get',
    params
  })
}

/**
 * 添加或修改目录
 * @params {string} id 目录id 必传
 * @params {string} parentId 案由名字 必传
 * @params {string} name 目录名称 必传
 */
export function addOrUpdateContents(params) {
  return service({
    url: '/court/archive/addOrUpdateContents',
    method: 'post',
    params
  })
}

/**
 * 删除目录
 * @params {string} id 目录id
 */
export function delContents(params) {
  return service({
    url: '/court/archive/delContents',
    method: 'post',
    params
  })
}

/**
 * 获取某个目录下的所有卷宗文件
 * @params {string} lawCaseId 案件id
 * @params {string} contentsId 目录id
 */
export function queryArchiveFile(params) {
  return service({
    url: '/court/archive/file/queryArchiveFile',
    method: 'get',
    params
  })
}

/**
 * 获取某个目录下的所有卷宗文件
 * @params {file} file 文件
 * @params {string} contentsId 目录id
 * @params {string} lawCaseId 案件id
 */
export function uploadFile(params) {
  return service({
    url: '/court/archive/file/add',
    header: {
      'Content-Type': 'multipart/form-data'
    },
    method: 'post',
    data: params
  })
}

/**
 * 删除文书
 * @params {string} fileIds 文件id，多个以“,”隔开
 */
export function fileDel(params) {
  return service({
    url: '/court/archive/file/del',
    method: 'post',
    data: params
  })
}

/**
 * 批量移动卷宗到某一目录
 * @params {string} fileIds 文件id，多个以“,”隔开
 * @params {string} contentsId 目录id
 */
export function fileChange(params) {
  return service({
    url: '/court/archive/file/change',
    method: 'post',
    data: params
  })
}

/**
 * 下载案件所有电子卷宗
 * @params {string} lawCaseId 案件id
 */
export function downArchiveFile(params) {
  return service({
    url: '/court/archive/file/downArchiveFile',
    method: 'get',
    params
  })
}

/**
 * 打印材料
 */
export function buildDiploms(params) {
  return service({
    url: '/court/diploms/buildDiploms',
    method: 'post',
    data: params
  })
}

/**
 * 查找签章文书
 */
export function queryDipSign(params) {
  return service({
    url: '/court/sign/queryDipSign',
    method: 'get',
    params
  })
}

/**
 * 审核待签章文书
 */
export function checkSign(params) {
  return service({
    url: '/court/sign/checkSign',
    method: 'post',
    data: params
  })
}

/**
 * 获取需要编辑的文书
 */
export function getEditDip(params) {
  return service({
    url: '/court/diploms/getEditDip',
    method: 'post',
    data: params
  })
}

/**
 * 添加诉前程序文书记录
 */
export function addPreDipRecord(params) {
  return service({
    url: '/court/preRecord/addPreDipRecord',
    method: 'post',
    data: params
  })
}

/**
 * 获取诉前文书记录
 */
export function listPreDipRecord(params) {
  return service({
    url: '/court/preRecord/listPreDipRecord',
    method: 'get',
    params
  })
}

/**
 * 删除诉前文书记录
 */
export function delPreDipRecord(params) {
  return service({
    url: '/court/preRecord/delPreDipRecord',
    method: 'post',
    params
  })
}

/**
 * 更新诉前程序文书记录
 */
export function updatePreDipRecord(params) {
  return service({
    url: '/court/preRecord/updatePreDipRecord',
    method: 'post',
    params
  })
}

/**
 * 查看送达文书
 */
export function sendInfoById(params) {
  return service({
    url: '/sf/send/sendInfoById',
    method: 'get',
    params
  })
}

/**
 * 签字
 */
export function signOfLit(params) {
  return service({
    url: '/sf/sign/signOfLit',
    method: 'post',
    data: params
  })
}

/**
 * 是否需要签字
 */
export function needSign(params) {
  return service({
    url: '/sf/sign/needSign',
    method: 'get',
    params
  })
}

/**
 * base64上传图片
 */
export function addBase64File(params) {
  return service({
    url: '/court/archive/file/addBase64File',
    method: 'post',
    data: params
  })
}

/**
 * 图片转成word 打印
 */
export function printImgArchive(params) {
  return service({
    url: '/court/archive/file/printImgArchive',
    method: 'post',
    data: params
  })
}
/**
 * 图片合成pdf
 * @param {*} params
 * @returns
 */
export function printImgToPdf(params) {
  return service({
    url: '/court/archive/file/printImgToPdf',
    method: 'post',
    data: params
  })
}
