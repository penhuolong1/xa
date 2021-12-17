import axiosConfig from '@/utils/axios.js'
// 创建正式用例接口基础配置
const service = axiosConfig.ajax()

// ------诉非工作台

// 获取当前用户的各种子部门即调解员数据
export function getTotalCourt(params) {
  return service({
    url: '/sf/workbench/get/total/and/addition/count',
    method: 'get',
    data: params
  })
}

// 获取当前部门、组织 或调解员的 收案结案数量
export function getReceiveFinishCount(type) {
  return service({
    url: `/sf/workbench/get/receive/finish/count/by/${type}`,
    method: 'get'
  })
}

// 法官助理、速录员办理 情况详情
export function getPrecaseByUser() {
  return service({
    url: '/court/Statement/get/preCase/by/user',
    method: 'get'
  })
}
// 代办工作台数据
export function workbenchData() {
  return service({
    url: '/court/workbench/get/un/process/data',
    method: 'get'
  })
}
// 诉前案件统计
export function getPreCaseStatement(params) {
  return service({
    url: '/court/Statement/getPreCase',
    method: 'post',
    data: params
  })
}

// 获取前十的人们案由
export function topBrief(params) {
  return service({
    url: '/sf/workbench/get/top/10/brief',
    method: 'get',
    params
  })
}

// 获取调解员的排名
export function rankMediator(params, caseType) {
  return service({
    url: `/sf/workbench/get/${caseType}/rank/by/mediator`,
    method: 'get',
    params
  })
}

// 获取单位或组织的排名
export function getCaseTypeBydeptOrOrg(caseType, deptOrOrg, params) {
  return service({
    url: `/sf/workbench/get/${caseType}/rank/by/${deptOrOrg}`,
    method: 'get',
    params
  })
}

// 获取联动单位综合考评指标
export function getComprehensiveData(params) {
  return service({
    url: `/sf/workbench/get/comprehensive/data`,
    method: 'get',
    params
  })
}

// 获取调节成功率，在线调节率，平均调节时长
export function getMediatorRate(params) {
  return service({
    url: `/sf/workbench/get/mediator/online/rate`,
    method: 'get',
    params
  })
}

// 获取联动中心、单位的收案数等等
export function getDeptDetail(params) {
  return service({
    url: `/sf/workbench/get/dept/detail`,
    method: 'get',
    params
  })
}
