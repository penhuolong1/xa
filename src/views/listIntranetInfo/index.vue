<template>
  <div>
    <SearchForm :is-skeleton="isSkeleton" :default-value="defaultValue" :schema="searchSchema" class="enter-X" @search="search" />
    <div class="list-btn-content enter-X">
      <Button class="list-btn-item" type="blue4" @click="intranetCase">同步榕基</Button>
    </div>
    <Table
      v-if="isTable"
      class="enter-X"
      :row-key="(record,index)=>{return index}"
      :columns="columns"
      :row-selection="rowSelection"
      :data-source="tabledata"
      :loading="loading"
      :pagination="{
        total: total,
        showTotal: total => {
          return `共计${total}条`
        },
        current: searchParams.pageNum,
        showSizeChanger: true,
        showQuickJumper: true,
      }"
      @change="changePage"
    >
      <div slot="preCaseNo" slot-scope="text, record">
        <a @click="toDetail(record)">{{ text }}</a>
      </div>
    </Table>

  </div>
</template>
<script>
import { Table, Button } from 'ant-design-vue'
import SearchForm from '@/components/SearchForm'
import { litigationScene } from '@/type/index.js'
import { listIntranetInfo, importIntranetCase } from '@/api/freeze/index.js'
export default {
  components: {
    SearchForm,
    Table,
    Button
  },
  props: {
  },
  data() {
    return {
      isSkeleton: false,
      isTable: true,
      loading: false,
      total: 0,
      selectedRows: [],
      searchSchema: [
        {
          label: '案件状态 ',
          type: 'radio',
          field: 'lawCaseState',
          options: [
            {
              label: '全部',
              value: '全部'
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
              label: '诉前调解',
              value: '诉前调解'
            },
            {
              label: '调解',
              value: '调解'
            },
            {
              label: '待立案',
              value: '待立案'
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
              label: '结案',
              value: '结案'
            },
            {
              label: '冻结',
              value: '冻结'
            },
            {
              label: '诉前销案',
              value: '诉前销案'
            },
            {
              label: '不予受理',
              value: '不予受理'
            }
          ]
        },
        {
          label: '同步进度',
          type: 'radio',
          field: 'intranetState',
          options: [{
            label: '全部',
            value: null
          },
          {
            label: '未提交',
            value: 3
          },
          {
            label: '提交中',
            value: 0
          },
          {
            label: '提交成功',
            value: 1
          },
          {
            label: '提交失败',
            value: 2
          }
          ]
        },
        {
          label: '申请流水号',
          type: 'input',
          field: 'serialNumber'
        },
        {
          label: '预立案案号',
          type: 'caseNo',
          field1: 'prefixPreCaseNo1',
          field2: 'prefixPreCaseNo2',
          field3: 'startNumber',
          field4: 'endNumber'
        },
        {
          label: '预立案时间',
          type: 'time',
          field: ['preStartDate', 'preEndDate']
          // showTime: true
        },
        {
          label: '法官助理',
          type: 'judge',
          userType: 3,
          field: 'assistantId'
        },
        {
          label: '速录员',
          type: 'judge',
          userType: 5,
          field: 'recorderId'
        },
        {
          label: '案由',
          type: 'brief',
          field: 'briefId'
        },
        {
          label: '当事人姓名',
          type: 'input',
          field: 'litigantName'
        },
        {
          label: '诉讼场景',
          type: 'select',
          field: 'litigationScene',
          options: litigationScene
        }
      ],
      defaultValue: {
        lawCaseState: '全部',
        intranetState: null
      },
      searchParams: { // 列表搜索条件
        pageNum: 1,
        pageSize: 10
      },
      columns: [
        {
          title: '序号',
          dataIndex: 'index',
          rowkey: 'index'
        },
        {
          title: '预立案号',
          dataIndex: 'preCaseNo',
          rowkey: 'preCaseNo',
          scopedSlots: { customRender: 'preCaseNo' }
        },
        {
          title: '预立案时间',
          dataIndex: 'preFilingDate',
          rowkey: 'preFilingDate'
        },
        {
          title: '当事人 | 案由',
          dataIndex: 'reason',
          rowkey: 'reason',
          width: 300
        },
        {
          title: '法官助理',
          dataIndex: 'assistantJudgeName',
          rowkey: 'assistantJudgeName'
        },
        {
          title: '速录员',
          dataIndex: 'recorderName',
          key: 'recorderName'
        },
        {
          title: '诉前结案方式',
          dataIndex: 'pre_close_type',
          key: 'pre_close_type'
        },
        {
          title: '同步进度',
          dataIndex: 'intranetState',
          key: 'intranetState'
        },
        {
          title: '榕基错误信息',
          dataIndex: 'caseInfo',
          key: 'caseInfo'
        }
      ],
      tabledata: []
    }
  },
  computed: {
    rowSelection() {
      return {
        onChange: (selectedRowKeys, selectedRows) => {
          console.log(selectedRows)
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
    // 搜索
    search(e) {
      const params = { ...e }

      this.searchParams = {
        ...params,
        pageSize: this.searchParams.pageSize,
        pageNum: this.searchParams.pageNum
      }
      const lab1 = params.prefixPreCaseNo1 || ''
      const lab2 = params.prefixPreCaseNo2 || ''
      params.prefixPreCaseNo = lab1 + lab2
      delete params.prefixPreCaseNo1
      delete params.prefixPreCaseNo2
      this.searchParams.pageNum = 1
      this.getList()
    },
    // 分页触发
    changePage(e) {
      console.log(e)
      if (e.pageSize !== this.searchParams.pageSize) {
        this.searchParams.pageNum = 1
        this.searchParams.pageSize = e.pageSize
      } else {
        this.searchParams.pageNum = e.current
      }
    },
    toDetail(e) {
      const caseNo = e.caseNo || e.preCaseNo
      const path = `/case/detail?lawCase=${e.lawCaseId}`
      const obj = {
        path,
        caseNo: caseNo,
        caseId: e.lawCaseId
      }
      this.$store.dispatch('ToDetail', obj)
    },
    // 同步榕基
    intranetCase() {
      this.lawCaseIdArr = []
      if (!this.selectedRows || this.selectedRows.length === 0) {
        this.$message.error('请先选择案件')
        return
      }
      this.selectedRows.map(item => {
        this.lawCaseIdArr.push(item.lawCaseId)
      })
      this.$confirm({
        title: '您确定将选中的案件同步榕基进行立案？',
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          const params = {
            lawCaseIds: this.selectedRows.length == 1 ? this.selectedRows[0].lawCaseId : this.selectedRows.map(item => item.lawCaseId).join(',')
          }
          importIntranetCase(params).then(({ code, msg }) => {
            if (code === 200) {
              if (msg == '操作成功！') {
                this.$message.success(msg)
              } else {
                this.$message.error(msg)
              }
              this.getList()
            }
          })
        },
        onCancel() {}
      })
    },
    // 获取列表数据
    getList() {
      this.isTable = false
      this.loading = true

      listIntranetInfo(this.searchParams).then(res => {
        this.isTable = true
        this.loading = false
        if (res.code === 200) {
          this.tabledata = res.data.rows.map((item, index) => {
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
.ant-btn{
  margin:10px;
}
</style>
