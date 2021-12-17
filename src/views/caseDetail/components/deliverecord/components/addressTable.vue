<template>
  <div>
    <Table
      :columns="columns"
      :data-source="[item]"
      :row-key="(record,index)=>{return index}"
      :loading="loading"
      :pagination="false"
    >
      <div slot="receiptFile" slot-scope="record">
        <a v-for="file in record.receiptFileList" :key="file.id" class="mr-5" @click="preview(file,record)">{{ file.receiptName }}</a>
      </div>
      <div slot="diplomsList" slot-scope="record">
        <div v-for="file in record" :key="file.id">
          <a class="mr-5" @click="preview(file,record)">{{ file.dipName }}</a>
        </div>
      </div>
      <div slot="operation" slot-scope="record">
        <div class="box">
          <a class="mr-5" @click="edit(record)">编辑</a>
          <a class="mr-5" @click="del(record)">删除</a>
          <a>打印送达回执</a>
        </div>
      </div></Table>
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
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      loading: false,
      fileList: [],
      columns: [
        {
          title: '送达方式',
          dataIndex: 'sendType',
          key: 'sendType',
          width: 100,
          align: 'center'
        },
        {
          title: '上门地址',
          dataIndex: 'address',
          key: 'address',
          width: 200
        },
        {
          title: '上门时间',
          dataIndex: 'sendDate',
          key: 'sendDate',
          width: 150
        },
        {
          title: '内容',
          dataIndex: 'diplomsList',
          key: 'diplomsList',
          scopedSlots: { customRender: 'diplomsList' },
          width: 250
        },
        {
          title: '上门情况',
          dataIndex: 'situation',
          key: 'situation',
          width: 150
        },
        {
          title: '送达回执',
          scopedSlots: { customRender: 'receiptFile' },
          width: 200
        },
        {
          title: '回执时间',
          dataIndex: 'receiveDate',
          key: 'receiveDate',
          width: 150
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
</style>
