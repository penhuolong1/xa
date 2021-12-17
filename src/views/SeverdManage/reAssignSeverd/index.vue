<template>
  <div>
    <SearchForm :schema="searchSchema" class="enter-X" :is-skeleton="isSkeleton" :default-value="defaultValue" @search="search" />
    <div class="wrapper">
      <Button class="list-btn-item" type="danger" @click="back">退回</Button>
      <Button class="list-btn-item" type="primary" @click="assign">指派送达员</Button>
      <Button class="list-btn-item" type="blue4" @click="nextProcess">转下一流程</Button>
      <!-- <Button class="list-btn-item" type="blue3" @click="print">打印卷宗封皮</Button> -->
      <Button class="list-btn-item" @click="addremark">添加备注</Button>

    </div>
    <Table
      v-if="isTable"
      :row-selection="rowSelection"
      :loading="loading"
      :row-key="(record,index)=>{return index}"
      :columns="columns"
      :data-source="tabledata"
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
    <!-- 指派送达员(单个) -->
    <Appoint ref="appointShow" :selected-rows="selectedRows" @refresh="getList" />
    <!-- 指派送达员(多个) -->
    <MulAppoint ref="mulAppointShow" :selected-rows="selectedRows" @refresh="getList" />
    <!-- 添加备注 -->
    <AddRemark ref="remark" @done="getList" />
    <!-- 退回 -->
    <Back ref="backShow" :selected-rows="selectedRows" @refresh="getList" />
    <!-- 转下一流程 -->
    <Next ref="nextkshow" :selected-rows="selectedRows" @refresh="getList" />
  </div>

</template>
<script>
import SearchForm from '@/components/SearchForm'
import { Button, Table } from 'ant-design-vue'
import { unSend } from '@/api/freeze/index.js'
import Appoint from './components/Appoint.vue'
import MulAppoint from './components/mulAppoint.vue'
import { formatDate } from '@/utils/format.js'
import AddRemark from '@/components/AddRemark'
import Back from './components/back.vue'
import Next from './components/next.vue'
export default {
  components: {
    SearchForm,
    AddRemark,
    Next,
    Back,
    Appoint,
    MulAppoint,
    Table,
    Button
  },
  props: {
  },
  data() {
    return {
      isTable: true,
      loading: false,
      total: 0,
      searchParams: { // 列表搜索条件
        pageNumber: 1,
        pageSize: 10
      },
      searchSchemaParams: {},
      defaultValue: {
        lawCaseStatus: '全部'
      },
      lawCaseStatus: '全部',
      searchSchema: [
        {
          label: '送达类型',
          type: 'radio',
          field: 'lawCaseStatus',
          options: [
            {
              value: '全部',
              label: '全部'
            },
            {
              value: '诉前送达',
              label: '诉前送达'
            },
            {
              value: '庭前送达',
              label: '庭前送达'
            }
          ]
        },
        {
          label: '案号',
          type: 'caseNo',
          field1: 'prefixPreCaseNo1',
          field2: 'prefixPreCaseNo2',
          field3: 'caseNoSuffixStart',
          field4: 'caseNoSuffixEnd'
        },
        {
          label: '预立案/立案时间',
          type: 'time',
          field: ['fillingDateStart', 'fillingDateEnd'],
          showTime: true
        },

        {
          label: '案由',
          type: 'brief',
          field: 'brief'
        },
        {
          label: '当事人姓名',
          type: 'input',
          field: 'litigantName'
        }
      ],
      columns: [
        {
          title: '序号',
          dataIndex: 'index',
          key: 'index'
        },
        {
          title: '预案号/案号',
          dataIndex: 'lawCaseBean.preCaseNo',
          key: 'lawCaseBean.preCaseNo',
          scopedSlots: { customRender: 'preCaseNo' }

        },
        {
          title: '案号',
          dataIndex: 'lawCaseBean.caseNo',
          key: 'lawCaseBean.caseNo',
          scopedSlots: { customRender: 'preCaseNo' }

        },
        {
          title: '当事人 | 案由',
          dataIndex: 'lawCaseBean.reason',
          key: 'lawCaseBean.reason'
        },
        {
          title: '预立案时间',
          dataIndex: 'lawCaseBean.preFilingDate',
          key: 'lawCaseBean.preFilingDate'
        },

        {
          title: '立案时间',
          dataIndex: 'lawCaseBean.filingDate',
          key: 'lawCaseBean.filingDate'
        },
        {
          title: '承办部门',
          dataIndex: 'lawCasePartBean.departmentName',
          key: 'lawCasePartBean.departmentName'
        },
        {
          title: '承办人',
          dataIndex: 'lawCasePartBean.judgeName',
          key: 'lawCasePartBean.judgeName'
        },
        {
          title: '法官助理',
          dataIndex: 'lawCasePartBean.AssistantJudgeName',
          key: 'lawCasePartBean.AssistantJudgeName'
        },

        {
          title: '速录员',
          dataIndex: 'lawCasePartBean.recordeName',
          key: 'lawCasePartBean.recordeName'
        },
        {
          title: '送达类型',
          dataIndex: 'type',
          key: 'type'
        },
        {
          title: '标识状态',
          dataIndex: 'appraisalCase.appraisalType',
          key: 'appraisalCase.appraisalType'
        }
      ],
      tabledata: [],
      selectedRows: [],
      isSkeleton: false
    }
  },
  computed: {
    rowSelection() {
      return {
        onChange: (selectedRowKeys, selectedRows) => {
          this.selectedRows = selectedRows
          console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
          this.selectedRows = selectedRows
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
    toDetail(e) {
      const caseNo = e.lawCaseBean.caseNo || e.lawCaseBean.preCaseNo
      const path = `/case/detail?lawCase=${e.lawCaseBean.id}`
      const obj = {
        path,
        caseNo: caseNo,
        caseId: e.lawCaseBean.id
      }
      this.$store.dispatch('ToDetail', obj)
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

    // 添加备注
    addremark() {
      if (!this.selectedRows || this.selectedRows.length === 0) {
        this.$message.error('请先选择案件')
        return
      }
      if (this.selectedRows.length > 1) {
        this.$message.error('只能选择一个案件进行添加')
        return
      }
      this.$refs.remark.show(this.selectedRows[0].lawCaseBean.id)
    },
    assign() {
      if (!this.selectedRows || this.selectedRows.length === 0) {
        this.$message.error('请先选择案件')
        return
      }
      // 待指派送达员(单个)
      if (this.selectedRows && this.selectedRows.length === 1) {
        this.$refs.appointShow.show()
      }
      if (this.selectedRows && this.selectedRows.length > 1) {
        this.$refs.mulAppointShow.show()
      }
    },
    back() {
      if (!this.selectedRows || this.selectedRows.length === 0) {
        this.$message.error('请先选择案件')
        return
      }
      this.$refs.backShow.show()
    },

    nextProcess() {
      if (!this.selectedRows || this.selectedRows.length === 0) {
        this.$message.error('请先选择案件')
        return
      }
      this.$refs.nextkshow.show()
    },
    print() {},
    // 高级搜索
    search(e) {
      this.searchSchemaParams = e
      this.searchParams.pageNumber = 1
      this.lawCaseStatus = e.lawCaseStatus
      this.getList()
    },
    getList() {
      this.isTable = false
      const params = {
        ...this.searchParams,
        ...this.searchSchemaParams
      }
      const lab1 = params.prefixPreCaseNo1 || ''
      const lab2 = params.prefixPreCaseNo2 || ''
      if (params.prefixPreCaseNo1 && params.prefixPreCaseNo2) {
        params.caseNoPrefix = '(' + lab1 + ')' + lab2
      }
      delete params.prefixPreCaseNo1
      delete params.prefixPreCaseNo2
      params.lawCaseStatus = this.lawCaseStatus
      this.loading = true
      unSend(params).then(res => {
        this.loading = false
        this.isTable = true
        if (res.code === 200) {
          this.total = parseInt(res.data.totalsCount)
          this.tabledata = res.data.searchResult
          this.tabledata = res.data.searchResult.map((item, index) => {
            if (item.lawCaseBean.preFilingDate) {
              item.lawCaseBean.preFilingDate = item.lawCaseBean.preFilingDate ? this.$moment(item.lawCaseBean.preFilingDate).format('YYYY-MM-DD') : ''
            }
            if (item.lawCaseBean.filingDate) {
              item.lawCaseBean.filingDate = item.lawCaseBean.filingDate ? this.$moment(item.lawCaseBean.filingDate).format('YYYY-MM-DD') : ''
            }
            item.deliver = ''
            item.index = index + 1
            return item
          })
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
.wrapper{
  .ant-btn{
    margin:10px;
  }
}
</style>
