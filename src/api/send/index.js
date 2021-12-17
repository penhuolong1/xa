import axiosConfig from '@/utils/axios.js'
// 创建正式用例接口基础配置
const service = axiosConfig.ajax()

/**
 * 获取当事人送达信息
 */
export function listSendInfo(params) {
  return service({
    url: '/court/send/listSendInfo',
    method: 'get',
    params
  })
}

/**
 * 查询当事人送达流程信息
 */
export function querySendProcessInfo(params) {
  return service({
    url: '/court/send/querySendProcessInfo',
    method: 'get',
    params
  })
}

/**
 * 送达
 */
export function sendDiploms(params) {
  return service({
    url: '/court/send/sendDiploms',
    method: 'post',
    data: params
  })
}

/**
 * 删除送达信息
 */
export function delSend(params) {
  return service({
    url: '/court/send/delSend',
    method: 'post',
    params
  })
}

/**
 * 添加或修改当事人的送达结果
 */
export function addSendResult(params) {
  return service({
    url: '/court/send/addSendResult',
    method: 'post',
    params
  })
}

/**
 * 上传录音文件
 */
export function uploadPhoneFile(params) {
  return service({
    url: '/court/phoneRecord/uploadPhoneFile',
    header: {
      'Content-Type': 'multipart/form-data'
    },
    method: 'post',
    data: params
  })
}

/**
 * 上传游离文件
 */
export function uploadFreeFile(params) {
  return service({
    url: '/court/freeFile/uploadFreeFile',
    header: {
      'Content-Type': 'multipart/form-data'
    },
    method: 'post',
    data: params
  })
}

/**
 * 查询送达具体信息
 */
export function getSendInfo(params) {
  return service({
    url: '/court/send/getSendInfo',
    method: 'get',
    params
  })
}

/**
 * 编辑送达记录
 */
export function editSendInfo(params) {
  return service({
    url: '/court/send/editSendInfo',
    method: 'post',
    data: params
  })
}

/**
 * queryRelationLit
 */
export function queryRelationLit(params) {
  return service({
    url: '/court/send/queryRelationLit',
    method: 'get',
    params
  })
}

/**
 * 查询当事人生成的文书
 */
export function listLitDip(params) {
  return service({
    url: '/court/diploms/listLitDip',
    method: 'get',
    params
  })
}
/**
 * 推送综合送达平台
 */
export function intranetSend(params) {
  return service({
    url: '/court/send/intranetSend',
    method: 'post',
    data: params
  })
}

/**
 * 获取委托送达法院列表
 */
export function listCourt(params) {
  return service({
    url: '/court/court/listCourt',
    method: 'get',
    params
  })
}

/**
 * 打印邮单
 */
export function printExpress(params) {
  return service({
    url: '/court/send/printExpress',
    method: 'post',
    data: params
  })
}

/**
 * 获取起诉状和证据材料
 */
export function getSendFile(params) {
  return service({
    url: '/court/archive/file/getSendFile',
    method: 'get',
    params
  })
}
