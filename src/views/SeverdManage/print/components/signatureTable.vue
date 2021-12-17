<template>
  <div>
    <Table
      v-if="isTable"
      :scroll="{x:1400}"
      :row-selection="rowSelection"
      :columns="columns"
      :data-source="tabledata"
      :loading="loading"
      :row-key="(record,index)=>{return index}"
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
      <div slot="preCaseNo" slot-scope="text, records">
        <a @click="toDetail(records)">{{ text }}</a>
      </div>
      <div slot="caseNo" slot-scope="text, records">
        <a @click="toDetail(records)">{{ text }}</a>
      </div>
      <div slot="dipName" slot-scope="text, records">
        <a @click="preview(records)">{{ text }}</a>
      </div>
    </Table>
    <Preview ref="preview" :file-list="fileList" />
  </div>
</template>
<script>
import { Table } from 'ant-design-vue'
import { queryDipSign, checkSign } from '@/api/book/index.js'
import Preview from '@/components/Preview/index'
import { ORIGINHTTP } from '@/utils/constVal.js'

const columns = [
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index'
  },
  {
    title: '预立案号',
    dataIndex: 'preCaseNo',
    key: 'preCaseNo',
    scopedSlots: { customRender: 'preCaseNo' }
  },
  {
    title: '案号',
    dataIndex: 'caseNo',
    key: 'caseNo',
    scopedSlots: { customRender: 'caseNo' }
  },
  {
    title: '当事人 | 案由',
    dataIndex: 'reason',
    key: 'reason'
  },
  {
    title: '申请时间',
    dataIndex: 'applyDate',
    key: 'applyDate'
  },
  {
    title: '申请人',
    dataIndex: 'applyPeople',
    key: 'applyPeople'
  },
  {
    title: '申请材料',
    dataIndex: 'dipName',
    key: 'dipName',
    scopedSlots: { customRender: 'dipName' }
  },
  {
    title: '文书当事人',
    dataIndex: 'litigantName',
    key: 'litigantName'
  },
  {
    title: '签章状态',
    dataIndex: 'signState',
    key: 'signState'
  }
]
const columns1 = [
  ...columns,
  {
    title: '签章结果',
    dataIndex: 'signResult',
    key: 'signResult'
  },
  {
    title: '失败原因',
    dataIndex: 'signReason',
    key: 'signReason'
  }
]
export default {
  components: {
    Table,
    Preview
  },
  props: {
    signatureState: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      isTable: true,
      columns: columns,
      fileList: [],
      tabledata: [
      ],
      selectedRows: [],
      loading: false,
      searchParams: {
        pageSize: 10,
        pageNumber: 1
      },
      total: 0
    }
  },
  computed: {
    rowSelection() {
      return {
        onChange: (selectedRowKeys, selectedRows) => {
          this.selectedRows = selectedRows
        }
      }
    }
  },
  watch: {
    signatureState() {
      if (this.signatureState === 0 || this.signatureState === 2) {
        this.columns = columns
      } else {
        this.columns = columns1
      }
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    changePage(e) {
      if (e.pageSize !== this.searchParams.pageSize) {
        this.searchParams.pageNum = 1
        this.searchParams.pageSize = e.pageSize
      } else {
        this.searchParams.pageNum = e.current
      }
      this.getList(this.searchParams)
    },
    getList(params) {
      this.searchParams = params
      this.isTable = false
      queryDipSign(params).then(({ code, data }) => {
        this.isTable = true
        if (code === 200) {
          this.tabledata = data.rows.map((item, index) => {
            item.index = index + 1
            item.applyDate = item.applyDate ? this.$moment(item.applyDate).format('YYYY-MM-DD') : ''
            return item
          })
          this.total = data.total
        }
      })
    },
    // 预览
    preview(e) {
      this.fileList = []
      this.$refs.preview.show(e.dipPath, [])
    },
    // 签章
    signature(type) {
      if (!this.selectedRows || this.selectedRows.length === 0) {
        this.$message.error('请先选择文书')
        return
      }
      const params = {
        signIds: this.selectedRows.map(item => item.signId),
        signState: type
      }
      checkSign(params).then(({ code, msg }) => {
        if (code === 200) {
          this.$message.success(msg)
          this.$emit('done')
        }
      })
      // checkSign
    },
    // 批量打印
    batchPrint() {
      if (!this.selectedRows || this.selectedRows.length === 0) {
        this.$message.error('请先选择文书')
        return
      }
      const href = ORIGINHTTP
      const files = this.selectedRows.map(item => {
        return href + item.dipPath
      }).join(',')
      const hide = this.$message.loading('正在打印')
      try {
        wordPrintActiveX.batchPrint(files)
      } catch (e) {
        if (!!window.ActiveXObject || 'ActiveXObject' in window) {
          hide()
          this.$message.success('请点击右上角控件下载，下载批量打印插件并安装！')
        } else {
          hide()
          this.$message.success('非IE浏览器不支持批量打印！')
        }
      }
      hide()
    },
    // 跳转页面
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
</style>
