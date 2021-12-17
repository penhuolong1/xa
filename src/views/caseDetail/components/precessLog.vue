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
import { precessLog } from '@/api/freeze/index.js'
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
          title: '操作时间',
          dataIndex: 'createTime',
          key: 'createTime'
        },
        {
          title: '操作人',
          dataIndex: 'operatorName',
          key: 'operatorName'
        },
        {
          title: 'IP',
          dataIndex: 'IPAddress',
          key: 'IPAddress'
        },
        {
          title: '操作平台',
          dataIndex: 'platform',
          key: 'platform'
        },
        {
          title: '详情',
          dataIndex: 'operatorDescription',
          key: 'operatorDescription',
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
      precessLog(this.$route.query.lawCase).then(res => {
        this.loading = false
        this.total = parseInt(res.data.totalsCount)
        this.tabledata = res.data.searchResult.map((item, index) => {
          if (item.createTime) {
            item.createTime = moment(item.createTime).format('YYYY-MM-DD HH:mm:ss')
          }
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
