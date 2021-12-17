<template>
  <div class="flex">
    <div class="case-detail-left">
      <div v-for="item in detailList" :key="item.schedulingId" class="case-detail-item">
        <div class="time">{{ item.time }}</div>
        <div class="case-no">{{ item.preCaseNo }}</div>
        <div class="other">
          <div class="time1">
            <Icon class="icon" type="clock-circle" />{{ item.startTime1 }}
          </div>
          <div class="name">{{ item.names }}</div>
        </div>
      </div>
      <Empty v-if="!detailList || detailList.length === 0" class="empty" />
    </div>
    <div class="calendar">
      <Calendar v-model="monthTime" @select="selectCalendar">
        <div slot="headerRender" />
        <ul slot="dateCellRender" slot-scope="value" class="events">
          <li v-for="item in getListData(value)" :key="item.schedulingId">
            <div class="scheduling-item">{{ item.caseNo }}({{ item.names }})</div>
          </li>
        </ul>
      </Calendar>
    </div>
  </div>
</template>

<script>
import { Icon, Calendar, Empty } from 'ant-design-vue'
import moment from 'moment'

export default {
  components: {
    Calendar,
    Empty,
    Icon
  },
  props: {
    list: {
      type: Array,
      default: () => []
    },
    time: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      monthTime: '',
      detailList: []
    }
  },
  watch: {
    time() {
      this.monthTime = this.time
    }
  },
  created() {
    this.monthTime = this.time
  },
  mounted() {
    this.selectCalendar(moment())
  },
  methods: {
    // 点击日历触发
    selectCalendar(value) {
      const list = this.getListData(value)
      const time = value.format('YYYY-MM-DD')
      this.detailList = []
      if (!list || list.length === 0) {
        return
      }
      this.detailList = [...list].map(item => {
        item.time = time
        item.startTime1 = item.startTime ? item.startTime.split(' ')[1] : ''
        return item
      })
      console.log(this.detailList)
    },
    getListData(value) {
      let listData = []
      const time = value.format('YYYY-MM-DD')
      listData = this.list && this.list.length > 0 ? [...this.list].filter(item => item.startTime && item.startTime.indexOf(time) !== -1) : []
      return listData || []
    }
  }
}
</script>

<style>
.ant-fullcalendar-fullscreen .ant-fullcalendar-month-panel-selected-cell .ant-fullcalendar-month, .ant-fullcalendar-fullscreen .ant-fullcalendar-selected-day .ant-fullcalendar-date {
  background: rgba(101,183,243,1);
  border-color: rgba(101,183,243,1)!important;
}
.ant-fullcalendar-fullscreen .ant-fullcalendar-month-panel-selected-cell .ant-fullcalendar-value, .ant-fullcalendar-fullscreen .ant-fullcalendar-selected-day .ant-fullcalendar-value {
  color: #fff;
}
.ant-fullcalendar-fullscreen .ant-fullcalendar-month-panel-selected-cell .ant-fullcalendar-value, .ant-fullcalendar-fullscreen .ant-fullcalendar-selected-day .ant-fullcalendar-content {
  color: #fff;
}
</style>
<style scoped lang="less">
.case-detail-left {
  width: 240px;
  box-shadow: 0px 4px 4px 0px rgba(0,0,0,0.25);
  overflow-y: auto;
  max-height: 800px;
  .empty {
    margin-top: 40px;
  }
  .case-detail-item {
    padding: 20px 10px;
    border-bottom: 1px solid #ececec;
    .time {
      color: #177ddc;
      font-size: 16px;
    }
    .case-no {
      color: rgba(0,0,0,0.85);
      font-size: 16px;
      font-weight: bold;
      margin-top: 5px;
    }
    .other {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 10px;
      .time1 {
        display: flex;
        align-items: center;
        i {
          color: #a5a5a5;
          margin-right: 5px;
          font-size: 14px;
        }
        .name {
          font-size: 14px;
        }
      }
    }
  }
}
.calendar {
  flex: 1;
  /deep/.ant-fullcalendar-date {
    border-top: none;
    border: 2px solid rgba(0,0,0,0.10);
    margin-bottom: 10px;
    border-radius: 4px;
  }
  /deep/.ant-fullcalendar-fullscreen .ant-fullcalendar-last-month-cell .ant-fullcalendar-date, .ant-fullcalendar-fullscreen .ant-fullcalendar-next-month-btn-day .ant-fullcalendar-date {
    border: none;
    background-color: #f7f7f7;
    color: rgba(0,0,0,0.50);
  }
}
.scheduling-item {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-left: 5px;
  border-left: 2px solid #b7e3fa;
}
</style>
