import axiosConfig from '@/utils/axios.js'
// 创建正式用例接口基础配置
const service = axiosConfig.ajax()

/**
 * 案件详情
 * @params {string} lawCaseId 案件id
 */
export function getDetailsCase(params) {
  return service({
    url: '/court/case/detailsCase.jhtml',
    method: 'get',
    params
  })
}

/**
 * 案件列表
 */
export function caseList(params) {
  return service({
    url: '/11/court/case/view/appraisalCase/',
    method: 'get',
    params
  })
}
/**
 * 保全案件列表(全部、保全中、已完成)
 */
export function preservationCase(params) {
  return service({
    url: '/11/view/preservationCase/',
    method: 'get',
    params
  })
}
/**
 * 添加鉴定
 */
export function addappraisalCase(params) {
  return service({
    url: '/11/court/case/add/appraisalCase',
    method: 'post',
    header: {
      'Content-Type': 'multipart/form-data'
    },
    params
  })
}
/**
 * 添加保全
 */
export function addpreservationCase(params) {
  return service({
    url: '/11/court/case/add/preservationCase',
    method: 'post',
    header: {
      'Content-Type': 'multipart/form-data'
    },
    params
  })
}

/**
 * 修改鉴定类别
 */
export function change(params) {
  return service({
    url: '/11/court/case/change/appraisalCase/type',
    method: 'post',
    header: {
      'Content-Type': 'multipart/form-data'
    },
    params
  })
}
/**
 * 鉴定结束
 */
export function finish(params) {
  return service({
    url: '/11/court/case/finish/appraisalCase',
    method: 'post',
    header: {
      'Content-Type': 'multipart/form-data'
    },
    params
  })
}

/**
 * 通过code获取录音文件
 */
export function getByCode(params) {
  return service({
    url: '/court/freeFile/getByCode',
    method: 'get',
    params
  })
}
