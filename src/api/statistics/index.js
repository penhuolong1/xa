import axiosConfig from '@/utils/axios.js'
// 创建正式用例接口基础配置
const service = axiosConfig.ajax()

/**
 *诉前案件统计
 */
export function getPreCase(params) {
  return service({
    url: '/court/Statement/getPreCase',
    method: 'post',
    params
  })
}

/**
 *诉前案件统计(合计)
 */
export function getPreCaseAll(params) {
  return service({
    url: '/court/Statement/getPreCaseAll',
    method: 'post',
    params
  })
}

/**
 *收案案由统计
 */
export function getBriefNum(params) {
  return service({
    url: '/court/Statement/getBriefNum',
    method: 'post',
    params
  })
}
/**
 *化解案由统计
 */
export function getMediaterBriefNum(params) {
  return service({
    url: '/court/Statement/getMediaterBriefNum',
    method: 'post',
    params
  })
}

/**
 * 鉴定案件统计
 */
export function getAuthenticateCase(params) {
  return service({
    url: '/court/Statement/getAuthenticateCase',
    method: 'post',
    params
  })
}

/**
 * 诉前保全案件统计
 */
export function getSaveCase(params) {
  return service({
    url: '/court/Statement/getSaveCase',
    method: 'post',
    params
  })
}

/**
 * 送达业务综合情况统计（送达业务总体情况）
 */
export function getGiveAllCase(params) {
  return service({
    url: '/court/Statement/getGiveAllCase',
    method: 'post',
    params
  })
}

/**
 * 送达业务总体情况
 */
export function getGiveAllState(params) {
  return service({
    url: '/court/Statement/getGiveAllState',
    method: 'post',
    params
  })
}

/**
 * 送达业务综合情况统计（送达总体完成情况）
 */
export function getGiveAllEnd(params) {
  return service({
    url: '/court/Statement/getGiveAllEnd',
    method: 'post',
    params
  })
}

/**
 * 送达方式记录次数统计
 */
export function getSendType(params) {
  return service({
    url: '/court/Statement/getSendType',
    method: 'post',
    params
  })
}

/**
 * 有效送达方式统计
 */
export function getSendSuccess(params) {
  return service({
    url: '/court/Statement/getSendSuccess',
    method: 'post',
    params
  })
}

/**
 * 上门送达方式统计
 */
export function getSendDoor(params) {
  return service({
    url: '/court/Statement/getSendDoor',
    method: 'post',
    params
  })
}

/**
 * 委托送达方式统计
 */
export function getSendEntrust(params) {
  return service({
    url: '/court/Statement/getSendEntrust',
    method: 'post',
    params
  })
}

/**
 * 邮寄送达方式统计
 */
export function getSendMail(params) {
  return service({
    url: '/court/Statement/getSendMail',
    method: 'GET',
    params
  })
}

/**
 * 未完成送达统计
 */
export function getNotSend(params) {
  return service({
    url: '/court/Statement/getNotSend',
    method: 'GET',
    params
  })
}

// /**
//  * 鉴定案件统计（点击数量查询案件列表）
//  */
// export function getAuthenticateCaseList(params, str) {
//   return service({
//     url: '/court/Statement/getAuthenticateCaseList?' + str,
//     method: 'GET',
//     params
//   })
// }

/**
 * 调解员调解情况统计（含底部合计）
 */
export function getMediator(params) {
  return service({
    url: '/court/Statement/getMediator',
    method: 'GET',
    params
  })
}
/**
 * 调解员调解情况统计（含最右侧受理数合计）
 */
export function getMediatorRightAll(params) {
  return service({
    url: '/court/Statement/getMediatorRightAll',
    method: 'GET',
    params
  })
}
/**
 * 诉前案件统计(点击查看案件列表)
 */
export function getPreCaseDetails(params) {
  return service({
    url: '/court/Statement/getPreCaseDetails',
    method: 'POST',
    params
  })
}
/**
 * 调解员调解情况统计（点击数量查询案件列表）
 */
export function getCaseListInMediator(params) {
  return service({
    url: '/court/Statement/getCaseListInMediator',
    method: 'POST',
    params
  })
}
/**
 * 鉴定案件统计（点击数量查询案件列表）
 */
export function getAuthenticateCaseList(params) {
  return service({
    url: '/court/Statement/getAuthenticateCaseList',
    method: 'GET',
    params
  })
}
/**
 * 诉前保全案件统计(点击数量查询案件列表)
 */
export function getSaveCaseDetails(params) {
  return service({
    url: '/court/Statement/getSaveCaseDetails',
    method: 'GET',
    params
  })
}
/**
 * 送达业务总体情况(点击数量查询案件列表)
 */
export function getGiveAllStateList(params) {
  return service({
    url: '/court/Statement/getGiveAllStateList',
    method: 'GET',
    params
  })
}
/**
 * 全院案件排庭情况统计（含右侧和底部合计）
 */
export function getCourtAllNum(params) {
  return service({
    url: '/court/Statement/getCourtAllNum',
    method: 'GET',
    params
  })
}
/**
 * 全院案件排庭情况统计（点击庭室下拉承办人详情）
 */
export function getCourtJudge(params) {
  return service({
    url: '/court/Statement/getCourtJudge',
    method: 'GET',
    params
  })
}
/**
 * 全院案件排庭情况统计（点击庭室下拉承办人详情）
 */
export function getCourtCaseDetails(params) {
  return service({
    url: '/court/Statement/getCourtCaseDetails',
    method: 'GET',
    params
  })
}
/**
 * 收案案由统计（点击数量查案件列表）
 */
export function getBriefCase(params) {
  return service({
    url: '/court/Statement/getBriefCase',
    method: 'POST',
    params
  })
}
/**
 * 化解案由统计(点击数量查案件列表)
 */
export function getMediaterBrieCase(params) {
  return service({
    url: '/court/Statement/getMediaterBrieCase',
    method: 'POST',
    params
  })
}

