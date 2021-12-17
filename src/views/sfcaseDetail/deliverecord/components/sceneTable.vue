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
      <div v-if="record&&record.length>0" slot="materialFileList" slot-scope="record">
        <div v-for="(item,index) in record" :key="index">
          <a @click="preview(item.filePath)">{{ item.fileName }}</a>
          <br>
        </div>
      </div>
      <div slot="sendFileList" slot-scope="record">
        <div v-for="item in record" :key="item.id">
          <a @click="preview(item.filePath)">{{ item.fileName }}</a>
        </div>
      </div>
    </Table>
    <Preview ref="preview" :file-list="fileList" />
    <Scene ref="sceneShow" :is-edit="isEdit" @refresh="refresh" />
  </div>
</template>
<script>
import { Table } from 'ant-design-vue'
import Preview from '@/components/Preview/index'
import Scene from './scene.vue'
import moment from 'moment'
import { sfdelSend } from '@/api/freeze/index.js'

export default {
  components: {
    Table,
    Preview,
    Scene
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
      isTable: true,
      fileList: [],
      loading: false,
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
      isEdit: false,
      columns: [
        {
          title: '送达方式',
          dataIndex: 'type',
          key: 'type',
          width: 100
        },
        {
          title: '领取时间',
          dataIndex: 'sendTime',
          key: 'sendTime',
          width: 150
        },
        {
          title: '送达回执',
          dataIndex: 'materialFileList',
          key: 'materialFileList',
          scopedSlots: { customRender: 'materialFileList' },
          width: 200
        },
        {
          title: '回执时间',
          dataIndex: 'receiptTime',
          key: 'receiptTime',
          width: 200
        },
        {
          title: '文书内容',
          dataIndex: 'sendFileList',
          key: 'sendFileList',
          scopedSlots: { customRender: 'sendFileList' },
          width: 250
        },
        {
          title: '送达结果',
          dataIndex: 'result2',
          key: 'result2',
          // scopedSlots: { customRender: 'diplomsList' },
          width: 250
        },
        {
          title: '送达人员',
          dataIndex: 'userName',
          key: 'userName',
          // scopedSlots: { customRender: 'diplomsList' },
          width: 250
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'operation' },
          width: 150
        }
      ],
      tabledata: []
    }
  },
  watch: {
    list() {
      this.getList()
    }
  },
  created() {
    console.log(this.item)
  },
  mounted() {
    // this.getList()
    this.getList()
  },
  methods: {
    refresh() {
      this.$emit('refresh')
    },
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
    edit(record) {
      console.log(record)
      this.isEdit = true
      this.$refs.sceneShow.show(record)
      // this.getList()
    },
    // 预览
    preview(file, record) {
      this.fileList = []
      this.$refs.preview.show(file, [])
    },
    // 获取表单数据
    getList() {
      // this.$emit('refresh')
      const [...list] = this.list
      if (list && list.length > 0) {
        this.tabledata = list.filter(item => item.type === 4).map(item => {
          item.sendTime ? moment(item.sendTime).format('YYYY-MM-DD HH:mm:ss') : ''
          item.receiptTime ? moment(item.receiptTime).format('YYYY-MM-DD HH:mm:ss') : ''
          item.updateTime ? moment(item.updateTime).format('YYYY-MM-DD HH:mm:ss') : ''
          item.type = this.sendStatus[item.type]
          item.result2 = this.sendResult[item.result]
          return item
        })
      }
      if (this.tabledata && this.tabledata.length > 0) {
        this.show = true
      } else {
        this.show = false
      }
      console.log(this.tabledata)
    }
  }
}
</script>

<style scoped lang="less">
a{
  margin-right:10px
}
</style>
