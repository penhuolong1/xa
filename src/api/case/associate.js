import axiosConfig from '@/utils/axios.js'
// 创建正式用例接口基础配置
const service = axiosConfig.ajax()

/**
 * 涉案关联查询
 * @params {string} caseId 案件id
 */
export function relateLawsuit (params) {
  return service({
    url: '/court/litigant/relateLawsuit',
    method: 'get',
    params
  })
}

/**
 * 本次送达关联查询
 * @params {string} caseId 案件id
 */
export function relateList (params) {
  return service({
    url: '/court/relate/listInfo',
    method: 'get',
    params
  })
}

/**
 * 同步关联关系查询
 * @params {number} relateType 关联方式
 * @params {number} type 关联类型
 * @params {number} caseType 被关联案件状态
 * @params {string} litigantId 当事人id relateType=1 参数
 * @params {string} caseId 当事人id relateType=2必传
 */
export function relateTypeInfo (params) {
  return service({
    url: '/court/litigant/relateTypeInfo',
    method: 'get',
    params
  })
}

/**
 * 添加送达关联
 * @params {number} type 1手机2地址
 * @params {array} phonesOrAddresses 手机/地址字符串
 * @params {array} litigantIds 被关联案件状态
 * @params {remark} litigantIds 备注
 */
export function addSendRelateInfo (params) {
  return service({
    url: '/court/relate/addSendRelateInfo',
    method: 'post',
    data: params
  })
}

/**
 * 移除送达关联
 * @params {array} sendRelateId 关联查询id
 */
export function removeInfo (params) {
  return service({
    url: '/court/relate/removeInfo',
    method: 'post',
    params
  })
}
