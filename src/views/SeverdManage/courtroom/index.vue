<template>
  <div>
    <SearchForm :schema="searchSchema" :is-skeleton="isSkeleton" class="enter-X" @search="search" />
    <div class="wrapper">
      <Button class="list-btn-item" type="danger" @click="refund"> 退回</Button>
      <Button class="list-btn-item" type="primary" @click="accept">接收</Button>
      <Button class="list-btn-item" type="blue4">打印移交签收单</Button>
      <Button class="list-btn-item" @click="addremark">添加备注</Button>

    </div>
    <Table
      :row-selection="rowSelection"
      :loading="loading"
      :columns="columns"
      :data-source="tabledata"
      :row-key="(record,index)=>{return index}"
      :pagination="{
        total: total,
        showTotal: total => {
          return `共计${total}条`
        },
        showSizeChanger: true,
        showQuickJumper: true,
      }"
      @change="changePage"
    >
      <div slot="caseNO" slot-scope="text, record">
        <a @click="toDetail(record)">{{ text }}</a>
      </div>
    </Table>
    <Accept ref="acceptShow" :selected-rows="selectedRows" @refresh="getList" />
    <Refund ref="refundShow" :selected-rows="selectedRows" @refresh="getList" />
    <AddRemark ref="remark" @done="getList" />
  </div>
</template>
<script>
import SearchForm from '@/components/SearchForm'
import { Table, Button } from 'ant-design-vue'
import { unReceiveList } from '@/api/freeze/index.js'
import AddRemark from '@/components/AddRemark'
import moment from 'moment'
import Accept from './components/accept.vue'
import Refund from './components/refund.vue'
export default {
  components: {
    SearchForm,
    AddRemark,
    Table,
    Button,
    Accept,
    Refund
  },
  props: {
  },
  data() {
    return {
      total: 0,
      isSkeleton: false,
      searchParams: { // 列表搜索条件
        pageNumber: 1,
        pageSize: 10
      },
      loading: false,
      selectedRows: [],
      searchSchemaParams: {},
      searchSchema: [
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
          label: '送达类型',
          type: 'select',
          field: 'lawCaseStatus',
          options: [
            {
              value: '庭前送达',
              label: '庭前送达'
            },
            {
              value: '诉前送达',
              label: '诉前送达'
            }

          ]
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
      columns: [
        {
          title: '序号',
          dataIndex: 'index',
          key: 'index'
        },
        {
          title: '案号',
          dataIndex: 'caseNO',
          key: 'caseNO',
          scopedSlots: { customRender: 'caseNO' }

        },
        {
          title: '当事人 | 案由',
          dataIndex: 'caseReason',
          key: 'caseReason'
        },
        {
          title: '立案时间',
          dataIndex: 'caseFillingDate',
          key: 'caseFillingDate'
        },
        {
          title: '承办部门',
          dataIndex: 'departmentName',
          key: 'departmentName'
        },
        {
          title: '承办人',
          dataIndex: 'judgeName',
          key: 'judgeName'
        },
        {
          title: '书记员',
          dataIndex: 'clerkName',
          key: 'clerkName'
        },
        {
          title: '建议开庭时间',
          dataIndex: 'suggestCourtTime',
          key: 'suggestCourtTime'
        },
        {
          title: '最后送达人',
          dataIndex: 'lastSenderName',
          key: 'lastSenderName'
        },
        {
          title: '移交原因',
          dataIndex: 'transferReason',
          key: 'transferReason'
        },
        {
          title: '标识状态',
          dataIndex: 'sendProcessType',
          key: 'sendProcessType'
        }

      ],
      tabledata: []
    }
  },
  computed: {
    rowSelection() {
      return {
        onChange: (selectedRowKeys, selectedRows) => {
          this.selectedRows = selectedRows
          console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
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
      const caseNo = e.caseNO
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
      this.searchParams.pageNumber = 1

      this.getList()
    },
    changePage(e) {
      if (e.pageSize !== this.searchParams.pageSize) {
        this.searchParams.pageNumber = 1
        this.searchParams.pageSize = e.pageSize
      } else {
        this.searchParams.pageNumber = e.current
      }
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
      this.$refs.remark.show(this.selectedRows[0].caseId)
    },
    getList() {
      const params = {
        ...this.searchParams,
        ...this.searchSchemaParams
      }
      if (params.prefixPreCaseNo1 && params.prefixPreCaseNo2) {
        const labe1 = this.searchSchemaParams.prefixPreCaseNo1 || ''
        const labe2 = this.searchSchemaParams.prefixPreCaseNo2 || ''
        params.caseNoPrefix = '(' + labe1 + ')' + labe2
      }
      delete params.prefixPreCaseNo1
      delete params.prefixPreCaseNo2
      unReceiveList(params).then(res => {
        if (res.code === 200) {
          this.total = parseInt(res.data.totalsCount)
          this.tabledata = res.data.searchResult.map((item, index) => {
            if (item.caseFillingDate) {
              item.caseFillingDate = moment(item.caseFillingDate).format('YYYY-MM-DD')
            }
            if (item.suggestCourtTime) {
              item.suggestCourtTime = moment(item.suggestCourtTime).format('YYYY-MM-DD')
            }
            item.index = index + 1
            return item
          })
        }
      })
    },
    accept() {
      if (!this.selectedRows || this.selectedRows.length === 0) {
        this.$message.error('请先选择案件')
        return
      }
      this.$refs.acceptShow.show()
    },
    refund() {
      if (!this.selectedRows || this.selectedRows.length === 0) {
        this.$message.error('请选择案件')
        return
      }
      this.$refs.refundShow.show()
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
