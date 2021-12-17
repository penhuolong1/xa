<template>
  <div>
    <div>
      <div class="header">
        <div class="title" style="margin-left:12px">解纷资源</div>
        <!-- <div  class="title">我的工作台</div>
        <div v-if="getUserInfo.loginRole.roleId==6" class="title">解纷资源</div> -->
        <div class="dateList">
          <div v-for="(item,index) in dateList" :key="index" class="dateListItem">
            <div :class="{selectedColor:state==item.index}" @click="changeDate(item)"> {{ item.title }}</div>
          </div>
        </div>
      </div>
      <!-- 调解组织 -->
      <div
        v-if="getUserInfo.user.dept.deptLevel.indexOf('组织')!=-1&&!getUserInfo.loginRole.roleKey"
      >
        <Row>
          <Col :span="12">
            <Row class="left-container">
              <Col :span="12" class="left">
                <img src="../../assets/workBench/Group 155@2x.png">
                <div class="record">
                  <div class="record-title">解纷员</div>
                  <div class="number">{{ totalCount.totalCountForMediator }} 人</div>
                </div>
              </Col>
              <Col :span="12" class="left">
                <div class="number">本日新增{{ totalCount.todayAddCountForMediator }} 人</div>
                <img src="../../assets/workBench/Group 12@2x.png">
              </Col>
            </Row>
            <Row class="left-container" style="height:385px">
              <div class="title">平均化解数</div>
              <Col span="12">
                <div v-for="(item,index) in Ratelist" :key="index" class="container">
                  <div class="content">
                    <div class="title1">{{ item.title }} </div>
                    <div class="title1">{{ item.value }}</div>
                  </div>
                </div>
              </Col>
              <Col span="12">
                <CollapseChart ref="CollapseChart" style="margin-left:50px" />
              </Col>
            </Row>
          </Col>

          <Col :span="12">
            <Row class="left-container">
              <div class="title">收结数</div>
              <!-- <Empty v-if="isEmpty" /> -->
              <LineChart ref="LineChart" />
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
            <Row class="left-container" style="height:420px">
              <div class="title">热点案由（前十）</div>
              <PieChart ref="pieChart" />
            </Row>
          </Col>
        </Row>
        <OrgPage ref="getLineNum" :time-params="timeParams" />
      </div>
    </div>
    <!-- 解纷员工作台0 -->
    <!-- v-if="getUserInfo.loginRole.roleKey -->
    <div>
      <MedPage
        ref="getLineNum"
        :time-params="timeParams"
        :date-type="dateType"
      />
    </div>
    <!-- 分流中心1 -->
    <!-- v-if="getUserInfo.user.dept.deptLevel.indexOf('组织')==-1&&getUserInfo.user.dept.deptLevel.indexOf('级')!=-1&&!getUserInfo.loginRole.roleKey" ref="getLineNum" -->
    <CenterPage
      ref="getLineNum"
      :time-params="timeParams"
      :date-type="dateType"
    />
    <!-- 联动单位1 -->
    <!-- v-if="getUserInfo.user.dept.deptLevel.indexOf('联动单位')!=-1&&!getUserInfo.loginRole.roleKey" -->

    <UnitPage
      ref="getLineNum"
      :time-params="timeParams"
      :date-type="dateType"
    />
  </div>
</template>
<script>
import { DatePicker } from 'ant-design-vue'
import UnitPage from './components/unitPage.vue'
import MedPage from './components/medPage.vue'
import DataBlock from './components/dataBlock.vue'
import LineChart from './components/lineChart.vue'
import PieChart from './components/pieChart.vue'
import CollapseChart from './components/collapseChart.vue'
import OrgRank from './components/orgRank.vue'
import CenterPage from './components/centerPage.vue'
import { Row, Col, Dropdown, Icon, Menu, Divider, Empty } from 'ant-design-vue'
import MedRank from './components/mediatorRank.vue'
import OrgPage from './components/orgPage.vue'
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
import { mapGetters } from 'vuex'

export default {
  components: {
    Row,
    Col,
    Dropdown,
    Icon,
    Menu,
    MenuItem: Menu.Item,
    DataBlock,
    PieChart,
    LineChart,
    OrgRank,
    Divider,
    CollapseChart,
    MedRank,
    Empty,
    UnitPage,
    CenterPage,
    MedPage,
    OrgPage
  },
  props: {
  },
  data() {
    return {
      type: 1,
      state: 2,
      people: null,
      caseType: 1,
      orgNum: 0,
      dateType: '',
      timeParams: {
        startTime: '2021-01-01 00:00:00', // 开始时间
        endTime: '2022-01-31 23:59:59' // 结束时间
      },
      dateList: [
        {
          title: '近一周',
          value: 'week',
          index: 0
        },
        {
          title: '近一个月',
          value: 'month',
          index: 1

        },
        {
          title: '近一年',
          value: 'year',
          index: 2
        }
      ],
      mediatorList: [],
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
      yearList: [2021, 2020, 2019],
      orgRank: [], // 单位组织排名
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
      ],
      totalCount: {}, // 获取当前用户的各种子部门即调解员数据
      mediatorRate: [], // 调解成功率数据mediatorRate
      briefList: [], // 案由排名前十
      xaxis: [], // 折现图的横坐标
      lineChartData: [], // 折线图的数据
      finishCaseCountX: [],
      receiveCaseCount: [], // 收案数
      finishCaseCount: [], // 结案数
      isEmpty: false,
      isLineChart: true, // 判断收结数是否有数据
      isRank: true, // 解纷员排名有无数据
      unitList: [{ // 联动单位图片
        title: '解纷组织',
        value: null,
        img: require('@/assets/workBench/Group 152@2x.png')
      },
      {
        title: '解纷员',
        value: null,
        img: require('@/assets/workBench/Group 155@2x.png')
      }]

    }
  },
  watch: {
    timeParams: {
      handler() {
        // this.getDeptOrg()
        // this.getComprehensive()
        // this.getMediatorRate()
        // this.getDeptDetail()
        // this.getTopBrief()
      },
      deep: true
    },
    mediatorRanking: {
      handler(new1, old) {
        console.log(new1, old)
      },
      deep: true
    }
  },
  created() {
    // this.getPage()
    // this.getMediatorRate()
  },
  computed: {
    ...mapGetters(['getUserInfo'])

  },

  mounted() {
    // this.getAdditionCount()
  },
  methods: {
    changeDate(e) {
      this.state = e.index
      this.dateType = e.value
      if (e.value === 'week') {
        this.timeParams.startTime = dateRangeUtil.getCurrentWeek()[0] + ' 00:00:00'
        this.timeParams.endTime = dateRangeUtil.getCurrentWeek()[1] + ' 23:59:59'
        this.$refs.getLineNum.getCaseNum(e.value)
      }
      if (e.value === 'month') {
        this.timeParams.startTime = dateRangeUtil.getCurrentMonth()[0] + ' 00:00:00'
        this.timeParams.endTime = dateRangeUtil.getCurrentMonth()[1] + ' 23:59:59'
        this.$refs.getLineNum.getCaseNum(e.value)
      }
      if (e.value === 'year') {
        this.timeParams.startTime = dateRangeUtil.getCurrentYear()[0] + ' 00:00:00'
        this.timeParams.endTime = dateRangeUtil.getCurrentYear()[1] + ' 23:59:59'
        this.$refs.getLineNum.getCaseNum(e.value)
      }
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
      , 200)
    },
    // 获取单位或组织的排名
    getDeptOrg() {
      getCaseTypeBydeptOrOrg('finish', 'dept', { ...this.timeParams }).then(({ code, data }) => {
        if (code === 200) {
          this.orgRank = data
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
          this.comprehensiveData[0].value = data.judgeCommissionCaseCount ? data.judgeCommissionCaseCount : null
          this.comprehensiveData[1].value = data.onlineCommissionRate ? data.onlineCommissionRate : null
          this.comprehensiveData[2].value = data.unReceiveCaseLongerThenThreeDay ? data.unReceiveCaseLongerThenThreeDay : null
          this.comprehensiveData[3].value = data.unFinishCaseLongerThenThirtyDay ? data.unFinishCaseLongerThenThirtyDay : null
          this.comprehensiveData[4].value = data.mediateSuccessRate ? data.mediateSuccessRate : null
        }
      })
    },
    // 获取调解成功率，在线调解率、平均调解时间
    getMediatorRate() {
      const params = {
        ...this.timeParams
      }
      getMediatorRate(params).then(({ code, data }) => {
        if (code === 200) {
          this.mediatorRate = data
          const processDateDistribute = data.processDateDistribute
          this.averageList[0].value = processDateDistribute.zeroToThree
          this.averageList[1].value = processDateDistribute.threeToSeven
          this.averageList[2].value = processDateDistribute.sevenToFifteen
          this.averageList[3].value = processDateDistribute.fifteenToThirty
          this.averageList[4].value = processDateDistribute.largerThenThirty
          this.$forceUpdate()
          this.$refs.DataBlock.getList(this.mediatorRate)
          // if (this.type === 2) {
          this.$refs.CollapseChart.init(this.averageList)
          // }
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
          this.totalCount = data
          for (var i = 0; i < data.totalCountForUAndO.length; i++) {
            this.orgNum = this.orgNum + parseInt(data.totalCountForUAndO[i].deptCount)
          }
        }
      })
    },
    // 获取当前部门、组织 或调解员的 收案结案数量
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
            this.$refs.LineChart.init(list)
          }
          if (e === 'month') {
            this.timeParams.startTime = dateRangeUtil.getCurrentMonth()[0] + ' 00:00:00'
            this.timeParams.endTime = dateRangeUtil.getCurrentMonth()[1] + ' 23:59:59'
            this.getDeptOrg()
            this.getComprehensive()
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
            this.getDeptOrg()
            this.getComprehensive()

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
    // 获取页面数据
    getPage() {
      if (this.getUserInfo.loginRole.roleId == 8) {
        this.getAdditionCount()
        this.getTopBrief()
        this.getRangkMed(this.caseType)
        this.getCaseNum('year')
        this.getMediatorRate()
      }
    }
  }
}
</script>

<style scoped lang="less">
.header{
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}
.title{
  font-size: 20px;
  font-weight: 700;
  color: #242f57;
  margin-bottom: 20px;
}
.dateList{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  color: rgba(0,0,0,0.50);
  margin-right: 60px;
}
.dateListItem{
  margin: 10px;
  font-weight: 400;
  font-size: 14px;
  cursor: pointer;
}
.selectedColor{
font-weight: 700;
color: rgba(0,0,0,0.85);
}
.left-container{
  margin:10px;
  padding: 20px;
  border: 1px solid rgba(0,0,0,0.10);
  border-radius: 10px;
}
.med-container{
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.med-title{
   font-size: 20px;
  font-weight: 700;
  color: #000000;
}
.med-menu{
  margin-left: 20px;
  right:40px;
  display: flex;
  cursor: pointer;
  font-size: 16px;
  // margin-left:200px;
}
.selectedMed{
  color: #177ddc;
  font-weight: 700;
  border-bottom:#177ddc ;
border-radius: 2px;
}
img{
    width: 60px;
    height: 60px;
  }
.left{
  padding: 0 20px;
  display: flex;
  flex-direction: row;
  align-items: center;
  .record{
    margin-left: 30px;
    .record-title{
      color: rgba(0,0,0,0.85);
      font-size: 15px;
      font-weight: 500;
    }
  }

  .right-container{
     margin:10px;
  padding: 20px;
  border: 1px solid rgba(0,0,0,0.10);
  border-radius: 10px;
  }
  .header-title{
    border: 1px solid rgba(0,0,0,0.10);
    border-radius: 10px;
  }
}
.evaluation{
    width: 100%;
   display: flex;
   padding-right:20px;
   justify-content: space-between;
   margin-bottom: 55px;
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
.number{
  margin-right: 30px;
  font-size: 15px;
  font-weight: 600;
  color: #242f57;
    }
</style>
