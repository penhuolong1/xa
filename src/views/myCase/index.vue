<template>
  <div>
    <!-- 我的案件 -->
    <SearchForm :is-skeleton="isSkeleton" :schema="searchSchema" :default-value="defaultValue" class="enter-X" @search="search" @change="change" />
    <div class="list-content enter-X">
      <div class="list-btn-content">
        <Button class="list-btn-item" type="org" @click="next">转到下一流程</Button>
        <Button class="list-btn-item" type="primary" @click="freeze">保全</Button>
        <Button class="list-btn-item" type="blue4" @click="appraisal">鉴定</Button>
        <Button class="list-btn-item" type="blue3" :selected-rows="selectedRows" @click="over">结案</Button>
        <Button class="list-btn-item" @click="remark">添加备注</Button>
      </div>
    </div>
    <Table
      v-if="isTable"
      :row-selection="rowSelection"
      :columns="columns"
      :data-source="tabledata"
      :row-key="(record,index)=>{return index}"

      :loading="loading"
      :pagination="{
        total: total,
        showTotal: total => {
          return `共计${total}条`
        },
        current: searchParams.pageNumber,
        showSizeChanger: true,
        showQuickJumper: true,
      }"
      @change="changePage"
    >
      <div slot="preCaseNo" slot-scope="text, record">
        <a @click="toDetail(record)">{{ text }}</a>
      </div>

    </Table>
    <!-- 添加备注 -->
    <AddRemark ref="remark" @done="getList" />
    <!-- 冻结案件 -->
    <Freeze ref="freeze" :select-key="selectedRows" @done="getList" />
    <!-- 结案 -->
    <CaseOver ref="overshow" @done="getList" />
    <!-- 转下一流程 -->
    <AllNext ref="allNextShow" :selected-rows="selectedRows" :is-whole="true" :case-type="caseType" @done="getList" />
    <NextServicing ref="NextServicingShow" :selected-rows="selectedRows" :is-whole="true" @done="getlist" />

  </div>
</template>
<script>
import SearchForm from '@/components/SearchForm'
import { myCase } from '@/api/freeze/index.js'
import { Button, Table } from 'ant-design-vue'
import moment from 'moment'
import AddRemark from '@/components/AddRemark'
import Freeze from '@/views/acceptCase/readyCase/components/free'
import CaseOver from '@/views/wholecaseline/Companents/CaseOver'
import Next from './components/next.vue'
import AllNext from '@/components/allNext/index.vue'
import NextServicing from '../wholecaseline/Companents/nextServing.vue'
export default {
  components: {
    SearchForm,
    Button,
    Table,
    AddRemark,
    Freeze,
    CaseOver,
    AllNext,
    NextServicing
  },
  props: {
  },
  data() {
    return {
      isTable: true,
      isSkeleton: false,
      loading: false,
      total: 0,
      caseType: '',
      selectedRows: [],
      searchSchemaParams: [],
      defaultValue: {
        upperState: '正在办理',
        lawCaseStatusStr: '全部'
      },
      upperState: '正在办理',
      lawCaseStatusStr: '全部',
      secondState: '待庭室接收',
      tabledata: [],
      columns: [
        {
          title: '序号',
          dataIndex: 'index',
          key: 'index'
        },
        {
          title: '预案号',
          dataIndex: 'casePreCaseNo',
          key: 'casePreCaseNo',
          scopedSlots: { customRender: 'preCaseNo' }

        },
        {
          title: '案号',
          dataIndex: 'caseNo',
          key: 'caseNo',
          scopedSlots: { customRender: 'preCaseNo' }

        },
        {
          title: '当事人|案由',
          dataIndex: 'caseReason',
          key: 'caseReason'
        },
        {
          title: '起诉标的',
          dataIndex: 'caseSubjectAmount',
          key: 'caseSubjectAmount'
        },
        {
          title: '预立案时间',
          dataIndex: 'casePreFillingDate',
          key: 'casePreFillingDate'
        },
        {
          title: '立案时间',
          dataIndex: 'caseFillingDate',
          key: 'caseFillingDate'
        },
        {
          title: '法官助理',
          dataIndex: 'caseAssistantJudgeName',
          key: 'caseAssistantJudgeName'
        },
        {
          title: '调解员',
          dataIndex: 'caseMediatornName',
          key: 'caseMediatornName'
        },
        {
          title: '承办人',
          dataIndex: 'judgeName',
          key: 'judgeName'
        },

        {
          title: '诉前程序时间',
          dataIndex: 'casePreMediateDate',
          key: 'casePreMediateDate'
        },
        {
          title: '排庭时间',
          dataIndex: 'caseStartTime',
          key: 'caseStartTime'
        },
        {
          title: '案件状态',
          dataIndex: 'caseState',
          key: 'caseState'
        },
        {
          title: '结案方式',
          dataIndex: 'casecloseType',
          key: 'casecloseType'
        }
      ],
      searchSchema: [
        {
          label: '办理状态',
          type: 'radio',
          field: 'upperState',
          options: [
            {
              label: '全部',
              value: '全部'
            },
            {
              label: '正在办理',
              value: '正在办理'
            },
            {
              label: '已结案',
              value: '已结案'
            },
            {
              label: '不予受理',
              value: '不予受理'
            }
          ]
        },
        // 全部
        {
          label: '案件状态',
          type: 'radio',
          field: 'lawCaseStatusStr',
          vIf: () => {
            return this.upperState === '全部'
          },
          options: [
            {
              label: '全部',
              value: '全部'
            },
            {
              label: '预立案待审查',
              value: '预立案待审查'
            },
            {
              label: '预立案',
              value: '预立案'
            },
            {
              label: '诉前送达',
              value: '诉前送达'
            },
            {
              label: '诉前调查',
              value: '诉前调查'
            },
            {
              label: '调解中',
              value: '调解中'
            },
            {
              label: '待正式立案',
              value: '待正式立案'
            },
            {
              label: '已立案待送达',
              value: '已立案待送达'
            },
            {
              label: '庭前送达',
              value: '庭前送达'
            },
            {
              label: '审理中',
              value: '审理中'
            },
            {
              label: '冻结',
              value: '冻结'
            },
            {
              label: '不予受理',
              value: '不予受理'
            },
            {
              label: '已结案',
              value: '已结案'
            }
          ]
        },
        // 正在办理
        {
          label: '案件状态',
          type: 'radio',
          field: 'lawCaseStatusStr',
          vIf: () => {
            return this.upperState === '正在办理'
          },
          options: [
            {
              label: '全部',
              value: '全部'
            },
            {
              label: '预立案待审查',
              value: '预立案待审查'
            },
            {
              label: '预立案',
              value: '预立案'
            },
            {
              label: '诉前送达',
              value: '诉前送达'
            },
            {
              label: '诉前调查',
              value: '诉前调查'
            },
            {
              label: '调解中',
              value: '调解中'
            },
            {
              label: '待正式立案',
              value: '待正式立案'
            },
            {
              label: '已立案待送达',
              value: '已立案待送达'
            },
            {
              label: '庭前送达',
              value: '庭前送达'
            },
            {
              label: '审理中',
              value: '审理中'
            },
            {
              label: '冻结',
              value: '冻结'
            }
          ]
        },
        // 已结案
        {
          label: '案件状态',
          type: 'radio',
          field: 'lawCaseStatusStr',
          vIf: () => {
            return this.upperState === '已结案'
          },
          options: [
            {
              label: '诉前结案',
              value: '诉前结案'// 也算结案
            },
            {
              label: '结案',
              value: '结案'
            },
            {
              label: '诉前销案',
              value: '诉前销案'
            }]
        },
        // 不予受理
        {
          label: '案件状态',
          type: 'radio',
          field: 'lawCaseStatusStr',
          vIf: () => {
            return this.upperState === '不予受理'
          },
          options: [
            {
              label: '不予受理',
              value: '不予受理'
            }
          ]
        },
        // 二级状态
        {
          label: '二级状态',
          type: 'radio',
          field: 'secondState',
          vIf: () => {
            return this.lawCaseStatusStr === '诉前送达'
          },
          options: [
            {
              label: '待指派',
              value: '待指派'
            },
            {
              label: '送达中',
              value: '送达中'
            },
            {
              label: '待复核',
              value: '待复核'
            }
          ]
        },
        // 调解中
        {
          label: '二级状态',
          type: 'radio',
          field: 'secondState',
          vIf: () => {
            return this.lawCaseStatusStr === '调解中'
          },
          options: [
            {
              label: '待指派',
              value: '待指派'
            },
            {
              label: '调解中',
              value: '调解中'
            }
          ]
        },
        // 庭前送达
        {
          label: '二级状态',
          type: 'radio',
          field: 'secondState',
          vIf: () => {
            return this.lawCaseStatusStr === '庭前送达'
          },
          options: [
            {
              label: '待指派',
              value: '待指派'
            },
            {
              label: '送达中',
              value: '送达中'
            },
            {
              label: '待复核',
              value: '待复核'
            },
            {
              label: '待庭室接收',
              value: '待庭室接收'
            }
          ]
        },
        // 已结案
        {
          label: '二级状态',
          type: 'radio',
          field: 'secondState',
          vIf: () => {
            return this.lawCaseStatusStr === '已结案'
          },
          options: [
            {
              label: '诉前结案',
              value: '诉前结案'
            },
            {
              label: '结案',
              value: '结案'
            },
            {
              label: '诉前销案',
              value: '诉前销案'
            }

          ]
        },
        {
          label: '申请流水号',
          type: 'input',
          field: 'serialNumber'
        },
        {
          label: '预案号/案号',
          type: 'caseNo',
          field1: 'prefixPreCaseNo1',
          field2: 'prefixPreCaseNo2',
          field3: 'startNumber',
          field4: 'endNumber'
        },
        {
          label: '预立案/立案时间',
          type: 'time',
          field: ['startDate', 'endDate'],
          showTime: true
        },
        {
          label: '案由',
          type: 'brief',
          field: 'reason'
        },

        {
          label: '当事人姓名',
          type: 'input',
          field: 'litigantName'
        }
      ],
      enableNext:
        ['已立案待送达', '诉前调查', '诉前送达 | 待指派', '诉前送达 | 送达中',
          '预立案', '调解 | 调解中', '待正式立案', '庭前送达 | 待指派',
          '庭前送达 | 送达中', '审理中'], // 能够转下一流程的状态
      searchParams: {
        pageSize: 10,
        pageNumber: 1
      }
    }
  },
  computed: {
    rowSelection() {
      return {
        onChange: (selectedRowKeys, selectedRows) => {
          this.selectedRows = selectedRows
          console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
          this.caseType = selectedRows[0].caseState
        }
      }
    }
  },
  created() {
    this.getList()
  },
  mounted() {
  },
  methods: {
    // 跳转详情
    toDetail(e) {
      const caseNo = e.caseNo || e.casePreCaseNo
      const path = `/case/detail?lawCase=${e.caseId}`
      const obj = {
        path,
        caseNo: caseNo,
        caseId: e.caseId
      }
      this.$store.dispatch('ToDetail', obj)
    },
    search(e) {
      this.searchSchemaParams = e
      console.log(this.searchSchemaParams)
      this.searchParams.pageNumber = 1
      this.getList()
    },
    change(value, field) {
      if (field == 'upperState') {
        this.upperState = value
      }
      if (field == 'lawCaseStatusStr') {
        this.lawCaseStatusStr = value
      }
      if (field == 'secondState') {
        this.secondState = value
      }
    },
    changePage(e) {
      if (e.pageSize !== this.searchParams.pageSize) {
        this.searchParams.pageNumber = 1
        this.searchParams.pageSize = e.pageSize
      } else {
        this.searchParams.pageNumber = e.current
      }
      this.getList()
    },
    getList() {
      this.isTable = false
      this.loading = true
      const params = {
        ...this.searchParams,
        ...this.searchSchemaParams
      }
      params.upperState = this.upperState
      params.lawCaseStatusStr = this.lawCaseStatusStr
      params.secondState = this.secondState
      delete params.prefixPreCaseNo1
      delete params.prefixPreCaseNo2
      if (this.searchSchemaParams.prefixPreCaseNo1 && this.searchSchemaParams.prefixPreCaseNo2) {
        params.prefixCaseNo = '(' + this.searchSchemaParams.prefixPreCaseNo1 + ')' + this.searchSchemaParams.prefixPreCaseNo2
      }
      if (params.lawCaseStatusStr != '诉前送达' &&
      params.lawCaseStatusStr != '调解中' &&
      params.lawCaseStatusStr != '庭前送达' &&
      params.lawCaseStatusStr != '结案') {
        params.secondState = ''
      }
      if (params.lawCaseStatusStr === '结案') {
        params.secondState = '结案'
      }
      if (params.lawCaseStatusStr === '诉前结案') {
        params.secondState = '诉前结案'
        params.lawCaseStatusStr = '结案'
      }
      myCase(params).then(res => {
        this.isTable = true
        this.loading = false
        if (res.code === 200) {
          this.total = parseInt(res.data.totalsCount)
          this.tabledata = res.data.searchResult.map((item, index) => {
            item.index = index + 1
            if (item.casePreFillingDate) {
              item.casePreFillingDate = moment(item.casePreFillingDate).format('YYYY-MM-DD HH:mm:ss')
            }
            if (item.caseFillingDate) {
              item.caseFillingDate = moment(item.caseFillingDate).format('YYYY-MM-DD HH:mm:ss')
            }
            if (item.casePreMediateDate) {
              item.casePreMediateDate = moment(item.casePreMediateDate).format('YYYY-MM-DD HH:mm:ss')
            }
            if (item.caseStartTime) {
              item.caseStartTime = moment(item.caseStartTime).format('YYYY-MM-DD HH:mm:ss')
            }
            return item
          })
        }
      })
    },
    // 保全
    freeze() {
      if (!this.selectedRows || this.selectedRows.length === 0) {
        this.$message.error('请先选择案件')
        return
      }
      this.$refs.freeze.show(1)
    },
    // 冻结
    appraisal() {
      if (!this.selectedRows || this.selectedRows.length === 0) {
        this.$message.error('请先选择案件')
        return
      }
      this.$refs.freeze.show(2)
    },
    // 添加备注
    remark() {
      if (!this.selectedRows || this.selectedRows.length === 0) {
        this.$message.error('请先选择案件')
        return
      }
      if (this.selectedRows.length > 1) {
        this.$message.error('只能选择一个案件进行添加')
        return
      }
      this.$refs.remark.show(this.selectedRows[0].caseId)
    },
    // 结案
    over() {
      if (!this.selectedRows || this.selectedRows.length === 0) {
        this.$message.error('请先选择案件')
        return
      }
      this.$refs.overshow.show(this.selectedRows)
    },
    // 转下一流程
    next() {
      const allNext = this.$refs.allNextShow
      if (!this.selectedRows || this.selectedRows.length === 0) {
        this.$message.error('请先选择案件')
        return
      }
      if (this.selectedRows.length > 0) {
        for (var i = 0; i < this.selectedRows.length; i++) {
          if (this.selectedRows[i].caseState != this.selectedRows[0].caseState) {
            this.$message.error('请选择相同状态的案件进行操作！')
            break
          }
        }
      }
      if (this.enableNext.indexOf(this.selectedRows[0].caseState) == -1) {
        this.$message.error('此类案件无法转下一流程!')
        return
      }
      switch (this.selectedRows[0].caseState) {
        case '已立案待送达':
          allNext.$refs.NextWaitCaseShow.show()
          break
        case '诉前调查':
          allNext.$refs.next.show()
          break
        case '诉前送达 | 待指派': {
          allNext.$refs.NextReAssignSeverdShow.show(this.selectedRows)
          break
        }
        case '诉前送达 | 送达中': {
          this.$refs.NextServicingShow.show()
          break
        }
        case '预立案':
          allNext.$refs.NextPreientationShow.show()
          break
        case '调解 | 调解中': {
          allNext.$refs.NextMediatingShow.show(this.selectedRows)
          break
        }

        case '待正式立案':
          allNext.$refs.NextPreientationShow.show()
          break
        case '庭前送达 | 待指派': {
          allNext.$refs.NextReAssignSeverdShow.show(this.selectedRows)
          break
        }

        case '庭前送达 | 送达中': {
          this.$refs.NextServicingShow.show(this.selectedRows)
          break
        }

        // case '审理中':
      }
    }
  }
}
</script>

<style scoped lang="less">
</style>
