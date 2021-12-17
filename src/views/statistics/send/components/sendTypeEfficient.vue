<template>
  <div class="table-box enter-x">
    <h1>有效送达方式统计</h1>
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
import { getSendSuccess } from '@/api/statistics/index'
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
          dataIndex: 'name',
          rowkey: 'name'
        },
        {
          title: '电话通知',
          children: [
            {
              title: '数量(次数)',
              dataIndex: 'dhsl',
              key: 'dhsl',
              scopedSlots: { customRender: 'data' }
            },
            {
              title: '占比(%)',
              dataIndex: 'dhzb',
              key: 'dhzb',
              scopedSlots: { customRender: 'data' }
            }
          ]
        },
        {
          title: '电子送达',
          children: [
            {
              title: '数量(次数)',
              dataIndex: 'dzsl',
              key: 'dzsl',
              scopedSlots: { customRender: 'data' }
            },
            {
              title: '占比(%)',
              dataIndex: 'dzzb',
              key: 'dzzb',
              scopedSlots: { customRender: 'data' }
            }
          ]
        },
        {
          title: '现场领取',
          children: [
            {
              title: '数量(次数)',
              dataIndex: 'xcsl',
              key: 'xcsl',
              scopedSlots: { customRender: 'data' }
            },
            {
              title: '占比(%)',
              dataIndex: 'xczb',
              key: 'xczb',
              scopedSlots: { customRender: 'data' }
            }
          ]
        },
        {
          title: '邮寄送达',
          children: [
            {
              title: '数量(次数)',
              dataIndex: 'yjsl',
              key: 'yjsl',
              scopedSlots: { customRender: 'data' }
            },
            {
              title: '占比(%)',
              dataIndex: 'yjzb',
              key: 'yjzb',
              scopedSlots: { customRender: 'data' }
            }
          ]
        },
        {
          title: '上门送达',
          children: [
            {
              title: '数量(次数)',
              dataIndex: 'smsl',
              key: 'smsl',
              scopedSlots: { customRender: 'data' }
            },
            {
              title: '占比(%)',
              dataIndex: 'smcg',
              key: 'smcg',
              scopedSlots: { customRender: 'data' }
            }
          ]
        },
        {
          title: '委托送达',
          children: [
            {
              title: '数量(次数)',
              dataIndex: 'wtsl',
              key: 'wtsl',
              scopedSlots: { customRender: 'data' }
            },
            {
              title: '占比(%)',
              dataIndex: 'wtzb',
              key: 'wtzb',
              scopedSlots: { customRender: 'data' }
            }
          ]
        },
        {
          title: '公告送达',
          children: [
            {
              title: '数量(次数)',
              dataIndex: 'ggsl',
              key: 'ggsl',
              scopedSlots: { customRender: 'data' }
            },
            {
              title: '占比(%)',
              dataIndex: 'ggzb',
              key: 'ggzb',
              scopedSlots: { customRender: 'data' }
            }
          ]
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
      getSendSuccess(params).then(({ code, data }) => {
        this.loading = false
        if (code === 200) {
          if (!data && data.length === 0) {
            return
          }
          this.list = data.map((item, index) => {
            item.name = item.jName
            const length = data.length - 1
            if (index === length) {
              item.name = '合计'
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
