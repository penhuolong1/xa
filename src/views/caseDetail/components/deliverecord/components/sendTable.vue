<template>
  <div>
    <Table
      :columns="columns"
      :data-source="item"
      :row-key="(record,index)=>{return index}"
      :loading="loading"
      :pagination="false"
    >
      <div slot="diplomsList" slot-scope="record">
        <div v-for="file in record" :key="file.id">
          <a class="mr-5" @click="preview(file,record)">{{ file.dipName }}</a>
        </div>
      </div>
      <div slot="operation" slot-scope="record">
        <a @click="edit(record)">编辑</a>
        <a @click="del(record)">删除</a>
      </div>
    </Table>
    <Preview ref="preview" :file-list="fileList" />
  </div>
</template>
<script>
import { Table } from 'ant-design-vue'
import Preview from '@/components/Preview/index'

export default {
  components: {
    Table,
    Preview
  },
  props: {
    item: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      isTable: true,
      fileList: [],
      loading: false,
      tabledata: [{
        index: 11
      }],
      columns: [
        {
          title: '送达方式',
          dataIndex: 'sendType',
          key: 'sendType',
          width: 100
        },
        {
          title: '发送号码',
          dataIndex: 'phone',
          key: 'phone',
          width: 150
        },
        {
          title: '发送时间',
          dataIndex: 'sendDate',
          key: 'sendDate',
          width: 200
        },
        {
          title: '送达材料',
          dataIndex: 'diplomsList',
          key: 'diplomsList',
          scopedSlots: { customRender: 'diplomsList' },
          width: 250
        },
        {
          title: '发送状态',
          dataIndex: 'receiptStatus',
          key: 'receiptStatus',
          width: 100
        },

        {
          title: '回执时间',
          dataIndex: 'receiveDate',
          key: 'receiveDate',
          width: 200
        },
        {
          title: '送达结果',
          dataIndex: 'state',
          key: 'state',
          width: 100
        },
        {
          title: '送达人员',
          dataIndex: 'senderName',
          key: 'senderName',
          width: 150
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'operation' },
          width: 150
        }
      ]
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
    },
    // 预览
    preview(file, record) {
      this.fileList = []
      this.$refs.preview.show(file.receiptPath || file.dipPath, [])
    }
  }
}
</script>

<style scoped lang="less">
a{
  margin-right:10px
}
</style>
