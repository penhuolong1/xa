<template>
  <Modal
    v-model="visible"
    :title="title"
    class="modal"
    width="500px"
    :mask-closable="false"
    @cancel="visible=false"
  >
    <Form1 ref="form" :schema="schema" :wrapper-col="16" @change="change" />
    <template slot="footer">
      <Button @click="visible=false">
        取消
      </Button>
      <Button v-if="!isEdit" type="primary" :loading="loading" @click="onConfirm">
        确认
      </Button>
      <Button v-if="isEdit" type="primary" :loading="loading" @click="onEdit">
        编辑
      </Button>
      <Button v-if="title==='委托送达'" type="primary" :loading="loading1" @click="printEmail">
        打印邮单
      </Button>
      <Button v-if="isEdit" type="danger" @click="del">
        删除
      </Button>
    </template>
    <Preview ref="preview" :file-list="[]" />
  </Modal>
</template>
<script>
import { Modal, Button, Form, Checkbox } from 'ant-design-vue'
import { sendDiploms, editSendInfo, listLitDip, listCourt, printExpress } from '@/api/send/index.js'
import { queryLitInfo } from '@/api/addCase/index.js'
import { getPreviewUrl } from '@/api/common/index.js'
import Form1 from '@/components/Form'
import Preview from '@/components/Preview/index'
import { mapGetters } from 'vuex'
import mixin from './send.js'
import { browserKernel } from '@/utils/tools.js'
export default {
  components: {
    Modal,
    Form1,
    Preview,
    FormItem: Form.Item,
    Checkbox,
    CheckboxGroup: Checkbox.Group,
    Button
  },
  mixins: [mixin],
  props: {
    sendProcess: {
      type: Number,
      default: 1 // 1 诉前送达 2 庭前送达
    }
  },
  data() {
    return {
      visible: false,
      loading: false,
      title: '',
      detail: {},
      sendFileList: [],
      sendFile: [],
      courtList: [],
      courtName: undefined, // 委托方为法院的时候
      email: '',
      entrustInfo: {}, // 委托方信息
      entrustType: 1, // 委托类型 1 法院 2 其他
      isEdit: false,
      nowTime: this.format(new Date(), 'YYYY-MM-DD h:m:s'),
      sendType: '',
      litigantId: '', // 受送达人id
      type: null, // 3电子送达
      form: this.$form.createForm(this, { name: 'form' }),
      loading1: false
    }
  },
  computed: {
    ...mapGetters(['getLawCaseId'])
  },
  watch: {
    title() {
      this.$refs?.form?.resetFields()
    },
    visible() {
      if (!this.visible && this.isEdit) {
        this.$refs.form.resetFields()
        this.detail = {}
      }
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    show(title, data) {
      this.sendType = ''
      this.isEdit = false
      this.title = title
      if (data) {
        this.sendFileList =
        this.isEdit = true
        this.$store.commit('SET_LITIGANTID', data.litigantId)
        if (data.sendType === '短信送达' || data.sendType === '微信送达' || data.sendType === '邮件送达') {
          data.subSendType = data.sendType
          this.sendType = data.sendType
          data.sendType = '电子送达'
          this.title = '电子送达'
        }
        this.detail = { ...data }
        if (this.detail.otherDiplomsList && this.detail.otherDiplomsList.length > 0) {
          const list = this.detail.otherDiplomsList.map(item => {
            return {
              dipPath: item.otherDipPath,
              dipName: item.otherDipName
            }
          })
          this.detail.diplomsList = [...this.detail.diplomsList, ...list]
        }
        if (data.receiptFileList && data.receiptFileList.length) {
          this.detail.receiptFile = data.receiptFileList.map(item => {
            return {
              uid: item.receiptId,
              name: item.receiptName,
              url: item.receiptPath,
              ...item
            }
          })
        }
      }
      this.visible = true
    },
    onConfirm() {
      this.$refs.form.getFieldsValue().then(res => {
        const params = {
          ...res
        }
        if (this.title !== '电子送达') {
          params.sendType = this.title
        }
        params.sendProcess = this.sendProcess
        params.lawCaseId = this.getLawCaseId
        params.receiptFileIds = params.receiptFileIds && params.receiptFileIds.length > 0 ? params.receiptFileIds.map(item => item.id) : []
        params.dipIdList = this.sendFile
        sendDiploms(params).then(({ code, msg }) => {
          this.loading = false
          if (code === 200) {
            this.sendFileList = []
            this.sendFile = []
            this.$message.success(msg)
            this.$refs.form.resetFields()
            this.$emit('done')
            this.visible = false
          }
        })
      })
    },
    // 编辑
    onEdit() {
      this.$refs.form.getFieldsValue().then(res => {
        const params = {
        }
        params.sendId = this.detail.sendId
        params.lawCaseId = this.getLawCaseId
        params.litigantId = res.litigantId
        params.sendType = this.title
        const ary = this.schema.filter(item => !item.disabled).map(item => item.field)
        if (this.title === '电子送达') {
          params.remark = res.remark
          params.sendType = res.sendType
          params.sendState = res.sendState
          // params.dipIdList = this.sendFile
          // if (!params.dipIdList || params.dipIdList.length === 0) {
          //   this.$message.error('送达内容不能为空')
          //   return
          // }
        }
        if (this.title === '现场领取') {
          params.orderDate = res.orderDate
          params.remark = res.remark
          params.sendState = res.sendState
          params.receiptFileIds = res.receiptFileIds && res.receiptFileIds.length > 0 ? res.receiptFileIds.map(item => item.id) : []
        }
        if (this.title === '邮寄送达') {
          params.addressType = res.addressType
          params.expressNumber = res.expressNumber
          params.sendDate = res.sendDate
          params.situation = res.situation
          params.remark = res.remark
          params.sendState = res.sendState
        }
        if (this.title === '委托送达') {
          params.sendDate = res.sendDate
          params.expressNumber = res.expressNumber
          params.courtAddress = res.courtAddress
          params.situation = res.situation
          params.remark = res.remark
          params.sendState = res.sendState
        }
        if (this.title === '公告送达') {
          params.media = res.media
          params.payed = res.payed
          params.sendDate = res.sendDate
          params.situation = res.situation
          params.remark = res.remark
        }
        if (this.title === '推送内网') {
          params.remark = res.remark
        }
        editSendInfo(params).then(({ code, msg }) => {
          this.loading = false
          if (code === 200) {
            this.$message.success(msg)
            this.$refs.form.resetFields()
            this.$emit('done')
            this.visible = false
          }
        })
      })
    },
    del() {
      this.$emit('delSendRecord', this.detail.sendId)
      this.visible = false
    },
    // 获取法院送达地址
    getCourtList(name) {
      console.log(name)
      listCourt({ name: name }).then(({ code, data }) => {
        if (code === 200) {
          if (!data.rows && data.rows.length === 0) {
            this.courtList = []
            return
          }
          this.courtList = data.rows.splice(0, 50)
        }
      })
    },
    // 表单事件触发
    change(e) {
      console.log(e)
      if (e.field === 'sendType') {
        this.sendType = e.value.sendType
        this.getLitInfo()
      }
      if (e.field === 'litigantId') {
        this.getSendFile(e.value.litigantId)
        this.litigantId = e.value.litigantId
        this.getLitInfo()
      }
      if (e.field === 'entrustType') {
        this.entrustType = e.value.entrustType
      }
    },
    getSendFile(id) {
      if (!id) {
        this.sendFileList = []
        return
      }
      listLitDip({ litigantId: id }).then(({ code, data }) => {
        if (code === 200) {
          this.sendFileList = data
        }
      })
    },
    // 搜索委托法院
    handleSearch(e) {
      this.getCourtList(e)
    },
    preview(item, e) {
      e.preventDefault() // 阻止默认发生的事情
      e.stopPropagation()
      this.$refs.preview.show(item.path || item.dipPath, [])
    },
    // 邮件送达的时候获取邮箱号码
    getLitInfo() {
      if (this.sendType === '邮件送达' && this.litigantId) {
        const params = {
          litigantId: this.litigantId
        }
        queryLitInfo(params).then(({ code, data }) => {
          if (code === 200) {
            this.email = data.email
          }
        })
      }
    },
    // 选择委托的法院
    changeCourt(e) {
      if (e) {
        this.entrustInfo = this.courtList.find(item => {
          return item.name === e
        })
      } else {
        this.entrustInfo = {}
      }
    },
    // 打印邮单
    printEmail() {
      this.$refs.form.getFieldsValue().then(res => {
        const params = {
          courtName: res.courtName,
          courtAddress: res.courtAddress,
          courtPhone: res.courtPhone,
          entrustAddressee: res.entrustAddressee,
          sendDate: res.sendDate
        }
        params.lawCaseId = this.getLawCaseId
        this.loading1 = true
        printExpress(params).then(({ code, msg, data }) => {
          this.loading1 = false
          if (code === 200) {
            this.sendFileList = []
            this.sendFile = []
            this.$message.success(msg)
            this.$refs.form.resetFields()
            this.$emit('done')
            this.visible = false
            if (browserKernel() === 'IE') { // ie的话用插件打开pdf
              getPreviewUrl(data.path).then(res => {
                console.log(res)
              })
            } else {
              window.open(data.path)
            }
          }
        })
      })
    }
  }
}
</script>

<style scoped lang="less">
.no-margin {
  margin: 0;
}
.send-file-wrapper {
  padding-top: 10px;
}
.btn {
  width: 90%;
}
/deep/.ant-modal-body{
  max-height: 500px;
  overflow: auto;
}
</style>
