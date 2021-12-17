<template>
  <div class="table-box enter-x">
    <h1>邮寄送达方式统计</h1>
    <Table
      :row-key="(record,index)=>{return index}"
      :columns="columns"
      bordered
      :scroll="{x: 1400}"
      :data-source="list"
      :loading="loading"
      :pagination="false"
    >
      <div slot="data" slot-scope="text">
        {{ text || 0 }}
      </div>
    </Table>
  </div>
</template>

<script>
import { Table } from 'ant-design-vue'
import { getSendMail } from '@/api/statistics/index'
export default {
  components: {
    Table
  },
  props: {

  },
  data() {
    return {
      columns: [
        {
          title: '排名',
          dataIndex: 'index',
          rowkey: 'index',
          scopedSlots: { customRender: 'data' }
        },
        {
          title: '送达员',
          dataIndex: 'name',
          rowkey: 'name',
          scopedSlots: { customRender: 'data' }
        },
        {
          title: '市内(次)',
          dataIndex: 'sn',
          rowkey: 'sn',
          scopedSlots: { customRender: 'data' }
        },
        {
          title: '本省(次)',
          dataIndex: 'bs',
          rowkey: 'bs',
          scopedSlots: { customRender: 'data' }
        },
        {
          title: '外省(次)',
          dataIndex: 'ws',
          rowkey: 'ws',
          scopedSlots: { customRender: 'data' }
        },
        {
          title: '小计(次)',
          dataIndex: 'xj',
          rowkey: 'xj',
          scopedSlots: { customRender: 'data' }
        }
      ],
      list: [],
      loading: false
    }
  },
  created() {

  },
  mounted() {

  },
  methods: {
    getList(params) {
      getSendMail(params).then(({ code, data }) => {
        this.loading = false
        if (code === 200) {
          console.log(data)
          if (!data && data.length === 0) {
            return
          }
          this.list = data.map((item, index) => {
            item.index = index + 1
            return item
          })
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
.table-box {
  padding: 20px!important;
  h1 {
    text-align: center;
    font-size: 18px;
    margin-bottom: 10px;
  }
}
</style>
