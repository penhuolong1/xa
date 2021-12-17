<template>
  <!-- 分流中心 -->
  <div>
    <Row>
      <Col v-for="(item,index) in headerList" :key="index" span="6" style="height:100px">
        <Row class="left-container" display="align-items:left;justify-content:space-between;height:50px">
          <Col span="7">
            <img :src="item.firstImg">
          </Col>
          <Col span="13">
            <div class="header">
              <div style="font-size:15px;font-weight:550">{{ item.title }}</div>
              <div class="number" style="font-size:16px">{{ item.value?item.value:0 }}</div>
            </div>
          </Col>
          <Col span="4">
            <img v-if="index!=1" :src="item.img" style="margin-right:-10%">
          </Col>
        </Row>
      </Col>

    </Row>
    <Row>
      <Col span="12">
        <Row class="left-container" style="height:500px">
          <div class="title">收结数</div>
          <LineChart
            ref="LineChart"
          />
        </Row>
      </Col>
      <Col span="6">
        <Row class="left-container" style="height:500px">
          <div class="title">流程监督</div>
          <CollapseChart ref="CollapseChart" style="margin-top:15px" />
        </Row>
      </Col>
      <Col span="6">
        <Row class="left-container" style="height:500px">
          <div class="title">解纷质效</div>
          <div v-for="(item,index) in Ratelist" :key="index" class="container">
            <div class="content">
              <div class="title1">{{ item.title }} </div>
              <div class="title1">{{ item.value }}</div>
            </div>
          </div>
        </Row>
      </Col>
    </Row>
    <Row>
      <Col span="12">
        <Row class="left-container" style="height:420px">
          <div v-if="isRank" class="med-container">
            <div class="med-title">解纷员排名（前十）</div>
            <div style="float:right;display:flex;margin-right:30px">
              <div v-for="(item) in mediatorRanking" :key="item.value" class="med-menu">
                <div :class="{selectedMed:caseType==item.index}" @click="getRangkMed(item)">{{ item.label }}</div>
              </div>
            </div>
          </div>
          <MedRank :mediator-list="mediatorList" />
        </Row>
      </Col>
      <Col span="12">
        <Row class="left-container" style="height:400px">
          <div class="title">热点案由（前十）</div>
          <PieChart ref="pieChart" /></Row>
      </Col>
    </Row>

  </div>
</template>
<script>
import { Col, Row, Empty, Divider } from 'ant-design-vue'
const { dateRangeUtil } = require('@/utils/dateRangUtil.js')
import PieChart from './pieChart.vue'
import CollapseChart from './collapseChart.vue'
import OrgRank from './orgRank.vue'
import DataBlock from './dataBlock.vue'
import MedRank from './mediatorRank.vue'
import LineChart from './lineChart.vue'
import {
  getReceiveFinishCount,
  rankMediator,
  getCaseTypeBydeptOrOrg,
  getComprehensiveData,
  getMediatorRate,
  getDeptDetail,
  topBrief,
  getTotalCourt
} from '@/api/workBench/index.js'
export default {
  components: {
    Col,
    Row,
    Empty,
    PieChart,
    OrgRank,
    Divider,
    CollapseChart,
    DataBlock,
    MedRank,
    LineChart

  },
  props: {
    timeParams: {
      type: Object,
      default: () => {}
    },
    dateType: {
      type: String,
      default: 'year'
    }
  },
  data() {
    return {
      caseType: 1,
      totalCount: {}, // 获取当前用户的各种子部门即调解员数据
      orgRank: [], // 单位组织排名
      mediatorRate: [], // 调解成功率数据
      isEmpty: false,
      deptDetail: [// 收案、受理、化解、司法确认、结案数据
        {
          name: '收案',
          value: ''
        },
        {
          name: '受理',
          value: ''
        },
        {
          name: '化解',
          value: ''
        },
        {
          name: '司法确认',
          value: ''
        },
        {
          name: '结案',
          value: ''
        }
      ],
      isRank: true, // 解纷员排名有无数据
      mediatorRanking: [
        {
          index: 0,
          label: '收案',
          value: 'receive'
        }, {
          index: 1,
          label: '结案',
          value: 'finish'
        }
      ],
      mediatorList: {},
      headerList: [// 联动单位数据
        {
          title: '分流中心',
          value: null,
          img: require('@/assets/workBench/Group 6@2x.png'),
          firstImg: require('@/assets/workBench/Group 153@2x.png')
        },
        {
          title: '联动单位',
          value: null,
          img: require('@/assets/workBench/Group 152@2x.png'),
          firstImg: require('@/assets/workBench/Group 153@2x.png')
        },
        {
          title: '解纷组织',
          value: 0,
          img: require('@/assets/workBench/Group 6@2x.png'),
          firstImg: require('@/assets/workBench/Group 154@2x.png')
        },
        {
          title: '解纷员',
          value: null,
          img: require('@/assets/workBench/Group 12@2x.png'),
          firstImg: require('@/assets/workBench/Group 155@2x.png')
        }
      ],
      Ratelist: [{
        title: '调解成功率',
        value: null
      },
      {
        title: '在线调解率',
        value: null
      },
      {
        title: '平均化解周期',
        value: null
      }
      ],
      receiveCaseCountX: [],
      receiveCaseCount: [],
      finishCaseCount: []
    }
  },
  watch: {
    timeParams: {
      handler(val) {
        this.getDeptOrg()
        this.getMediator()
        this.getTopBrief()
        this.getAdditionCount()
        this.getDeptDetail()
      },
      deep: true,
      immediate: true
    },
    dateType: {
      handler(val) {
        this.getCaseNum(val || 'year')
      },
      immediate: true,
      deep: true

    }
  },
  created() {
    this.getCaseNum('year')
    this.getDeptOrg()
    this.getMediator()
    this.getTopBrief()
    this.getAdditionCount()
    this.getDeptDetail()
  },
  mounted() {
  },
  methods: {
    getMediator(val) {
      console.log(val)
      const params = {
        ...this.timeParams
      }
      getMediatorRate(params).then(({ code, data }) => {
        if (code === 200) {
          this.Ratelist[0].value = data.mediateSuccessRate
          this.Ratelist[1].value = data.onlineCaseRate
          this.Ratelist[2].value = data.averageProcessDate
          this.$forceUpdate()
          // if (this.type === 2) {
          // this.$refs.CollapseChart.init(this.averageList)
          // }
        }
      })
    },
    // 获取前十的案由
    getTopBrief() {
      topBrief({ ...this.timeParams }).then(({ code, data }) => {
        if (code === 200) {
          this.briefList = data.map(item => {
            return {
              value: item.currentBriefCount,
              name: item.briefName
            }
          })
          const BriefName = []
          this.briefList.map(item => {
            BriefName.push(item.name)
          })
          console.log(this.briefList)
          this.$refs.pieChart.init(this.briefList)
        }
      })
    },
    // 获取收结案件数
    getCaseNum(e) {
      getReceiveFinishCount(e || 'year').then(({ code, data }) => {
        if (code === 200) {
          this.xaxis = []
          this.receiveCaseCountX = []
          this.receiveCaseCount = []
          this.finishCaseCount = []
          if (e === 'week') {
            if (data.finishCountByTime && data.finishCountByTime.length > 0) {
              data.finishCountByTime.map(item => {
                this.xaxis.push(item.dayOfWeek)// x轴
                this.finishCaseCount.push(item.finishCaseCount)// 结案数
                this.finishCaseCount = this.finishCaseCount.map(item => {
                  return {
                    value: item
                  }
                })
              })
            }
            // 获取收案数
            const list = []
            // 获取结案数
            if (data.finishCountByTime && data.finishCountByTime.length > 0) {
              data.finishCountByTime.forEach((item) => {
                const index = list.findIndex(
                  (itey) => itey.dayOfWeek === item.dayOfWeek
                )
                if (index !== -1) {
                  list[index].finishCaseCount = item.finishCaseCount
                } else {
                  list.push(item)
                }
              })
            }
            // 获取收案数
            if (data.receiveCountByTime && data.receiveCountByTime.length > 0) {
              data.receiveCountByTime.forEach((item) => {
                const index = list.findIndex((itey) =>
                  itey.dayOfWeek === item.dayOfWeek
                )
                if (index !== -1) {
                  list[index].receiveCaseCount = item.receiveCaseCount
                } else {
                  list.push(item)
                }
              })
            }
            list.map(item => {
              if (item.dayOfWeek) {
                item.xaxis = item.dayOfMonth
                delete item.dayOfWeek
              }
              if (!item.finishCaseCount) {
                item.finishCaseCount = '0'
              }
              if (!item.receiveCaseCount) {
                item.receiveCaseCount = '0'
              }
            })
            console.log(list)
            if (list.length === 0) {
              this.isLineChart = false
            } else {
              this.isLineChart = true
            }
            this.$refs.LineChart.init(list)
          }
          if (e === 'month') {
            this.timeParams.startTime = dateRangeUtil.getCurrentMonth()[0] + ' 00:00:00'
            this.timeParams.endTime = dateRangeUtil.getCurrentMonth()[1] + ' 23:59:59'
            // this.getDeptOrg()
            // this.getComprehensive()
            const list = []
            // 获取结案数
            if (data.finishCountByTime && data.finishCountByTime.length > 0) {
              data.finishCountByTime.forEach((item) => {
                const index = list.findIndex(
                  (itey) => itey.dayOfMonth === item.dayOfMonth
                )
                if (index !== -1) {
                  list[index].finishCaseCount = item.finishCaseCount
                } else {
                  list.push(item)
                }
              })
            }
            // 获取收案数
            if (data.receiveCountByTime && data.receiveCountByTime.length > 0) {
              data.receiveCountByTime.forEach((item) => {
                const index = list.findIndex((itey) =>
                  itey.dayOfMonth === item.dayOfMonth
                )
                if (index !== -1) {
                  list[index].receiveCaseCount = item.receiveCaseCount
                } else {
                  list.push(item)
                }
              })
            }
            this.xaxis = this.xaxis.filter((item, index) => this.xaxis.indexOf(item) == index).sort()// 过滤重复出现的横轴
            list.map(item => {
              if (item.dayOfMonth) {
                item.xaxis = item.dayOfMonth
                delete item.dayOfMonth
              }
              if (!item.finishCaseCount) {
                item.finishCaseCount = '0'
              }
              if (!item.receiveCaseCount) {
                item.receiveCaseCount = '0'
              }
            })
            console.log(list)
            if (list.length === 0) {
              this.isLineChart = false
            } else {
              this.isLineChart = true
            }
            this.$refs.LineChart.init(list, '号')
          }
          if (e === 'year') {
            this.timeParams.startTime = dateRangeUtil.getCurrentYear()[0] + ' 00:00:00'
            this.timeParams.endTime = dateRangeUtil.getCurrentYear()[1] + ' 23:59:59'
            // this.getDeptOrg()
            // this.getComprehensive()

            const list = []
            // 获取结案数
            if (data.finishCountByTime && data.finishCountByTime.length > 0) {
              data.finishCountByTime.forEach((item) => {
                const index = list.findIndex(
                  (itey) => itey.monthOfYear === item.monthOfYear
                )
                if (index !== -1) {
                  list[index].finishCaseCount = item.finishCaseCount
                } else {
                  list.push(item)
                }
              })
            }
            // 获取收案数
            if (data.receiveCountByTime && data.receiveCountByTime.length > 0) {
              data.receiveCountByTime.forEach((item) => {
                const index = list.findIndex((itey) =>
                  itey.monthOfYear === item.monthOfYear
                )
                if (index !== -1) {
                  list[index].receiveCaseCount = item.receiveCaseCount
                } else {
                  list.push(item)
                }
              })
            }
            this.xaxis = this.xaxis.filter((item, index) => this.xaxis.indexOf(item) == index).sort()// 过滤重复出现的横轴
            list.map(item => {
              if (item.monthOfYear) {
                item.xaxis = item.monthOfYear
                delete item.monthOfYear
              }
              if (!item.finishCaseCount) {
                item.finishCaseCount = '0'
              }
              if (!item.receiveCaseCount) {
                item.receiveCaseCount = '0'
              }
            })
            console.log(list)
            this.$refs.LineChart.init(list, '月')
          }
          if (this.finishCaseCount.length === 0 && this.receiveCaseCount.length === 0) {
            this.isEmpty = true
          } else {
            this.isEmpty = false
          }
        }
      })
    },
    // 获取单位或组织的排名
    getDeptOrg() {
      getCaseTypeBydeptOrOrg('finish', 'dept', { ...this.timeParams }).then(({ code, data }) => {
        if (code === 200) {
          this.orgRank = data
        }
      })
    },
    // 获取联动中心、单位的收案数等等
    getDeptDetail() {
      getDeptDetail({ ...this.timeParams }).then(({ code, data }) => {
        if (code === 200) {
          this.deptDetail[0].value = data.receiveCaseCount
          this.deptDetail[1].value = data.receiveCaseCount
          this.deptDetail[2].value = data.resolveCaseCount
          this.deptDetail[3].value = data.judicialCaseCount
          this.deptDetail[4].value = data.finishCaseCount
          this.$refs.CollapseChart.init(this.deptDetail)
        }
      })
    },
    // 获取解纷员排名
    getRangkMed(e) {
      console.log(e)
      this.caseType = e.index
      const params = {
        ...this.timeParams
      }
      setTimeout(() =>
        rankMediator(params, e.value).then(({ code, data }) => {
          if (code === 200) {
            this.mediatorList = data
            this.$forceUpdate()
          }
        })
      , 100)
    },
    // 获取各单位数据
    getAdditionCount() {
      getTotalCourt().then(({ code, data }) => {
        if (code === 200) {
          this.headerList[1].value = (data.totalCountForUAndO.map(item => {
            return item.deptLevel + (item.deptCount + '家')
          })).join(' ')
          this.headerList[2].value = null
          for (var i = 0; i < data.totalCountForUAndO.length; i++) {
            this.headerList[2].value = (this.headerList[2].value + parseInt(data.totalCountForUAndO[i].deptCount))
          }
          this.headerList[2].value = this.headerList[2].value + '家'
          this.headerList[3].value = data.totalCountForMediator + '人'
        }
      })
    }
  }
}
</script>
<style scoped lang="less" src="./item.less"></style>

<style scoped lang="less">

</style>
