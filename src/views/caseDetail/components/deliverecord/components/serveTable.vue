<template>
  <div>
    <Table
      :columns="columns"
      :data-source="[item]"
      :row-key="(record,index)=>{return index}"
      :scroll="{x: 1400}"
      :loading="loading"
      :pagination="false"
    >
      <div slot="diplomsList" slot-scope="record">
        <div v-for="file in record" :key="file.id">
          <a class="mr-5" @click="preview(file,record)">{{ file.dipName }}</a>
        </div>
      </div>
      <div slot="operation" slot-scope="record">
        <div class="box">
          <a @click="edit(record)">编辑</a>
          <a @click="del(record)">删除</a>
        </div>
        <!-- <div class="box">
          <a>委托稿</a>
          <a>委托函</a>
        </div>
        <a>打印委托稿</a> -->
      </div>
      <div slot="receiptFile" slot-scope="record">
        <a v-for="file in record.receiptFileList" :key="file.id" class="mr-5" @click="preview(file,record)">{{ file.receiptName }}</a>
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
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      fileList: [],
      loading: false,
      columns: [
        {
          title: '送达方式',
          dataIndex: 'sendType',
          key: 'sendType',
          width: 100
        },
        {
          title: '委托送达地址',
          dataIndex: 'address',
          key: 'address',
          width: 150
        },
        {
          title: '受托法院',
          dataIndex: 'court',
          key: 'court',
          width: 100
        },
        {
          title: '内容',
          dataIndex: 'diplomsList',
          key: 'diplomsList',
          scopedSlots: { customRender: 'diplomsList' },
          width: 250
        },
        {
          title: '受托法院地址',
          dataIndex: 'courtAddress',
          key: 'courtAddress',
          width: 150
        },
        {
          title: '邮寄时间',
          dataIndex: 'sendDate',
          key: 'sendDate',
          width: 150
        },

        {
          title: '邮寄单号',
          dataIndex: 'expressNumber',
          key: 'expressNumber',
          width: 100
        },
        {
          title: '邮寄情况',
          dataIndex: 'situation',
          key: 'situation',
          width: 100
        },
        {
          title: '送达回执',
          scopedSlots: { customRender: 'receiptFile' },
          width: 150
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
.box{
  margin-bottom: 10px;
}
a{
  margin-right:10px
}
</style>
