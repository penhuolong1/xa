<template>
  <!--案件鉴定 -->
  <div>
    <SearchForm :is-skeleton="isSkeleton" :schema="searchSchema" class="enter-X" @search="search" />
    <div class="list-btn-content enter-X">
      <Button class="list-btn-item" type="green" @click="review">审查</Button>
      <Button class="list-btn-item" type="org" @click="transferReview">移交审查</Button>
      <!-- <Button class="list-btn-item" type="primary" @click="moveUnit">转单位调解</Button> -->
      <Button class="list-btn-item" type="primary">上报联动中心</Button>
      <Button class="list-btn-item" type="danger" @click="delCase">删除</Button>
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
    />
    <!-- <MoveUnit ref="moveUnit" :select-key="selectKey" @done="getList" /> -->
    <!-- 移交审查 -->
    <TransferReview ref="transferReview" :select-key="selectKey" @done="getList" />
  </div>

</template>
<script>
import SearchForm from '@/components/SearchForm'
import { Button, Table } from 'ant-design-vue'
import MoveUnit from './components/moveUnit.vue'
import TransferReview from './components/transferReview.vue'
import { getBrief } from '@/api/addCase/index.js'
import { formatDate } from '@/utils/format.js'
import { queryPreCase, delPreCase } from '@/api/collectCase'
export default {
  components: {
    SearchForm,
    Button,
    Table,
    MoveUnit,
    TransferReview
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
          title: '诉讼场景',
          dataIndex: 'litigationScene',
          rowkey: 'litigationScene'
        },
        {
          title: '申请流水号',
          dataIndex: 'serialNumber',
          rowkey: 'serialNumber'
        },
        {
          title: '提交时间',
          dataIndex: 'applyDate',
          rowkey: 'applyDate'
        },
        {
          title: '当事人|案由',
          dataIndex: 'reason',
          rowkey: 'reason',
          width: 300
        },
        {
          title: '诉讼人姓名',
          dataIndex: 'applyPeople',
          rowkey: 'applyPeople'
        },
        {
          title: '审批状态',
          dataIndex: 'state',
          key: 'state'
        }
      ],
      isSkeleton: false, // 是否显示骨架屏
      searchParams: { // 列表搜索条件
        pageNum: 1,
        pageSize: 10
      },
      tabledata: [
      ],
      searchSchema: [
        {
          label: '诉讼场景',
          type: 'select',
          field: 'litigationScene',
          options: [
            {
              value: '大厅收案',
              label: '大厅收案'
            },
            {
              value: '当事人申请',
              label: '当事人申请'
            },
            {
              value: '中心分配',
              label: '中心分配'
            },
            {
              value: '单位申请',
              label: '单位申请'
            },
            {
              value: '其他平台',
              label: '其他平台'
            }
          ]
        },
        {
          label: '申请流水号',
          type: 'input',
          field: 'serialNumber'
        },
        {
          label: '提交时间',
          type: 'time',
          field: ['startDate', 'endDate']
          // showTime: true
        },
        {
          label: '诉讼人',
          type: 'input',
          field: 'applyPeople'
        },
        {
          label: '案由',
          type: 'brief',
          field: 'brief'
        }
      ],
      selectKey: [] // 选中的列
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
      this.searchParams = {
        ...params,
        pageNum: this.searchParams.pageNum,
        pageSize: this.searchParams.pageSize
      }
      this.searchParams.pageNumber = 1
      this.getList()
    },
    getList(e) {
      console.log(e)
      this.loading = true
      queryPreCase(this.searchParams).then(({ code, data }) => {
        this.loading = false
        if (code === 200) {
          this.list = data.records.map((item, index) => {
            item.applyDate = item.applyDate ? formatDate(item.applyDate, 'YYYY-MM-DD') : ''
            item.index = index + 1
            return item
          })
          this.total = parseInt(data.total)
        }
      })
    },
    // 跳转审查页面
    review() {
      if (!this.selectKey || this.selectKey.length === 0) {
        this.$message.error('请先选择案件')
        return
      }
      if (this.selectKey.length > 1) {
        this.$message.error('一次只能审查一件案件')
        return
      }
      if (this.selectKey[0].sfType == 2) { // 诉非的案件
        this.$store.commit('SET_LAWCASE', this.selectKey[0].lawCase)
        localStorage.setItem('addCaseType', 0)
        if (this.selectKey[0].state === '同意受理') { // 同意受理的直接调整到立案页面
          const path = '/addCase/step1'
          this.$router.push(path)
          this.$store.commit('ADD_TAGVIEWLIST', path)
        } else {
          const path = '/collectCase/reivew?id=' + this.selectKey[0].sfLawCaseId + '&preId=' + this.selectKey[0].id
          this.$router.push(path)
          this.$store.commit('ADD_OTHERTAGVIEWLIST', { path, title: '审查' })
        }
      } else {
        localStorage.setItem('addCaseType', 0)
        this.$store.commit('SET_LAWCASE', this.selectKey[0].lawCase)
        const path = '/addCase/step1'
        this.$router.push(path)
        this.$store.commit('ADD_TAGVIEWLIST', path)
      }
    },
    // 转单位调解
    moveUnit() {
      if (!this.selectKey || this.selectKey.length === 0) {
        this.$message.error('请先选择案件')
        return
      }
      if (this.selectKey.length > 1) {
        this.$message.error('一次只能转移一件案件')
        return
      }
      this.$refs.moveUnit.show()
    },
    // 移交审查
    transferReview() {
      if (!this.selectKey || this.selectKey.length === 0) {
        this.$message.error('请先选择案件')
        return
      }
      this.$refs.transferReview.show()
    },
    // 删除案件
    delCase() {
      if (!this.selectKey || this.selectKey.length === 0) {
        this.$message.error('请先选择案件')
        return
      }
      this.$confirm({
        title: '是否删除该案件',
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          const params = {
            preCaseId: this.selectKey.map(item => item.id).join(',')
          }
          delPreCase(params).then(({ code, msg }) => {
            if (code === 200) {
              this.$message.success(msg)
              this.getList()
            }
          })
        },
        onCancel() {}
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
