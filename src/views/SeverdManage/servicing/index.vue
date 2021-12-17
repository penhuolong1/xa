<template>
  <div>
    <SearchForm :is-skeleton="isSkeleton" :schema="searchSchema" :default-value="searchDefaultValue" class="enter-X" @change="change" @search="search" />
    <div v-if="type==1" class="wrapper">
      <Button class="list-btn-item" type="org" @click="next">转下一流程</Button>
      <Button class="list-btn-item" type="green" @click="trans">移交送达员</Button>
      <Button class="list-btn-item" type="danger" @click="refund"> 退回</Button>
      <!-- <Button class="list-btn-item" type="primary" @click="transition">转普</Button> -->
      <Button class="list-btn-item" type="primary" @click="changeState">修改可排期/排庭状态</Button>
      <Button class="list-btn-item" type="blue4" @click="addReserveTime">添加诉前程序时间</Button>
      <Button class="list-btn-item" type="blue3" @click="addPalaceTime">添加排庭时间</Button>
      <Button class="list-btn-item" @click="addRemark">添加备注</Button>
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
      <div slot="casePreCaseNo" slot-scope="text, record">
        <a @click="toDetail(record)">{{ text }}</a>
      </div>
      <div slot="operation" slot-scope="text, record">
        <a @click="toDeliverDetail(record)">进入</a>
      </div>
    </Table>
    <!-- 移交 -->
    <Transfer ref="transShow" :selected-rows="selectedRows" @refresh="getList" />
    <!-- 转普 -->
    <Transition ref="transitionShow" :selected-rows="selectedRows" @refresh="getList" />
    <!-- 退回 -->
    <Refund ref="refundShow" :selected-rows="selectedRows" @refresh="getList" />
    <!-- 转下一流程 -->
    <Next ref="nextShow" :selected-rows="selectedRows" @refresh="getList" />
    <!-- 添加备注 -->
    <AddRemark ref="remark" @done="getList" />
    <!-- 添加预约时间 -->
    <AddReserveTime ref="addReserveTime" @done="getList" />
    <!-- 添加排庭时间 -->
    <AddPalaceTime ref="addPalaceTime" @done="getList" />
    <!-- 修改可排期状态 -->
    <ChangeState ref="changeStateShow" :selected-rows="selectedRows" @refresh="getList" />
  </div>
</template>
<script>
import SearchForm from '@/components/SearchForm'
import Transfer from './components/transfer.vue'
import Transition from './components/transition'
import Refund from './components/refund'
import AddRemark from '@/components/AddRemark'
import AddPalaceTime from '../../schedule/palace/components/addPalaceTime.vue'
import moment from 'moment'
import AddReserveTime from '../../schedule/prosecution/components/addReserveTime.vue'
import ChangeState from './components/changeState.vue'
import { Button, Table } from 'ant-design-vue'
import { onSend, sender, getScheduleInfo, getReserveInfo } from '@/api/freeze/index.js'
import Next from './components/next.vue'
export default {
  components: {
    SearchForm,
    Transfer,
    Refund,
    Transition,
    AddRemark,
    Table,
    Button,
    Next,
    AddReserveTime,
    AddPalaceTime,
    ChangeState
  },
  props: {
  },
  data() {
    return {
      type: 1,
      isSkeleton: false,
      caseType: 'allCase',
      sendType: 'all',
      appointType: 'all',
      loading: false,
      total: 0,
      selectedRows: [],
      searchSchemaParams: {},
      searchDefaultValue: {
        caseType: 'allCase',
        appointType: 'all',
        sendType: 'all'
      },
      litigantAddress: [],
      searchSchema: [
        {
          label: '送达类型',
          type: 'radio',
          field: 'sendType',
          options: [
            {
              label: '全部',
              value: 'all'
            },
            {
              label: '诉前送达',
              value: 'preSend'
            },
            {
              label: '庭前送达',
              value: 'send'
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
          field: 'reason'
        },

        {
          label: '当事人姓名',
          type: 'input',
          field: 'litigantName',
          style: 'width: 305px;'
        }
      ],
      searchParams: { // 列表搜索条件
        pageNumber: 1,
        pageSize: 10
      },
      columns: [
        {
          title: '序号',
          dataIndex: 'index',
          key: 'index',
          width: 80
        },
        {
          title: '预案号',
          dataIndex: 'casePreCaseNo',
          key: 'casePreCaseNo',
          scopedSlots: { customRender: 'casePreCaseNo' }

        },
        {
          title: '案号',
          dataIndex: 'caseNo',
          key: 'caseNo',
          scopedSlots: { customRender: 'casePreCaseNo' }
        },
        {
          title: '当事人 | 案由',
          dataIndex: 'caseReason',
          key: 'caseReason'
        },
        {
          title: '送达开始时间',
          dataIndex: 'SPStartTime',
          key: 'SPStartTime'
        },

        {
          title: '承办部门',
          dataIndex: 'departName',
          key: 'departName'
        },
        {
          title: '承办人',
          dataIndex: 'judgeName',
          key: 'judgeName'
        },
        {
          title: '法官助理',
          dataIndex: 'assistantJudjeName',
          key: 'assistantJudjeName'
        },
        {
          title: '诉前程序时间',
          dataIndex: 'casePreMediateDate',
          key: 'casePreMediateDate'
        },
        {
          title: '排庭时间',
          dataIndex: 'caseScheduleDate',
          key: 'caseScheduleDate'
        },
        {
          title: '确认开庭时间',
          dataIndex: 'caseScheduleConformDate',
          key: 'caseScheduleConformDate'
        },
        {
          title: '公证送达员',
          dataIndex: 'notarySenderName',
          key: 'notarySenderName'
        },
        {
          title: '邮政送达员',
          dataIndex: 'postalSenderName',
          key: 'postalSenderName'
        },
        {
          title: '送达类型',
          dataIndex: 'SPtype',
          key: 'SPtype'
        },
        {
          title: '已使用送达方式',
          dataIndex: 'sendTypeHistory',
          key: 'sendTypeHistory'
        },
        {
          title: '当前送达方式',
          dataIndex: 'currentSendType',
          key: 'currentSendType'
        },
        {
          title: '标识状态',
          dataIndex: '',
          key: ''
        },
        {
          title: '操作',
          width: 80,
          scopedSlots: { customRender: 'operation' }

        }

      ],
      tabledata: [],
      isTable: true
    }
  },
  computed: {
    rowSelection() {
      return {
        onChange: (selectedRowKeys, selectedRows) => {
          this.selectedRows = selectedRows
          this.litigants = selectedRows[0].litigants
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
    changePage(e) {
      if (e.pageSize !== this.searchParams.pageSize) {
        this.searchParams.pageNumber = 1
        this.searchParams.pageSize = e.pageSize
      } else {
        this.searchParams.pageNumber = e.current
      }
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
    toDeliverDetail(e) {
      const caseNo = e.caseNo || e.casePreCaseNo
      const path = `/case/detail?lawCase=${e.caseId}&menu=4`
      const obj = {
        path,
        caseNo: caseNo,
        caseId: e.caseId
      }
      this.$store.dispatch('ToDetail', obj)
    },
    // 转下一流程
    next() {
      if (!this.selectedRows || this.selectedRows.length === 0) {
        this.$message.error('请选择案件')
        return
      }
      this.$refs.nextShow.show()
    },
    // 移交案件
    trans() {
      if (!this.selectedRows || this.selectedRows.length === 0) {
        this.$message.error('请选择案件')
        return
      }
      this.$refs.transShow.show()
    },
    // 退回
    refund() {
      if (!this.selectedRows || this.selectedRows.length === 0) {
        this.$message.error('请选择案件')
        return
      }
      this.$refs.refundShow.show()
    },
    // 转普
    transition() {
      if (!this.selectedRows || this.selectedRows.length === 0) {
        this.$message.error('请选择案件')
        return
      }
      for (let i = 0; i < this.selectedRows.length; i++) {
        if (!this.selectedRows[i].caseNo) {
          this.$message.error('只有正式案件才能转普，请重新选择')
          return
        }
      }
      this.$refs.transitionShow.show()
    },
    // 添加预约时间
    addReserveTime() {
      if (!this.selectedRows || this.selectedRows.length === 0) {
        this.$message.error('请先选择案件')
        return
      }
      if (this.selectedRows.length !== 1) {
        this.$message.error('一次只能预约一个案件')
        return
      }
      if (this.selectedRows[0].caseNo) {
        this.$message.error('请选择诉前案件添加诉前程序时间')
        return
      }
      getReserveInfo(this.selectedRows[0].caseId).then(({ code, data }) => {
        if (code === 200) {
          this.selectedRows[0].tribunalId = data.scheduleTribunalId
          this.selectedRows[0].schedulingTime = data.scheduleStartTime ? this.$moment(data.scheduleStartTime).format('YYYY-MM-DD HH:mm') : ''
        }
      })
      this.$refs.addReserveTime.show(this.selectedRows[0])
    },
    // 添加排庭时间
    addPalaceTime() {
      if (!this.selectedRows || this.selectedRows.length === 0) {
        this.$message.error('请先选择案件')
        return
      }
      if (!this.selectedRows.length > 0) {
        this.$message.error('一次只能选择一个案件')
        return
      }
      if (!this.selectedRows[0].caseNo) {
        this.$message.error('请选择正式案件添加排庭时间')
        return
      }
      getScheduleInfo(this.selectedRows[0].caseId).then(({ code, data }) => {
        if (code === 200) {
          this.selectedRows[0].startTime = data.scheduleStartTime ? this.$moment(data.scheduleStartTime).format('YYYY-MM-DD HH:mm') : ''
          this.selectedRows[0].minute = data.scheduleDuration ? data.scheduleDuration : ''
          this.selectedRows[0].state = data.scheduleState ? data.scheduleState : ''
          this.selectedRows[0].tribunalId = data.scheduleTribunalId ? data.scheduleTribunalId : ''
        }
      })
      this.$refs.addPalaceTime.show(this.selectedRows[0])
    },
    // 添加备注
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
    },
    // 修改可排期状态
    changeState() {
      this.$refs.changeStateShow.show()
    },
    // 案件类型修改功能选项
    change(value) {
      if (value === 'allCase') {
        this.type = 1
        this.caseType = 'allCase'
        this.getList()
      }
      if (value === 'activeCase') {
        this.type = 2
        this.caseType = 'activeCase'
        this.getList()
      }
    },
    search(e) {
      this.searchSchemaParams = e
      console.log(e)
      this.caseType = e.caseType
      this.sendType = e.sendType
      this.appointType = e.appointType
      this.searchParams.pageNumber = 1
      this.getList()
    },
    getList() {
      this.isTable = false
      this.loading = true
      const params = {
        sendType: this.sendType,
        ...this.searchParams,
        caseType: 'allCase',
        ...this.searchSchemaParams
      }
      if (this.caseType === 'activeCase') {
        params.appointType = this.appointType
      }
      if (params.prefixPreCaseNo1 && params.prefixPreCaseNo2) {
        const labe1 = this.searchSchemaParams.prefixPreCaseNo1 || ''
        const labe2 = this.searchSchemaParams.prefixPreCaseNo2 || ''
        params.caseNoPrefix = '(' + labe1 + ')' + labe2
      }
      delete params.prefixPreCaseNo1
      delete params.prefixPreCaseNo2
      onSend(params).then(res => {
        this.loading = false
        this.isTable = true

        if (res.code === 200) {
          this.total = parseInt(res.data.totalsCount)
          this.tabledata = res.data.searchResult
          this.tabledata = res.data.searchResult.map((item, index) => {
            item.index = index + 1
            item.caseScheduleDate = item.caseScheduleDate ? moment(item.caseScheduleDate).format('YYYY-MM-DD HH:mm:ss') : ''
            item.SPStartTime = item.SPStartTime ? moment(item.SPStartTime).format('YYYY-MM-DD HH:mm:ss') : ''
            item.casePreMediateDate = item.casePreMediateDate ? moment(item.casePreMediateDate).format('YYYY-MM-DD HH:mm:ss') : ''
            item.caseScheduleConformDate = item.caseScheduleConformDate ? moment(item.caseScheduleConformDate).format('YYYY-MM-DD HH:mm:ss') : ''
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
