import axiosConfig from '@/utils/axios.js'
// 创建正式用例接口基础配置
const service = axiosConfig.ajax()

// 保存通话记录
export function saveCallLog(params) {
  return service({
    url: '/court/preCallLog/saveCallLog',
    method: 'post',
    data: params
  })
}
