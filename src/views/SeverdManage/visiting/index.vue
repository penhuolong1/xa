<template>
  <div>
    <SearchForm :is-skeleton="isSkeleton" :schema="searchSchema" :default-value="searchDefaultValue" class="enter-X" @search="search" />
    <div class="wrapper">
      <Button class="list-btn-item" type="primary" @click="appoint">指派</Button>
      <Button class="list-btn-item" type="blue4" @click="del">取消上门</Button>
      <Button class="list-btn-item" type="blue3"> 完成送达</Button>
      <Button class="list-btn-item" type="blue2" @click="map">地图模式</Button>
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
        <a @click="toDetail(record)">操作</a>
      </div>
    </Table>
    <!-- 添加备注 -->
    <AddRemark ref="remark" @done="getList" />
    <!-- 地图 -->
    <Map ref="getmap" :litigant-address="litigantAddress" />
    <!-- 指派上门送达员 -->
    <Appoint ref="appoint" :selected-rows="selectedRows" @refresh="getList" />
  </div>
</template>
<script>
import SearchForm from '@/components/SearchForm'
import AddRemark from '@/components/AddRemark'
import Map from './components/map.vue'
import moment from 'moment'
import { Button, Table } from 'ant-design-vue'
import { onSend, sender } from '@/api/freeze/index.js'
import { delSend } from '@/api/send/index'
import Appoint from './components/appoint.vue'
export default {
  components: {
    SearchForm,
    AddRemark,
    Map,
    Table,
    Button,
    Appoint
  },
  props: {
  },
  data() {
    return {
      type: 1,
      isSkeleton: false,
      caseType: 'activeCase',
      appointType: 'all',
      sendType: 'all',
      loading: false,
      total: 0,
      selectedRows: [],
      searchSchemaParams: {},
      searchDefaultValue: {
        caseType: 'activeCase',
        appointType: 'all',
        sendType: 'all',
        finishState: 'sending'
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
          label: '完成状态',
          type: 'radio',
          field: 'finishState',
          options: [
            {
              label: '未完成',
              value: 'sending'
            },
            {
              label: '已完成',
              value: 'finished'
            }
          ]
        },
        {
          label: '指派状态',
          type: 'radio',
          field: 'appointType',
          options: [
            {
              label: '全部',
              value: 'all'
            },
            {
              label: '未指派',
              value: 'unAppoint'
            },
            {
              label: '已指派',
              value: 'appointed'
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
          style: 'width: 540px;'
          // showTime: true
        },
        {
          label: '案由',
          type: 'brief',
          field: 'reason',
          style: 'width: 276px;'
        },
        {
          label: '当事人姓名',
          type: 'input',
          field: 'litigantName'
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
          width: 80,
          customRender: (text, row, index) => {
            return index + 1
          }
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
          title: '受送达人',
          dataIndex: 'litigantIdName',
          key: 'litigantIdName'
        },

        {
          title: '地址类型 | 上门地址',
          dataIndex: 'sendAddressAndType',
          key: 'sendAddressAndType'
        },
        {
          title: '送达类型',
          dataIndex: 'sendtype',
          key: 'sendtype'
        },
        {
          title: '诉前程序时间',
          dataIndex: 'casePreMediateDate',
          key: 'casePreMediateDate'
        },
        {
          title: '确认开庭时间',
          dataIndex: 'caseScheduleConformDate',
          key: 'caseScheduleConformDate'
        },
        {
          title: '最迟上门时间',
          dataIndex: 'lastArriveDate',
          key: 'lastArriveDate'
        },
        {
          title: '上门送达员',
          dataIndex: 'senderName',
          key: 'senderName'
        },
        // 暂时没有
        {
          title: '标识操作',
          dataIndex: 'caseScheduleConformDate3',
          key: 'caseScheduleConformDate3'
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'operation' },
          width: 80
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
    this.getSearchRelevant()
  },
  mounted() {
    this.map()
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

    // 地图
    map() {
      sender().then(({ code, data }) => {
        if (code === 200) {
          this.litigantAddress = data
        }
      })
      if (!this.litigantAddress || this.litigantAddress.length > 0) {
        this.$refs.getmap.conversion()
      }
    },
    // 指派上门送达员
    appoint() {
      if (!this.selectedRows || this.selectedRows.length === 0) {
        this.$message.error('请先选择案件')
        return
      }
      if (this.selectedRows.length > 1) {
        this.$message.error('只能选择一件案件指派上门送达员')
        return
      }
      this.$refs.appoint.show()
    },
    // 取消上门
    del() {
      if (!this.selectedRows || this.selectedRows.length === 0) {
        this.$message.error('请先选择案件')
        return
      }
      this.$confirm({
        title: '是否取消上门送达',
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          const params = {
            sendId: this.selectedRows[0].sendId
          }
          delSend(params).then(({ code, msg }) => {
            if (code === 200) {
              this.$message.success(msg)
              this.getList()
            }
          })
        },
        onCancel() {}
      })
    },
    search(e) {
      this.searchSchemaParams = e
      this.caseType = 'activeCase'
      this.appointType = e.appointType
      this.sendType = e.sendType
      this.searchParams.pageNumber = 1
      this.getList()
    },
    getList() {
      this.isTable = false
      this.loading = true
      const params = {
        ...this.searchParams,
        caseType: 'activeCase',
        ...this.searchSchemaParams
      }
      params.finishState = 'all'
      params.sendType = this.sendType
      params.appointType = this.appointType
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
          this.tabledata.map((item, index) => { item.index = index + 1 })
          this.tabledata = res.data.searchResult.map((item) => {
            if (item.casePreMediateDate) {
              item.casePreMediateDate = moment(item.casePreMediateDate).format('YYYY-MM-DD HH:mm:ss')
            }
            if (item.caseScheduleConformDate) {
              item.caseScheduleConformDate = moment(item.caseScheduleConformDate).format('YYYY-MM-DD HH:mm:ss')
            }
            if (item.lastArriveDate) {
              item.lastArriveDate = moment(item.lastArriveDate).format('YYYY-MM-DD HH:mm:ss')
            }
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
