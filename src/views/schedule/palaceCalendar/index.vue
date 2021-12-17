<template>
  <!--案件鉴定 -->
  <div>
    <SearchForm :is-skeleton="isSkeleton" :schema="searchSchema" class="enter-X" @search="search" />
    <div class="header-wrapper">
      <div class="time-label">{{ monthTitle }}月</div>
      <div class="header-right">
        <div class="tap">
          <div class="tap-item" :class="queryType == 2 ? 'active':''" @click="selectQueryType(2)">月</div>
          <div class="tap-item" :class="queryType == 1 ? 'active':''" @click="selectQueryType(1)">周</div>
        </div>
        <MonthPicker v-show="queryType == 2" v-model="monthTime" format="YYYY-MM" value-format="YYYY-MM" @change="getList" />
        <DatePicker v-show="queryType == 1" v-model="weekTime" format="YYYY-MM-DD" value-format="YYYY-MM-DD" @change="getList" />
      </div>
    </div>
    <MonthCalendar v-if="loading && queryType === 2" :list="list" :time="monthTime" />
    <WeekCalendar v-if="loading && queryType === 1" :type="2" :list="list" :time="weekTime" />
  </div>

</template>
<script>
import SearchForm from '@/components/SearchForm'
import { Button, DatePicker } from 'ant-design-vue'
import { listSchedulingInfo } from '@/api/schedule/index.js'
import MonthCalendar from './components/monthCalendar.vue'
import WeekCalendar from '@/components/WeekCalendar/index.vue'
import moment from 'moment'
export default {
  components: {
    SearchForm,
    Button,
    MonthCalendar,
    WeekCalendar,
    DatePicker,
    MonthPicker: DatePicker.MonthPicker
  },
  props: {},
  data() {
    return {
      isSkeleton: false, // 是否显示骨架屏
      searchSchema: [
        {
          label: '预案号',
          type: 'caseNo',
          field1: 'prefixPreCaseNo1',
          field2: 'prefixPreCaseNo2',
          field3: 'startNumber',
          field4: 'endNumber'
        },
        {
          label: '预立案时间',
          type: 'time',
          field: ['startDate', 'endDate'],
          showTime: true
        },
        {
          label: '案由',
          type: 'brief',
          field: 'briefId'
        },
        {
          label: '法官助理',
          type: 'judge',
          userType: 3,
          field: 'assistantId'
        },
        {
          label: '速录员',
          type: 'judge',
          userType: 5,
          field: 'recorderId'
        },
        {
          label: '调解单位',
          type: 'mediates',
          medType: 'unit',
          field: 'unitId'
        },
        {
          label: '调解组织',
          type: 'mediates',
          medType: 'organization',
          field: 'orgId'
        },
        {
          label: '调解员',
          type: 'mediates',
          medType: 'people',
          field: 'peopleId'
        }
      ],
      monthTime: '',
      weekTime: '',
      monthTitle: '',
      queryType: 1, // 1周 2月
      list: [],
      weekList: [],
      searchParams: {
        queryType: 1
      },
      loading: false,
      detailList: [], // 左侧详细列表
      isFirst: false // 刷新页面后第一次
    }
  },
  computed: {
  },
  async created() {
    const month = (new Date().getMonth() + 1) < 10 ? `0${(new Date().getMonth() + 1)}` : (new Date().getMonth() + 1)
    this.monthTitle = `${new Date().getFullYear()}-${month}`
    this.searchParams.queryDate = this.monthTitle
    this.monthTime = moment().format('YYYY-MM-DD')
    this.weekTime = moment().format('YYYY-MM-DD')
    await this.getList()
  },
  mounted() {
  },
  methods: {
    search(e) {
      const params = { ...e }
      const lab1 = params.prefixPreCaseNo1 || ''
      const lab2 = params.prefixPreCaseNo2 || ''
      if (lab1 && lab2) {
        params.prefixPreCaseNo = '(' + lab1 + ')' + lab2
      }
      delete params.prefixPreCaseNo1
      delete params.prefixPreCaseNo2
      params.queryType = this.queryType
      this.searchParams = {
        ...params
      }
      this.searchParams.queryDate = this.queryType === 1 ? this.weekTime : this.monthTime
      this.getList()
    },
    // 获取日历数据
    async getList() {
      this.loading = false
      if (!this.searchParams.queryDate) {
        this.$message.error('请选择时间')
        return
      }
      this.searchParams.queryDate = this.queryType === 1 ? this.weekTime : this.monthTime
      this.monthTitle = this.searchParams.queryDate.substring(0, 7)
      await listSchedulingInfo(this.searchParams).then(({ code, data }) => {
        this.loading = true
        if (code === 200) {
          if (!data || data.length === 0) {
            return
          }
          this.list = data
          this.weekList = data.map(item => {
            const minutes = !item.minutes ? 30 : Number(item.minutes)
            const time = new Date(item.startTime).getTime() + minutes * 60 * 1000
            const end = moment(time).format('YYYY-MM-DD HH:mm')
            return {
              id: item.schedulingId,
              title: `${item.caseNo || ''}(${item.names || ''})`,
              start: item.startTime,
              end: end
            }
          })
        }
      })
    },
    // 改变时间触发
    changeTime(e) {
      this.monthTitle = this.monthTime
    },
    selectQueryType(type) {
      this.queryType = type
      this.searchParams.queryDate = this.queryType === 1 ? this.weekTime : this.monthTime
      this.getList()
    }
  }
}
</script>

<style scoped lang="less">
.ant-btn{
  margin:10px;
}
.header-wrapper {
  height: 80px;
  background: rgba(183,227,250,0.10);
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  .time-label {
    font-size: 16px;
    font-weight: bold;
  }
  .header-right {
    display: flex;
    .tap {
      display: flex;
      border-radius: 4px;
      margin-right: 20px;
      .tap-item {
        &.active {
          color: rgba(0,0,0);
        }
        cursor: pointer;
        background-color: rgba(143,146,161,0.05);
        width: 40px;
        height: 32px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: rgba(0,0,0,0.50);
        font-weight: bold;
        &:first-child {
          border-right: 1px solid rgba(143,146,161,0.1);
        }
      }
    }
  }
}

</style>
