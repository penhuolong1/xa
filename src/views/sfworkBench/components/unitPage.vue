<template>
  <!-- 联动单位 -->
  <div>
    <!-- <div>解纷资源</div> -->
    <Row>
      <Col v-for="(item,index) in headerList" :key="item.img" span="8" style="height:100px">
        <Row class="left-container" display="align-items:left;justify-content:space-between">
          <Col span="7">
            <img :src="item.firstImg">
          </Col>
          <Col span="13">
            <div class="header">
              <div style="font-size:15px;font-weight:550">{{ item.title }}</div>
              <div class="num">{{ item.value }}</div>
            </div>
          </Col>
          <Col span="4">
            <img v-if="index!=0" :src="item.img" style="margin-right:-10%">
          </Col>
        </Row>
      </Col>

    </Row>
    <Row>
      <Col span="12" style="margin:0">
        <Row class="left-container" style="height:500px">
          <div class="title">收结数</div>
          <LineChart ref="LineChart" />
        </Row>
      </Col>
      <Col span="6">
        <Row class="left-container" style="height:500px">
          <div class="title">流程监督 </div>
          <CollapseChart ref="CollapseChart" style="margin:30px 0 0 20px" />
        </Row>
      </Col>
      <Col span="6">
        <Row class="left-container" style="height:500px">
          <div class="title">解纷质效</div>
          <DataBlock ref="DataBlock" :index="0" style="margin-top:50px" />
          <DataBlock ref="DataBlock" :index="1" style="margin-top:50px" />
          <DataBlock ref="DataBlock" :index="2" style="margin-top:50px" />

        </Row>
      </Col>
    </Row>
    <Row>
      <Col span="8">
        <Row class="left-container" style="height:350px">
          <div class="title">综治考评指标数据
            <div v-for="(item,index) in comprehensiveData" :key="index" class="evaluation">
              <div class="evaluation-title">{{ item.title }}</div>
              <div class="evaluation-data">{{ item.value }}</div>
            </div>
          </div></Row>

      </Col>
      <Col span="8">
        <Row class="left-container" style="height:350px">
          <div class="title" style="margion-bottom:30px">单位排名（前十）</div>
          <OrgRank :org-rank="orgRank" />
        </Row>
      </Col>
      <Col span="8">
        <Row class="left-container" style="height:350px">
          <div class="title">热点案由（前十）</div>
          <PieChart ref="pieChart" style="margin-top:-20px;margin-left:-12px" /></Row>
      </Col>

    </Row>
  </div>
</template>
<script>
import { Col, Row, Empty } from 'ant-design-vue'
import CollapseChart from './collapseChart.vue'
import DataBlock from './dataBlock.vue'
import OrgRank from './orgRank.vue'
import PieChart from './pieChart.vue'
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
const { dateRangeUtil } = require('@/utils/dateRangUtil.js')

export default {
  components: {
    Col,
    Row,
    CollapseChart,
    LineChart,
    DataBlock,
    OrgRank,
    PieChart,
    Empty
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
      headerList: [// 联动单位数据
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
      mediatorRate: [], // 调解成功率数据
      totalCount: {}, // 获取当前用户的各种子部门即调解员数据
      lineChartData: [], // 折线图的数据
      isLineChart: true, // 判断收结数是否有数据
      receiveCaseCount: [], // 收案数
      finishCaseCount: [], // 结案数
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
      comprehensiveData: [ // 综治考评指标数据
        {
          title: '法院委派、委托案件',
          value: ''
        },
        {
          title: '在线调解',
          value: ''
        },
        {
          title: '3日内未接收案件',
          value: ''
        },
        {
          title: '30日为化解案件',
          value: ''
        },
        {
          title: '委派、委托...成功率',
          value: ''
        }
      ],
      orgNum: 0,
      isEmpty: false
    }
  },
  watch: {
    timeParams: {
      handler() {
        this.getDeptDetail()
        this.getMediatorRate()
        this.getComprehensive()
        this.getDeptOrg()
        this.getTopBrief()
        this.getAdditionCount()
        this.getCaseNum()
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
    this.getDeptDetail()
    this.getMediatorRate()
    this.getComprehensive()
    this.getDeptOrg()
    this.getTopBrief()
    this.getAdditionCount()
  },
  mounted() {
  },
  methods: {
    // 获取收案结案数据
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
    // 调解员排名
    getMediatorRate() {
      const params = {
        ...this.timeParams
      }
      getMediatorRate(params).then(({ code, data }) => {
        if (code === 200) {
          this.mediatorRate = data
          // const processDateDistribute = data.processDateDistribute
          // this.averageList[0].value = processDateDistribute.zeroToThree
          // this.averageList[1].value = processDateDistribute.threeToSeven
          // this.averageList[2].value = processDateDistribute.sevenToFifteen
          // this.averageList[3].value = processDateDistribute.fifteenToThirty
          // this.averageList[4].value = processDateDistribute.largerThenThirty
          this.$forceUpdate()
          this.$refs.DataBlock.getList(this.mediatorRate)
          // if (this.type === 2) {
          // this.$refs.CollapseChart.init(this.averageList)
          // }
        }
      })
    },
    // 获取联动单位综合考评指标
    getComprehensive() {
      const params = {
        ...this.timeParams
      }
      getComprehensiveData(params).then(({ code, data }) => {
        if (code === 200) {
          this.comprehensiveData[0].value = data.judgeCommissionCaseCount
          this.comprehensiveData[1].value = data.onlineCommissionRate
          this.comprehensiveData[2].value = data.unReceiveCaseLongerThenThreeDay
          this.comprehensiveData[3].value = data.unFinishCaseLongerThenThirtyDay
          this.comprehensiveData[4].value = data.mediateSuccessRate
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
    // 获取当前用户的各种子部门即调解员数据
    getAdditionCount() {
      getTotalCourt().then(({ code, data }) => {
        if (code === 200) {
          this.headerList[0].value = (data.totalCountForUAndO.map(item => {
            return item.deptLevel + (item.deptCount + '家')
          })).join(' ')
          this.headerList[1].value = null
          for (var i = 0; i < data.totalCountForUAndO.length; i++) {
            this.headerList[1].value = (this.headerList[1].value + parseInt(data.totalCountForUAndO[i].deptCount))
          }
          this.headerList[1].value = this.headerList[1].value + '家'
          this.headerList[2].value = data.totalCountForMediator + '人'
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
.header{
  display: flex;
  flex-direction: column;
  align-items: left;
  justify-content: space-between;
  margin-left: -50px;
}
.title{
  font-size: 20px;
  font-weight: 700;
  color: #242f57;
  margin-bottom: 20px;
  margin-top:12px;
}
.left-container{
  margin:10px;
  padding:10px 20px;
  border: 1px solid rgba(0,0,0,0.10);
  border-radius: 10px;
  position: relative;
}
img{
    width: 60px;
    height: 60px;
  }
  .evaluation{
    width: 100%;
   display: flex;
   padding-right:20px;
   justify-content: space-between;
   margin-bottom: 30px;
   margin-top:30px;
   overflow:auto;
   .evaluation-title{
     width:200px;
     overflow: hidden;
     text-overflow:ellipsis;
     font-size: 16px;
     font-weight: 600;
   }
   .evaluation-data{
     width:100px;
     color: #65BF73;
    font-size: 16px;
     font-weight: 600;
   }
  }
  .num{
    font-size: 20px;
 font-weight: 700;
 margin-top:10px;

  }
</style>
