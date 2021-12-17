<template>
  <div class="container">
    <div class="header">
      <div>{{ getUserInfo.user.nickName }},本月办理如下</div>
      <div class="detail-flex">
        <div v-for="(item,index) in headerList" :key="index" class="header-detail">
          <div>{{ item.title }}</div>
          <div :class="item.class">{{ item.value }}</div>
        </div>
      </div>
    </div>
    <div>
      <Row>
        <Col :span="16">
          <Row class="content">
            <div style="font-size: 20px;font-weight: 700;margin-bottom:20px">待办工作台</div>
            <Col v-for="(item,index) in agentList " :key="index" :span="12" class="bench-container">
              <div class="bench-header">
                <div style="font-weight: 600;font-size: 14px;">{{ item.title }}</div>
                <img class="image1" :src="item.arrowPath" @click="jump(item.navigator)">
              </div>
              <div class="count-flex">
                <div style="font-weight: 600;font-size: 32px;">{{ item.count }}</div>
                <img class="image2" :src="item.path">
              </div>
              <Divider v-if="index==1||index==0" class="divider1" />
              <Divider v-if="index==1||index==3" type="vertical" class="divider" />

            </Col>

          </Row>
        </Col>
        <Col :span="8" class="calendar_box" style="height:420px">
          <div class="calendar">
            <div class="calendar_title">
              <div v-for="(item,index) in calendarType" :key="index" :class="{selectType:type==item.index}" style=" cursor: pointer;" @click="changeIndex(item.index)">{{ item.title }}</div>
            </div>
            <span class="toAll" @click="toAll">查看全部</span>
          </div>

          <Calendar
            :fullscreen="false"
            @panelChange="onPanelChange"
            @select="selectCalender"
          >
            <ul slot="dateCellRender" slot-scope="value" class="events">
              <li v-for="item in getListData(value)" :key="item.content">
                <Badge :status="item.type" :text="item.content" color="#108ee9" class="badge" />
              </li>
            </ul>
          </Calendar>
          <div
            v-if="calenderShow"
            class="calendar_detail"
          >
            <Spin :spinning="spinning">
              <div class="detail_headeer">
                <div>{{ type==1?'排期':'排庭' }}案件{{ caseNum }}件</div>
                <Icon type="close" @click="calenderShow=false" />
              </div>
              <div v-for="(item,index) in scheduleList" :key="index" class="calendar_count">
                <img src="../../assets/images/login/Frame@2x (13).png" alt="">
                <div class="calendar_caseNo"> {{ item.caseNo?item.caseNo:item.preCaseNo }}</div>
                <div class="calendar_judge">
                  <div v-if="type==1">
                    <div class="wrap">解纷员：{{ item.names.split(',')[1] }}</div>
                    <!-- <div>/</div> -->
                    <div class="wrap">法官助理：{{ item.names.split(',')[0] }}</div>
                  </div>
                  <div v-if="type==2">(法官：{{ item.judgeName }}/书记员:{{ item.clerkName }})</div>
                </div>
              </div>
            </Spin>
          </div>
        </Col>
      </Row>
    </div>
    <div class="header">
      <div class="table_container">
        <div class="tableTitle">诉前案件统计</div>
        <div class="list-btn-content enter-X">
          <RadioGroup v-model="dataType" class="radio1" button-style="solid" @change="change">
            <RadioButton :value="1">周</RadioButton>
            <RadioButton :value="2">月</RadioButton>
            <RadioButton :value="3">季</RadioButton>
            <RadioButton :value="4">年</RadioButton>
          </RadioGroup>
        </div>
      </div>
      <Table
        :columns="columns"
        :data-source="list"
        :row-key="(record,index)=>{return index}"
        class="my-table"
        :loading="loading"
        :pagination="{
          total: total,
          showTotal: total => {
            return `共计${total}条`
          },
          current: searchParams.pageNumber,
          showSizeChanger: true,
          showQuickJumper: true,
        }"
        @change="changePage"
      >
        <div slot="operation" slot-scope="record">
          <a class="operation_btn" @click="look(record)">查看</a>
          <a class="operation_btn1" @click="del(record)">删除</a>
        </div>
      </Table>
    </div>
    <!-- <PhoneList /> -->
  </div>
</template>
<script>
import { Row, Col, Table, Calendar, Radio, Icon, Spin, Badge, Divider } from 'ant-design-vue'
import { getPrecaseByUser, workbenchData, getPreCaseStatement } from '@/api/workBench/index.js'
import { getPreCase } from '@/api/statistics/index.js'
import { listPreSchedulingInfo, listSchedulingCaseInfo, listSchedulingInfo } from '@/api/schedule/index.js'
// import PhoneList from './components/phoneList.vue'
import moment from 'moment'
import { mapGetters } from 'vuex'
const { dateRangeUtil } = require('@/utils/dateRangUtil.js')

export default {
  components: {
    Row,
    Col,
    Table,
    Calendar,
    RadioGroup: Radio.Group,
    RadioButton: Radio.Button,
    Icon,
    Spin,
    Badge,
    Divider

  },
  props: {
  },
  data() {
    return {
      spinning: false,
      loading: false,
      total: 0,
      type: 1, // 1为排期,2为排庭
      dataType: 1, // 1为周，2为月，3为季，4为年
      caseNum: 0, // 当前排期/排庭案件数量
      calenderShow: false,
      isInit: true,
      headerList: [
        {
          title: '旧存',
          value: 0 + '件',
          class: 'index1'
        },
        {
          title: '新收',
          value: 0 + '件',
          class: 'index2'
        },
        {
          title: '诉前调查',
          value: 0 + '件',
          class: 'index3'
        },
        {
          title: '调解',
          value: 0 + '件',
          class: 'index4'
        },
        {
          title: '撤诉',
          value: 0 + '件',
          class: 'index5'
        },
        {
          title: '调撤率',
          value: 0 + '%',
          class: 'index6'
        },
        {
          title: '纠纷化解率',
          value: 0 + '%',
          class: 'index7'
        }
      ],
      calendarType: [
        {
          index: 1,
          title: '排期日历'
        },
        {
          index: 2,
          title: '排庭日历'
        }
      ], // 日期类型
      agentList: [// 代办工作台
        {
          title: '送达中',
          count: null,
          path: require('@/assets/images/login/blue.png'),
          arrowPath: require('@/assets/images/login/blue1.png'),
          navigator: '/servedManage/servicing'
          // increase: require('@/assets/images/login/increaseArrow.png'),
          // reduce: require('@/assets/images/login/reduceArrow.png')
        },
        {
          title: '待指派调解员',
          count: null,
          path: require('@/assets/images/login/purple.png'),
          arrowPath: require('@/assets/images/login/purple1.png'),
          navigator: '/caseHandle/reassigned'
        },
        {
          title: '诉前调查中',
          count: null,
          arrowPath: require('@/assets/images/login/Group 626047@2x.png'),
          path: require('@/assets/images/login/yellow.png'),
          navigator: '/caseHandle/preientation'
        },
        {
          title: '委派调解中',
          count: null,
          arrowPath: require('@/assets/images/login/green1.png'),
          path: require('@/assets/images/login/green.png'),
          navigator: '/caseHandle/mediating'
        }
      ], // 代办工作台数据
      columns: [
        {
          title: '法官助理',
          dataIndex: 'name',
          key: 'name'
        },
        {
          title: '旧存',
          dataIndex: 'jc',
          key: 'jc'
        },
        {
          title: '新收',
          dataIndex: 'xs',
          key: 'xs'
        },
        {
          title: '受理数',
          dataIndex: 'sls',
          key: 'sls'
        },
        {
          title: '诉前调查',
          dataIndex: 'sqdc',
          key: 'sqdc'
        },
        {
          title: '调解',
          dataIndex: 'tj',
          key: 'tj'
        },
        {
          title: '撤诉',
          dataIndex: 'cs',
          key: 'cs'
        },
        {
          title: '其他',
          dataIndex: 'qt',
          key: 'qt'
        },
        {
          title: '处理数',
          dataIndex: 'cls',
          key: 'cls'
        },
        {
          title: '未结',
          dataIndex: 'wj',
          key: 'wj'
        },
        {
          title: '诉前鉴定',
          dataIndex: 'sqjd',
          key: 'sqjd'
        },
        {
          title: '诉前保全',
          dataIndex: 'sqbq',
          key: 'sqbq'
        },
        {
          title: '调撤率',
          dataIndex: 'dcl',
          key: 'dcl'
        },

        {
          title: '纠纷化解率',
          dataIndex: 'jfhjl',
          key: 'jfhjl'
        }
      ],
      list: [],
      time: '',
      scheduleList: [], // 排庭or排期列表
      caseDateList: [], // 出现案件的时间
      searchParams: {
        startDate: dateRangeUtil.getCurrentWeek()[0],
        endDate: dateRangeUtil.getCurrentWeek()[1],
        pageNumber: 1,
        pageSize: 10
      }
    }
  },
  created() {
    this.getHeaderData()
    this.getWorkBench()
    this.getPreCaseStatement(this.searchParams)
  },
  computed: {
    ...mapGetters(['getUserInfo'])
  },
  mounted() {
    this.selectCalender(this.$moment())
    this.isInit = false
  },
  methods: {
    getHeaderData() {
      getPrecaseByUser().then(({ code, data }) => {
        if (code === 200) {
          this.headerList[0].value = (data.jc ? data.jc : 0) + '件'
          this.headerList[1].value = (data.xs ? data.xs : 0) + '件'
          this.headerList[2].value = (data.sqdc ? data.sqdc : 0) + '件'
          this.headerList[3].value = (data.tj ? data.tj : 0) + '件'
          this.headerList[4].value = (data.cs ? data.cs : 0) + '件'
          this.headerList[5].value = (data.dcl ? data.dcl : 0) + '%'
          this.headerList[6].value = (data.jfhjl ? data.jfhjl : 0) + '%'
          this.$forceUpdate()
        }
        console.log(this.headerList)
      })
    },
    // 代办工作台数据
    getWorkBench() {
      workbenchData().then(({ code, data }) => {
        if (code == 200) {
          this.agentList[0].count = (data.sendingCaseCount ? data.sendingCaseCount : 0) + '件'
          this.agentList[1].count = (data.unAppointMediatorCaseCount ? data.unAppointMediatorCaseCount : 0) + '件'
          this.agentList[2].count = (data.preLawCaseCount ? data.preLawCaseCount : 0) + '件'
          this.agentList[3].count = (data.commissionMediateCaseCount ? data.commissionMediateCaseCount : 0) + '件'
          this.$forceUpdate()
        }
      })
    },
    // 待办工作台跳转页面
    jump(path) {
      console.log(path)
      this.$router.push(path)
      this.$store.commit('ADD_TAGVIEWLIST', path)
    },
    // 案件数据
    getPreCaseStatement(params) {
      this.loading = true
      getPreCase(params).then(res => {
        this.loading = false
        if (res.code === 200) {
          this.list = res.data.map(item => {
            item.dcl = item.dcl ? (item.dcl + '%') : '0%'
            item.jfhjl = item.jfhjl ? (item.jfhjl + '%') : '0%'
            return item
          })

          this.total = this.list.length
        }
      })
    },
    // 分页触发
    changePage(e) {
      if (e.pageSize !== this.searchParams.pageSize) {
        this.searchParams.pageNumber = 1
        this.searchParams.pageSize = e.pageSize
      } else {
        this.searchParams.pageNumber = e.current
      }
      this.getPreCaseStatement()
    },
    // 修改日历选择 月/年
    onPanelChange(value, mode) {
      console.log(value, mode)
      this.selectCalender(value)
      this.time = value
    },
    // 修改日期
    selectCalender(date) {
      if (!this.isInit && date) {
        this.calenderShow = true
      }
      this.scheduleList = []
      this.caseDateList = []
      this.format(new Date(date._d), 'YYYY-MM-DD')
      const params = {
        queryType: 2,
        queryDate: this.format(new Date(date._d), 'YYYY-MM-DD')
      }
      this.spinning = true
      // 排期
      if (this.type == 1) {
        listPreSchedulingInfo(params).then(({ code, data }) => {
          if (code == 200) {
            this.spinning = false
            data.map(item => {
              item.schedulingStartime1 = moment(item.schedulingStartime).format('YYYY-MM-DD')
              if (item.schedulingStartime1 == this.format(new Date(date._d), 'YYYY-MM-DD')) {
                this.scheduleList.push(item)
              }
              this.caseDateList.push(item.schedulingStartime1)
            })
          }
          this.caseDateList = this.caseDateList.filter((item, index) => this.caseDateList.indexOf(item) == index)
          console.log(this.caseDateList)
          this.caseNum = this.scheduleList.length
        })
      }
      // 排庭
      if (this.type == 2) {
        listSchedulingInfo(params).then(({ code, data }) => {
          if (code == 200) {
            this.spinning = false
            data.map(item => {
              item.startTime1 = moment(item.startTime).format('YYYY-MM-DD')
              if (item.startTime1 == this.format(new Date(date._d), 'YYYY-MM-DD')) {
                this.scheduleList.push(item)
              }
            })
          }
          this.caseNum = this.scheduleList.length
        })
        this.getListData(this.time)
      }
    },
    // 跳转排期全部
    toAll() {
      if (this.type === 1) {
        this.$router.push('/servedManage/schedule/calendar')
        this.$store.commit('ADD_TAGVIEWLIST', '/servedManage/schedule/calendar')
      } else {
        this.$router.push('/servedManage/schedule/palaceCalendar')
        this.$store.commit('ADD_TAGVIEWLIST', '/servedManage/schedule/palaceCalendar')
      }
    },
    // 修改表单搜索条件
    change(e) {
      const value = e.target.value
      if (value === 1) {
        this.searchParams.startDate = dateRangeUtil.getCurrentWeek()[0] + ' 00:00:00'
        this.searchParams.endDate = dateRangeUtil.getCurrentWeek()[1] + ' 23:59:59'
        this.searchParams.pageNumber = 1
        this.getPreCaseStatement(this.searchParams)
      }
      if (value === 2) {
        this.searchParams.startDate = dateRangeUtil.getCurrentMonth()[0] + ' 00:00:00'
        this.searchParams.endDate = dateRangeUtil.getCurrentMonth()[1] + ' 23:59:59'
        this.searchParams.pageNumber = 1
        this.getPreCaseStatement(this.searchParams)
      }

      if (value === 3) {
        this.searchParams.startDate = dateRangeUtil.getCurrentSeason()[0] + ' 00:00:00'
        this.searchParams.endDate = dateRangeUtil.getCurrentSeason()[1] + ' 23:59:59'
        this.searchParams.pageNumber = 1
        this.getPreCaseStatement(this.searchParams)
      }
      if (value === 4) {
        this.searchParams.startDate = dateRangeUtil.getCurrentYear()[0] + ' 00:00:00'
        this.searchParams.endDate = dateRangeUtil.getCurrentYear()[1] + ' 23:59:59'
        this.searchParams.pageNumber = 1
        this.getPreCaseStatement(this.searchParams)
      }
    },
    changeIndex(e) {
      this.type = e
      console.log('12321321', this.time)
      this.selectCalender(this.time)
    },
    // 日历提醒渲染
    getListData(value) {
      let listData = []
      for (const key in this.caseDateList) {
        if (this.caseDateList[key] == this.$moment(value._d).format('YYYY-MM-DD')) {
          listData = [
            { type: 'success' }
          ]
        }
      }
      return listData || []
    }

  }
}
</script>

<style scoped lang="less">
.container{
  display: flex;
  flex-direction: column;

}
.flex{
  display: flex;
}
.wrap{
  flex-wrap: wrap;
}
.header{
  width: 100%;
  // height:150px ;
  padding: 20px;
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(23,125,220,0.20);
  border-radius: 10px;
  box-shadow: 0px 4px 4px 0px rgba(23,125,220,0.05);
  color:black;
  font-size: 20px;
  font-weight: 600;
}
.detail-flex{
  display: flex;
  margin-left: 5%;
  width: 100%;
  font-size: 18px;
  font-weight: 500;
  justify-content: space-between;
  align-items: center;

}
.header-detail{
  width: 80%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.content{
  margin-top:20px;
  height: 420px;
   border: 1px solid rgba(23,125,220,0.20);
  border-radius: 10px;
  box-shadow: 0px 4px 4px 0px rgba(23,125,220,0.05);
  color:black;
  padding: 20px;
  margin-bottom: 20px;
}
.bench-container{
  padding: 20px;
  position: relative;

}
.bench-header{
  padding: 0 10px;
  display: flex;
  width:100%;
  justify-content: space-between;
}
.image1{
  width: 35px;
  height: 35px;
  cursor: pointer;
}
.count-flex{
  margin-top:20px;
  margin-left:30px;
  display: flex;
  // div{
  //   margin-right:10px;
  // }
}
.image2{
  width: 200px;
  height: 80px;
  margin-left: 180px;
}
.index1{
  font-size: 24px;
  font-weight: 600;
  color:#177DDC;
}
.index2{
  font-size: 24px;
  font-weight: 600;
  color:#3C9AE8;
}
.index3{
  font-size: 24px;
  font-weight: 600;
  color:#65BF73;
}
.index4{
  font-size: 24px;
  font-weight: 600;
  color:#8DCFF8;
}
.index5{
  font-size: 24px;
  font-weight: 600;
  color:#6863FB;
}
.index6{
  font-size: 24px;
  font-weight: 600;
  color:#F2994A;
}
.index7{
  font-size: 24px;
  font-weight: 600;
  color:#13C2C2;
}
// :style="{ width: '30%',height:'320px', border: '1px solid #d9d9d9', borderRadius: '4px',margin:'20px' }"
.calendar_box{
  width:32%;
  background: #ffffff;
  border: 1px solid rgba(23,125,220,0.10);
  border-radius: 10px;
   margin-top:20px ;
   height: 380px;
   position: relative;
   float: right;
}
.radio {
  margin: 10px;
}

.calendar_detail{
  background-color: white;
   position: absolute;
  width:80%;
  height: 200px;
  top:90px;
  right: 40px;
  left:80px;
  bottom:140px;
  font-size: 14px;
  padding: 10px;
  border: 1px solid rgba(23,125,220,0.10);
border-radius: 6px;
box-shadow: 4px 16px 54px 0px rgba(23,125,220,0.16);
overflow: auto;
}
.calendar_count{
  margin-top:10px;
  display: flex;
  align-items: center;
  div{
    margin-left:10px;
  }
}
.detail_headeer{
  display: flex;
  justify-content: space-between;

}
img{
    width:20px;
    height: 20px;
  }

/deep/.ant-fullcalendar-header{
 .ant-radio-button-wrapper{
  display: none;
}
}
.calendar{
  margin-top: 10px;
  display: flex;
  align-items: center;
}
.toAll{
  width: 78px;
  padding: 5px;
  // opacity: 0.2;
  background: rgb(228, 240, 251);
  border-radius: 20px;
  color:#177DDC;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-left: 5px;
}
.calendar_caseNo{
  max-width: 30%;
  margin-left: 10px;
}
.calendar_judge{
  max-width: 50%;
}
.table_container{
  width:100%;
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}
.calendar_title{
  color:rgb(157, 157, 157);
  font-size: 16px;
display: flex;
align-items: center;
padding:10px;
div{
  margin-left: 20px;
}
}
.selectType{
  font-weight: 700;
  font-size: 20px;
  color:black;

}
.circle-content{
  display: flex;
  justify-content:center;
  margin-top:-10px;

}
.circle{
    width: 10px;
    height: 10px;
    background-color:#177DDC;
    border-radius: 50%;
    -moz-border-radius: 50%;
    -webkit-border-radius: 50%;
    font-size: 8px;
    margin-top:-5px;
}
.divider{
  height:150px;
  position: absolute;
  right:98%;
}
.divider1{
  position: absolute;
  right:10px;
  left:5px;
top:145px;
}
/deep/.ant-badge{
  margin-left:10px
}
</style>
