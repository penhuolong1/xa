import axiosConfig from '@/utils/axios.js'
// 创建正式用例接口基础配置
const service = axiosConfig.ajax()

/**
 * 翔安区联动中心数据
 */
export function getCentgerCourt(params) {
  return service({
    url: '/court/center/getCentgerCourt',
    method: 'post',
    params
  })
}

/**
 * 万人成诉率
 */
export function getCenterChar(params) {
  return service({
    url: '/court/char/getCenterChar',
    method: 'post',
    params
  })
}

/**
 * 联动中心一览
 */
export function getCenterCourtStreet(params) {
  return service({
    url: '/court/street/getStreet',
    method: 'post',
    params
  })
}

/**
 * 街道|镇化解件数|化解率
 */
export function getStreetNum(params) {
  return service({
    url: '/court/street/getStreetNum',
    method: 'post',
    params
  })
}

/**
 * 纠纷趋势
 */
export function getDisputeNum(params) {
  return service({
    url: '/court/center/getDisputeNum',
    method: 'post',
    params
  })
}

/**
 * 纠纷类型分析
 */
export function getDispute(params) {
  return service({
    url: '/court/disputeallnum/getDispute',
    method: 'get',
    params
  })
}

/**
 * 查询联动单位|街道镇级联动单位|调解组织|调解员|年平均办案量数量
 */
export function getCourtNum(params) {
  return service({
    url: '/court/mediater/getCourtNum',
    method: 'post',
    params
  })
}

/**
 * 单位排行榜
 */
export function getCourtCaseNum(params) {
  return service({
    url: '/court/mediater/getCourtCaseNum',
    method: 'post',
    params
  })
}

/**
 * 组织排行榜
 */
export function getMediaterCourt(params) {
  return service({
    url: '/court/mediater/getMediaterCourt',
    method: 'post',
    params
  })
}

/**
 * 调解员类型
 */
export function getMediaterType(params) {
  return service({
    url: '/court/mediater/getMediaterType',
    method: 'post',
    params
  })
}

/**
 * 调解员排行榜
 */
export function getMediaterNum(params) {
  return service({
    url: '/court/mediater/getMediaterNum',
    method: 'post',
    params
  })
}

/**
 * 纠纷高发地预警(街道)
 */
export function getDisputeStreet(params) {
  return service({
    url: '/court/dispute/getDisputeStreet',
    method: 'post',
    params
  })
}

/**
 * 纠纷高发地预警(社区)
 */
export function getDisputeSCommunity(params) {
  return service({
    url: '/court/dispute/getDisputeSCommunity',
    method: 'post',
    params
  })
}
