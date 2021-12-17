import axiosConfig from '@/utils/axios.js'
// 创建正式用例接口基础配置
const service = axiosConfig.ajax()

/**
 * 获取案由
 * @params {string} name 案由名字
 */
export function getBrief(params) {
  const params1 = {
    ...params,
    pageSize: 100
  }
  return service({
    url: '/court/brief/query',
    method: 'get',
    params: params1
  })
}

/**
 * 添加案件修改案件
 */
export function addOrUpdateCase(params) {
  return service({
    url: '/court/case/addOrUpdateCase',
    method: 'post',
    data: params
  })
}

/**
 * 获取工作人员信息接口
 * @params {string} name 姓名
 * @params {string} type 类型
 */
export function queryJudge(params) {
  return service({
    url: '/court/judge/queryJudge',
    method: 'get',
    params
  })
}

/**
 * 获取案件详情
 * @params {string} lawCaseId 案件id
 */
export function queryById(params) {
  return service({
    url: '/court/case/queryById',
    method: 'get',
    params
  })
}

/**
 * 获取案件列表
 */
export function queryCaseInfo(params) {
  return service({
    url: '/court/case/queryCaseInfo',
    method: 'get',
    params
  })
}

/**
 * 添加修改当事人
 */
export function addOrUpdateLitigant(params) {
  return service({
    url: '/court/litigant/addOrUpdateLitigant',
    method: 'post',
    data: params
  })
}

/**
 * 查询当事人信息
 */
export function queryLitigant(params) {
  return service({
    url: '/court/litigant/queryLitigant',
    method: 'get',
    params
  })
}

/**
 * 确认预立案信息
 */
export function addPreCasePartInfo(params) {
  return service({
    url: '/court/case/addPreCasePartInfo',
    method: 'post',
    data: params
  })
}

/**
 * 查询预立案信息
 * @params {string} lawCaseId 案件id
 */
export function queryPreCaseInfo(params) {
  return service({
    url: '/court/case/queryPreCaseInfo',
    method: 'get',
    params
  })
}

/**
 * 查询预立案信息
 * @params {string} lawCaseId 案件id
 */
export function getNewSerial(params) {
  return service({
    url: '/court/serial/getNewSerial',
    method: 'get',
    params
  })
}

/**
 * 删除当事人
 * @params {string} litigantId 案件id
 */
export function delLitigant(params) {
  return service({
    url: '/court/litigant/delLitigant',
    method: 'post',
    params
  })
}

/**
 * 查询当事人详情
 * @params {string} litigantId 案件id
 */
export function queryLitInfo(params) {
  return service({
    url: '/court/litigant/queryLitInfo',
    method: 'get',
    params
  })
}

/**
 * 删除联系方式
 * @params {string} litPhoneId 联系方式id
 */
export function delLitPhone(params) {
  return service({
    url: '/court/phone/delLitPhone',
    method: 'post',
    params
  })
}

/**
 * 删除地址
 * @params {string} litAddrId 地址id
 */
export function delLitAddr(params) {
  return service({
    url: '/court/address/delLitAddr',
    method: 'post',
    params
  })
}

/**
 * 获取申请流水号
 */
export function getApplySerial(params) {
  return service({
    url: '/court/serial/getApplySerial',
    method: 'get',
    params
  })
}

/**
 * 获取部门列表
 * @params {string} type 类型
 * @params {string} name 名称
 *
 */
export function queryDepartment(params) {
  return service({
    url: '/court/department/queryDepartment',
    method: 'get',
    params
  })
}

/**
 * 添加备注
 * @params {string} type 类型
 * @params {string} name 名称
 *
 */
export function addRemark(params) {
  return service({
    url: '/court/remark/add/remark',
    header: {
      'Content-Type': 'multipart/form-data'
    },
    method: 'post',
    params
  })
}

/**
 * 添加证据
 *
 */
export function saveQtwEvidence(params) {
  return service({
    url: '/court/qtw/saveQtwEvidence',
    method: 'post',
    data: params
  })
}

/**
 * 查询举证质证时间
 *
 */
export function queryQtwTime(params) {
  return service({
    url: '/court/qtw/queryQtwTime',
    method: 'get',
    params
  })
}

/**
 * 结束质证
 */
export function endQtw(params) {
  return service({
    url: '/court/qtw/endQtw',
    method: 'post',
    data: params
  })
}

/**
 * 举证质证查询
 */
export function listQtwInfo(params) {
  return service({
    url: '/court/qtw/listQtwInfo',
    method: 'get',
    params
  })
}

/**
 * 添加质证记录
 */
export function addQtwVerify(params) {
  return service({
    url: '/court/qtw/addQtwVerify',
    method: 'post',
    data: params
  })
}

/**
 * 审核/重新审核
 */
export function qtwresetListInfo(params) {
  return service({
    url: '/court/qtw/resetListInfo',
    method: 'post',
    data: params
  })
}

/**
 *删除质证清单信息
 */
export function delListInfo(params) {
  return service({
    url: '/court/qtw/delListInfo',
    method: 'post',
    data: params
  })
}

/**
 *添加/修改记录
 */
export function editRecord(params) {
  return service({
    url: '/court/preRecord/editPreRecord',
    method: 'post',
    data: params
  })
}

/**
 *查询诉前程序记录
 */
export function listPreRecordInfo(params) {
  return service({
    url: '/court/preRecord/listPreRecordInfo',
    method: 'get',
    params
  })
}

/**
 * 删除诉前程序
 */
export function delRecord(params) {
  return service({
    url: '/court/preRecord/delRecord',
    method: 'post',
    data: params
  })
}

/**
 * 删除质证
 */
export function delQtwVerifyInfo(params) {
  return service({
    url: '/court/qtw/delQtwVerifyInfo',
    method: 'post',
    data: params
  })
}

/**
 * 案件详情头部信息
 */
export function preCaseInfo(params) {
  return service({
    url: '/court/precase/preCaseInfo',
    method: 'get',
    params
  })
}

/**
 * 添加代理人
 */
export function addOrUpdateAgent(params) {
  return service({
    url: '/court/agent/addOrUpdateAgent',
    method: 'post',
    data: params
  })
}

/**
 * 获取当事人的代理信息
 */
export function queryLitAgentInfo(params) {
  return service({
    url: '/court/agent/queryLitAgentInfo',
    method: 'get',
    params
  })
}

/**
 * 删除代理人信息
 */
export function delAgent(params) {
  return service({
    url: '/court/agent/delAgent',
    method: 'post',
    params
  })
}

/**
 * 查询案件当事人及关联代理人
 */
export function listLitInfo(params) {
  return service({
    url: '/court/litigant/listLitInfo',
    method: 'get',
    params
  })
}

/**
 * 查询案件当事人及关联代理人
 */
export function listAllAgents(params) {
  return service({
    url: '/court/agent/listAllAgents',
    method: 'get',
    params
  })
}

/**
 * 查询代理人信息库信息
 */
export function queryAgent(params) {
  return service({
    url: '/court/agent/queryAgent',
    method: 'get',
    params
  })
}

/**
 * 聊天上传文件
 */
export function chatUploadFile(params) {
  return service({
    url: '/court/chat/uploadFile',
    header: {
      'Content-Type': 'multipart/form-data'
    },
    method: 'post',
    data: params
  })
}

/**
 * 获取历史聊天记录
 */
export function listChatMessage(params) {
  return service({
    url: '/court/chat/listChatMessage',
    method: 'get',
    params
  })
}

/**
 * 法院获取机构信息
 */
export function listDetp(params) {
  return service({
    url: '/court/query/listDept',
    method: 'get',
    params
  })
}

/**
 * 法院获取专职调解员
 */
export function listMediator(params) {
  return service({
    url: '/court/query/listMediator',
    method: 'get',
    params
  })
}

/**
 * 法院查询 联动列表
 */
export function listTeam(params) {
  return service({
    url: '/court/query/listTeam',
    method: 'get',
    params
  })
}

/**
 * 查询案由树形结构
 */
export function briefTree(type) {
  return service({
    url: `/court/brief/view/${type}/law/tree`,
    method: 'get'
  })
}

/**
 * 确认完成立案
 */
export function completeAddCase(params) {
  return service({
    url: `/court/case/completeAddCase`,
    method: 'post',
    params
  })
}

/**
 * 获取送达流程表
 */
export function downSendInfoFile(params) {
  return service({
    url: `/court/send/downSendInfoFile`,
    method: 'get',
    params
  })
}

// 法院证据信息
export function listEvidence(params) {
  return service({
    url: '/court/evidence/listEvidence',
    method: 'get',
    params
  })
}

// 法院删除证据
export function delEvidence(params) {
  return service({
    url: '/court/evidence/delEvidence',
    method: 'post',
    params
  })
}

// 法院删除证据
export function caseRate() {
  return service({
    url: '/court/allot/caseRate',
    method: 'get',
    params: { type: 1 }
  })
}

// 待指派联动
export function listTeamOfPoint(params) {
  return service({
    url: '/sf/team/listTeamOfPoint',
    method: 'get',
    params
  })
}

// 联动中
export function listTeamOfHandling(params) {
  return service({
    url: '/sf/team/listTeamOfHandling',
    method: 'get',
    params
  })
}

// 获取代理人代理的当事人信息
export function queryAgentLit(params) {
  return service({
    url: '/court/agent/queryAgentLit',
    method: 'get',
    params
  })
}

// 修改代理人代理的当事人对应关系
export function updateAgentLit(params) {
  return service({
    url: '/court/agent/updateAgentLit',
    method: 'post',
    data: params
  })
}

// 删除证据文件
export function delEvidenceFile(params) {
  return service({
    url: '/court/file/delEvidenceFile',
    method: 'post',
    params
  })
}

// 修改当事人起诉状态
export function changeSueState(params) {
  return service({
    url: '/court/litigant/changeSueState',
    method: 'post',
    params
  })
}
