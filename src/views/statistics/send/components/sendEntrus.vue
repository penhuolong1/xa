<template>
  <div class="table-box enter-x">
    <h1>委托送达方式统计</h1>
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
import { getSendEntrust } from '@/api/statistics/index'
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
          customRender: (text, row, index) => {
            const obj = {
              children: text,
              attrs: {}
            }
            obj.attrs.rowSpan = row.dwRowSpan
            if (index === this.list.length - 1) {
              obj.attrs.colSpan = 2
            }
            return obj
          }
        },
        {
          title: '委托法院',
          dataIndex: 'court',
          rowkey: 'court',
          scopedSlots: { customRender: 'data' },
          customRender: (text, row, index) => {
            const obj = {
              children: text,
              attrs: {}
            }
            obj.attrs.rowSpan = row.dwRowSpan
            if (index === this.list.length - 1) {
              obj.attrs.colSpan = 0
            }
            return obj
          }
        },
        {
          title: '案件数(件)',
          dataIndex: 'caseNum',
          rowkey: 'caseNum',
          scopedSlots: { customRender: 'data' }
        },
        {
          title: '送达时长(天)',
          dataIndex: 'sendTime',
          rowkey: 'sendTime',
          scopedSlots: { customRender: 'data' }
        },
        {
          title: '送达成功率(%)',
          dataIndex: 'sendSuccess',
          rowkey: 'sendSuccess',
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
      getSendEntrust(params).then(({ code, data }) => {
        this.loading = false
        if (code === 200) {
          if (!data && data.length === 0) {
            return
          }
          this.list = data.map((item, index) => {
            item.index = index + 1
            const length = data.length - 1
            if (index === length) {
              item.index = '合计'
            }
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
