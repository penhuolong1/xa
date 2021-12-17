<template>
  <!--案件鉴定 -->
  <div>
    <SearchForm :is-skeleton="isSkeleton" :default-value="defaultValue" :schema="searchSchema" class="enter-X" @search="search" @change="change" />
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
    <Table
      class="enter-X"
      :row-key="(record,index)=>{return record.name}"
      :columns="columns"
      :scroll="{x: 1400}"
      :data-source="list"
      :loading="loading"
      :pagination="false"
    >
      <!-- <div slot="data" slot-scope="text">
        {{ text || 0 }}
      </div> -->
    </Table>
    <div class="mt-2.5">备注：本统计表支持搜索指定时间范围内的鉴定案件数，其中统计的查询日期为自然日期，鉴定案件数以移送鉴定为统计节点，诉前结案数以诉前结案时间为统计节点。（单位：件）</div>
    <Button type="primary" @click="isExplain = !isExplain">更多解释</Button>
    <div v-show="isExplain" class="explain">
      <div>1.鉴定案件数：是指移送鉴定的案件数量；</div>
      <div> 2.诉前结案数：诉前结案方式等于移送、调解、撤诉、诉前销案的案件数；</div>
      <div> 3.调解案件数：诉前结案方式为调解的案件数；</div>
      <div> 4.撤诉案件数：诉前结案方式为撤诉和诉前销案的案件数；</div>
      <div>5.调撤率：（调解案件数+撤诉案件数）/诉前结案数X100%。</div>
      <div>【筛选条件重点说明】</div>
      <div>1.鉴定案件数指移送鉴定时间在查询自然日期范围内的预立案案件数；</div>
      <div> 2.诉前结案数、调解数、撤诉数是指鉴定案件的诉前结案时间在查询自然日期范围内的预立案案件数。</div>
    </div>
    <CaseList ref="caseListLog" :report="report" />
  </div>
</template>
<script>
import SearchForm from '@/components/SearchForm'
import CaseList from '../case/components/caseList.vue'
import { Button, Table, Radio } from 'ant-design-vue'
import { getAuthenticateCase } from '@/api/statistics/index'
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
      report: 3,
      loading: false,
      total: 0, // 列表总数
      list: [], // 列表数据
      isExplain: false,
      defaultValue: {
        num: 10
      },
      columns: [
        {
          title: '法官助理',
          dataIndex: 'judgeName',
          rowkey: 'judgeName'
        },
        {
          title: '鉴定案件数',
          dataIndex: 'jdajs',
          rowkey: 'jdajs',
          customRender: (text, record) => {
            return (<a onclick={() => { this.caseList(record, '鉴定案件数') }}>{{ text }}</a>)
          }
        },
        {
          title: '诉前结案数',
          dataIndex: 'sqjas',
          rowkey: 'sqjas',
          customRender: (text, record) => {
            return (<a onclick={() => { this.caseList(record, '诉前结案数') }}>{{ text }}</a>)
          }
        },
        {
          title: '调解案件数',
          dataIndex: 'tj',
          rowkey: 'tj',
          customRender: (text, record) => {
            return (<a onclick={() => { this.caseList(record, '调解案件数') }}>{{ text }}</a>)
          }
        },
        {
          title: '撤诉案件数',
          dataIndex: 'cs',
          rowkey: 'cs',
          customRender: (text, record) => {
            return (<a onclick={() => { this.caseList(record, '撤诉案件数') }}>{{ text }}</a>)
          }
        },
        {
          title: '调撤率',
          dataIndex: 'dcl',
          rowkey: 'dcl'

        }
      ],
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
      this.getList()
    },
    getList(e) {
      this.loading = true
      getAuthenticateCase(this.searchParams).then(({ code, data }) => {
        this.loading = false
        if (code === 200) {
          if (!data && data.length === 0) {
            return
          }
          this.list = data.map((item, index) => {
            item.dcl = (item.dcl || 0) + '%'
            return item
          })
          data[data.length - 1].judgeName = '合计'
        }
      })
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
          assistantJudgeId: record.jId,

          startDate: this.searchParams.startDate,
          endDate: this.searchParams.endDate,
          caseNumType: title
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

</style>
