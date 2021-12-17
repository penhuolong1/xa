<template>
  <div>
    <Table
      :columns="columns1"
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
          <a class="mr-2.5" @click="edit(record)">编辑</a>
          <a @click="del(record)">删除</a>
        </div>
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
      isTable: true,
      fileList: [],
      loading: false,
      tabledata: [{
        index: 11
      }],
      columns1: [
        {
          title: '送达方式',
          dataIndex: 'sendType',
          key: 'sendType',
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
          title: '备注',
          dataIndex: 'remark',
          key: 'remark'
        },
        {
          title: '推送结果',
          dataIndex: 'state',
          key: 'state',
          customRender: (state) => {
            return state ? state.replace('送达', '推送') : ''
          },
          width: 100
        },
        {
          title: '送达时间',
          dataIndex: 'sendDate',
          key: 'sendDate',
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
  created() {
  },
  mounted() {
  },
  methods: {
    changePage() {},
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
  margin-bottom: 20px;
}
a{
  margin-right:10px
}
</style>
