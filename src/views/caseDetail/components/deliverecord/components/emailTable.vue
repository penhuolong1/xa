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
      <div slot="expressNumber" slot-scope="record">
        <div v-if="record.expressNumber">
          <div>
            <div>{{ record.expressNumber }}</div>
            <a @click="getDetail(record)">物流详情</a>
          </div>
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
    <Modal
      title="物流详情"
      :visible="visible"
      :mask-closable="false"
      @cancel="visible = false"
    >
      <div id="printMe" class="content">
        <span v-html="content" />
      </div>
      <div slot="footer" class="footer">
        <Button @click="visible = false">
          取消
        </Button>
        <Button v-print="'#printMe'" type="primary">
          打印
        </Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import { Table, Modal, Button } from 'ant-design-vue'
import Preview from '@/components/Preview/index'
import { addResstype } from '@/type/index.js'

export default {
  components: {
    Table,
    Preview,
    Modal,
    Button
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
      visible: false,
      fileList: [],
      content: '', // 物流信息
      columns: [
        {
          title: '送达方式',
          dataIndex: 'sendType',
          key: 'sendType',
          width: 100
        },
        {
          title: '邮寄地址',
          dataIndex: 'address',
          key: 'address',
          width: 200
        },
        {
          title: '地址类型',
          dataIndex: 'addressType',
          key: 'addressType',
          customRender: (text, row, index) => {
            const label = addResstype.find(item => item.value === text).label
            const obj = {
              children: label,
              attrs: {}
            }
            return obj
          },
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
          title: '邮寄号码',
          dataIndex: 'phone',
          key: 'phone',
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
          scopedSlots: { customRender: 'expressNumber' },
          width: 150
        },
        {
          title: '邮寄情况',
          dataIndex: 'situation',
          key: 'situation',
          width: 100
        },
        {
          title: '送达回执',
          dataIndex: 'receiptStatus',
          key: 'receiptStatus',
          width: 200
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
    },
    // 查看详情
    getDetail(e) {
      console.log(e)
      if (!e.content) {
        this.$message.error('暂无详情信息')
        return
      }
      this.content = e.content.split(';').join('</br>')
      this.visible = true
    }
  }
}
</script>

<style scoped lang="less">
</style>
