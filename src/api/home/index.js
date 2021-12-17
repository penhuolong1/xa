import axiosConfig from '@/utils/axios.js'
// 创建正式用例接口基础配置
const service = axiosConfig.ajax()

/**
 * 普法动态列表
 */
export function popularization(params) {
  return service({
    url: '/sf/home/page/law/popularization',
    method: 'get',
    params
  })
}
/**
 * 获取统计数量数据
 */
export function info(params) {
  return service({
    url: '/sf/home/page/base/info',
    method: 'get',
    params
  })
}
/**
 * 普法动态 详情
 */
export function popularizationDetails(params) {
  return service({
    url: `/sf/home/page/law/popularization/${params.id}`,
    method: 'get'
  })
}

