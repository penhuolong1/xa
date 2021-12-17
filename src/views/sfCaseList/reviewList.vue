<template>
  <!--案件鉴定 -->
  <div>
    <SearchForm :is-skeleton="isSkeleton" :schema="searchSchema" class="enter-X" @search="search" />
    <div class="list-btn-content enter-X mb-5">
      <!-- <Button class="list-btn-item" type="green" @click="addcase">新增案件</Button> -->
    </div>
    <Table
      v-if="isTable"
      class="enter-X"
      :row-key="(record,index)=>{return index}"
      :columns="columns"
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
      <div slot="caseNo" slot-scope="text, record">
        <a @click="toDetailCase(record)">{{ text }}</a>
      </div>
      <div slot="operate" slot-scope="text, record">
        <a @click="toDetailCase(record)">进入</a>
      </div>
    </Table>
  </div>

</template>
<script>
import SearchForm from '@/components/SearchForm'
import { Button, Table } from 'ant-design-vue'
import { sfCaseSource, sfCaseState } from '@/type/index.js'
import { listCheckCase } from '@/api/sfAddcase/index.js'
export default {
  name: 'SfCaseReview',
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
        // {
        //   title: '案号',
        //   dataIndex: 'caseNo',
        //   rowkey: 'caseNo',
        //   scopedSlots: { customRender: 'caseNo' }
        // },
        {
          title: '案件来源',
          dataIndex: 'caseSource',
          rowkey: 'caseSource'
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
          title: '审批状态',
          dataIndex: 'acceptType',
          rowkey: 'acceptType'
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
          label: '办理状态',
          type: 'select',
          field: 'doType',
          options: [
            {
              value: 0,
              label: '全部'
            },
            {
              value: 1,
              label: '已办理'
            },
            {
              value: 2,
              label: '未办理'
            }
          ]
        },
        {
          label: '纠纷来源',
          type: 'select',
          field: 'caseSource',
          options: sfCaseSource
        },
        {
          label: '申请流水号',
          type: 'input',
          field: 'serialNumber'
        },
        // {
        //   label: '案号',
        //   type: 'caseNo',
        //   field1: 'prefixPreCaseNo1',
        //   field2: 'prefixPreCaseNo2',
        //   field3: 'startNumber',
        //   field4: 'endNumber',
        //   trialFieldType: [{
        //     value: '诉非',
        //     label: '诉非'
        //   }]
        // },
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
          field: ['applyDateStart', 'applyDateStart'],
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
        pageNumber: 1,
        pageSize: this.searchParams.pageSize
      }
      console.log(this.searchParams)
      this.getList()
    },
    getList(e) {
      this.loading = true
      listCheckCase(this.searchParams).then(({ code, data }) => {
        this.loading = false
        this.selectKey = []
        if (code === 200) {
          this.list = data.rows.map((item, index) => {
            item.index = index + 1
            item.acceptType = sfCaseState[item.acceptType]
            return item
          })
          console.log(this.list)
          this.total = data.total
        }
      })
    },
    addcase() {
      this.$store.commit('SET_SFLAWCASE', '')
      this.$router.push('/sfaddCase/step1')
    },
    toDetailCase(e) {
      const caseNo = e.caseNo || e.serialNumber
      const path = `/sfcase/detail?caseId=${e.id}`
      const obj = {
        path,
        caseNo: caseNo,
        caseId: e.id,
        type: 2
      }
      this.$store.dispatch('ToSfDetail', obj)
    }
  }
}
</script>

<style scoped lang="less">
.ant-btn{
  margin:10px;
}

</style>
