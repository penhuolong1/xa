<template>
  <div>
    <Table
      :columns="columns"
      :data-source="list"
      :row-key="(record,index)=>{return index}"
      :loading="loading"
      :scroll="{x: 1400}"
      :pagination="false"
    >
      <div slot="path" slot-scope="text">
        <audio class="audio" controls :src="text" />
      </div>
      <div slot="operation" slot-scope="record">
        <a @click="edit(record)">编辑</a>
        <a @click="del(record)">删除</a>
      </div>
    </Table>
  </div>
</template>
<script>
import { Table } from 'ant-design-vue'
import { delSend } from '@/api/send/index'
export default {
  components: {
    Table
  },
  props: {
    item: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {

      isTable: true,
      loading: false,
      columns: [
        {
          title: '送达方式',
          dataIndex: 'sendType',
          key: 'sendType',
          width: 100
        },
        {
          title: '呼叫号码',
          dataIndex: 'phone',
          key: 'phone',
          width: 150
        },
        {
          title: '与当事人关系',
          dataIndex: 'phoneRecord.relation',
          key: 'phoneRecord.relation',
          width: 150
        },
        {
          title: '呼叫时间',
          dataIndex: 'phoneRecord.callTime',
          key: 'phoneRecord.callTime',
          width: 200
        },
        {
          title: '呼叫记录',
          dataIndex: 'phoneRecord.path',
          key: 'phoneRecord.path',
          scopedSlots: { customRender: 'path' },
          width: 300
        },

        {
          title: '通话情况',
          dataIndex: 'phoneRecord.callState',
          key: 'phoneRecord.callState',
          width: 100
        },
        {
          title: '预约领取时间',
          dataIndex: 'orderDate',
          key: 'orderDate',
          width: 200
        },
        {
          title: '送达人员',
          dataIndex: 'senderName',
          key: 'senderName',
          width: 100
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'operation' },
          width: 150
        }

      ]
    }
  },
  computed: {
    list() {
      const list = []
      if (!this.item) {
        return list
      }
      list.push(this.item)
      return list
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    del(record) {
      this.$emit('delSendRecord', record.sendId)
    },
    edit(record) {
      this.$emit('editSendRecord', record)
    }
  }
}
</script>

<style scoped lang="less">
a{
   margin-right:10px
}
.audio {
  width: 100%;
  height: 40px;
}
</style>
