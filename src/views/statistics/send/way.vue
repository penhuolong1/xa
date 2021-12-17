<template>
  <!--案件鉴定 -->
  <div>
    <SearchForm :is-skeleton="isSkeleton" :schema="searchSchema" class="enter-X" @search="search" @change="change" />
    <div class="list-btn-content enter-X">
      <RadioGroup v-model="type" class="my-5" @change="changeType">
        <RadioButton :value="1">
          本周
        </RadioButton>
        <RadioButton :value="2">
          本月
        </RadioButton>
        <RadioButton :value="3">
          本季度
        </RadioButton>
        <RadioButton :value="4">
          本年
        </RadioButton>
      </RadioGroup>
    </div>
    <SendTypeCount ref="sendTypeCount" /> <!-- 送达方式记录次数统计 -->
    <SendTypeEfficient ref="sendTypeEfficient" /> <!-- 有效送达方式统计 -->
    <SendMail ref="sendMail" /><!-- 邮寄送达方式统计 -->
    <SendDoor ref="sendDoor" /> <!-- 上门送达方式统计 -->
    <SendEntrus ref="sendEntrus" /> <!-- 委托送达方式统计 -->
    <Button type="primary" @click="isExplain = !isExplain">更多解释</Button>
    <div v-show="isExplain" class="explain">
      <div>一．名词解释：</div>
      <div>1、每个自然月的中心接收案件的总数（以进入待指派的时间为统计点）</div>
      <div>2、每个自然月的完成案件总数（以案件送达完成移交庭室的时间节点为统计点）</div>
      <div>3、返件量（以案件送达完成移交庭室的时间节点为统计点）</div>
      <div>4、退件（转流程-案件终止，统计案件进入送达待指派后的案件）</div>
      <div>5、自动计算出平均送达时效（XX天/件为单位，计算时间以自然月、自然年、实时数据为节点）。</div>
      <div>6、30天内完成送达的案件数（从案件进入待指派时间开始计算）与实际完成送达的案件量的占比（以自然月为节点）</div>
      <div>7、本自然月完成送达的案件数量与上月完成送达的案件数量的环比【公式：（本月-上月）/上月X100% 】增长率（以案件进入待庭室接收的时间为准）。</div>
      <div>8、平均送达时效：查询时间内具体每个案件的实际完成天数之和/查询时间内送达案件完成总数</div>
      <div>9、移交：如送达员A把案件D移交给送达员B，那么案件D既属于送达员A的收件数，又是送达员B的收件数；</div>
      <div>10、重新指派：案件D本来属于送达员A的，重新指派给送达员B，那么案件D属于B的收件数，不属于A的收件数</div>
    </div>
  </div>
</template>
<script>
import SearchForm from '@/components/SearchForm'
import { Button, Radio } from 'ant-design-vue'
import SendTypeCount from './components/sendTypeCount.vue'
import SendTypeEfficient from './components/sendTypeEfficient.vue'
import SendDoor from './components/sendDoor.vue'
import SendEntrus from './components/sendEntrus.vue'
import SendMail from './components/sendMail.vue'
import { getSendType, getGiveAllCase, getGiveAllState, getGiveAllEnd } from '@/api/statistics/index'
const { dateRangeUtil } = require('@/utils/dateRangUtil.js')
export default {
  components: {
    SearchForm,
    RadioGroup: Radio.Group,
    RadioButton: Radio.Button,
    SendDoor,
    SendEntrus,
    SendTypeCount,
    SendTypeEfficient,
    SendMail,
    Button
  },
  props: {},
  data() {
    return {
      isExplain: false,
      type: 2, // 1 本周 2 本月 3 本季度 4 本年
      timeType: 0, // 1 年 2月 3天
      isSkeleton: false, // 是否显示骨架屏
      searchParams: { // 列表搜索条件
        startDate: dateRangeUtil.getCurrentMonth()[0] + ' 00:00:00',
        endDate: dateRangeUtil.getCurrentMonth()[1] + ' 23:59:59'
      },
      searchSchema: [
        {
          label: '法官助理',
          type: 'input',
          field: 'assistantJudgeName'
        },
        {
          label: '时间类型',
          type: 'select',
          field: 'timeType',
          options: [
            {
              value: 1,
              label: '年'
            },
            {
              value: 2,
              label: '月'
            },
            {
              value: 3,
              label: '日'
            }
          ]
        },
        {
          label: '时间',
          type: 'year',
          field: ['startDate', 'endDate'],
          vIf: () => {
            return this.timeType === 1
          }
        },
        {
          label: '时间',
          type: 'month',
          field: ['startDate', 'endDate'],
          vIf: () => {
            return this.timeType === 2
          }
        },
        {
          label: '时间',
          type: 'time',
          field: ['startDate', 'endDate'],
          vIf: () => {
            return this.timeType === 3
          }
        }
      ]
    }
  },
  computed: {
    rowSelection() {
      return {
        onChange: (selectedRowKeys, selectedRows) => {
          this.selectKey = selectedRows
          console.log(this.selectKey)
        }
      }
    }
  },
  created() {},
  mounted() {
    this.getList()
  },
  methods: {
    search(e) {
      this.searchParams = e
      delete this.searchParams['startDate,endDate']
      delete this.searchParams.timeType
      if (this.timeType === 1) {
        if (this.searchParams.startDate) {
          this.searchParams.startDate = this.searchParams.startDate + '-01-01 00:00:00'
          this.searchParams.endDate = this.searchParams.endDate + '-12-31 23:59:59'
        }
      } else if (this.timeType === 2) {
        if (!this.searchParams.startDate) {
          return
        }
        const ary = this.searchParams.endDate.split('-')
        const days = new Date(ary[0], ary[1], 0).getDate()
        this.searchParams.startDate = this.searchParams.startDate + '-01 00:00:00'
        this.searchParams.endDate = this.searchParams.endDate + `-${days} 23:59:59`
      } else if (this.timeType === 3) {
        if (!this.searchParams.startDate) {
          return
        }
        this.searchParams.startDate = this.searchParams.startDate + ' 00:00:00'
        this.searchParams.endDate = this.searchParams.endDate + ' 23:59:59'
      }
      if (!this.searchParams.startDate && !this.searchParams.endDate) {
        this.changeType()
      } else {
        this.getList()
      }
    },
    async getList(e) {
      this.$refs.sendTypeCount.getList(this.searchParams)
      this.$refs.sendTypeEfficient.getList(this.searchParams)
      this.$refs.sendDoor.getList(this.searchParams)
      this.$refs.sendEntrus.getList(this.searchParams)
      this.$refs.sendMail.getList(this.searchParams)
    },
    changeType() {
      delete this.searchParams['startDate,endDate']
      delete this.searchParams.timeType
      if (this.type === 1) {
        this.searchParams.startDate = dateRangeUtil.getCurrentWeek()[0]
        this.searchParams.endDate = dateRangeUtil.getCurrentWeek()[1]
      }
      if (this.type === 2) {
        console.log(dateRangeUtil.getCurrentMonth())
        this.searchParams.startDate = dateRangeUtil.getCurrentMonth()[0]
        this.searchParams.endDate = dateRangeUtil.getCurrentMonth()[1]
      }
      if (this.type === 3) {
        this.searchParams.startDate = dateRangeUtil.getCurrentSeason()[0]
        this.searchParams.endDate = dateRangeUtil.getCurrentSeason()[1]
      }
      if (this.type === 4) {
        this.searchParams.startDate = dateRangeUtil.getCurrentYear()[0]
        this.searchParams.endDate = dateRangeUtil.getCurrentYear()[1]
      }
      this.searchParams.startDate = this.searchParams.startDate + ' 00:00:00'
      this.searchParams.endDate = this.searchParams.endDate + ' 23:59:59'
      this.getList()
    },
    change(vaule, filed) {
      if (filed === 'timeType') {
        this.timeType = vaule
      }
    }
  }
}
</script>

<style scoped lang="less">
.ant-btn{
  margin:10px;
}

.table-box {
  padding: 20px!important;
  h1 {
    text-align: center;
    font-size: 18px;
    margin-bottom: 10px;
  }
}
</style>
