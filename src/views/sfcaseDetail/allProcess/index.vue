<template>
  <div>

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
    />

  </div>
</template>

<script>
import { Table } from 'ant-design-vue'
import { mapGetters } from 'vuex'
import { sflogOfCase } from '@/api/freeze/index.js'
import moment from 'moment'
export default {
  components: {
    Table
  },
  props: {

  },
  data() {
    return {
      loading: false,
      columns: [
        {
          title: '序号',
          dataIndex: 'index',
          key: 'index',
          className: 'index'

        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          key: 'createTime'
        },
        {
          title: '操作人',
          dataIndex: 'userName',
          key: 'userName'
        },
        {
          title: '操作角色',
          dataIndex: 'roleName',
          key: 'roleName'
        },
        {
          title: 'IP',
          dataIndex: 'operateIp',
          key: 'operateIp'
        },
        {
          title: '操作平台',
          dataIndex: 'operateOs',
          key: 'operateOs'
        },
        {
          title: '更新时间',
          dataIndex: 'updateTime',
          key: 'updateTime'
        },
        {
          title: '操作部门',
          dataIndex: 'deptName',
          key: 'deptName'
        },
        {
          title: '操作内容',
          dataIndex: 'content',
          key: 'content',
          className: 'operatorDescription'
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
  },
  mounted() {
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
    getList() {
      this.loading = true
      const params = {
        sfLawCaseId: this.getSfLawCaseId,
        ...this.searchParams
      }
      sflogOfCase(params).then(res => {
        this.loading = false
        this.total = parseInt(res.rows.total)
        this.tabledata = res.rows.map((item, index) => {
          item.index = index + 1
          return item
        })
        console.log(this.tabledata)
      })
    }
  }
}
</script>
<style scoped lang="less" >
/deep/.index{
  width:120px;
}
/deep/.operatorDescription{
  width:400px;
}
</style>
