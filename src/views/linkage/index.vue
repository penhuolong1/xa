<template>
  <!--案件鉴定 -->
  <div>
    <SearchForm :is-skeleton="isSkeleton" :schema="searchSchema" :default-value="defaultValue" class="enter-X" @search="search" @change="changeRadio" />
    <div class="list-btn-content enter-X" />
    <Table
      v-if="isTable"
      class="enter-X"
      :row-key="(record,index)=>{return index}"
      :columns="columns"
      :row-selection="rowSelection"
      :data-source="list"
      :scroll="{x: 1400}"
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
      <div slot="preCaseNo" slot-scope="text, record">
        <a @click="toDetail(record)">{{ text }}</a>
      </div>
    </Table>
  </div>

</template>
<script>
import SearchForm from '@/components/SearchForm'
import { Button, Table } from 'ant-design-vue'
import { getBrief, queryJudge } from '@/api/addCase/index.js'
import { queryCaseInfo } from '@/api/addCase'
const caseState = [
  {
    value: '全部',
    label: '全部'
  },
  {
    value: '待审核',
    label: '待审核'
  },
  {
    value: '待指派',
    label: '待指派'
  },
  {
    value: '调解',
    label: '调解'
  },
  {
    value: '申请司法确认',
    label: '申请司法确认'
  },
  {
    value: '申请立案',
    label: '申请立案'
  },
  {
    value: '已结案',
    label: '已结案'
  }
]
const closeCaseType = [
  {
    value: '全部',
    label: '全部'
  },
  {
    value: '撤诉',
    label: '撤诉'
  },
  {
    value: '化解成功',
    label: '化解成功'
  },
  {
    value: '化解成功并申请司法确认',
    label: '化解成功并申请司法确认'
  },
  {
    value: '化解失败',
    label: '化解失败'
  },
  {
    value: '化解失败并申请立案',
    label: '化解失败并申请立案'
  }
]
export default {
  components: {
    SearchForm,
    Button,
    Table
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
          rowkey: 'index',
          width: 70
        },
        {
          title: '诉非预立案号',
          width: 150
        },
        {
          title: '诉非号',
          dataIndex: '',
          rowkey: '',
          width: 150
        },
        {
          title: '当事人 | 案由',
          dataIndex: 'reason',
          rowkey: 'reason',
          width: 200
        },
        {
          title: '申请标的',
          dataIndex: '',
          rowkey: '',
          width: 100
        },
        {
          title: '立案时间',
          dataIndex: '',
          key: '',
          width: 100
        },
        {
          title: '调解单位/组织名称',
          dataIndex: '',
          key: '',
          width: 150
        },
        {
          title: '调解员',
          dataIndex: '',
          key: '',
          width: 100
        },
        {
          title: '调解预约时间',
          dataIndex: '',
          key: '',
          width: 100
        },
        {
          title: '案件状态',
          dataIndex: '',
          key: '',
          width: 100
        },
        {
          title: '结案方式',
          dataIndex: '',
          key: '',
          width: 100
        }
      ],
      caseStatus: '',
      defaultValue: {
        caseState: '全部',
        closeCaseType: '全部'
      },
      isSkeleton: false, // 是否显示骨架屏
      searchParams: { // 列表搜索条件
        pageNumber: 1,
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
          label: '案件状态',
          type: 'radio',
          field: 'caseState',
          options: caseState,
          className: 'form-item-3'
        },
        {
          label: '结案方式',
          type: 'radio',
          field: 'closeCaseType',
          options: closeCaseType,
          className: 'form-item-3'
        },
        {
          label: '诉非预案号',
          type: 'input',
          field: '',
          vIf: () => {
            return this.caseStatus === '调解'
          }
        },
        {
          label: '诉非号',
          type: 'caseNo',
          field1: 'prefixPreCaseNo1',
          field2: 'prefixPreCaseNo2',
          field3: 'startNumber',
          field4: 'endNumber'
        },
        {
          label: '联动单位',
          type: 'select',
          field: ''
        },
        {
          label: '立案时间',
          type: 'time',
          field: ['preStartDate', 'preEndDate']
          // showTime: true
        },
        {
          label: '案由',
          type: 'select',
          field: 'briefId'
        },
        {
          label: '申请人姓名',
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
          console.log(this.selectKey)
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
    freeze() {
      if (!this.selectKey || this.selectKey.length === 0) {
        this.$message.error('请先选择案件')
        return
      }
      this.$refs.free.show()
    },
    // 下一个流程
    next() {
      if (!this.selectKey || this.selectKey.length === 0) {
        this.$message.error('请先选择案件')
        return
      }
      this.$refs.next.show()
    },
    changeRadio(value, field) {
      if (field === 'caseState') {
        this.caseStatus = value
      }
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
    // 获取搜索条件数据
    async getSearchRelevant() {
      this.isSkeleton = true
      await getBrief().then(({ code, data }) => {
        if (code === 200) {
          if (!data || data.length === 0) {
            return
          }
          const index = this.searchSchema.findIndex(item => {
            return item.field === 'briefId'
          })
          this.searchSchema[index].options = data.records.map(item => {
            return {
              value: item.id,
              label: item.name
            }
          })
        }
      })
      await queryJudge().then(({ code, data }) => {
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
          this.searchSchema[3].options = list
          this.searchSchema[4].options = list
          console.log(this.searchSchema)
        }
      })
      this.isSkeleton = false
    },
    // 分页触发
    changePage(e) {
      if (e.pageSize !== this.searchParams.pageSize) {
        this.searchParams.pageNumber = 1
        this.searchParams.pageSize = e.pageSize
      } else {
        this.searchParams.pageNumber = e.current
      }
      this.getList()
    },
    // 跳转到录入案件
    addCase() {
      this.$store.commit('SET_LAWCASE', '')
      localStorage.setItem('addCaseType', 0)
      this.$router.push('/addCase/step1')
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
        pageNumber: this.searchParams.pageNumber,
        pageSize: this.searchParams.pageSize,
        lawCaseState: '预立案'
      }
      this.searchParams.pageNumber = 1
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
