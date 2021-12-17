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
        <a class="mr-2.5" @click="edit(record)">编辑</a>
        <a class="mr-2.5" @click="del(record)">删除</a>
        <!-- <a class="mr-2.5">公告稿</a>
        <a class="mr-2.5">公告函</a>
        <a>打印委托稿</a> -->
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
      columns: [
        {
          title: '送达方式',
          dataIndex: 'sendType',
          key: 'sendType',
          width: 100
        },
        {
          title: '开庭时间',
          dataIndex: 'schedulingDate',
          key: 'schedulingDate',
          width: 200
        },
        {
          title: '内容',
          dataIndex: 'diplomsList',
          key: 'diplomsList',
          scopedSlots: { customRender: 'diplomsList' },
          width: 250
        },
        {
          title: '发布媒体',
          dataIndex: 'media',
          key: 'media',
          width: 100
        },
        {
          title: '当事人是否缴费',
          dataIndex: 'payed',
          key: 'payed',
          width: 100
        },
        {
          title: '发布时间',
          dataIndex: 'sendDate',
          key: 'sendDate',
          width: 200
        },
        {
          title: '发布状态',
          dataIndex: 'situation',
          key: 'situation',
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
