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
    <Table
      class="enter-X"
      :row-key="(record,index)=>{return index}"
      :columns="columns"
      :scroll="{x: 1400}"
      :data-source="list"
      :loading="loading"
      :pagination="false"
    >
      <!-- <div slot="data" slot-scope="text, record">
        <a @click="caseList(record,text)">{{ text }}</a>
      </div> -->
    </Table>
    <div class="mt-2.5">备注：本统计表支持搜索指定自然日期范围内的案件数据，其中受理数统计的是预立案时间在查询范围内的案件数，处理数统计的是诉前结案时间在查询范围内的案件数。（单位：件）</div>
    <Button type="primary" @click="isExplain = !isExplain">更多解释</Button>
    <div v-show="isExplain" class="explain">
      <div>1.旧存：上一统计日的诉前未结案案件数；</div>
      <div>2.新收：查询时间范围内新预立案的案件数；</div>
      <div>3.受理数：旧存+新收；</div>
      <div>4.诉前调查：诉前结案方式等于移送的案件数；</div>
      <div>5.调解：诉前结案方式等于调解的案件数；</div>
      <div>6.撤诉：诉前结案方式等于撤诉的案件数； </div>
      <div>7.诉前销案：诉前结案方式等于诉前销案的案件数；</div>
      <div>8.调解成功：诉前结案方式等于调解+撤诉+诉前销案的案件数；</div>
      <div>9.处理数：诉前结案方式等于诉前调查+调解+撤诉+诉前销案的案件数；</div>
      <div>10.未结：受理数-处理数；</div>
      <div>11.诉前鉴定：查询时间范围内移送鉴定的案件数；</div>
      <div>12.诉前保全：查询时间范围内立财保案号的案件数；</div>
      <div>13.调撤率：（调解+撤诉+诉前销案）/处理数*100%；</div>
      <div>14.纠纷化解率：（调解+撤诉+诉前销案）/处理数中非送达失败案件数*100%。  </div>
      <div>【筛选条件重点说明】</div>
      <div>1.时间搜索是指搜索的是自然日期范围内预立案案件数；</div>
      <div>2.受理数、未结案件数都是指预立案时间在查询自然日期范围的案件；</div>
      <div>3.处理数是指诉前结案时间在查询自然日期范围的案件；</div>
      <div>4.诉前鉴定是指移送鉴定时间在查询自然日期范围的案件；</div>
      <div>5.诉前保全是指保全立案时间在查询自然日期范围的案件。</div>
    </div>
    <CaseList ref="caseListLog" :report="report" />
  </div>

</template>
<script>
import SearchForm from '@/components/SearchForm'
import CaseList from './components/caseList.vue'
import { Button, Table, Radio } from 'ant-design-vue'
import { getPreCase, getPreCaseAll } from '@/api/statistics/index'
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
      report: 1,
      loading: false,
      total: 0, // 列表总数
      list: [], // 列表数据
      isExplain: false,
      columns: [
        {
          title: '法官助理',
          dataIndex: 'name',
          rowkey: 'name',
          width: 200
        },
        {
          title: '旧存',
          width: 100,
          dataIndex: 'jc',
          rowkey: 'jc',
          customRender: (text, record) => {
            return (<a onclick={() => { this.caseList(record, '旧存') }}>{{ text }}</a>)
          }
          // scopedSlots: { customRender: 'data' }
        },
        {
          title: '新收',
          width: 100,
          dataIndex: 'xs',
          rowkey: 'xs',
          customRender: (text, record) => {
            return (<a onclick={() => { this.caseList(record, '新收') }}>{{ text }}</a>)
          }
        },
        {
          title: '受理数',
          width: 100,
          dataIndex: 'sls',
          rowkey: 'sls',
          customRender: (text, record) => {
            return (<a onclick={() => { this.caseList(record, '受理数') }}>{{ text }}</a>)
          }
        },
        {
          title: '诉前调查',
          width: 150,
          dataIndex: 'sqdc',
          rowkey: 'sqdc',
          customRender: (text, record) => {
            return (<a onclick={() => { this.caseList(record, '诉前调查') }}>{{ text }}</a>)
          }
        },
        {
          title: '调解',
          width: 100,
          dataIndex: 'tj',
          key: 'tj',
          customRender: (text, record) => {
            return (<a onclick={() => { this.caseList(record, '调解') }}>{{ text }}</a>)
          }
        },
        {
          title: '撤诉',
          width: 100,
          dataIndex: 'cs',
          key: 'cs',
          customRender: (text, record) => {
            return (<a onclick={() => { this.caseList(record, '撤诉') }}>{{ text }}</a>)
          }
        },
        {
          title: '诉前销案',
          width: 100,
          dataIndex: 'sqxa',
          key: 'sqxa',
          customRender: (text, record) => {
            return (<a onclick={() => { this.caseList(record, '诉前销案') }}>{{ text }}</a>)
          }
        },
        {
          title: '调解成功',
          width: 100,
          dataIndex: 'tjcg',
          key: 'tjcg',
          customRender: (text, record) => {
            return (<a onclick={() => { this.caseList(record, '调解成功') }}>{{ text }}</a>)
          }
        },
        {
          title: '处理数',
          width: 100,
          dataIndex: 'cls',
          key: 'cls',
          customRender: (text, record) => {
            return (<a onclick={() => { this.caseList(record, '处理数') }}>{{ text }}</a>)
          }
        },
        {
          title: '未结',
          width: 100,
          dataIndex: 'wj',
          key: 'wj',
          customRender: (text, record) => {
            return (<a onclick={() => { this.caseList(record, '未结') }}>{{ text }}</a>)
          }
        },
        {
          title: '诉前鉴定',
          width: 150,
          dataIndex: 'sqjd',
          key: 'sqjd',
          customRender: (text, record) => {
            return (<a onclick={() => { this.caseList(record, '诉前鉴定') }}>{{ text }}</a>)
          }
        },
        {
          title: '诉前保全',
          width: 150,
          dataIndex: 'sqbq',
          key: 'sqbq',
          customRender: (text, record, index) => {
            // if (index === this.list.length - 1) {
            //   return (<span>{text}</span>)
            // } else {
            //   return (<a onclick={() => { this.caseList(record, '诉前保全') }}>{{ text }}</a>)
            // }
            return (<a onclick={() => { this.caseList(record, '诉前保全') }}>{{ text }}</a>)
          }
        },
        {
          title: '调撤率',
          width: 100,
          dataIndex: 'dcl',
          key: 'dcl'
          // customRender: (text, record) => {
          //   return (<a onclick={() => { this.caseList(record, '调撤率') }}>{{ text }}</a>)
          // }
        },
        {
          title: '纠纷化解率',
          width: 150,
          dataIndex: 'jfhjl',
          key: 'jfhjl'
          // customRender: (text, record) => {
          //   return (<a onclick={() => { this.caseList(record, '纠纷化解率') }}>{{ text }}</a>)
          // }
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
    async getList(e) {
      this.loading = true
      await getPreCase(this.searchParams).then(({ code, data }) => {
        if (code === 200) {
          if (!data || data.length === 0 || data[0] == null) {
            this.list = []
            return
          }
          if (data && data.length > 0 && data[0] != null) {
            this.list = data.map(item => {
              item.dcl = item.dcl + '%'
              item.jfhjl = item.jfhjl + '%'
              return item
            })
          }
        }
      })
      if (!this.list || this.list.length === 0) { // 如果没有数据则不掉下方的合计接口
        this.loading = false
        return
      }
      await getPreCaseAll(this.searchParams).then(({ code, data }) => {
        if (code === 200) {
          if (!data || data.length === 0 || data[0] === null) {
            this.list = []
            return
          }
          if (data && data.length > 0 && data[0] != null) {
            const list = data.map(item => {
              item.dcl = item.dcl + '%'
              item.jfhjl = item.jfhjl + '%'
              return item
            })
            data[0].name = '合计'
            this.list = [...this.list, ...list]
          }
        }
      })
      this.loading = false
    },
    // 打开弹窗
    caseList(record, title) {
      console.log('record', record)
      this.$refs.caseListLog.show(
        {
          startDate: this.searchParams.startDate,
          endDate: this.searchParams.endDate,
          assistantJudgeId: record.id,
          caseNumType: title
        }
      )
    },
    changeType() {
      delete this.searchParams['startDate,endDate']
      delete this.searchParams.timeType
      if (this.type === 1) {
        this.searchParams.startDate = dateRangeUtil.getCurrentWeek()[0]
        this.searchParams.endDate = dateRangeUtil.getCurrentWeek()[1]
      }
      if (this.type === 2) {
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

</style>
