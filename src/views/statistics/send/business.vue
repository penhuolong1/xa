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
    <Row :gutter="24" class="enter-X">
      <Col :span="12" class="table-box">
        <h1>送达业务总体情况</h1>
        <Table
          :row-key="(record,index)=>{return index}"
          :columns="columns1"
          :data-source="list1"
          bordered
          :loading="loading"
          :pagination="false"
        />
      </Col>
      <Col :span="12" class="table-box">
        <h1>总体完成情况</h1>
        <Table
          bordered
          :row-key="(record,index)=>{return index}"
          :columns="columns2"
          :data-source="list2"
          :loading="loading"
          :pagination="false"
        />
      </Col>
    </Row>
    <div class="table-box enter-x">
      <h1>送达业务总体情况</h1>
      <Table
        :row-key="(record,index)=>{return index}"
        :columns="columns"
        :scroll="{x: 1400}"
        :data-source="list"
        :loading="loading"
        :pagination="false"
      >
        <div slot="data" slot-scope="text">
          {{ text || 0 }}
        </div>
      </Table>
    </div>
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
    <CaseList ref="caseListLog" :report="report" />
  </div>
</template>
<script>
import SearchForm from '@/components/SearchForm'
import CaseList from '../case/components/caseList.vue'
import { Button, Table, Radio, Row, Col } from 'ant-design-vue'
import { getGiveAllCase, getGiveAllState, getGiveAllEnd } from '@/api/statistics/index'
const { dateRangeUtil } = require('@/utils/dateRangUtil.js')
export default {
  components: {
    SearchForm,
    RadioGroup: Radio.Group,
    RadioButton: Radio.Button,
    Table,
    Row,
    Col,
    Button,
    CaseList
  },
  props: {},
  data() {
    return {
      report: 5,
      loading: false,
      total: 0, // 列表总数
      list: [], // 列表数据
      list1: [], // 列表数据
      list2: [], // 列表数据
      isExplain: false,
      defaultValue: {
      },
      columns1: [
        {
          title: '旧存总数(件)',
          dataIndex: 'jc',
          rowkey: 'jc',
          customRender: (text, record) => {
            return (<a onclick={() => { this.caseList(record, '旧存总数', '1') }}>{{ text }}</a>)
          }
        },
        {
          title: '收件总数(件)',
          dataIndex: 'sjzs',
          rowkey: 'sjzs',
          customRender: (text, record) => {
            return (<a onclick={() => { this.caseList(record, '收件总数', '1') }}>{{ text }}</a>)
          }
        },
        {
          title: '完成总数(件)',
          dataIndex: 'wczs',
          rowkey: 'wczs',
          customRender: (text, record) => {
            return (<a onclick={() => { this.caseList(record, '完成总数', '1') }}>{{ text }}</a>)
          }
        },
        {
          title: '平均送达时效(天/件)',
          dataIndex: 'pjsdsx',
          rowkey: 'pjsdsx',
          scopedSlots: { customRender: 'data' }
        }
      ],
      columns2: [
        {
          title: '整卷送达成功',
          dataIndex: 'zj',
          rowkey: 'zj',
          customRender: (text, record) => {
            return (<a onclick={() => { this.caseList(record, '整卷送达成功', '2') }}>{{ text }}</a>)
          }
        },
        {
          title: '部分送达成功',
          dataIndex: 'bf',
          rowkey: 'bf',
          customRender: (text, record) => {
            return (<a onclick={() => { this.caseList(record, '整卷送达成功', '2') }}>{{ text }}</a>)
          }
        },
        {
          title: '未送达成功',
          dataIndex: 'wsd',
          rowkey: 'wsd',
          customRender: (text, record) => {
            return (<a onclick={() => { this.caseList(record, '整卷送达成功', '2') }}>{{ text }}</a>)
          }
        }
      ],
      columns: [
        {
          title: '送达员',
          dataIndex: 'jName',
          rowkey: 'jName'
        },
        {
          title: '旧存(件)',
          dataIndex: 'jc',
          rowkey: 'jc',
          customRender: (text, record) => {
            return (<a onclick={() => { this.caseList(record, '旧存', '3') }}>{{ text }}</a>)
          }
        },
        {
          title: '新收(件)',
          dataIndex: 'xs',
          rowkey: 'xs',
          customRender: (text, record) => {
            return (<a onclick={() => { this.caseList(record, '新收', '3') }}>{{ text }}</a>)
          }
        },
        {
          title: '返件(件)',
          dataIndex: 'fj',
          rowkey: 'fj',
          customRender: (text, record) => {
            return (<a onclick={() => { this.caseList(record, '返件', '3') }}>{{ text }}</a>)
          }
        },
        {
          title: '退件(件)',
          dataIndex: 'tj',
          rowkey: 'tj',
          customRender: (text, record) => {
            return (<a onclick={() => { this.caseList(record, '退件', '3') }}>{{ text }}</a>)
          }
        },
        {
          title: '完成件数(件)',
          dataIndex: 'wcjs',
          rowkey: 'wcjs',
          customRender: (text, record) => {
            return (<a onclick={() => { this.caseList(record, '完成件数', '3') }}>{{ text }}</a>)
          }
        },
        {
          title: '占送达实际完成总量(%)',
          dataIndex: 'sjsd',
          rowkey: 'sjsd',
          scopedSlots: { customRender: 'data' }
        },
        {
          title: '平均送达时效(天/件)',
          dataIndex: 'pjsxsx',
          rowkey: 'pjsxsx',
          scopedSlots: { customRender: 'data' }
        },
        {
          title: '送达成功当事人个数(件)',
          dataIndex: 'sdcgdsr',
          rowkey: 'sdcgdsr',
          customRender: (text, record) => {
            return (<a onclick={() => { this.caseList(record, '送达成功当事人个数', '3') }}>{{ text }}</a>)
          }
        },
        {
          title: '送达不成功当事人个数(件)',
          dataIndex: 'sdbcgdsr',
          rowkey: 'sdbcgdsr',
          customRender: (text, record) => {
            return (<a onclick={() => { this.caseList(record, '送达不成功当事人个数', '3') }}>{{ text }}</a>)
          }
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
      if (!this.searchParams.startDate && !this.searchParams.endDate) {
        this.changeType()
      } else {
        this.getList()
      }
    },
    async getList(e) {
      this.loading = true
      getGiveAllCase(this.searchParams).then(({ code, data }) => {
        this.loading = false
        if (code === 200) {
          if (!data && data.length === 0) {
            return
          }
          this.list1 = data
        }
      })
      getGiveAllEnd(this.searchParams).then(({ code, data }) => {
        this.loading = false
        if (code === 200) {
          if (!data && data.length === 0) {
            return
          }
          this.list2 = data.map(item => {
            item.zj = `${item.zjsdcg || 0}件,${item.zjsdcgbf || 0} %`
            item.bf = `${item.bfsdcg || 0}件,${item.bfsdcgbf || 0} %`
            item.wsd = `${item.wsdcg || 0}件,${item.wsdcgbf || 0} %`
            return item
          })
        }
      })
      getGiveAllState(this.searchParams).then(({ code, data }) => {
        this.loading = false
        if (code === 200) {
          if (!data && data.length === 0) {
            return
          }
          this.list = data.map(item => {
            item.sjsd = `${item.sjsd || 0} %`
            return item
          })
          this.list[this.list.length - 1].jName = '合计'
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
    caseList(record, title, form) {
      console.log('record', record, title, form)
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

.table-box {
  padding: 20px!important;
  h1 {
    text-align: center;
    font-size: 18px;
    margin-bottom: 10px;
  }
}
</style>
