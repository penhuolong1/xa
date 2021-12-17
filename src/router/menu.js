import addCaserouter from './addCase'
import caserouter from './case'
import collectCase from './collectCase'
import caseManage from './caseManage'
import caseHandle from './caseHandle'
import servedManage from './servedManage'
import statistics from './statistics'
// import informationBase from './informationBase'
import visualize from './visualize'
import sfCase from './sfCase'
import rtcrouter from './rtc'
import workBench from './workBench'
const menu = [
  ...workBench, // 法院工作台
  ...collectCase, // 收案审查
  ...caseManage, // 案件管理
  ...caseHandle, // 案件办理
  ...addCaserouter, // 添加案件
  ...caserouter, // 案件详情
  ...servedManage, // 送达管理
  ...statistics, // 统计报表
  // ...informationBase, // 当事人信息库
  ...visualize, // 数助决策
  // ...sfCase, // 诉非段
  ...rtcrouter // 调解室
]

export default menu
