import axiosConfig from '@/utils/axios.js'
// 创建正式用例接口基础配置
const service = axiosConfig.ajax()

/**
 * 添加案件修改案件(sf)
 */
export function addSfLawCase(params) {
  return service({
    url: '/sf/operate/addSfLawCase',
    method: 'post',
    data: params
  })
}

/**
 * 查询案件详情(sf)
 */
export function sfCaseInfoById(params) {
  return service({
    url: '/sf/case/sfCaseInfoById',
    method: 'get',
    params
  })
}

/**
 * 删除调解记录(sf)
 */
export function delRecord(params) {
  return service({
    url: '/sf/record/delRecord',
    method: 'post',
    data: params
  })
}

/**
 * 编辑当事人(sf)
 */
export function editLitigant(params) {
  return service({
    url: '/sf/litigant/operate/editLitigant',
    method: 'post',
    data: params
  })
}

/**
 * 获取案件当事人(sf)
 */
export function listLitigantByCase(params) {
  return service({
    url: '/sf/litigant/listLitigantByCase',
    method: 'get',
    params
  })
}

/**
 * 保存文件信息(sf)
 */
export function saveMaterialInfo(params) {
  return service({
    url: '/sf/material/saveMaterialInfo',
    method: 'post',
    data: params
  })
}

/**
 * 查询待发列表(sf)
 */
export function listTempCase(params) {
  return service({
    url: '/sf/case/listTempCase',
    method: 'get',
    params
  })
}

/**
 * 提交审核案件
 */
export function submitCase(params) {
  return service({
    url: '/sf/operate/submitCase',
    method: 'post',
    data: params
  })
}

/**
 * 获取登录账号下级部门
 */
export function listChildOfUnit(params) {
  return service({
    url: '/sf/dept/listChildOfParentDept',
    method: 'get',
    params
  })
}

/**
 * 查询待审核列表
 */
export function listCheckCase(params) {
  return service({
    url: '/sf/case/listCheckCase',
    method: 'get',
    params
  })
}

/**
 * 删除案件
 */
export function delSfLawCase(params) {
  return service({
    url: '/sf/case/delSfLawCase',
    method: 'post',
    data: params
  })
}

/**
 * 查询待指派调节列表
 */
export function listPointCase(params) {
  return service({
    url: '/sf/case/listPointCase',
    method: 'get',
    params
  })
}

/**
 * 审核操作
 */
export function acceptCase(params) {
  return service({
    url: '/sf/operate/acceptCase',
    method: 'post',
    data: params
  })
}

/**
 * 交办下级单位（审核）
 */
export function assignChildOfCheck(params) {
  return service({
    url: '/sf/operate/assignChildOfCheck',
    method: 'post',
    data: params
  })
}

/**
 * 获取用户对案件的处理状态
 */
export function getHandleOfCase(params) {
  return service({
    url: '/sf/case/getHandleOfCase',
    method: 'get',
    params
  })
}

/**
 * 获取案件操作记录
 */
export function operateLogOfCase(params) {
  return service({
    url: '/sf/operate/operateLogOfCase',
    method: 'get',
    params
  })
}

/**
 * 指派调解机构/调解员
 */
export function pointCase(params) {
  return service({
    url: '/sf/operate/pointCase',
    method: 'post',
    data: params
  })
}

/**
 * 获取调解员
 */
export function listByDept(params) {
  return service({
    url: '/sf/mediator/listByDept',
    method: 'get',
    params
  })
}

/**
 * 办结案件
 */
export function caseClosed(params) {
  return service({
    url: '/sf/operate/caseClosed',
    method: 'post',
    data: params
  })
}

/**
 * 获取当事人简要信息
 */
export function listShortInfo(params) {
  return service({
    url: '/sf/litigant/listShortInfo',
    method: 'get',
    params
  })
}

/**
 * 删除当事人
 */
export function delLitigant(params) {
  return service({
    url: '/sf/litigant/operate/delLitigant',
    method: 'post',
    data: params
  })
}

/**
 * 获取当事人详情
 */
export function getInfoById(params) {
  return service({
    url: '/sf/litigant/getInfoById',
    method: 'get',
    params
  })
}

/**
 * 添加号码簿/地址簿信息
 */
export function editPhoneOrAddress(params) {
  return service({
    url: '/sf/litigant/operate/editPhoneOrAddress',
    method: 'post',
    data: params
  })
}

/**
 * 查询当事人电话簿/地址簿
 */
export function listBookOfLitigant(params) {
  return service({
    url: '/sf/litigant/listBookOfLitigant',
    method: 'get',
    params
  })
}

/**
 * 删除号码簿/地址簿
 */
export function delPhoneOrAddress(params) {
  return service({
    url: '/sf/litigant/operate/delPhoneOrAddress',
    method: 'post',
    data: params
  })
}

/**
 * 编辑代理人
 */
export function editAgent(params) {
  return service({
    url: '/sf/agent/editAgent',
    method: 'post',
    data: params
  })
}

/**
 * 查询案件对应材料信息
 */
export function listSfMaterialByFileType(params) {
  return service({
    url: '/sf/material/listSfMaterialByFileType',
    method: 'get',
    params
  })
}

/**
 * 获取当事人所有代理人信息
 */
export function listAgentOfLitigant(params) {
  return service({
    url: '/sf/agent/listAgentOfLitigant',
    method: 'get',
    params
  })
}

/**
 * 获取同一案件相同诉讼地位的信息
 */
export function listAgentByStatus(params) {
  return service({
    url: '/sf/agent/listAgentByStatus',
    method: 'get',
    params
  })
}

/**
 * 删除证据
 */
export function delEvidence(params) {
  return service({
    url: '/sf/material/delEvidence',
    method: 'post',
    data: params
  })
}

/**
 * 删除代理人
 */
export function delAgent(params) {
  return service({
    url: '/sf/agent/delAgent',
    method: 'post',
    data: params
  })
}

/**
 * 删除文件
 */
export function delFileById(params) {
  return service({
    url: '/sf/material/delFileById',
    method: 'post',
    data: params
  })
}

/**
 * 根据参数查询对应部门
 */
export function listDeptListByArgs(params) {
  return service({
    url: '/sf/dept/listDeptListByArgs',
    method: 'get',
    params
  })
}

/**
 * 申请联动
 */
export function addTeam(params) {
  return service({
    url: '/sf/team/operate/addTeam',
    method: 'post',
    data: params
  })
}

/**
 * 联动中列表
 */
export function listCaseOfTeam(params) {
  return service({
    url: '/sf/team/listCaseOfTeam',
    method: 'get',
    params
  })
}

/**
 * 获取联动信息
 */
export function listTeamInfo(params) {
  return service({
    url: '/sf/team/listTeamInfo',
    method: 'get',
    params
  })
}

/**
 * 获取测回联动
 */
export function cancelTeam(params) {
  return service({
    url: '/sf/team/operate/cancelTeam',
    method: 'post',
    data: params
  })
}

/**
 * 修改联动内容
 */
export function updateTeam(params) {
  return service({
    url: '/sf/team/operate/updateTeam',
    method: 'post',
    data: params
  })
}

/**
 * 结束本次联动
 */
export function finishTeam(params) {
  return service({
    url: '/sf/team/operate/finishTeam',
    method: 'post',
    data: params
  })
}

/**
 * 退回本次联动
 */
export function handleTeam(params) {
  return service({
    url: '/sf/team/operate/handleTeam',
    method: 'post',
    data: params
  })
}

/**
 * 查询调解中案件列表
 */
export function listMediateOfCase(params) {
  return service({
    url: '/sf/case/listMediateOfCase',
    method: 'get',
    params
  })
}

/**
 * 结案列表
 */
export function listEndCase(params) {
  return service({
    url: '/sf/case/listEndCase',
    method: 'get',
    params
  })
}

/**
 * 获取调解地点 type 1法院 2 诉非
 */
export function listPlace(params) {
  return service({
    url: '/court/tribunal/listTribunal',
    method: 'get',
    params
  })
}

/**
 * 调解员接收案件
 */
export function acceptOfMediator(params) {
  return service({
    url: '/sf/operate/acceptOfMediator',
    method: 'post',
    data: params
  })
}

/**
 * 联动日志
 */
export function listTeamLogById(params) {
  return service({
    url: '/sf/team/log/listTeamLogById',
    method: 'get',
    params
  })
}

/**
 * 查询案件调解记录
 */
export function listRecord(params) {
  return service({
    url: '/sf/record/listRecord',
    method: 'get',
    params
  })
}

/**
 * 编辑调解管理
 */
export function editRecord(params) {
  return service({
    url: '/sf/record/editRecord',
    method: 'post',
    data: params
  })
}

/**
 * 化解结果
 */
export function editMediateResult(params) {
  return service({
    url: '/sf/operate/editMediateResult',
    method: 'post',
    data: params
  })
}

/**
 * 获取法院赋强所需文件
 */
export function queryForMoveCourt(params) {
  return service({
    url: '/sf/archive/file/queryForMoveCourt',
    method: 'get',
    params
  })
}

/**
 * 获取某个目录下的所有卷宗文件
 * @params {file} file 文件
 * @params {string} sfLawCaseId 案件id
 * @params {string} type 1 解协议书 2司法确认申请书
 */
export function updateForMoveCourt(params) {
  return service({
    url: '/sf/archive/file/updateForMoveCourt',
    header: {
      'Content-Type': 'multipart/form-data'
    },
    method: 'post',
    data: params
  })
}

/**
 * 法院赋强
 */
export function moveCourt(params) {
  return service({
    url: '/sf/operate/moveCourt',
    method: 'post',
    data: params
  })
}

/**
 * 查询法院赋强信息
 */
export function getMoveInfo(params) {
  return service({
    url: '/sf/case/getMoveInfo',
    method: 'get',
    params
  })
}

/**
 * 查询赋强案件
 */
export function listOfMove(params) {
  return service({
    url: '/sf/case/listOfMove',
    method: 'get',
    params
  })
}

/**
 * 法院案件提交案件操作
 */
export function submitToCourt(params) {
  return service({
    url: '/sf/operate/submitToCourt',
    method: 'post',
    data: params
  })
}

/**
 * 查看化解结果
 */
export function getResultOfCase(params) {
  return service({
    url: '/sf/case/getResultOfCase',
    method: 'get',
    params
  })
}

/**
 * 查看审查材料
 */
export function listOfCase(params) {
  return service({
    url: '/sf/temp/listOfCase',
    method: 'get',
    params
  })
}
// 代理人信息
export function listAgentIdInfo(params) {
  return service({
    url: '/court/agent/listAgentIdInfo',
    method: 'get',
    params
  })
}

// 联动回复
export function replyTeam(params) {
  return service({
    url: '/sf/team/operate/replyTeam',
    method: 'post',
    data: params
  })
}

// 查看协同详情 sfteamid
export function teamInfoById(params) {
  return service({
    url: '/sf/team/teamInfoById',
    method: 'get',
    params
  })
}
