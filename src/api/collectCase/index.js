import axiosConfig from '@/utils/axios.js'
// 创建正式用例接口基础配置
const service = axiosConfig.ajax()

/**
 * 预立案待审查案件列表
 * @params {string} lawCaseId 案件id
 */
export function queryPreCase(params) {
  return service({
    url: '/court/precase/queryPreCase',
    method: 'get',
    params
  })
}

/**
 * 查询预立案案件具体信息
 * @params {string} lawCaseId 案件id
 */
export function queryPreCaseInfo(params) {
  return service({
    url: '/court/precase/queryPreCaseInfo',
    method: 'get',
    params
  })
}

/**
 * 获取证据列表
 * @params {string} lawCaseId 案件id
 */
export function queryEvidence(params) {
  return service({
    url: '/court/evidence/queryEvidence',
    method: 'get',
    params
  })
}

/**
 * 审查案件
 * @params {string} preCaseId 预立案id
 * @params {string} result 结果
 * @params {string} remark 审查意见
 */
export function examineAdd(params) {
  return service({
    url: '/court/examine/add',
    method: 'post',
    params
  })
}

/**
 * 审查历史记录
 * @params {string} preCaseId 预立案id
 */
export function examineHistory(params) {
  return service({
    url: '/court/examine/list',
    method: 'get',
    params
  })
}

/**
 * 查询所有调解组织、单位、人员
 */
export function queryMediates(params) {
  return service({
    url: '/court/mediation/info/queryMediates',
    method: 'get',
    params
  })
}

/**
 * 转单位调解
 */
export function mediationAdd(params) {
  return service({
    url: '/court/mediation/info/add',
    method: 'post',
    data: params
  })
}

/**
 * 录入案号
 */
export function filingCase(params) {
  return service({
    url: '/court/case/filingCase',
    method: 'post',
    data: params
  })
}

/**
 * 移交审查
 * @params {string} preCaseId 预立案id
 * @params {string} judgeId 移交人员id
 */
export function transferCase(params) {
  return service({
    url: '/court/precase/transferCase',
    method: 'post',
    params
  })
}

/**
 * 删除预立案案件
 * @params {string} preCaseId 预立案id
 */
export function delPreCase(params) {
  return service({
    url: '/court/precase/delPreCase',
    method: 'post',
    params
  })
}

/**
 * 转下一流程
 */
export function nextProcess(params) {
  return service({
    url: '/court/case/nextProcess',
    method: 'post',
    data: params
  })
}

/**
 * 复制案件
 */
export function copyCase(params) {
  return service({
    url: '/court/case/copyCase',
    method: 'post',
    data: params
  })
}

/**
 * 获取流水号信息(复制案件)
 */
export function getSerialInfo(params) {
  return service({
    url: '/court/serial/getSerialInfo',
    method: 'get',
    params
  })
}

/**
 * 法院获取案件联动列表
 */
export function listTeamOfCase(params) {
  return service({
    url: '/court/query/listTeamOfCase',
    method: 'get',
    params
  })
}

/**
 * 草稿箱
 */
export function queryUnCompleteCase(params) {
  return service({
    url: '/court/case/queryUnCompleteCase',
    method: 'get',
    params
  })
}

/**
 * 删除
 */
export function delCaseList(params) {
  return service({
    url: '/court/case/delCaseList',
    method: 'post',
    params
  })
}
