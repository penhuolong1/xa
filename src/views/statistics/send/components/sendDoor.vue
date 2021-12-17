<template>
  <div class="table-box enter-x">
    <h1>上门送达方式统计</h1>
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
import { getSendDoor } from '@/api/statistics/index'
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
          title: '送达员',
          dataIndex: 'jName',
          rowkey: 'jName',
          scopedSlots: { customRender: 'data' }
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
      getSendDoor(params).then(({ code, data }) => {
        this.loading = false
        if (code === 200) {
          if (!data && data.length === 0) {
            return
          }
          this.list = data.map((item, index) => {
            const length = data.length - 1
            if (index === length) {
              item.jName = '合计'
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
