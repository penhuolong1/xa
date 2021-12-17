import axiosConfig from '@/utils/axios.js'
// 创建正式用例接口基础配置
const service = axiosConfig.ajax()

/**
 * 诉前排期-案件查询
 */
export function listPreSchedulingCaseInfo(params) {
  return service({
    url: '/court/scheduling/listPreSchedulingCaseInfo',
    method: 'get',
    params
  })
}

/**
 * 获取所有开庭地点
 * params type 1是开庭地点 2是诉前地点
 */
export function listTribunal(params) {
  return service({
    url: '/court/tribunal/listTribunal',
    method: 'get',
    params
  })
}

/**
 * 获取当事人数据
 */
export function litigantNameByCaseId(params) {
  return service({
    url: '/court/litigant/litigantNameByCaseId',
    method: 'get',
    params
  })
}

/**
 * 诉前排期日历查询
 */
export function listPreSchedulingInfo(params) {
  return service({
    url: '/court/scheduling/listPreSchedulingInfo',
    method: 'get',
    params
  })
}

/**
 * 排庭案件查询
 */
export function listSchedulingCaseInfo(params) {
  return service({
    url: '/court/scheduling/listSchedulingCaseInfo',
    method: 'get',
    params
  })
}

/**
 * 排庭 新增/修改
 * @params {number} state 0预排庭 1排庭
 * @params {string} startTime 时间
 * @params {array} minutes 时长 分钟
 * @params {string} tribunalId 开庭地点id
 * @params {array} lawCaseIds 案件id
 */
export function editSchedulingInfo(params) {
  return service({
    url: '/court/scheduling/editSchedulingInfo',
    method: 'post',
    data: params
  })
}

/**
 * 合并案件
 * @params {array} lawCaseIds 案件id
 */
export function combineCase(params) {
  return service({
    url: '/court/relation/combineCase',
    method: 'post',
    data: params
  })
}

/**
 * 解除合并
 */
export function cencelCombine(params) {
  return service({
    url: '/court/relation/cencelCombine',
    method: 'post',
    data: params
  })
}

/**
 * 销庭
 */
export function cancelScheduling(params) {
  return service({
    url: '/court/scheduling/cancelScheduling',
    method: 'post',
    data: params
  })
}

/**
 * 排庭日历 查询
 */
export function listSchedulingInfo(params) {
  return service({
    url: '/court/scheduling/listSchedulingInfo',
    method: 'get',
    params
  })
}
