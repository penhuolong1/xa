import axiosConfig from '@/utils/axios.js'
// 创建正式用例接口基础配置
const service = axiosConfig.ajax()
/**
 * 鉴定案件列表(全部、保全中、已完成)
 */
export function caseList(params) {
  return service({
    url: '/court/appraisal/view/appraisalCase',
    method: 'post',
    header: {
      'Content-Type': 'application/json'
    },
    data: params
  })
}
/**
 * 保全案件列表(全部、保全中、已完成)
 */
export function preservationCase(params) {
  return service({
    url: '/court/preservation/view/preservationCase',
    method: 'post',
    header: {
      'Content-Type': 'application/json'
    },
    data: params
  })
}
/**
 * 添加鉴定
 */
export function addappraisalCase(params) {
  return service({
    url: '/court/appraisal/add/appraisalCase',
    method: 'post',
    header: {
      'Content-Type': 'application/json'
    },
    data: params
  })
}
/**
 * 添加保全
 */
export function addpreservationCase(params) {
  return service({
    url: '/court/preservation/add/preservationCase',
    method: 'post',
    header: {
      'Content-Type': 'application/json'
    },
    data: params
  })
}

/**
 * 获取保全案件当前状态
 */
export function refundedstate(lawcaseId) {
  return service({
    url: `/court/case/get/${lawcaseId}/refunded/state`,
    method: 'get'
  })
}

/**
 * 修改鉴定类别
 */
export function change(params) {
  return service({
    url: '/court/appraisal/change/appraisalCase/type',
    method: 'post',
    header: {
      'Content-Type': 'application/json'
    },
    data: params
  })
}
/**
 * 鉴定结束
 */
export function finishappraisalCase(params) {
  return service({
    url: '/court/appraisal/finish/appraisalCase',
    method: 'post',
    data: params
  })
}

/**
 * 访问指定案件的审核记录
 */
export function appraisalCaseFocus(params, lawCase) {
  return service({
    url: '/court/appraisal/view/appraisalCase/by/' + lawCase,
    method: 'get',
    params
  })
}
/**
 * 访问指定案件的冻结记录
 */
export function preservationCaseFocus(params, lawCase) {
  return service({
    url: '/court/preservation/view/preservationCase/by/' + lawCase,
    method: 'get',
    params
  })
}
/**
 * 保全结束
 */
export function finishpreservationCase(params) {
  return service({
    url: '/court/preservation/finish/preservationCase',
    method: 'post',
    header: {
      'Content-Type': 'application/json'
    },
    data: params
  })
}
/**
 * 补录保全案号
 */
export function append(params) {
  return service({
    url: '/court/preservation/append/preservationCase/no',
    method: 'post',
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    params
  })
}
// 修改保全案号
export function changeCaseNo(persevationId, params) {
  return service({
    url: `/court/preservation/change/${persevationId}/no`,
    method: 'post',
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    params
  })
}
/**
 * 结案
 */
export function finish(params) {
  return service({
    url: '/court/case/finish/lawCase',
    header: {
      'Content-Type': 'application/json'
    },
    method: 'post',
    data: params
  })
}

/**
 *同步榕基列表数据
 */
export function listIntranetInfo(params) {
  return service({
    url: '/court/intranet/listIntranetInfo',
    method: 'get',
    params
  })
}

/**
 *同步榕基
 */
export function importIntranetCase(params) {
  return service({
    url: '/court/intranet/importIntranetCase',
    method: 'post',
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    params
  })
}
/**
 * 待指派调解员案件列表
 */
export function mediationlist(params) {
  return service({
    url: '/court/mediation/info/view/mediation',
    header: {
      'Content-Type': 'application/json'
    },
    method: 'post',
    data: params
  })
}
/**
 * 待指派调解员退回上一流程
 */
export function refunded(params) {
  return service({
    url: '/court/mediation/info/refunded/lawCase',
    method: 'post',
    header: {
      'Content-Type': 'application/json'
    },
    data: params
  })
}
/**
 * 指派调解员
 */
export function appointed(params, lawCase) {
  return service({
    url: '/court/mediation/info/appointed/' + lawCase,
    method: 'post',

    data: params
  })
}
// 待指派调解员-获取发送调解模板
export function mediateMessage(params, lawCaseId) {
  return service({
    url: `/court/template/get/mediate/${lawCaseId}/message/content`,
    method: 'get',
    params
  })
}
/**
 * 指派调解员-转下一流程
 */
export function unSendNextProcess(params) {
  return service({
    url: '/court/process/unSend/nextProcess',
    method: 'post',
    header: {
      'Content-Type': 'application/json'
    },
    data: params
  })
}
// 待指派调解员--获取案件的调节地点
export function getMediatePlace(lawCaseId) {
  return service({
    url: `/court/mediation/info/get/${lawCaseId}/mediatePlace`,
    method: 'get'
  })
}
/**
 * 修改调解时间
 */
export function changemediationTime(params) {
  return service({
    url: '/court/mediation/info/change/mediationTime/lawCase',
    method: 'post',
    header: {
      'Content-Type': 'application/json'
    },
    data: params
  })
}
/**
 * 调节中案件列表
 */
export function onMediation(params) {
  return service({
    url: '/court/mediation/info/view/onMediation',
    method: 'POST',
    data: params
  })
}
/**
 * 退回到待指派调解员
 */
export function refundonMediation(params) {
  return service({
    url: '/court/mediation/info/refund/onMediation/lawCase',
    method: 'post',
    header: {
      'Content-Type': 'application/json'
    },
    data: params
  })
}
/**
 * 退回到待指派调解员
 */
export function refundonSendProcess(params) {
  return service({
    url: '/court/process/refunded/sendProcess',
    method: 'post',
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: params
  })
}
/**
 * 修改调解中时间
 */
export function changeonMediationTime(params) {
  return service({
    url: '/court/mediation/info/refund/onMediation',
    method: 'post',
    header: {
      'Content-Type': 'multipart/form-data'
    },
    params
  })
}
/**
 * 调节中-转下一流程
 */
export function mediationNextProcess(params) {
  return service({
    url: '/court/mediation/info/nextProcess',
    method: 'post',
    header: {
      'Content-Type': 'application/json'
    },
    data: params
  })
}
/**
 * 申请联动
 */
export function addCollaborative(params) {
  return service({
    url: '/court/collaborative/add/collaborative/mediationCase',
    method: 'post',
    header: {
      'Content-Type': 'application/json'
    },
    data: params
  })
}

/**
 * 联动案件列表
 */
export function collaborationList(params) {
  return service({
    url: '/court/collaborative/view/collaborativeType/by/userRole',
    method: 'post',
    header: {
      'Content-Type': 'application/json'
    },
    data: params
  })
}

/**
 * 联动调解-联动：指派
 */
export function appointMediator(params) {
  return service({
    url: '/court/collaborative/appoint/mediator',
    method: 'post',
    header: {
      'Content-Type': 'multipart/form-data'
    },
    data: params
  })
}

/**
 * 联动撤回
 */
export function withdraw(params) {
  return service({
    url: '/court/collaborative/withdraw/collaborativeCase',
    method: 'POST',
    header: {
      'Content-Type': 'multipart/form-data'
    },
    data: params
  })
}
/**
 * 联动办结
 */
export function finishCase(params) {
  return service({
    url: 'court/collaborative/finish/collaborativeCase',
    method: 'POST',
    header: {
      'Content-Type': 'multipart/form-data'
    },
    data: params
  })
}
/**
 * 联动修改
 */
export function changeInfo(params) {
  return service({
    url: 'court/collaborative/change/collaborativeCase',
    method: 'POST',
    header: {
      'Content-Type': 'multipart/form-data'
    },
    data: params
  })
}
/**
 * 案件备注列表
 */
export function remarks(params, lawCase) {
  return service({
    url: '/court/remark/view/remarks/' + lawCase,
    method: 'GET',
    params
  })
}

/**
 * 添加案件备注---（使用原有状态/追加新状态）
 */
export function addremark(params) {
  return service({
    url: '/court/remark/add/remark',
    method: 'POST',
    data: params
  })
}

/**
 * 浏览指定案件的联动记录
 */
export function viewCollaborative(params, lawCase) {
  return service({
    url: `/court/collaborative/view/${lawCase}/collaborative`,
    method: 'GET',
    params
  })
}

/**
 * 联动办理
 */
export function answerAdd(params) {
  return service({
    url: '/court/collaborativeAnswer/add/answer',
    method: 'POST',
    header: {
      'Content-Type': 'application/json'
    },
    data: params
  })
}
/**
 * 查看联动
 */
export function viewAnswer(params, collaborativeId) {
  return service({
    url: '/court/collaborativeAnswer/view/' + collaborativeId + '/answer',
    method: 'GET',
    params
  })
}
/**
 * 待指派送达员案件列表
 */
export function unSend(params) {
  return service({
    url: '/court/process/view/lawCase/unSend',
    method: 'GET',
    params
  })
}

/**
 * 待指派送达-指派
 */
export function appoint(params) {
  return service({
    url: '/court/process/appoint/sendProcess',
    method: 'POST',
    header: {
      'Content-Type': 'application/json'
    },
    data: params
  })
}

// 指派送达员回填
export function relationSender(lawcaseId) {
  return service({
    url: `/court/with/sender/get/${lawcaseId}/relation/sender`,
    method: 'GET'
  })
}
/**
 * 送达案件列表
 */
export function onSend(params) {
  return service({
    url: '/court/process/view/lawCase/onSend',
    method: 'GET',
    params
  })
}

/**
 * 移交案件
 */
export function transLawCase(params) {
  return service({
    url: '/court/process/trans/lawCase/to/other/sender',
    method: 'POST',
    header: {
      'Content-Type': 'application/json'
    },
    data: params
  })
}

/**
 * 退回
 */
export function refundedLawCase(params) {
  return service({
    url: '/court/process/refunded/onSend/lawCase',
    method: 'POST',
    header: {
      'Content-Type': 'application/json'
    },
    data: params
  })
}
/**
 * 转为普通案件
 */
export function changeProcedures(params) {
  return service({
    url: '/court/process/change/LawCase/to/procedures',
    method: 'POST',
    header: {
      'Content-Type': 'application/json'
    },
    data: params
  })
}
/**
 * 送达完成案件列表
 */
export function unVerifyList(params) {
  return service({
    url: '/court/process/view/unVerify/lawCase',
    method: 'GET',
    params
  })
}

/**
 * 复核
 */
export function verifyLawCase(params) {
  return service({
    url: '/court/process/verify/lawCase',
    method: 'POST',
    header: {
      'Content-Type': 'application/json'
    },
    data: params
  })
}
/**
 * 送达中-转下一流程
 */
export function sendingNextProcess(params) {
  return service({
    url: '/court/process/sending/nextProcess',
    method: 'POST',
    header: {
      'Content-Type': 'application/json'
    },
    data: params
  })
}

/**
 * 送达中-地图模式
 */
export function sender() {
  return service({
    url: '/court/send/view/unSend/by/sender',
    method: 'get'

  })
}
/**
 * 送达待复核退回
 */
export function refundedSending(params) {
  return service({
    url: '/court/process/refunded/verify/lawCase',
    method: 'POST',
    header: {
      'Content-Type': 'application/json'
    },
    data: params
  })
}

/**
 * 待庭室接收案件列表
 */
export function unReceiveList(params) {
  return service({
    url: '/court/process/view/unReceive/lawCase',
    method: 'GET',
    params
  })
}
/**
 * 待庭室接收-接收
 */
export function receiveLawCase(params) {
  return service({
    url: '/court/process/receive/lawCase',
    method: 'POST',
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: params
  })
}

/**
 * 待庭室接收-退回
 */
export function refundedSend(params) {
  return service({
    url: '/court/process/refunded/lawCase/to/other/status',
    method: 'POST',
    header: {
      'Content-Type': 'application/json'
    },
    data: params
  })
}

/**
 * 案件备注列表
 */
export function remarksList(params, lawCase) {
  return service({
    url: '/court/remark/view/remarks/' + lawCase,
    method: 'GET',
    params
  })
}
/**
 * 案件整体流程
 */
export function precessLog(lawCaseId) {
  return service({
    url: `/court/process/log/view/${lawCaseId}/precess/log`,
    method: 'GET'
  })
}
/**
 * 浏览全部案件列表
 */
export function allCase(params) {
  return service({
    url: '/court/case/view/all/case',
    method: 'POSt',
    header: {
      'Content-Type': 'application/json'
    },
    data: params
  })
}

/**
 * 全案件列表-转下一流程
 */
export function allCaseNext(params) {
  return service({
    url: '/court/case/toNextProcess',
    method: 'POSt',
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: params
  })
}

/**
 * 查找签章文书
 */
export function queryDipSign(params) {
  return service({
    url: '/court/sign/queryDipSign',
    method: 'GET',
    params
  })
}

/**
 * 案件当事人地址详情
 */
export function listLitAddr(params) {
  return service({
    url: '/court/litigant/listLitAddr',
    method: 'GET',
    params
  })
}

/**
 * 我的案件列表
 */
export function myCase(params) {
  return service({
    url: '/court/case/view/all/my/case',
    method: 'POSt',
    header: {
      'Content-Type': 'application/json'
    },
    data: params
  })
}

/**
 * 当事人信息库
 */
export function litigantInfo(params) {
  return service({
    url: '/court/litigant/info/view/all',
    method: 'GET',
    params
  })
}

/**
 *当事人信息库-加入/移除黑名单
 */
export function changeBlock(params) {
  return service({
    url: '/court/litigant/info/change/block',
    method: 'POSt',
    header: {
      'Content-Type': 'application/json'
    },
    data: params
  })
}

/**
 * 当事人信息库-删除
 */
export function remove(params) {
  return service({
    url: '/court/litigant/info/remove',
    method: 'POSt',
    header: {
      'Content-Type': 'application/json'
    },
    data: params
  })
}

/**
 * 当事人信息库-增加/修改
 */
export function addUpdate(params) {
  return service({
    url: '/court/litigant/info/add/or/update/litigant',
    method: 'POSt',
    header: {
      'Content-Type': 'application/json'
    },
    data: params
  })
}

/**
 * 当事人信息库-查询详情
 */
export function getDetail(id) {
  return service({
    url: `/court/litigant/info/view/${id}/info`,
    method: 'get'
  })
}

/**
 * 当前案件退回的上一流程的状态
 */
export function stateTop(lawCaseId) {
  return service({
    url: `/court/state/log/view/${lawCaseId}/state/top`,
    method: 'get'
  })
}

/**
 * 复核表单-转下一流程排期时间需要回填
 */
export function infoTime(sendProcessId) {
  return service({
    url: `/court/process/verify/view/${sendProcessId}/info`,
    method: 'get'
  })
}

/**
 * 诉非-查询案件备注信息
 */
export function sflistCaseRemark(params) {
  return service({
    url: '/sf/remark/listCaseRemark',
    method: 'get',
    params
  })
}

/**
 * 诉非-新增/编辑 环节备注
 */
export function sfaddremark(params) {
  return service({
    url: '/sf/remark/addOrEdit',
    method: 'post',
    data: params
  })
}

/**
 * 诉非-环节备注  删除备注
 */
export function sfdelremark(params) {
  return service({
    url: '/sf/remark/del',
    method: 'post',
    data: params
  })
}

/**
 * 诉非-案件整体流程  案件日志查询
 */
export function sflogOfCase(params) {
  return service({
    url: '/sf/log/logOfCase',
    method: 'get',
    params
  })
}

/**
 * 诉非-文书送达 查询送达记录
 */
export function sflistOfCase(params) {
  return service({
    url: '/sf/send/listOfCase',
    method: 'get',
    params
  })
}
/**
 * 诉非-文书送达 文书详情
 */
export function litReceiveDip(params) {
  return service({
    url: '/court/send/litReceiveDip',
    method: 'get',
    params
  })
}

/**
 *新增/编辑 送达文书
 */
export function editSend(params) {
  return service({
    url: '/sf/send/editSend',
    method: 'post',
    data: params
  })
}

/**
 *根据参数查询对应部门
 */
export function listDeptListByArgs(params) {
  return service({
    url: '/sf/dept/listDeptListByArgs',
    method: 'get',
    params
  })
}

/**
 *获取部门调解员
 */
export function sfmediator(params) {
  return service({
    url: '/sf/mediator/listByDept',
    method: 'get',
    params
  })
}

/**
 *诉非-删除送达记录
 */
export function sfdelSend(params) {
  return service({
    url: '/sf/send/del',
    method: 'post',
    data: params
  })
}

// 获取当前用户的各种子部门即调解员数据
export function getTotalCount(params) {
  return service({
    url: '/sf/workbench/get/total/and/addition/count',
    method: 'get',
    params
  })
}

// ========================法院工作态======================
// 工作台电话列表
// 保存来去电信息
export function saveCallLog(params) {
  return service({
    url: '/court/preCallLog/saveCallLog',
    method: 'post',
    data: params
  })
}

// 暂存电话列表
export function listTempCallLog(params) {
  return service({
    url: '/court/preCallLog/listTempCallLog',
    method: 'get',
    params
  })
}

// 清除电话记录
export function delCallLog(params) {
  return service({
    url: '/court/preCallLog/delCallLog',
    method: 'post',
    data: params
  })
}

// 查询手机号对应当事人以及案号
export function listInfoByPhone(params) {
  return service({
    url: '/court/preCallLog/listInfoByPhone',
    method: 'get',
    params
  })
}
// 绑定案件
export function bindCase(params) {
  return service({
    url: '/court/preCallLog/bindCase',
    method: 'post',
    data: params
  })
}
// 更改诉前是否可排期
export function updateCaseSchedule(params) {
  return service({
    url: '/court/scheduling/updateCaseSchedule',
    method: 'post',
    data: params
  })
}
// 回填排庭信息
export function getScheduleInfo(lawCaseId) {
  return service({
    url: `/court/scheduling/get/${lawCaseId}/schedule`,
    method: 'get'
  })
}
// 回填预约时间
export function getReserveInfo(lawCaseId) {
  return service({
    url: `/court/scheduling/get/${lawCaseId}/reserve/schedule`,
    method: 'get'
  })
}
// ======================获取短信模板================
// 指派调解员通知当事人
export function appointMessage(id, params) {
  return service({
    url: `/court/template/get/appoint/${id}/mediate/send/litigant/message`,
    method: 'get',
    params
  })
}
// 指派调解员、组织 通知调解员、组织
export function mediateOrDeptMessage(id, params) {
  return service({
    url: `/court/template/get/appoint/${id}/mediate/send/mediateOrDept/message`,
    method: 'get',
    params
  })
}
// 修改调节时间通知当事人、组织、调解员
export function timeMessage(id, type, params) {
  return service({
    url: `/court/template/get/change/${id}/mediate/time/${type}/message`,
    method: 'get',
    params
  })
}
// 申请协同短信模板
export function collaborativeMessage(lawCaseid, type, params) {
  return service({
    url: `/court/template/get/court/${lawCaseid}/collaborative/${type}/message/content`,
    method: 'get',
    params
  })
}
// 复核案件、送达转下一流程 提示模板
export function reviewMessage(id, params) {
  return service({
    url: `/court/template/get/verify/${id}/message/content`,
    method: 'get',
    params
  })
}

