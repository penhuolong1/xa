<template>
  <!-- 案件保全 -->
  <div>
    <SearchForm :is-skeleton="isSkeleton" :schema="searchSchema" :default-value="searchDefaultValue" class="enter-X" @search="search" />

    <div class="list-btn-content">
      <Button class="list-btn-item" type="green" @click="assureOver">保全结束</Button>
      <Button class="list-btn-item" type="primary" @click="openRecord">补录保全案号</Button>
      <Button class="list-btn-item" type="blue4" @click="changeRecord">修改保全案号</Button>
    </div>
    <Table
      v-if="isTable"
      :scroll="{x:1400}"
      :row-selection="rowSelection"
      :columns="columns"
      :data-source="tabledata"
      :loading="loading1"
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
      <div slot="preCaseNo" slot-scope="text, records">
        <a @click="toDetail(records)">{{ text }}</a>
      </div>
      <div slot="caseNo" slot-scope="text, records">
        <a @click="toDetail(records)">{{ text }}</a>
      </div>
    </Table>
    <Over ref="overshow" :selected-rows="selectedRows" :type="type" @refresh="getlist" />
    <Append ref="appendshow" :selected-rows="selectedRows" :type="type" @refresh="getlist" />
    <ChangeRecord ref="changeShow" :selected-rows="selectedRows" @refresh="getlist" />
  </div>
</template>
<script>
import SearchForm from '@/components/SearchForm'
import ChangeRecord from './Componants/changeRecord.vue'
import Over from './Componants/Over'
import Append from './Componants/Append'
import moment from 'moment'
import { Button, Table } from 'ant-design-vue'
import { preservationCase } from '@/api/freeze/index.js'
import { formatDate } from '@/utils/format.js'
export default {
  components: {
    SearchForm,
    Over,
    Append,
    Button,
    Table,
    ChangeRecord
  },
  props: {
  },
  data() {
    return {
      total: 0,
      type: 1, // 保全案件列表中的补录保全
      loading: false,
      loading1: false,
      isend: false,
      record: false,
      isTable: true,
      isSkeleton: false,
      status: 'all',
      caseNo: '',
      endtime: '',
      form1: this.$form.createForm(this, { name: 'coordinated' }),
      searchParams: { // 列表搜索条件
        pageNumber: 1,
        pageSize: 10
      },
      prefixPreCaseNo1: '',
      prefixPreCaseNo2: '',
      selectedRows: [],
      searchSchemaParams: [], // 高级搜索条件
      enableSendState: { // 是否冻结送达状态转换
        true: '是',
        false: '否'
      },
      caseStatus: 'preserving',
      searchDefaultValue: {
        caseStatus: 'preserving'
      },
      searchSchema: [
        {
          label: '保全状态',
          type: 'radio',
          field: 'caseStatus',
          options: [
            // {
            //   label: '全部',
            //   value: 'all'
            // },
            {
              label: '保全中',
              value: 'preserving'
            },
            {
              label: '已结束',
              value: 'finished'
            }
          ]
        },
        {
          label: '是否冻结送达',
          type: 'radio',
          field: 'isSend',
          style: 'width: 521px;',
          options: [
            {
              label: '是',
              value: true
            },
            {
              label: '否',
              value: false
            }
          ]
        },
        {
          label: '申请流水号',
          type: 'input',
          field: 'serialNumber'
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
          label: '案由',
          type: 'brief',
          field: 'reason'
        },
        {
          label: '当事人姓名',
          type: 'input',
          field: 'litigantName'
        },
        {
          label: '预立案/立案时间',
          type: 'time',
          field: ['fillingDateStart', 'fillingDateEnd'],
          style: 'width: 521px;'
          // showTime: true
        },

        {
          label: '保全案号',
          type: 'input',
          field: 'case'
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
          dataIndex: 'lawCaseBean.preCaseNo',
          key: 'lawCaseBean.preCaseNo',
          scopedSlots: { customRender: 'preCaseNo' }

        },
        {
          title: '案号',
          dataIndex: 'lawCaseBean.caseNo',
          key: 'lawCaseBean.caseNo',
          scopedSlots: { customRender: 'caseNo' }

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
          title: '终止人员',
          dataIndex: 'preserveCaseBean.endPeopleBean.name',
          key: 'preserveCaseBean.endPeopleBean.name'
        },
        {
          title: '保全开始时间',
          dataIndex: 'preserveCaseBean.frozenStartTime',
          key: 'preserveCaseBean.frozenStartTime'
        },
        {
          title: '保全结束时间',
          dataIndex: 'preserveCaseBean.frozenEndTime',
          key: 'preserveCaseBean.frozenEndTime'
        },

        {
          title: '保全时长',
          dataIndex: 'preserveCaseBean.frozenDuration',
          key: 'preserveCaseBean.frozenDuration'
        },
        {
          title: '是否冻结送达',
          dataIndex: 'preserveCaseBean.enableSend',
          key: 'preserveCaseBean.enableSend'
        },
        {
          title: '可启用送达日期',
          dataIndex: 'preserveCaseBean.enableSendDate',
          key: 'preserveCaseBean.enableSendDate',
          width: 150
        },
        {
          title: '保全案号',
          dataIndex: 'preserveCaseBean.preserveCaseNo',
          key: 'preserveCaseBean.preserveCaseNo'
        }

      ],
      tabledata: [
      ]
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
    this.getlist()
  },
  mounted() {
  },
  methods: {
    changePage(e) {
      if (e.pageSize !== this.searchParams.pageSize) {
        this.searchParams.pageNumber = 1
        this.searchParams.pageSize = e.pageSize
      } else {
        this.searchParams.pageNumber = e.current
      }
      this.getlist()
    },
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
    // 高级搜索
    search(e) {
      console.log(e)
      this.prefixPreCaseNo1 = e.prefixPreCaseNo1
      this.prefixPreCaseNo2 = e.prefixPreCaseNo2
      this.searchSchemaParams = e
      this.caseStatus = e.caseStatus
      this.searchParams.pageNumber = 1

      this.getlist()
    },
    enidentify() {
    },
    // 判断是否补录保全是否有选中案件
    openRecord() {
      if (!this.selectedRows || this.selectedRows.length === 0) {
        this.$message.error('请先选择案件')
        return
      }
      if (this.selectedRows.length > 1) {
        this.$message.error('请选择一件案件')
        return
      }
      if (this.selectedRows[0].preserveCaseBean.preserveCaseNo) {
        this.$message.error('已存在保全案号，可以进行修改')
        return
      }
      this.$refs.appendshow.show()
    },
    // 修改保全案号
    changeRecord() {
      if (!this.selectedRows || this.selectedRows.length === 0) {
        this.$message.error('请先选择案件')
        return
      }
      if (this.selectedRows.length > 1) {
        this.$message.error('请选择一件案件')
        return
      }
      this.$refs.changeShow.show()
    },
    // 判断有没有选中案件
    assureOver() {
      if (!this.selectedRows || this.selectedRows.length === 0) {
        this.$message.error('请选择案件')
        return
      }
      if (!this.selectedRows[0].preserveCaseBean.preserveCaseNo) {
        this.$message.error('未有保全案号不能结束保全')
        return
      }
      this.$refs.overshow.show()
    },
    getlist() {
      this.isTable = false
      const params = {
        ...this.searchParams,
        ...this.searchSchemaParams
      }
      params.caseStatus = this.caseStatus
      if (params.prefixPreCaseNo1 || params.prefixPreCaseNo2) {
        delete params.prefixPreCaseNo1
        delete params.prefixPreCaseNo2
        const labe1 = this.prefixPreCaseNo1 || ''
        const labe2 = this.prefixPreCaseNo2 || ''
        params.caseNoPrefix = '(' + labe1 + ')' + labe2
      }
      preservationCase(params).then(res => {
        this.isTable = true
        this.loading1 = false
        if (res.code === 200) {
          this.total = parseInt(res.data.totalsCount)
          this.tabledata = res.data.searchResult
          this.tabledata = res.data.searchResult.map((item, index) => {
            item.preserveCaseBean.frozenDuration = item.preserveCaseBean.frozenDuration ? (item.preserveCaseBean.frozenDuration + '天') : ''
            item.preserveCaseBean.frozenEndTime = item.preserveCaseBean.frozenEndTime ? this.$moment(item.preserveCaseBean.frozenEndTime).format('YYYY-MM-DD HH:mm:ss') : ''
            item.preserveCaseBean.frozenStartTime = item.preserveCaseBean.frozenStartTime ? this.$moment(item.preserveCaseBean.frozenStartTime).format('YYYY-MM-DD HH:mm:ss') : ''
            item.lawCaseBean.preFilingDate = item.lawCaseBean.preFilingDate ? this.$moment(item.lawCaseBean.preFilingDate).format('YYYY-MM-DD HH:mm:ss') : ''
            item.lawCaseBean.filingDate = item.lawCaseBean.filingDate ? this.$moment(item.lawCaseBean.filingDate).format('YYYY-MM-DD HH:mm:ss') : ''
            item.preserveCaseBean.enableSend = this.enableSendState[item.preserveCaseBean.enableSend]
            item.preserveCaseBean.enableSendDate = item.preserveCaseBean.enableSendDate ? this.$moment(item.preserveCaseBean.enableSendDate).format('YYYY-MM-DD HH:mm:ss') : ''
            item.index = index + 1
            return item
          })
        }
      })
    },
    changetime(time) {
      this.endtime = time
    }
  }
}
</script>

<style scoped lang="less">
.ant-btn{
    margin:10px;
  }
  /deep/.ant-calendar-picker-input.ant-input{
    min-width: 235px;
  }
</style>
