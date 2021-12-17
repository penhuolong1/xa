import sfCase from './sfCase'
import team from './team'
import sfworkBench from './sfworkBench'

const menu = [
  ...sfworkBench, // 工作台
  ...sfCase, // 案件管理
  ...team // 队伍管理
]

export default menu
