import axiosConfig from '@/utils/axios.js'
// 创建正式用例接口基础配置
const service = axiosConfig.ajax()

// 诉前调查查询
export function listPreCaseInfo(params) {
  return service({
    url: '/court/precase/listPreCaseInfo',
    method: 'get',
    params
  })
}

/**
 * 适宜调解操作
 * @param {string} lawCaseId 案件id
 * @param {string} lawCaseState 案件状态（调解中）
 * @returns
 */
export function yetMediate(params) {
  return service({
    url: '/court/precase/yetMediate',
    method: 'post',
    data: params
  })
}

/**
 * 修改调查时间
 * @param {string} lawCaseId 案件id
 * @param {string} schedulingTime 调查时间
 * @param {string} tribunalId 地点
 * @param {object} noticeObjects 通知对象
 * @param {boolean} smsNotice true通知 false不通知
 * @param {string} content 短信内容
 * @returns
 */
export function editPreScheduling(params) {
  return service({
    url: '/court/scheduling/editPreScheduling',
    method: 'post',
    data: params
  })
}
