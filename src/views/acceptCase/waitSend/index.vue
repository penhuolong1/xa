<template>
  <!--案件鉴定 -->
  <div>
    <SearchForm :is-skeleton="isSkeleton" :schema="searchSchema" class="enter-X" @search="search" />
    <div class="list-btn-content enter-X">
      <Button class="list-btn-item" type="org" @click="next">转入下一流程</Button>
      <Button class="list-btn-item" type="primary" @click="addCase">新增案件</Button>
      <Button class="list-btn-item" type="blue4">导入案件</Button>
      <Button class="list-btn-item" @click="addRemark">添加备注</Button>

      <!-- <Button class="list-btn-item" type="blue3">复制案件</Button> -->
    </div>
    <Table
      class="enter-X"
      :row-key="(record,index)=>{return index}"
      :columns="columns"
      :row-selection="rowSelection"
      :data-source="list"
      :loading="loading"
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
      <div slot="preCaseNo" slot-scope="text, record">
        <a @click="toDetail(record)">{{ text }}</a>
      </div>
    </Table>
    <!-- 转下一流程 -->
    <Next ref="next" :select-key="selectKey" :next-list="nextList" @done="getList" />
    <!-- 添加备注 -->
    <AddRemark ref="remark" />
    <!-- 草稿箱 -->
    <DraftBox ref="draftBox" />
  </div>

</template>
<script>
import SearchForm from '@/components/SearchForm'
import { Button, Table } from 'ant-design-vue'
import { getBrief, queryJudge, queryDepartment } from '@/api/addCase/index.js'
import { queryCaseInfo } from '@/api/addCase'
import AddRemark from '@/components/AddRemark'
import Next from '@/components/NextStep'
import DraftBox from '@/components/DraftBox'

export default {
  components: {
    SearchForm,
    Button,
    Table,
    Next,
    DraftBox,
    AddRemark
  },
  props: {},
  data() {
    return {
      loading: false,
      total: 0, // 列表总数
      list: [], // 列表数据
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
          title: '案号',
          dataIndex: 'caseNo',
          rowkey: 'caseNo',
          scopedSlots: { customRender: 'preCaseNo' }
        },
        {
          title: '当事人 | 案由',
          dataIndex: 'reason',
          rowkey: 'reason',
          width: 300
        },
        {
          title: '立案时间',
          dataIndex: 'filingDate',
          rowkey: 'filingDate'
        },
        {
          title: '承办部门',
          dataIndex: 'takingDepartment',
          rowkey: 'takingDepartment'
        },
        {
          title: '承办人',
          dataIndex: 'judgeName',
          key: 'judgeName'
        },
        {
          title: '诉前结案方式',
          dataIndex: 'preCloseType',
          key: 'preCloseType'
        },
        {
          title: '标识状态',
          dataIndex: '',
          key: ''
        }

      ],
      isSkeleton: false, // 是否显示骨架屏
      searchParams: { // 列表搜索条件
        pageNum: 1,
        pageSize: 10,
        lawCaseState: '已立案待送达'
      },
      tabledata: [
      ],
      searchSchema: [
        {
          label: '案号',
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
          label: '承办部门',
          type: 'select',
          field: 'courtId'
        },
        {
          label: '承办人',
          type: 'judge',
          userType: 1,
          field: 'judgeId'
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
        }
      ],
      selectKey: [], // 选中的列
      nextList: [
        {
          value: 1,
          label: '送达中待指派'
        },
        {
          value: 7,
          label: '结案'
        }
      ]
    }
  },
  computed: {
    rowSelection() {
      return {
        onChange: (selectedRowKeys, selectedRows) => {
          this.selectKey = selectedRows
          console.log(this.selectedRows)
        }
      }
    }
  },
  created() {},
  mounted() {
    this.getList()
    this.getSearchRelevant()
  },
  methods: {
    // 添加案号
    addCaseNo() {
      if (!this.selectKey || this.selectKey.length === 0) {
        this.$message.error('请先选择案件')
        return
      }
      this.$refs.addCaseNo.show()
    },
    // 获取搜索条件数据
    async getSearchRelevant() {
      this.isSkeleton = true
      await queryDepartment().then(({ code, data }) => {
        if (code === 200) {
          if (!data || data.length === 0) {
            return
          }
          const list = data.map(item => {
            return {
              value: item.id,
              label: item.name
            }
          })
          const index = this.searchSchema.findIndex(item => {
            return item.field === 'courtId'
          })
          this.searchSchema[index].options = list
        }
      })
      this.isSkeleton = false
    },
    // 跳转详情
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
    // 下一个流程
    next() {
      if (!this.selectKey || this.selectKey.length === 0) {
        this.$message.error('请先选择案件')
        return
      }
      this.$refs.next.show()
    },
    // 添加备注
    addRemark() {
      if (!this.selectKey || this.selectKey.length === 0) {
        this.$message.error('请先选择案件')
        return
      }
      if (this.selectKey.length > 1) {
        this.$message.error('只能选择一个案件进行添加')
        return
      }
      this.$refs.remark.show(this.selectKey[0].lawCaseId)
    },
    // 跳转到录入案件
    addCase() {
      this.$refs.draftBox.show(1)
    },
    // 分页触发
    changePage(e) {
      if (e.pageSize !== this.searchParams.pageSize) {
        this.searchParams.pageNum = 1
        this.searchParams.pageSize = e.pageSize
      } else {
        this.searchParams.pageNum = e.current
      }
      this.getList()
    },
    search(e) {
      console.log(e)
      const params = { ...e }
      const lab1 = params.prefixPreCaseNo1 || ''
      const lab2 = params.prefixPreCaseNo2 || ''
      if (params.prefixPreCaseNo1 && params.prefixPreCaseNo2) {
        params.prefixPreCaseNo = '(' + lab1 + ')' + lab2
      }
      delete params.prefixPreCaseNo1
      delete params.prefixPreCaseNo2
      this.searchParams = {
        ...params,
        pageNum: this.searchParams.pageNum,
        pageSize: this.searchParams.pageSize,
        lawCaseState: '已立案待送达'
      }
      this.searchParams.pageNumber = 1
      this.getList()
    },
    getList(e) {
      this.loading = true
      queryCaseInfo(this.searchParams).then(({ code, data }) => {
        this.loading = false
        if (code === 200) {
          this.list = data.rows.map((item, index) => {
            item.index = index + 1
            return item
          })
          this.total = data.total
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
