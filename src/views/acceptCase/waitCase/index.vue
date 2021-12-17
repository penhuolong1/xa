<template>
  <!--案件鉴定 -->
  <div>
    <SearchForm :is-skeleton="isSkeleton" :schema="searchSchema" class="enter-X" @search="search" />
    <div class="list-btn-content enter-X">
      <Button class="list-btn-item" type="green" @click="addCaseNo">录入案号</Button>
      <Button class="list-btn-item" type="org" @click="nextStep">结束案件</Button>
      <Button class="list-btn-item" type="blue4" @click="intranetCase">同步榕基</Button>
      <Button class="list-btn-item" @click="addremark">添加备注</Button>
    </div>
    <Table
      v-if="isTable"
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
    <!-- 录入案号 -->
    <AddCaseNo ref="addCaseNo" :select-key="selectKey" @done="getList" />
    <!-- 转下一流程 -->
    <Next ref="next" :select-key="selectKey" :next-list="nextList" @done="getList" />
    <!-- 添加备注 -->
    <AddRemark ref="remark" />
  </div>

</template>
<script>
import SearchForm from '@/components/SearchForm'
import Next from '@/components/NextStep'
import { Button, Table } from 'ant-design-vue'
import AddRemark from '@/components/AddRemark'
import AddCaseNo from './components/addCaseNo.vue'
import { queryCaseInfo } from '@/api/addCase'
import { importIntranetCase } from '@/api/freeze/index.js'
export default {
  components: {
    SearchForm,
    Button,
    Table,
    AddCaseNo,
    Next,
    AddRemark
  },
  props: {},
  data() {
    return {
      loading: false,
      lawCaseIdArr: [],
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
        }
      ],
      isSkeleton: false, // 是否显示骨架屏
      searchParams: { // 列表搜索条件
        pageNum: 1,
        pageSize: 10,
        lawCaseState: '待正式立案'
      },
      tabledata: [
      ],
      nextList: [
        {
          value: 5,
          label: '不予受理'
        },
        {
          value: 6,
          label: '结案'
        }
      ],
      searchSchema: [
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
        }
      ],
      selectKey: [], // 选中的列
      isTable: true
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
    // 下一个流程
    nextStep() {
      if (!this.selectKey || this.selectKey.length === 0) {
        this.$message.error('请先选择案件')
        return
      }
      this.$refs.next.show()
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
    // 添加备注
    addremark() {
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
    // 跳转到录入案件
    addCase() {
      this.$router.push('/addCase/step1')
    },
    // 同步榕基
    intranetCase() {
      this.lawCaseIdArr = []
      if (!this.selectKey || this.selectKey.length === 0) {
        this.$message.error('请先选择案件')
        return
      }
      this.selectKey.map(item => {
        this.lawCaseIdArr.push(item => {
          item.lawCaseId
        })
      })
      this.$confirm({
        title: '您确定将选中的案件同步榕基进行立案？',
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          const params = {
            lawCaseIds: this.selectKey.length == 1 ? this.selectKey[0].lawCaseId : this.selectKey.map(item => item.lawCaseId).join(',')
          }
          importIntranetCase(params).then(({ code, msg }) => {
            if (code === 200) {
              if (msg == '操作成功！') {
                this.$message.success(msg)
              } else {
                this.$message.warning(msg)
              }
              this.getList()
            }
          })
        },
        onCancel() {}
      })
    },
    search(e) {
      console.log(e)
      const params = { ...e }
      const lab1 = params.prefixPreCaseNo1 || ''
      const lab2 = params.prefixPreCaseNo2 || ''
      params.prefixPreCaseNo = lab1 + lab2
      delete params.prefixPreCaseNo1
      delete params.prefixPreCaseNo2
      this.searchParams = {
        ...params,
        pageNum: this.searchParams.pageNum,
        pageSize: this.searchParams.pageSize,
        lawCaseState: '待正式立案'
      }
      this.getList()
    },
    getList(e) {
      console.log(e)
      this.loading = true
      this.isTable = false
      queryCaseInfo(this.searchParams).then(({ code, data }) => {
        this.loading = false
        this.isTable = true
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
