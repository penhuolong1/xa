<template>
  <div class="week-calendar">
    <div class="weeks flex">
      <div class="first week-header" />
      <div v-for="item in weekTimes" :key="item.time" class="item week-header">
        <div class="time">{{ item.time }}</div>
        <div class="time">{{ item.weekName }}</div>
      </div>
    </div>
    <div v-for="(item, index) in timeAry" :key="index" class="flex">
      <div class="first item-content">{{ item.time }}</div>
      <div v-for="item1 in item.timeAry" :key="item1.key" class="item item-content">
        <CalendarItem :list="list" :type="type" :time="item1.time+' '+ item.time" />
      </div>
    </div>
  </div>
</template>

<script>
import CalendarItem from './calendarItem.vue'
const { dateRangeUtil } = require('@/utils/dateRangUtil.js')
export default {
  components: {
    CalendarItem
  },
  props: {
    time: {
      type: String,
      default: ''
    },
    list: {
      type: Array,
      default: () => []
    },
    type: { // 1排期 2排庭
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      weekTimes: [],
      startTime: '08:00',
      endTime: '18:00',
      spacing: 30,
      timeAry: []
    }
  },
  watch: {
    time() {
      this.setTime()
    }
  },
  created() {
  },
  mounted() {
    this.setTime()
  },
  methods: {
    setTime() {
      this.weekTimes = dateRangeUtil.getCurrentWeeks(new Date(this.time))
      this.computeTime()
    },
    // 根据开始结束时间和间隔计算出所有时间
    computeTime() {
      const startTimeStr = (this.time + ' ' + this.startTime).replace(new RegExp(/-/gm), '/')
      const endTimeStr = (this.time + ' ' + this.endTime).replace(new RegExp(/-/gm), '/')
      const startTime = new Date(startTimeStr).getTime()
      const endTime = new Date(endTimeStr).getTime()
      const spacing = this.spacing * 60 * 1000
      const timeAry = []
      for (let i = startTime; i < endTime; i = i + spacing) {
        const obj = {
          timeAry: this.weekTimes,
          time: this.format(new Date(i), 'H:m'),
          key: i
        }
        timeAry.push(obj)
      }
      this.timeAry = timeAry
    }
  }
}
</script>

<style scoped lang="less">
.week-calendar {
  height: calc(100% - 260px);
  overflow-y: auto;
  width: 100%;
  .flex {
    width: 100%;
    .first {
      width: 100px;
      border: 1px solid rgba(0,0,0,0.10);
      border-right: none;
      #center();
    }
    .item {
      flex: 1;
      width: 0;
      border: 1px solid rgba(0,0,0,0.10);
      &:nth-child(odd) {
        border-left: none;
        border-right: none;
      }
    }
    .week-header {
      height: 60px;
      #center();
      flex-direction: column;
    }
    .item-content {
      height: 120px;
      border-top: none;
    }
  }
}
</style>
