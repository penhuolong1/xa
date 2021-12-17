<template>
  <!--案件鉴定 -->
  <div>
    <SearchForm :is-skeleton="isSkeleton" :default-value="defaultValue" :schema="searchSchema" class="enter-X" @search="search" @change="change" />
    <div class="list-btn-content enter-X flex-between">
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
      <Button type="primary" @click="isChart = !isChart">图表模式</Button>
    </div>

    <div v-show="!isChart">
      <Table
        class="enter-X"
        :row-key="(record,index)=>{return record.name}"
        :columns="columns"
        :scroll="{x: 1400}"
        :data-source="list"
        :loading="loading"
        :pagination="false"
      />
      <div class="mt-2.5">备注：本统计报表，统计的是选择的自然日期范围内的各案由对应的预立案案件数（单位：件）</div>
      <Button type="primary" @click="isExplain = !isExplain">更多解释</Button>
      <div v-show="isExplain" class="explain">
        <div>1.案由：已立案案件的案由；</div>
        <div>2.案件数：案由的案件数和；</div>
        <div>3.百分比：单个案由下的案件数/所有案由下的案件数之和。</div>
        <div>【筛选条件重点说明】</div>
        <div>1.时间搜索是指搜索的是自然日期范围内各案由对应的预立案案件数。</div>
      </div>
    </div>
    <div
      style="display: flex; justify-content: center;"
    >
      <div v-show="isChart" ref="echart" class="echart" />
    </div>
    <CaseList ref="caseListLog" :report="report" />
  </div>
</template>
<script>
import * as echarts from 'echarts'
import SearchForm from '@/components/SearchForm'
import CaseList from '../case/components/caseList.vue'
import { Button, Table, Radio } from 'ant-design-vue'
import { getMediaterBriefNum } from '@/api/statistics/index'
const { dateRangeUtil } = require('@/utils/dateRangUtil.js')
export default {
  components: {
    SearchForm,
    RadioGroup: Radio.Group,
    RadioButton: Radio.Button,
    Table,
    Button,
    CaseList
  },
  props: {},
  data() {
    return {
      report: 8,
      loading: false,
      total: 0, // 列表总数
      list: [], // 列表数据
      isExplain: false,
      isChart: false,
      defaultValue: {
        num: 10
      },
      columns: [
        {
          title: '序号',
          dataIndex: 'index',
          rowkey: 'index',
          width: 100
        },
        {
          title: '排名',
          dataIndex: 'num',
          rowkey: 'num'
        },
        {
          title: '案由',
          dataIndex: 'name',
          rowkey: 'name'
        },
        {
          title: '案件数',
          dataIndex: 'lawcaseNum',
          rowkey: 'lawcaseNum',
          customRender: (text, record) => {
            return (<a onclick={() => { this.caseList(record, '案件数') }}>{{ text }}</a>)
          }
        },
        {
          title: '百分比',
          dataIndex: 'lawcaseNumAll',
          rowkey: 'lawcaseNumAll'
        }
      ],
      type: 2, // 1 本周 2 本月 3 本季度 4 本年
      timeType: 0, // 1 年 2月 3天
      isSkeleton: false, // 是否显示骨架屏
      searchParams: { // 列表搜索条件
        startDate: dateRangeUtil.getCurrentMonth()[0] + ' 00:00:00',
        endDate: dateRangeUtil.getCurrentMonth()[1] + ' 23:59:59',
        num: 10
      },
      searchSchema: [
        {
          label: '单位',
          type: 'mediates',
          medType: 'unit',
          field: 'unitid'
        },
        {
          label: '排名前',
          type: 'input',
          field: 'num'
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
      ],
      selectKey: [], // 选中的列
      remarkInfo: {}, // 备注需要的信息
      isTable: true
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
    console.log('isc', this.isChart)
  },
  methods: {
    initEchart() {
      const myChart = echarts.init(this.$refs.echart)
      const data = this.list.map((item, index) => {
        if (index < 10) {
          item.value = item.lawcaseNumAll
          item.name = item.name + '，' + item.value + '%'
          return item
        }
      })
      console.log('data', data)
      const option = {
        series: [
          {
            type: 'pie',
            center: ['50%', '50%'],
            radius: '50%',
            data: data,
            emphasis: {
              itemStyle: {
                shadowBlur: 11,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
      myChart.setOption(option)
    },
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
      this.getList()
    },
    async getList(e) {
      this.loading = true
      await getMediaterBriefNum(this.searchParams).then(({ code, data }) => {
        console.log('this.searchParams', this.searchParams)
        this.loading = false
        if (code === 200) {
          if (!data && data.length === 0) {
            return
          }
          this.list = data.map((item, index) => {
            item.index = index + 1
            item.num = index + 1
            item.lawcaseNumAll = item.lawcaseNumAll + '%'
            return item
          })
        }
      })
      this.loading = false
      this.initEchart()
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
    },
    caseList(record, title) {
      console.log('record', record, title)
      console.log('12345', this.searchParams.startDate)
      this.$refs.caseListLog.show(
        {
          briefId: record.bId,
          unitId: this.searchParams.id, // 法院id

          startDate: this.searchParams.startDate,
          endDate: this.searchParams.endDate
        }
      )
    }
  }
}
</script>

<style scoped lang="less">
.ant-btn{
  margin:10px;
}
.echart {
  width:500px;
  height: 500px;
}
.flex-between{
  display: flex;
  justify-content: space-between;
}

</style>
