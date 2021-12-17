<template>
  <!-- 鉴定页面 -->
  <div>
    <SearchForm
      :default-value="defaultValue"
      :is-skeleton="isSkeleton"
      :is-need-export="isNeedExport"
      :schema="searchSchema"
      class="enter-X"
      @search="search"
      @export="derive"
    />
    <div class="list-btn-content">
      <Button class="list-btn-item" type="green" @click="openRecord">鉴定结束</Button>
      <Button class="list-btn-item" type="blue4" @click="assureOver">修改鉴定类别</Button>
    </div>
    <Table
      v-if="isTable"
      :scroll="{x:1400}"
      :loading="loading1"
      :row-selection="rowSelection"
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
      <div slot="CaseNo" slot-scope="text, record">
        <a @click="toDetail(record)">{{ text }}</a>
      </div>
    </Table>
    <Over ref="show" :selected-rows="selectedRows" :type="type" @refresh="getList" />
    <ChangeType ref="changeshow" :selected-rows="selectedRows" :type="type" @refresh="getList" />
  </div>
</template>
<script>
import SearchForm from '@/components/SearchForm'
import Over from './components/Over'
import ChangeType from './components/ChangeType'
import { Button, Table } from 'ant-design-vue'
import { caseList } from '@/api/freeze/index.js'
import { formatDate } from '@/utils/format.js'
import moment from 'moment'

export default {
  components: {
    SearchForm,
    Over,
    ChangeType,
    Button,
    Table
  },
  props: {
  },
  data() {
    return {
      isSkeleton: false, // 是否显示骨架屏
      isNeedExport: true,
      isover: false,
      loading: false,
      loading1: false,
      isTable: true,
      time: '',
      lawCase: 4,
      total: 0,
      type: 1,
      ischange: false,
      finishedCount: null, // 已完成
      appraisalingCount: null, // 正在鉴定
      status: 'appraising',
      typevalue: '',
      defaultValue: {
        caseStatus: 'appraising'
      },
      searchParams: { // 列表搜索条件
        pageNumber: 1,
        pageSize: 10
      },
      searchDetail: {},
      selectedRows: [],
      selectedRowKeys: [],
      searchSchema: [
        {
          label: '鉴定状态',
          type: 'radio',
          field: 'caseStatus',
          options: [
            // {
            //   label: '全部',
            //   value: 'all'
            // },
            {
              label: '正在鉴定',
              value: 'appraising'
            },
            {
              label: '已完成',
              value: 'finished'
            }
          ]
        },
        // {
        //   label: '申请流水号',
        //   type: 'input',
        //   field: 'serialNumber'
        // },
        {
          label: '预案号/案号',
          type: 'caseNo',
          field1: 'prefixPreCaseNo1',
          field2: 'prefixPreCaseNo2',
          field3: 'caseNoSuffixStart',
          field4: 'caseNoSuffixEnd'
        },
        {
          label: '当事人姓名',
          type: 'input',
          field: 'litigantName'
        },
        {
          label: '案由',
          type: 'brief',
          field: 'brief'
        },
        {
          label: '预立案/立案时间',
          type: 'time',
          field: ['fillingDateStart', 'fillingDateEnd'],
          // showTime: true
          style: 'width: 550px;'
        }
      ],
      searchSchemaParams: {},
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
          title: '终止人员',
          dataIndex: 'endPeopleBean.name',
          key: 'endPeopleBean.name'
        },
        {
          title: '鉴定开始时间',
          dataIndex: 'appraisalCase.appraisalStartTime',
          key: 'appraisalCase.appraisalStartTime'
        },
        {
          title: '鉴定结束时间',
          dataIndex: 'appraisalCase.appraisalEndTime',
          key: 'appraisalCase.appraisalEndTime'
        },

        {
          title: '鉴定时长',
          dataIndex: 'appraisalCase.appraisalDuration',
          key: 'appraisalCase.appraisalDuration'
        },
        {
          title: '鉴定类别',
          dataIndex: 'appraisalCase.appraisalType',
          key: 'appraisalCase.appraisalType'
        }
      ],
      tabledata: []
    }
  },
  computed: {
    rowSelection() {
      return {
        onChange: (selectedRowKeys, selectedRows) => {
          console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
          this.selectedRows = selectedRows
        }
      }
    }
  },
  watch: {
  },
  created() {
  },
  mounted() {
    this.getList()
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

    // 判断鉴定结束是否有选中案件
    openRecord() {
      if (!this.selectedRows || this.selectedRows.length === 0) {
        this.$message.error('请选择案件')
        return
      }
      this.$refs.show.show()
    },
    // 判断修改类型有没有选中案件
    assureOver() {
      if (!this.selectedRows || this.selectedRows.length === 0) {
        this.$message.error('请选择案件')
        return
      }
      this.$refs.changeshow.show(this.selectedRows)
    },
    // 分页触发
    changePage(e) {
      if (e.pageSize !== this.searchParams.pageSize) {
        this.searchParams.pageNumber = 1
        this.searchParams.pageSize = e.pageSize
      } else {
        this.searchParams.pageNumber = e.current
      }
      this.searchSchemaParams = {
        ...this.searchParams,
        ...this.searchDetail
      }
      this.getList()
    },
    derive(e) {
      console.log(e)
    },
    // 根据搜索条件触发页面
    search(e) {
      this.searchDetail = e
      console.log(e)
      this.status = e.caseStatus
      this.searchSchemaParams = {
        ...this.searchParams,
        ...e
      }
      if (this.searchSchemaParams.prefixPreCaseNo1 || this.searchSchemaParams.prefixPreCaseNo2) {
        delete this.searchSchemaParams.prefixPreCaseNo1
        delete this.searchSchemaParams.prefixPreCaseNo2
        const lab1 = e.prefixPreCaseNo1 || ''
        const lab2 = e.prefixPreCaseNo2 || ''
        this.searchSchemaParams.caseNoPrefix = '(' + lab1 + ')' + lab2
      }
      this.searchParams.pageNumber = 1
      this.getList()
    },
    // 刷新页面
    getList(e) {
      this.isTable = false
      this.loading1 = true
      if (!this.searchSchemaParams.caseStatus) {
        this.searchSchemaParams = {
          caseStatus: this.status,
          ...this.searchParams
        }
      }
      caseList(this.searchSchemaParams).then(res => {
        this.isTable = true
        this.loading1 = false
        this.selectedRows = []
        this.total = parseInt(res.data.totalsCount)
        this.tabledata = res.data.searchResult
        this.tabledata.forEach((item, index) => { item.index = index + 1 })

        this.tabledata = res.data.searchResult.map((item) => {
          if (item.appraisalCase.appraisalDuration) {
            item.appraisalCase.appraisalDuration = item.appraisalCase.appraisalDuration + '天'
          }
          item.appraisalCase.appraisalEndTime = item.appraisalCase.appraisalEndTime ? this.$moment(item.appraisalCase.appraisalEndTime).format('YYYY-MM-DD HH:mm:ss') : ''
          item.appraisalCase.appraisalStartTime = item.appraisalCase.appraisalStartTime ? this.$moment(item.appraisalCase.appraisalStartTime).format('YYYY-MM-DD HH:mm:ss') : ''
          item.lawCaseBean.preFilingDate = item.lawCaseBean.preFilingDate ? this.$moment(item.lawCaseBean.preFilingDate).format('YYYY-MM-DD HH:mm:ss') : ''
          item.lawCaseBean.filingDate = item.lawCaseBean.filingDate ? this.$moment(item.lawCaseBean.filingDate).format('YYYY-MM-DD HH:mm:ss') : ''

          return item
        })
      })
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
