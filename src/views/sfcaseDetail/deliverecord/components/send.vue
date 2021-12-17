<template>
  <div>
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
        <Button v-if="isEdit" type="danger" @click="del">
          删除
        </Button>
      </template>
    </Modal>
    <Document ref="documentShow" @selectedBox="getFile" />
    <Preview ref="preview" :file-list="casefileList" />
  </div>
</template>
<script>
import { Modal, Button, Form, Checkbox, Divider, Icon } from 'ant-design-vue'
import { sendDiploms, editSendInfo, listLitDip } from '@/api/send/index.js'
import { editSend } from '@/api/freeze/index.js'
import Form1 from '@/components/Form'
import { formatDate } from '@/utils/format.js'
import Preview from '@/components/Preview/index'
import { addResstype } from '@/type/index.js'
import { mapGetters } from 'vuex'
import Document from './document.vue'
const nowTime = formatDate(new Date(), 'YYYY-MM-DD H:m:s')
const expressSituation = [ // k快递邮寄情况
  {
    value: '本人签收',
    label: '本人签收'
  },
  {
    value: '他人签收',
    label: '他人签收'
  },
  {
    value: '退回',
    label: '退回'
  }
]
export default {
  components: {
    Modal,
    Form1,
    FormItem: Form.Item,
    Checkbox,
    CheckboxGroup: Checkbox.Group,
    Button,
    Document,
    Icon,
    Preview
  },
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
      caseFile: [], // 获取到的文书pdf
      sendFileList: [],
      sendFile: [],
      casefileList: [], // 预览文书
      isEdit: false,
      nowTime: this.format(new Date(), 'YYYY-MM-DD h:m:s'),
      sendType: '',
      type: null, // 3电子送达
      form: this.$form.createForm(this, { name: 'form' }),
      fileIds: []
    }
  },
  computed: {
    ...mapGetters(['getSfLawCaseId']),
    schema() {
      return [
        {
          label: '受送达人',
          type: 'litigant',
          placeholder: '请选择受送达人',
          field: 'litigantId',
          disabled: this.isEdit,
          formOption: { rules: [{ required: true, message: '请选择受送达人' }], initialValue: this.detail?.litigantId || undefined }
        },
        // 电子送达
        {
          label: '送达方式',
          type: 'select',
          field: 'sendType',
          disabled: this.isEdit,
          formOption: { rules: [{ required: true, message: '请选择送达类型' }], initialValue: this.detail?.subSendType || undefined },
          options: [
            {
              value: '1',
              label: '短信送达'
            },
            // {
            //   value: '微信送达',
            //   label: '微信送达'
            // },
            {
              value: '2',
              label: '邮件送达'
            },
            {
              value: '3',
              label: '微信送达'
            },
            {
              value: '4',
              label: '现场领取'
            }
          ],
          vIf: () => {
            return this.title === '电子送达'
          }
        },
        {
          type: 'other',
          content: (
            <FormItem label='发送内容'>
              <Button type='primary' onclick={this.chooseDocument}>选择</Button>
              {this.caseFile && this.caseFile.length ? this.caseFile.map(item => {
                return (
                  <div class='fileDel'>
                    <a onclick={() => this.preview(item)} class='file-name'>{item.name}</a>
                    <Icon onclick={() => { this.delFile(item) }} type='delete'></Icon>

                  </div>
                )
              }) : ''}
            </FormItem>
          )
        },
        {
          label: '发送号码',
          type: 'phoneList',
          field: 'goal',
          disabled: this.isEdit,
          isNoReset: this.isEdit,
          formOption: { rules: [{ required: true, message: '请选择发送号码' }], initialValue: this.detail?.phone || undefined },
          vIf: () => {
            return this.sendType === '短信送达'
          }
        },
        {
          label: '电子邮箱',
          type: 'input',
          field: 'goal',
          disabled: this.isEdit,
          formOption: { rules: [{ required: true, message: '请输入电子邮箱' }], initialValue: this.detail?.email || undefined },
          vIf: () => {
            return this.sendType === '邮件送达'
          }
        },
        {
          label: '发送时间',
          type: 'date',
          field: 'sendTime',
          showTime: true,
          disabled: this.isEdit,
          formOption: { rules: [{ required: true, message: '请选择邮寄时间' }], initialValue: this.detail?.sendDate || undefined },
          vIf: () => {
            return this.title === '电子送达'
          }
        },
        // 现场领取
        {
          label: '预约时间',
          type: 'date',
          field: 'orderDate',
          showTime: true,
          formOption: { rules: [{ required: true, message: '请选择预约时间' }], initialValue: this.detail?.orderDate || undefined },
          vIf: () => {
            return this.title === '现场领取'
          }
        },
        {
          label: '送达回执',
          type: 'upload',
          field: 'receiptFileIds',
          showType: 'filePath',
          fileList: this.detail?.receiptFile || [],
          showTypeId: 'fileId',
          action: '/api/court/receipt/uploadReceiptFile',
          vIf: () => {
            return this.title === '现场领取'
          }
        },
        {
          label: '发送时间',
          type: 'date',
          field: 'sendTime',
          showTime: true,
          formOption: { rules: [{ required: true, message: '请选择发送时间' }], initialValue: nowTime },
          vIf: () => {
            const list = ['现场领取', '邮寄送达', '上门送达', '委托送达', '公告送达']
            return list.find(item => item === this.title) === -1
          }
        },
        {
          label: '发送内容',
          type: 'checkbox',
          field: 'fileIds',
          formOption: { rules: [{ required: true, message: '请选择发送内容' }] },
          vIf: () => {
            const list = ['现场领取', '邮寄送达', '上门送达', '委托送达', '公告送达']
            return list.find(item => item === this.title) === -1
          }
        },
        {
          label: '送达结果',
          type: 'select',
          field: 'result',
          options: [
            {
              value: 0,
              label: '送达中'
            },
            {
              value: 1,
              label: '送达成功'
            },
            {
              value: 2,
              label: '送达失败'
            },
            {
              value: 3,
              label: '未送达'
            }
          ],
          formOption: { initialValue: this.detail?.state },
          vIf: () => {
            return this.title !== '公告送达'
          }
        },
        {
          label: '备注',
          type: 'textArea',
          field: 'remark',
          formOption: { initialValue: this.detail?.remark || undefined }
        }
      ]
    }
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
        this.isEdit = true
        this.$store.commit('SET_LITIGANTID', data.litigantId)
        if (data.sendType === '短信送达' || data.sendType === '微信送达' || data.sendType === '邮件送达') {
          data.subSendType = data.sendType
          this.sendType = data.sendType
          data.sendType = '电子送达'
          this.title = '电子送达'
        }
        this.detail = { ...data }
      }
      this.visible = true
    },
    onConfirm() {
      this.$refs.form.getFieldsValue().then(res => {
        const params = {
          ...res
        }
        delete params.sendType
        // if (this.title == '电子送达') {
        params.type = this.sendType
        // params.lawCaseId = this.getSfLawCaseId
        params.fileIds = this.fileIds && this.fileIds > 0 ? this.fileIds : []
        console.log(params)
        editSend(params).then(({ code, msg }) => {
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
    // 编辑
    onEdit() {
      this.$refs.form.getFieldsValue().then(res => {
        const params = {
        }
        params.sendId = this.detail.sendId
        params.lawCaseId = this.getSfLawCaseId
        params.litigantId = res.litigantId
        params.sendType = this.title
        const ary = this.schema.filter(item => !item.disabled).map(item => item.field)
        if (this.title === '电子送达') {
          params.remark = res.remark
          params.sendType = res.sendType
          params.sendState = res.sendState
          params.dipIdList = this.sendFile
          if (!params.dipIdList || params.dipIdList.length === 0) {
            this.$message.error('送达内容不能为空')
            return
          }
        }
        if (this.title === '现场领取') {
          params.orderDate = res.orderDate
          params.remark = res.remark
          params.sendState = res.sendState
          params.receiptFileIds = params.receiptFileIds && params.receiptFileIds.length > 0 ? params.receiptFileIds.map(item => item.id) : []
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
    // 表单事件触发
    change(e) {
      if (e.field === 'sendType') {
        this.sendType = e.value.sendType
      }
      if (e.field === 'litigantId') {
        this.getSendFile(e.value.litigantId)
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
    preview(item) {
      console.log(item)
      this.casefileList = []
      this.$refs.preview.show(item.path, this.casefileList)
    },
    chooseDocument() {
      this.$refs.documentShow.show(this.getSfLawCaseId)
    },
    getFile(e) {
      this.caseFile = e
      this.fileIds = []
      this.caseFile.map(item => {
        this.fileIds.push(item.id)
      })
      console.log(this.fileIds)
    },
    delFile(item) {
      console.log(item)
      this.$confirm({
        title: '是否删除该条文书信息',
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          this.caseFile.splice(item, 1)
          this.fileIds = []
          this.caseFile.map(item => {
            this.fileIds.push(item.id)
          })
          console.log(this.fileIds)
        },
        onCancel() {}
      })
    }
  }
}
</script>

<style scoped lang="less">
.no-margin {
  margin: 0;
}
.btn {
  width: 90%;
}
.file-name {
  display: block;
  #ellipsis();
}
.fileDel{
  display:flex;
  align-items: center;
}
</style>
