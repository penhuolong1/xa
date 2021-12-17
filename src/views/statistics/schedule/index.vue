<template>
  <!--案件鉴定 -->
  <div>
    <SearchForm
      :is-skeleton="isSkeleton"
      :schema="searchSchema"
      class="enter-X"
      @search="search"
      @change="change"
    />
    <div class="list-btn-content enter-X">
      <RadioGroup v-model="type" class="my-5" @change="changeType">
        <RadioButton :value="1"> 本周 </RadioButton>
        <RadioButton :value="2"> 本月 </RadioButton>
        <RadioButton :value="3"> 本季度 </RadioButton>
        <RadioButton :value="4"> 本年 </RadioButton>
      </RadioGroup>
    </div>
    <Table
      class="enter-X"
      :row-key="
        (record, index) => {
          return index;
        }
      "
      :columns="columns"
      bordered
      :scroll="{ x: 1400 }"
      :data-source="list"
      :loading="loading"
      :pagination="false"
      @expand="expand"
    />
    <div class="mt-2.5">
      备注：本统计表支持搜索指定自然日期范围内的案件数据，其中受理数统计的是预立案时间在查询范围内的案件数，处理数统计的是诉前结案时间在查询范围内的案件数。（单位：件）
    </div>
    <Button type="primary" @click="isExplain = !isExplain">更多解释</Button>
    <div v-show="isExplain" class="explain">
      <div>1.已开庭：承办人已开庭庭数；</div>
      <div>2.已排未开庭：承办人已排期未开庭数；</div>
      <div>3.预排庭：承办人预排庭庭数；</div>
      <div>4.总计（右侧）：已开庭+已排未开庭+预排庭；</div>
      <div>5.总计（底部）：每列的和。</div>
      <div>【筛选条件重点说明】</div>
      <div>1.时间搜索是指搜索的是开庭时间范围内的立案案件。</div>
      <div>2.如果只填写了期初时间表示统计从期初时间到目前为止的案件数；</div>
      <div>
        3.如果只填写了期末时间，则表示统计截止到期末时间为止的所有案件数。
      </div>
    </div>
    <CaseList ref="caseListLog" :report="report" />
  </div>
</template>
<script>
import SearchForm from '@/components/SearchForm'
import CaseList from '../case/components/caseList.vue'
import { Button, Table, Radio } from 'ant-design-vue'
import { getCourtAllNum, getCourtJudge } from '@/api/statistics/index'
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
      report: 6,
      loading: false,
      total: 0, // 列表总数
      list: [], // 列表数据
      isExplain: false,
      columns: [
        {
          title: '庭室',
          dataIndex: 'courtName',
          rowkey: 'courtName  ',
          width: 200,
          align: 'left'
        },
        {
          title: '确认开庭',
          children: [
            {
              title: '已开庭',
              dataIndex: 'openCourt',
              key: 'openCourt',
              customRender: (text, record) => {
                return (
                  <a
                    onclick={() => {
                      this.caseList(record, '已开庭')
                    }}
                  >
                    {{ text }}
                  </a>
                )
              }
            },
            {
              title: '已排未开庭',
              dataIndex: 'notOpen',
              key: 'notOpen',
              customRender: (text, record) => {
                return (
                  <a
                    onclick={() => {
                      this.caseList(record, '已排未开庭')
                    }}
                  >
                    {{ text }}
                  </a>
                )
              }
            }
          ]
        },
        {
          title: '预排庭',
          width: 100,
          dataIndex: 'ypt',
          rowkey: 'ypt',
          customRender: (text, record) => {
            return (
              <a
                onclick={() => {
                  this.caseList(record, '预排庭')
                }}
              >
                {{ text }}
              </a>
            )
          }
        },
        {
          title: '总计',
          width: 100,
          dataIndex: 'rightAll',
          rowkey: 'rightAll'

        }
      ],
      type: 2, // 1 本周 2 本月 3 本季度 4 本年
      timeType: 0, // 1 年 2月 3天
      isSkeleton: false, // 是否显示骨架屏
      searchParams: {
        // 列表搜索条件
        startDate: dateRangeUtil.getCurrentMonth()[0] + ' 00:00:00',
        endDate: dateRangeUtil.getCurrentMonth()[1] + ' 23:59:59'
      },
      searchSchema: [
        {
          label: '承办部门',
          type: 'department',
          field: 'judgeId'
        },
        {
          label: '承办人',
          type: 'judge',
          userType: 1,
          field: 'judgeId'
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
          this.searchParams.startDate =
            this.searchParams.startDate + '-01-01 00:00:00'
          this.searchParams.endDate =
            this.searchParams.endDate + '-12-31 23:59:59'
        }
      } else if (this.timeType === 2) {
        if (!this.searchParams.startDate) {
          return
        }
        const ary = this.searchParams.endDate.split('-')
        const days = new Date(ary[0], ary[1], 0).getDate()
        this.searchParams.startDate =
          this.searchParams.startDate + '-01 00:00:00'
        this.searchParams.endDate =
          this.searchParams.endDate + `-${days} 23:59:59`
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
      await getCourtAllNum(this.searchParams).then(({ code, data }) => {
        this.loading = false
        if (code === 200) {
          this.list = []
          if (!data && data.length === 0) {
            return
          }
          if (data[0] == 'null') {
            return
          }
          data.map((item, index) => {
            if (index < data.length - 1) {
              item.children = []
            }
            return item
          })
          data[data.length - 1].courtName = '合计'
          this.list = data
        }
      })
    },
    // 展开表格
    expand(e, row) {
      console.log('e', e)
      const params = {
        startDate: this.searchParams.startDate,
        endDate: this.searchParams.endDate,
        courtId: row.dId
      }
      getCourtJudge(params).then(({ code, data }) => {
        if (code === 200) {
          if (!data && data.length === 0) {
            return
          }
          data.map((item) => {
            item.courtName = item.jName
            return item
          })
          this.list.map((items) => {
            if (items.dId === row.dId) {
              items.children = data
            }
            return items
          })
        }
      })
    },
    // 打开弹窗
    caseList(record, title) {
      this.$refs.caseListLog.show({
        startDate: this.searchParams.startDate,
        endDate: this.searchParams.endDate,
        caseNumType: title,
        courtId: record.dId,
        judgeId: record.jId
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
.ant-btn {
  margin: 10px;
}
</style>
