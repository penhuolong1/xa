<template>
  <div>
    <Table
      v-if="show"
      :columns="columns"
      :data-source="tabledata"
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
      <div slot="sendFileList" slot-scope="record">
        <div v-for="item in record" :key="item.id">
          <a @click="preview(item.filePath)">{{ item.fileName }}</a>
        </div>
      </div>
    </Table>
    <Preview ref="preview" :file-list="fileList" />
    <!-- <Edit ref="editShow" @refresh="getList" /> -->
    <EleSend ref="eleSendShow" :is-edit="isEdit" @refresh="refresh" />
  </div>
</template>
<script>
import { Table } from 'ant-design-vue'
import Preview from '@/components/Preview/index'
import moment from 'moment'
import { sfdelSend } from '@/api/freeze/index.js'
import Edit from './edit.vue'
import EleSend from './eleSend.vue'
export default {
  components: {
    Table,
    // Edit,
    Preview,
    EleSend
  },
  props: {
    list: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      show: true,
      fileList: [],
      loading: false,
      isEdit: false,
      tabledata: [],
      columns: [
        {
          title: '送达方式',
          dataIndex: 'type2',
          key: 'type2',
          width: 100
        },
        {
          title: '发送号码',
          dataIndex: 'goal',
          key: 'goal',
          width: 150
        },
        {
          title: '发送时间',
          dataIndex: 'sendTime',
          key: 'sendTime',
          width: 200
        },
        {
          title: '发送内容',
          dataIndex: 'content',
          key: 'content',
          // scopedSlots: { customRender: 'diplomsList' },
          width: 250
        },
        {
          title: '文书内容',
          dataIndex: 'sendFileList',
          key: 'sendFileList',
          scopedSlots: { customRender: 'sendFileList' },
          width: 250
        },
        // {
        //   title: '材料',
        //   dataIndex: 'materialFileList',
        //   key: 'materialFileList',
        // scopedSlots: { customRender: 'diplomsList' },
        // width: 250
        // },
        {
          title: '回执信息',
          dataIndex: 'receipt',
          key: 'receipt',
          // scopedSlots: { customRender: 'sendFileList' },
          width: 100
        },
        {
          title: '回执时间',
          dataIndex: 'receiptTime',
          key: 'receiptTime',
          width: 200
        },
        {
          title: '送达结果',
          dataIndex: 'result2',
          key: 'result2',
          width: 100
        },
        {
          title: '发送状态',
          dataIndex: 'state',
          key: 'state',
          width: 150
        },
        {
          title: '送达人员',
          dataIndex: 'userName',
          key: 'userName',
          width: 150
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'operation' },
          width: 150
        }
      ],
      ids: [],
      tabeldata: [],
      // 送达方式转换
      sendStatus: {
        1: '短信送达',
        2: '邮件送达',
        3: '小程序送达',
        4: '现场领取'
      },
      sendResult: {
        0: '送达中',
        1: '送达成功',
        2: '送达失败',
        3: '未送达'
      },
      sendState: { // 发送状态
        0: '发送中',
        1: '发送成功',
        2: '发送失败'

      }

    }
  },
  watch: {
    list() {
      this.getList()
    }
  },
  created() {

  },
  mounted() {
    this.getList()
  },
  methods: {
    del(record) {
      this.$confirm({
        title: '是否删除该送达记录',
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          this.ids = []
          this.ids.push(record.id)
          const params = {
            ids: this.ids
          }
          sfdelSend(params).then(({ code, msg }) => {
            if (code === 200) {
              this.$message.success(msg)
              this.$emit('refresh')
              this.getList()
            }
          })
        },
        onCancel() {}
      })
    },
    refresh() {
      this.$emit('refresh')
    },
    edit(record) {
      this.isEdit = true
      this.$refs.eleSendShow.show(record)
      // this.refs.editShow.show(record)
    },
    // 预览
    preview(file, record) {
      this.fileList = []
      this.$refs.preview.show(file || file.dipPath, [])
    },
    getList() {
      // this.$emit('refresh')
      const list = [...this.list]
      if (!list || list.length === 0) {
        return
      }
      this.tabledata = []
      this.tabledata = list.filter(item => item.type != 4).map(item => {
        item.sendTime ? moment(item.sendTime).format('YYYY-MM-DD HH:mm:ss') : ''
        item.receiptTime ? moment(item.receiptTime).format('YYYY-MM-DD HH:mm:ss') : ''
        item.updateTime ? moment(item.updateTime).format('YYYY-MM-DD HH:mm:ss') : ''
        item.type2 = this.sendStatus[item.type]
        item.state = this.sendState[item.state]
        item.result2 = this.sendResult[item.result]
        console.log(item.result)
        return item
      })
      if (this.tabledata && this.tabledata.length > 0) {
        this.show = true
      } else {
        this.show = false
      }
    }

  }
}
</script>

<style scoped lang="less">
a{
  margin-right:10px
}
</style>
