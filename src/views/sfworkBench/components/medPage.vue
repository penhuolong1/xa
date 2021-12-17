<template>
  <div>
    <Row>
      <Col span="12">
        <ChartRate />
        <Row class="left-container" style="height:480px">
          <div class="title" style="font-size: 18px;"> 解纷质效</div>
          <div class="title" style="font-size: 16px;">平均化解周期</div>
          <div class="quertar">
            <div class="quertar1" style="border-style:none solid solid none;border-width:thin;">
              <DateLineChart ref="DateLineInit" style="margin-left:20px;margin-top:-10px" />
            </div>
            <DataBlock ref="DataBlock" :index="0" class="quertar1" style="border-style:none none solid none;border-width:thin;" />
            <DataBlock ref="DataBlock" :index="1" class="quertar1" style="border-style:none solid none none;border-width:thin;" />
            <DataBlock ref="DataBlock" :index="2" class="quertar1" />
          </div>
        </Row>
      </Col>
      <Col span="12">
        <Row class="left-container" style="height:480px">
          <div class="title">收结数</div>
          <LineChart ref="LineChart" style="margin-top:-20px" />
        </Row>
      </Col>

    </Row>
    <Row style="display:flex;justify-content:space-between;height:420px">
      <Col span="12">
        <Row class="left-container" style="height:400px">
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
          <PieChart ref="pieChart" style="margin-left:60px" />
        </Row>
      </Col>
    </Row>

  </div>
</template>
<script>
import { Row, Col, Empty, Divider } from 'ant-design-vue'
import {
  getReceiveFinishCount,
  rankMediator,
  getMediatorRate,
  topBrief
} from '@/api/workBench/index.js'
import DataBlock from './dataBlock.vue'
import LineChart from './lineChart.vue'
import PieChart from './pieChart1.vue'
import CollapseChart from './collapseChart.vue'
import MedRank from './mediatorRank.vue'
import DateLineChart from './dateLineChart.vue'
import ChartRate from './chartRate.vue'
const { dateRangeUtil } = require('@/utils/dateRangUtil.js')

export default {
  components: {
    Row, Col, LineChart, CollapseChart, DataBlock, MedRank, PieChart, DateLineChart, Divider, ChartRate
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
      briefList: [], // 案由排名前十
      lineChartData: [], // 折线图的数据
      finishCaseCountX: [],
      receiveCaseCount: [], // 收案数
      finishCaseCount: [], // 结案数
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
      mediatorList: [],
      caseType: 1,
      isRank: true,
      mediatorRate: [],
      averageList: [// 平均化解周期数
        {
          name: '3日以下',
          value: ''
        },
        {
          name: '3-7日',
          value: ''
        },
        {
          name: '7-15日',
          value: ''
        },
        {
          name: '15-30日',
          value: ''
        },
        {
          name: '30日以上',
          value: ''
        }
      ]

    }
  },
  watch: {
    timeParams: {
      handler(val) {
        this.getRangkMed()
        this.getTopBrief(val)
        this.getMediator()
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
    // this.getRangkMed()
    this.getCaseNum('year')
    this.getMediator()
  },
  mounted() {
  },
  methods: {
    // 获取解纷员排名
    getRangkMed(e) {
      if (e) {
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
        , 200)
      }
    },
    // 获取前十的案由
    getTopBrief() {
      console.log(this.timeParams)

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
        }
      })
    },
    // 获取调解成功率，在线调解率、平均调解时间
    getMediator() {
      const params = {
        ...this.timeParams
      }
      getMediatorRate(params).then(({ code, data }) => {
        if (code === 200) {
          this.Ratelist[0].value = data.mediateSuccessRate
          this.Ratelist[1].value = data.onlineCaseRate
          this.Ratelist[2].value = data.averageProcessDate
          const processDateDistribute = data.processDateDistribute
          this.averageList[0].value = processDateDistribute.zeroToThree
          this.averageList[1].value = processDateDistribute.threeToSeven
          this.averageList[2].value = processDateDistribute.sevenToFifteen
          this.averageList[3].value = processDateDistribute.fifteenToThirty
          this.averageList[4].value = processDateDistribute.largerThenThirty
          const averageListName = []
          const averageListValue = []
          this.averageList.map(item => {
            averageListName.push(item.name)
            averageListValue.push(item.value)
          })
          this.$forceUpdate()
          // if (this.type === 2) {
          // this.$refs.CollapseChart.init(this.averageList)
          this.$refs.DateLineInit.init(averageListName, averageListValue)
          // }
        }
      })
    }
  }
}
</script>
<style scoped lang="less" src="./item.less"></style>
<style >
.quertar{
  display: flex;
  flex-wrap:wrap;
  margin-top:-30px;
}
.quertar1{
  width: 50%;
  height: 200px;
  padding:5px;
  border-color:rgba(0,0,0,0.1)
}
.title{
  color: rgba(36,47,87,1);
  font-weight: 700;
}
</style>
