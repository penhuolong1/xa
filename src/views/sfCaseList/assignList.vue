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
      :row-key="(record,index)=>{return record.id}"
      :columns="columns"
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
      <div slot="caseNo" slot-scope="text, record">
        <a @click="toAddCase(record)">{{ text }}</a>
      </div>
    </Table>
  </div>

</template>
<script>
import SearchForm from '@/components/SearchForm'
import { sfCaseState } from '@/type/index.js'
import { Button, Table } from 'ant-design-vue'
import { listPointCase } from '@/api/sfAddcase/index.js'
import { trialFieldType2 } from '@/type/index.js'
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
          title: '案号',
          dataIndex: 'caseNo',
          rowkey: 'caseNo',
          scopedSlots: { customRender: 'caseNo' }
        },
        {
          title: '立案日期',
          dataIndex: 'registerDate',
          rowkey: 'registerDate'
        },
        {
          title: '当事人 | 案由',
          dataIndex: 'reason',
          rowkey: 'reason'
        },
        {
          title: '状态',
          dataIndex: 'state',
          rowkey: 'state'
        }
        // {
        //   title: '操作',
        //   scopedSlots: { customRender: 'operate' }
        // }
      ],
      isSkeleton: false, // 是否显示骨架屏
      searchParams: { // 列表搜索条件
        pageNum: 1,
        pageSize: 10
      },
      searchSchema: [
        {
          label: '申请流水号',
          type: 'input',
          field: 'serialNumber'
        },
        {
          label: '案号',
          type: 'caseNo',
          field1: 'prefixPreCaseNo1',
          field2: 'prefixPreCaseNo2',
          field3: 'startNumber',
          field4: 'endNumber',
          trialFieldType: [
            {
              value: '诉非',
              label: '诉非'
            },
            ...trialFieldType2
          ]
        },
        {
          label: '立案时间',
          type: 'time',
          field: ['applyDateStart', 'applyDateEnd'],
          trialFieldType: [
            {
              value: '诉非',
              label: '诉非'
            }
          ],
          showTime: true
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
        this.searchParams.pageNum = 1
        this.searchParams.pageSize = e.pageSize
      } else {
        this.searchParams.pageNum = e.current
      }
      this.getList()
    },
    // 跳转到录入案件
    search(e) {
      console.log(e)
      const params = { ...e }
      this.searchParams = {
        ...params,
        pageNum: this.searchParams.pageNum,
        // pageNumber: this.searchParams.pageNumber,
        pageNumber: 1,
        pageSize: this.searchParams.pageSize
      }

      this.getList()
    },
    getList(e) {
      this.loading = true
      listPointCase(this.searchParams).then(({ code, data }) => {
        this.loading = false
        this.selectKey = []
        if (code === 200) {
          this.list = data.rows.map((item, index) => {
            item.index = index + 1
            item.state = sfCaseState[item.acceptType]
            return item
          })
          this.total = data.total
        }
      })
    },
    toAddCase(e) {
      if (e.sfType == 1) { // 法院的案件
        this.$store.commit('SET_SFLAWCASE', e.id)
        const caseNo = e.caseNo || e.preCaseNo
        const path = '/case/detail?lawCase=' + e.lawCaseId + '&type=2'
        const obj = {
          path,
          caseNo: caseNo,
          caseId: e.lawCaseId
        }
        this.$store.dispatch('ToDetail', obj)
      } else {
        const caseNo = e.caseNo
        const path = `/sfcase/detail?caseId=${e.id}`
        const obj = {
          path,
          caseNo: caseNo,
          caseId: e.id,
          type: 2 // type为2是诉非的案件
        }
        this.$store.dispatch('ToSfDetail', obj)
      }
    }
  }
}
</script>

<style scoped lang="less">
.ant-btn{
  margin:10px;
}

</style>
