<template>
  <div>
    <div class="wrapper">
      <Button type="primary" @click="addRemark">添加</Button>
    </div>
    <AddRemark ref="remarkShow" :is-edit="isEdit" @done="getList" />
    <Table
      :loading="loading"
      :scroll="{x:1400}"
      :columns="columns"
      :data-source="tabledata"
      :row-key="(record,index)=>{return index}"
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
      <div slot="operation" slot-scope="record">
        <div class="box">
          <a class="mr-5" @click="edit(record)">编辑</a>
          <a class="mr-5" @click="del(record)">删除</a>
        </div>
      </div>
    </Table>

  </div>
</template>

<script>
import { Table, Button } from 'ant-design-vue'
import { sflistCaseRemark, sfdelremark } from '@/api/freeze/index.js'
import AddRemark from './components/addRemark.vue'
import { mapGetters } from 'vuex'

import moment from 'moment'
export default {
  components: {
    Table,
    Button,
    AddRemark
  },
  props: {

  },
  data() {
    return {
      isEdit: false,
      loading: false,
      type: 2,
      selectRow: {},
      columns: [
        {
          title: '序号',
          dataIndex: 'index',
          key: 'index'
        },
        {
          title: '操作时间',
          dataIndex: 'createTime',
          key: 'createTime'

        },
        {
          title: '案件状态',
          dataIndex: 'caseState',
          key: 'caseState'
        },
        {
          title: '备注',
          dataIndex: 'content',
          key: 'content'
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'operation' }
        }

      ],
      tabledata: [],
      searchParams: { // 列表搜索条件
        pageNumber: 1,
        pageSize: 10
      },
      total: 0
    }
  },
  computed: {
    ...mapGetters(['getSfLawCaseId'])

  },
  created() {
    this.getList()
  },
  mounted() {
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
    addRemark() {
      this.$refs.remarkShow.show()
    },
    getList() {
      this.loading = true
      const params = {
        ...this.searchParams,
        lawCase: this.getSfLawCaseId,
        ...this.searchParams
      }
      sflistCaseRemark(params).then(res => {
        this.loading = false
        this.total = parseInt(res.total)
        this.tabledata = res.rows.map((item, index) => {
          item.createTime = moment(item.createTime).format('YYYY-MM-DD HH:mm:ss')
          item.index = index + 1
          return item
        })
      })
    },
    edit(e) {
      this.isEdit = true
      this.$refs.remarkShow.show(e)
    },
    del(e) {
      this.$confirm({
        title: '是否删除该备注',
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          const params = {
            id: e.id
          }
          sfdelremark(params).then(({ code, msg }) => {
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
<style scoped lang="less" >
.wrapper{
  margin-left: 90%;
}
</style>
