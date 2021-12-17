<template>
  <div>
    <SearchForm :is-skeleton="isSkeleton" :schema="searchSchema" :default-value="searchDefaultValue" class="enter-X" @search="search" />
    <div class="wrapper">
      <Button class="list-btn-item" type="danger" @click="refunded"> 退回</Button>
      <Button class="list-btn-item" type="primary" @click="check">复核</Button>
      <Button class="list-btn-item" @click="addRemark"> 添加备注</Button>

    </div>
    <Table
      v-if="isTable"
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
    <PreLitigationCase ref="checkShow" :selected-rows="selectedRows" @refresh="getList" />
    <LegalCase ref="LegalCaseShow" :selected-rows="selectedRows" @refresh="getList" />
    <Refunded ref="RefundedCaseShow" :selected-rows="selectedRows" @refresh="getList" />
    <AddRemark ref="remark" @done="getList" />

  </div>
</template>
<script>
import { Table, Button } from 'ant-design-vue'
import PreLitigationCase from './components/preLitigationCase.vue'
import LegalCase from './components/legalCase.vue'
import Refunded from './components/refunded'
import AddRemark from '@/components/AddRemark'

import SearchForm from '@/components/SearchForm'
import { unVerifyList } from '@/api/freeze/index.js'
import moment from 'moment'
export default {
  components: {
    SearchForm,
    Refunded,
    AddRemark,
    LegalCase,
    PreLitigationCase,
    Button,
    Table
  },
  props: {
  },
  data() {
    return {
      isSkeleton: false,
      type: 1,
      total: 0,
      loading: false,
      isTable: true,
      searchParams: { // 列表搜索条件
        pageNumber: 1,
        pageSize: 10
      },
      searchDefaultValue: {
        lawCaseStatus: ''
      },
      lawCaseStatus: '',
      selectedRows: [],
      searchSchemaParams: [], // 高级搜索条件
      sendProcessIdArr: [],
      searchSchema: [
        {
          label: '送达类型',
          type: 'radio',
          field: 'lawCaseStatus',
          options: [
            {
              label: '全部',
              value: ''
            },
            {
              label: '诉前送达',
              value: '诉前送达'
            },
            {
              label: '庭前送达',
              value: '庭前送达'
            }
          ]
        },
        {
          label: '预案号/案号',
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
          field: 'reason',
          style: 'width: 303px;'
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
          title: '当事人 | 案由',
          dataIndex: 'caseReason',
          key: 'caseReason'
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
          title: '法官助理',
          dataIndex: 'assistantJudgeName',
          key: 'assistantJudgeName'
        },
        {
          title: '公证处送达员',
          dataIndex: 'notarySenderName',
          key: 'notarySenderName'
        },
        {
          title: '邮政送达员',
          dataIndex: 'postalSenderName',
          key: 'postalSenderName'
        },
        // {
        //   title: '送达员',
        //   dataIndex: 'senderName',
        //   key: 'senderName'
        // },
        {
          title: '提交复核时间',
          dataIndex: 'sumbmitReviewDate',
          key: 'sumbmitReviewDate'
        },
        {
          title: '下一流程',
          dataIndex: 'reviewType',
          key: 'reviewType'
        },
        {
          title: '处理/送达情况',
          dataIndex: 'transferState',
          key: 'transferState'
        },
        {
          title: '送达类型',
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
    search(e) {
      this.searchSchemaParams = e
      this.lawCaseStatus = e.lawCaseStatus
      this.searchParams.pageNumber = 1
      this.getList()
    },
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
      params.lawCaseStatus = this.lawCaseStatus
      if (params.prefixPreCaseNo1 && params.prefixPreCaseNo2) {
        const labe1 = this.searchSchemaParams.prefixPreCaseNo1 || ''
        const labe2 = this.searchSchemaParams.prefixPreCaseNo2 || ''
        params.caseNoPrefix = '(' + labe1 + ')' + labe2
      }
      delete params.prefixPreCaseNo1
      delete params.prefixPreCaseNo2
      unVerifyList(params).then(res => {
        this.loading = false
        this.isTable = true
        if (res.code === 200) {
          this.total = parseInt(res.data.totalsCount)
          this.tabledata = res.data.searchResult.map((item, index) => {
            if (item.casePreFillingDate) {
              item.casePreFillingDate = moment(item.casePreFillingDate).format('YYYY-MM-DD')
            }
            if (item.sumbmitReviewDate) {
              item.sumbmitReviewDate = moment(item.sumbmitReviewDate).format('YYYY-MM-DD')
            }
            if (item.caseFillingDate) {
              item.caseFillingDate = moment(item.caseFillingDate).format('YYYY-MM-DD')
            }

            item.index = index + 1
            return item
          })
        }
      })
    },
    check() {
      if (!this.selectedRows || this.selectedRows.length === 0) {
        this.$message.error('请选择案件')
        return
      }

      if (!this.selectedRows[0].caseNo) {
        this.$refs.checkShow.show()
      } else {
        this.$refs.LegalCaseShow.show()
      }
    },
    refunded() {
      if (!this.selectedRows || this.selectedRows.length === 0) {
        this.$message.error('请选择案件')
        return
      }
      this.$refs.RefundedCaseShow.show()
    },
    addRemark() {
      if (!this.selectedRows || this.selectedRows.length === 0) {
        this.$message.error('请先选择案件')
        return
      }
      if (this.selectedRows.length > 1) {
        this.$message.error('只能选择一个案件进行添加')
        return
      }
      this.$refs.remark.show(this.selectedRows[0].caseId)
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
