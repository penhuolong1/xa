<template>
  <!--案件鉴定 -->
  <div>
    <SearchForm :is-skeleton="isSkeleton" :schema="searchSchema" class="enter-X" @search="search" />
    <div class="list-btn-content enter-X">
      <Button class="list-btn-item" type="green" @click="addcase">新增案件</Button>
      <Button class="list-btn-item" type="danger" @click="delCase">删除案件</Button>
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
        current: searchParams.pageNumber,
        showSizeChanger: true,
        showQuickJumper: true,
      }"
      @change="changePage"
    >
      <div slot="operate" slot-scope="text, record">
        <a @click="toAddCase(record)">进入</a>
      </div>
    </Table>
  </div>

</template>
<script>
import SearchForm from '@/components/SearchForm'
import { Button, Table } from 'ant-design-vue'
import { sfCaseSource } from '@/type/index.js'
import { listTempCase, delSfLawCase } from '@/api/sfAddcase/index.js'
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
          rowkey: 'index'
        },
        {
          title: '申请流水号',
          dataIndex: 'serialNumber',
          rowkey: 'serialNumber'
        },
        {
          title: '申请时间',
          dataIndex: 'applyDate',
          rowkey: 'applyDate'
        },
        {
          title: '当事人 | 案由',
          dataIndex: 'reason',
          rowkey: 'reason'
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'operate' }
        }
      ],
      isSkeleton: false, // 是否显示骨架屏
      searchParams: { // 列表搜索条件
        pageNumber: 1,
        pageSize: 10
      },
      searchSchema: [
        {
          label: '申请流水号',
          type: 'input',
          field: 'serialNumber'
        },
        {
          label: '纠纷案由',
          type: 'brief',
          field: 'briefId'
        },
        {
          label: '当事人名',
          type: 'input',
          field: 'litigantName'
        },
        {
          label: '申请时间',
          type: 'time',
          field: ['applyDateStart', 'applyDateEnd'],
          showTime: true
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
  },
  activated() {
    this.getList()
  },
  methods: {
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
    search(e) {
      const params = { ...e }
      const lab1 = params.prefixPreCaseNo1 || ''
      const lab2 = params.prefixPreCaseNo2 || ''
      if (lab1 && lab2) {
        params.prefixStr = `(${lab1})${lab2}`
      }
      delete params.prefixPreCaseNo1
      delete params.prefixPreCaseNo2
      this.searchParams = {
        ...params,
        // pageNumber: this.searchParams.pageNumber,
        pageNumber: 1,
        pageSize: this.searchParams.pageSize
      }
      console.log(this.searchParams)
      this.getList()
    },
    getList(e) {
      this.loading = true
      listTempCase(this.searchParams).then(({ code, data }) => {
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
    delCase() {
      if (!this.selectKey && this.selectKey.length === 0) {
        this.$message.error('请选择需要删除的案件')
        return
      }
      const ids = this.selectKey.map(item => item.id)
      this.$confirm({
        title: '是否删除该案件',
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          delSfLawCase({ ids }).then(({ code, msg }) => {
            if (code === 200) {
              this.$message.success(msg)
              this.getList()
            }
          })
        },
        onCancel() {}
      })
    },
    addcase() {
      this.$store.commit('SET_SFLAWCASE', '')
      const path = '/sfaddCase/step1'
      this.$router.push(path)
      this.$store.commit('ADD_TAGVIEWLIST', path)
    },
    toAddCase(e) {
      this.$store.commit('SET_SFLAWCASE', e.id)
      this.$router.push('/sfaddCase/step1')
    }
  }
}
</script>

<style scoped lang="less">
.ant-btn{
  margin:10px;
}

</style>
