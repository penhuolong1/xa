import axiosConfig from '@/utils/axios.js'
// 创建正式用例接口基础配置
const service = axiosConfig.ajax()

/**
 * 进入视频房间
 * @params {string} lawCaseId 案件id
 */
export function intoRoom(params) {
  return service({
    url: '/court/room/intoRoom',
    method: 'post',
    params
  })
}

/**
 * 退出视频房间
 * @params {string} lawCaseId 案件id
 */
export function quitRoom(params) {
  return service({
    url: '/court/room/quitRoom',
    method: 'post',
    params
  })
}

/**
 * 获取人员信息
 * @params {string} lawCaseId 案件id
 */
export function userDetail(params) {
  return service({
    url: '/court/room/userDetail',
    method: 'get',
    params
  })
}

/**
 * sf进入视频房间
 * @params {string} sfLawCaseId 案件id
 */
export function intoSfRoom(params) {
  return service({
    url: '/court/room/intoSfRoom',
    method: 'post',
    params
  })
}

/**
 * sf退出视频房间
 * @params {string} sfLawCaseId 案件id
 */
export function quitSfRoom(params) {
  return service({
    url: '/court/room/quitSfRoom',
    method: 'post',
    params
  })
}

/**
 * sf获取人员
 * @params {string} userid 案件id
 */
export function sfUserDetail(params) {
  return service({
    url: '/court/room/sfUserDetail',
    method: 'get',
    params
  })
}

/**
 * 联动进入视频房间
 * @params {string} sfTeamId
 */
export function intoTeamRoom(params) {
  return service({
    url: '/court/room/intoTeamRoom',
    method: 'post',
    params
  })
}

/**
 * 联动退出视频房间
 * @params {string} sfTeamId 案件id
 */
export function quitTeamRoom(params) {
  return service({
    url: '/court/room/quitTeamRoom',
    method: 'post',
    params
  })
}

/**
 * 联动获取人员
 * @params {string} userid 案件id
 */
export function teamUserDetail(params) {
  return service({
    url: '/court/room/teamUserDetail',
    method: 'get',
    params
  })
}
