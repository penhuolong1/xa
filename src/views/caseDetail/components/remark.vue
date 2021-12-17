<template>
  <div>

    <div class="wrapper">
      <Button type="primary" @click="addRemark">添加</Button>
    </div>
    <AddRemark ref="remarkShow" :sf-edit="true" @done="getList" />
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
import { Table, Button } from 'ant-design-vue'
import { remarksList } from '@/api/freeze/index.js'
import AddRemark from '@/components/AddRemark'

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
          title: '操作人',
          dataIndex: 'operator',
          key: 'operator'
        },
        {
          title: '环节',
          dataIndex: 'caseProcess',
          key: 'caseProcess'
        },
        {
          title: '备注',
          dataIndex: 'remarkContent',
          key: 'remarkContent'
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
      this.$refs.remarkShow.show(this.$route.query.lawCase)
    },
    getList() {
      this.loading = true
      const params = {
        ...this.searchParams
      }
      remarksList(params, this.$route.query.lawCase).then(res => {
        this.loading = false
        this.total = parseInt(res.data.totalsCount)
        this.tabledata = res.data.searchResult.map((item, index) => {
          item.createTime = moment(item.createTime).format('YYYY-MM-DD HH:mm:ss')
          item.index = index + 1
          return item
        })
      })
    }
  }
}
</script>
<style scoped lang="less" >

</style>
