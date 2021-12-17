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
      bordered
      :data-source="list"
      :loading="loading"
      :pagination="false"
    >
      <!-- <div slot="data" slot-scope="text, record">
        <a @click="caseList(record)">{{ text }}</a>
      </div> -->
    </Table>
    <div class="mt-2.5">备注：本统计表支持搜索指定自然日期范围内的案件数据，其中受理数统计的是预立案时间在查询范围内的案件数，处理数统计的是诉前结案时间在查询范围内的案件数。（单位：件）</div>
    <Button type="primary" @click="isExplain = !isExplain">更多解释</Button>
    <div v-show="isExplain" class="explain">
      <div>1.旧存：上一统计日的诉前未结案案件数；</div>
      <div>2.委派委托调解数：诉前案件指派送达员后进入调解中的案件数；</div>
      <div>3.调解：诉前结案方式等于调解的案件数；</div>
      <div>4.撤诉：诉前结案方式等于撤诉的案件数；</div>
      <div>5.诉前调查：诉前结案方式等于移送的案件数；</div>
      <div>6.诉前销案：诉前结案方式等于诉前销案的案件数；</div>
      <div>7.处理数：是指委托调解案件数中诉前结案的案件数量；</div>
      <div>8.未结：旧存+委派委托调解数（新增）-处理数；</div>
      <div>9.调解成功：诉前结案方式等于调解+撤诉+诉前销案的案件数；</div>
      <div>10.调撤率：（调解+撤诉+诉前销案）/处理数*100%；</div>
      <div>11.总计（处理数）（右侧）：处理数总和；</div>
      <div>12.合计（底部）：每列的和。</div>
      <div>【筛选条件重点说明】</div>
      <div>1.时间搜索是指搜索的是自然日期范围内的预立案案件数；</div>
      <div>2.委托调解数是指委托调解时间在查询范围内的案件数；</div>
      <div>3.诉前结案数是指诉前结案时间在查询自然日期范围的案件；</div>
      <div>4.调解、撤诉、诉前调查、诉前销案是指诉前结案时间在查询范围内的案件数。</div>
    </div>
    <CaseList ref="caseListLog" :report="report" />
  </div>
</template>
<script>
import SearchForm from '@/components/SearchForm'
import CaseList from '../case/components/caseList.vue'
import { Button, Table, Radio } from 'ant-design-vue'
import { getMediator, getMediatorRightAll } from '@/api/statistics/index'
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
      report: 2,
      loading: false,
      total: 0, // 列表总数
      list: [], // 列表数据
      isExplain: false,
      columns: [
        {
          title: '调解单位',
          dataIndex: 'dw',
          rowkey: 'dw',
          width: 150,
          customRender: (text, row, index) => {
            const obj = {
              children: text,
              attrs: {}
            }
            obj.attrs.rowSpan = row.dwRowSpan
            if (index === this.list.length - 1) {
              obj.attrs.colSpan = 3
              obj.children = '合计'
            }
            return obj
          }
        },
        {
          title: '调解组织',
          width: 100,
          dataIndex: 'zz',
          rowkey: 'zz',
          customRender: (text, row, index) => {
            const obj = {
              children: text,
              attrs: {}
            }
            if (index === this.list.length - 1) {
              obj.attrs.colSpan = 0
            }
            return obj
          }
        },
        {
          title: '调解员',
          width: 100,
          dataIndex: 'tjy',
          rowkey: 'tjy',
          customRender: (text, row, index) => {
            const obj = {
              children: text,
              attrs: {}
            }
            if (index === this.list.length - 1) {
              obj.attrs.colSpan = 0
            }
            return obj
          }
        },
        {
          title: '旧存',
          width: 100,
          dataIndex: 'jc',
          rowkey: 'jc',
          customRender: (text, record) => {
            return (<a onclick={() => { this.caseList(record, '旧存') }}>{{ text }}</a>)
          }
        },
        {
          title: '委派委托调解数(新增)',
          width: 150,
          dataIndex: 'wtxz',
          rowkey: 'wtxz',
          customRender: (text, record) => {
            return (<a onclick={() => { this.caseList(record, '委派委托调解数(新增)') }}>{{ text }}</a>)
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
          title: '诉前调查',
          width: 100,
          dataIndex: 'sqdc',
          key: 'sqdc',
          customRender: (text, record) => {
            return (<a onclick={() => { this.caseList(record, '诉前调查') }}>{{ text }}</a>)
          }
        },
        {
          title: '诉前销案',
          width: 100,
          dataIndex: 'qt',
          key: 'qt',
          customRender: (text, record) => {
            return (<a onclick={() => { this.caseList(record, '诉前销案') }}>{{ text }}</a>)
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
          width: 150,
          dataIndex: 'wj',
          key: 'wj',
          customRender: (text, record) => {
            return (<a onclick={() => { this.caseList(record, '未结') }}>{{ text }}</a>)
          }
        },
        {
          title: '调解成功',
          width: 150,
          dataIndex: 'tjcg',
          key: 'tjcg',
          customRender: (text, record) => {
            return (<a onclick={() => { this.caseList(record, '调解成功') }}>{{ text }}</a>)
          }
        },
        {
          title: '调解率',
          width: 150,
          dataIndex: 'dcl',
          key: 'dcl'
        },
        {
          title: '总计(处理数)',
          width: 100,
          dataIndex: 'hj',
          key: 'hj',
          customRender: (text, row, index, record) => {
            const obj = {
              children: text,
              attrs: {}
            }
            obj.attrs.rowSpan = row.dwRowSpan
            return obj
            // return (<a onclick={() => { this.caseList(record, '总计') }}>{{ text }}</a>)
          }
        }
      ],
      type: 2, // 1 本周 2 本月 3 本季度 4 本年
      timeType: 0, // 1 年 2月 3天
      isSkeleton: false, // 是否显示骨架屏
      searchParams: { // 列表搜索条件
        startDate: dateRangeUtil.getCurrentMonth()[0],
        endDate: dateRangeUtil.getCurrentMonth()[1]
      },
      searchSchema: [
        {
          label: '调解单位',
          type: 'mediates',
          medType: 'unit',
          field: 'mediatorUnitId'
        },
        {
          label: '调解组织',
          type: 'mediates',
          medType: 'organization',
          field: 'mediatorOrgId'
        },
        {
          label: '调解员',
          type: 'mediates',
          medType: 'people',
          field: 'mediatorOrgId'
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
      await getMediator(this.searchParams).then(({ code, data }) => {
        if (code === 200) {
          if (!data || data.length === 0) {
            this.list = []
            return
          }
          if (data[0] === null) {
            this.list = []
            return
          }
          if (data && data.length > 0 && data[0] != null) {
            this.list = data.map((item, index) => {
              if (index === data.length - 1) {
                item.dw = item.dw ? item.dw + '合计' : ''
              }
              return item
            })
            this.list = this.rowSpan('dw', this.list)
          }

          // this.list = this.rowSpan('zz', this.list)
          // console.log()
        }
      })
      if (!this.list || this.list.length === 0) {
        this.loading = false
        return
      }
      await getMediatorRightAll(this.searchParams).then(({ code, data }) => {
        this.loading = false
        if (code === 200) {
          if (!data && data.length === 0) {
            return
          }
          if (data && data.length != 0 && data[0] != null) {
            data[data.length - 1].dw = '合计'
            this.list.forEach(item => {
              item.hj = data.find(item1 => item.dw === item1.dw)?.cls
              item.dcl = item.dcl + '%'
            })
          }
        }
      })
    },
    // 打开弹窗
    caseList(record, title) {
      console.log('record', record, title)
      console.log('12345', this.searchParams.startDate)
      this.$refs.caseListLog.show(
        {
          mediatorUnitId: record.muid,
          mediatorOrgId: record.moid,
          mediatorId: record.mpid,

          startDate: this.searchParams.startDate,
          endDate: this.searchParams.endDate,
          caseNumType: title
        }
      )
    },
    rowSpan(key, list) {
      const arr = list
        .reduce((result, item) => {
          if (result.indexOf(item[key]) < 0) {
            result.push(item[key])
          }
          return result
        }, [])
        .reduce((result, keys) => {
          const children = list.filter((item) => item[key] === keys)
          result = result.concat(
            children.map((item, index) => ({
              ...item,
              [`${key}RowSpan`]: index === 0 ? children.length : 0
            }))
          )
          return result
        }, [])
      return arr
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

</style>
