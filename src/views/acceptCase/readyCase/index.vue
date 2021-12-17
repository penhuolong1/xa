<template>
  <!--案件鉴定 -->
  <div>
    <SearchForm :is-skeleton="isSkeleton" :schema="searchSchema" class="enter-X" @search="search" />
    <div class="list-btn-content enter-X">
      <Button class="list-btn-item" type="org" @click="next">转到下一流程</Button>
      <Button class="list-btn-item" type="primary" @click="addCase">收案登记</Button>
      <Button class="list-btn-item" type="blue4" @click="copyCase">复制案件</Button>
      <Button class="list-btn-item" type="blue3" @click="freeze">保全</Button>
      <Button class="list-btn-item" type="blue2" @click="appraisal">鉴定</Button>
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
    <!-- 冻结案件 -->
    <Free ref="free" :select-key="selectKey" @done="getList" />

    <!-- 下一流程 -->
    <Next ref="next" :select-key="selectKey" :next-list="nextList" @done="getList" />
    <!-- 复制案件 -->
    <CopyCase ref="copyCase" :select-key="selectKey" @done="getList" />
    <!-- 添加备注 -->
    <AddRemark ref="remark" />
    <!-- 草稿箱 -->
    <DraftBox ref="draftBox" />
  </div>

</template>
<script>
import SearchForm from '@/components/SearchForm'
import { Button, Table } from 'ant-design-vue'
import Free from './components/free.vue'
import Next from '@/components/NextStep'
import AddRemark from '@/components/AddRemark'
import DraftBox from '@/components/DraftBox'
import CopyCase from './components/copyCase.vue'
import { getBrief, queryJudge } from '@/api/addCase/index.js'
import { queryCaseInfo } from '@/api/addCase'
export default {
  components: {
    SearchForm,
    Button,
    Table,
    Free,
    Next,
    CopyCase,
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
          title: '申请流水号',
          dataIndex: 'serialNumber',
          rowkey: 'serialNumber'
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
        lawCaseState: '预立案'
      },
      nextList: [
        {
          value: 1,
          label: '送达中待指派'
        },
        {
          value: 2,
          label: '诉前程序'
        },
        {
          value: 3,
          label: '待正式立案'
        },
        {
          value: 4,
          label: '诉前销案'
        },
        {
          value: 5,
          label: '不予受理'
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
      remarkInfo: {}, // 备注需要的信息
      isTable: true
    }
  },
  computed: {
    rowSelection() {
      return {
        onChange: (selectedRowKeys, selectedRows) => {
          this.selectKey = selectedRows
        }
      }
    }
  },
  created() {},
  mounted() {
    this.getList()
  },
  methods: {
    // 保全
    freeze() {
      if (!this.selectKey || this.selectKey.length === 0) {
        this.$message.error('请先选择案件')
        return
      }
      this.$refs.free.show(1)
    },
    // 鉴定
    appraisal() {
      if (!this.selectKey || this.selectKey.length === 0) {
        this.$message.error('请先选择案件')
        return
      }
      this.$refs.free.show(2)
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
    // 复制案件
    copyCase() {
      if (!this.selectKey || this.selectKey.length === 0) {
        this.$message.error('请先选择案件')
        return
      }
      if (this.selectKey.length > 1) {
        this.$message.error('只能选择一个案件进行添加')
        return
      }
      this.$refs.copyCase.show()
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
      this.$refs.draftBox.show(0)
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
        lawCaseState: '预立案'
      }
      this.searchParams.pageNum = 1
      this.getList()
    },
    getList(e) {
      console.log(e)
      this.loading = true
      this.isTable = false
      queryCaseInfo(this.searchParams).then(({ code, data }) => {
        this.isTable = true
        this.loading = false
        this.selectKey = []
        if (code === 200) {
          this.list = data.rows.map((item, index) => {
            item.index = index + 1
            return item
          })
          this.total = data.total
        }
      })
    },
    // 跳转详情
    toDetail(e) {
      // this.$store.commit('SET_LAWCASE', e.lawCaseId)
      // const caseNo = e.caseNo || e.preCaseNo
      // this.$store.commit('SET_CASENO', caseNo)
      // this.$store.dispatch('ToDetail')
      // const path = `/case/detail?lawCase=${e.lawCaseId}`
      // this.$router.push(path)
      // const obj = {
      //   path,
      //   caseNo: caseNo,
      //   caseId: e.lawCaseId
      // }
      // this.$store.commit('ADD_TAGVIEWCASE', obj)
      const caseNo = e.caseNo || e.preCaseNo
      const path = `/case/detail?lawCase=${e.lawCaseId}`
      const obj = {
        path,
        caseNo: caseNo,
        caseId: e.lawCaseId
      }
      this.$store.dispatch('ToDetail', obj)
    }
  }
}
</script>

<style scoped lang="less">
.ant-btn{
  margin:10px;
}

</style>
