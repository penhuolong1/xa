<template>
  <Modal
    v-model="visible"
    title="上门送达"
    class="modal"
    width="500px"
    :mask-closable="false"
    @cancel="visible=false"
  >
    <Form1 ref="form" :schema="schema" :label-col="8" :wrapper-col="14" @change="change" />
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
</template>
<script>
import { Modal, Button, Form, Checkbox } from 'ant-design-vue'
import { sendDiploms, editSendInfo, queryRelationLit, listLitDip } from '@/api/send/index.js'
import Form1 from '@/components/Form'
import { formatDate } from '@/utils/format.js'
import { addResstype } from '@/type/index.js'
import { mapGetters } from 'vuex'
const nowTime = formatDate(new Date(), 'YYYY-MM-DD H:m:s')
export default {
  components: {
    Modal,
    Form1,
    Checkbox,
    CheckboxGroup: Checkbox.Group,
    Button,
    FormItem: Form.Item
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
      sendFileList: [],
      title: '',
      nowTime: this.format(new Date(), 'YYYY-MM-DD h:m:s'),
      sendType: '',
      detailObj: {
        assignSender: false
      },
      isConcentrated: true, // 集中指派
      isAssign: false, // 是否本人送达
      isEdit: false,
      relationSend: false,
      connectList: [],
      sendFile: [],
      relationLitIds: [],
      type: null, // 3电子送达
      form: this.$form.createForm(this, { name: 'form' })
    }
  },
  computed: {
    ...mapGetters(['getLawCaseId']),
    schema() {
      return [
        {
          label: '受送达人',
          type: 'litigant',
          placeholder: '请选择受送达人',
          field: 'litigantId',
          disabled: this.isEdit,
          formOption: { rules: [{ required: true, message: '请选择受送达人' }], initialValue: this.detailObj?.litigantId || undefined }
        },
        {
          type: 'other',
          content: (
            <FormItem label='送达材料'>
              <CheckboxGroup vModel={this.sendFile}>
                {
                  this.sendFileList && this.sendFileList.length > 0 ? this.sendFileList.map(item => {
                    return (<div><Checkbox value={item.id}>
                      <a onclick={(e) => { this.preview(item, e) }}>{item.name}</a>
                    </Checkbox></div>)
                  }) : ''
                }
              </CheckboxGroup>
            </FormItem>
          ),
          vIf: () => {
            return !this.isEdit
          }
        },
        {
          type: 'other',
          content: (
            <FormItem label='送达材料'>
              <div class='send-file-wrapper'>{
                this.detailObj.diplomsList && this.detailObj.diplomsList.length > 0 ? this.detailObj.diplomsList.map(item => {
                  return (<div style='line-height:1.5;'>
                    <a onclick={(e) => { this.preview(item, e) }}>{item.dipName}</a>
                  </div>)
                }) : ''
              }</div>
            </FormItem>
          ),
          vIf: () => {
            return this.isEdit
          }
        },
        {
          label: '是否使用关联关系',
          type: 'radio',
          field: 'relationSend',
          options: [
            {
              value: true,
              label: '是'
            },
            {
              value: false,
              label: '否'
            }
          ],
          formOption: { rules: [{ required: true, message: '请选择是否使用关联关系' }], initialValue: false },
          vIf: () => {
            return !this.isEdit
          }
        },
        {
          type: 'other',
          content: (<FormItem label='关联关系'>
            <CheckboxGroup vModel={this.relationLitIds}>
              {
                this.connectList && this.connectList.length > 0 ? this.connectList.map(item => {
                  return (<Checkbox value={item.value}>{item.label}</Checkbox>)
                }) : ''
              }
            </CheckboxGroup>
          </FormItem>),
          vIf: () => {
            return this.relationSend
          }
        },
        {
          label: '上门地址',
          type: 'address',
          field: 'address',
          disabled: this.isEdit,
          isNoReset: this.isEdit,
          formOption: { rules: [{ required: true, message: '请选择上门地址' }], initialValue: this.detailObj?.address || undefined }
        },
        {
          label: '是否本人送达',
          type: 'radio',
          field: 'assignSender',
          options: [
            {
              value: true,
              label: '是'
            },
            {
              value: false,
              label: '否'
            }
          ],
          formOption: { rules: [{ required: true, message: '请选择指派上门送达员' }], initialValue: this.detailObj?.assignSender || false }
        },
        {
          label: '集中指派',
          type: 'radio',
          field: 'assignTogether',
          options: [
            {
              value: true,
              label: '是'
            },
            {
              value: false,
              label: '否'
            }
          ],
          formOption: { rules: [{ required: true, message: '请选择集中指派' }], initialValue: this.detailObj?.assignTogether },
          vIf: () => {
            return this.isAssign !== true
          }
        },
        {
          label: '上门时间',
          type: 'date',
          field: 'sendDate',
          showTime: true,
          formOption: { initialValue: this.detailObj?.sendDate || undefined },
          vIf: () => {
            return this.isAssign !== false
          }
        },
        {
          label: '上门情况',
          type: 'select',
          field: 'situation',
          options: [
            {
              value: '本人收',
              label: '本人收'
            },
            {
              value: '上门无人',
              label: '上门无人'
            }
          ],
          formOption: { initialValue: this.detailObj?.situation || undefined },
          vIf: () => {
            return this.isAssign !== false
          }
        },
        {
          label: '送达回执',
          type: 'upload',
          field: 'receiptFileIds',
          showType: 'filePath',
          showTypeId: 'fileId',
          action: '/api/court/receipt/uploadReceiptFile',
          vIf: () => {
            return this.isAssign !== false
          }
        },
        {
          label: '回执时间',
          type: 'date',
          field: 'receiveDate',
          showTime: true,
          disabled: this.isEdit,
          formOption: { rules: [{ required: true, message: '请选择发送时间' }], initialValue: this.detailObj?.receiveDate || nowTime },
          vIf: () => {
            return this.isAssign !== false
          }
        },
        {
          label: '送达人员',
          type: 'judge',
          field: 'sender',
          disabled: this.isEdit,
          formOption: { rules: [{ required: true, message: '请选择送达人员' }], initialValue: this.detailObj?.senderId },
          vIf: () => {
            return this.isConcentrated === false
          }
        },
        {
          label: '最迟完成时间',
          type: 'input',
          field: 'limitedDay',
          suffix: '天内',
          disabled: this.isEdit,
          formOption: { rules: [{ required: true, message: '请输入最迟完成时间' }], initialValue: this.detailObj?.limitedDay },
          vIf: () => {
            return this.isConcentrated === false
          }
        },
        {
          label: '送达结果',
          type: 'select',
          field: 'sendState',
          options: [
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
          formOption: { initialValue: this.detailObj?.state },
          vIf: () => {
            return this.isAssign !== false
          }
        },
        {
          label: '备注',
          type: 'textArea',
          field: 'remark',
          formOption: { initialValue: this.detailObj?.remark }
        }
      ]
    }
  },
  watch: {
    visible() {
      if (!this.visible && this.isEdit) {
        this.$refs.form.resetFields()
        this.detailObj = {}
      }
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    show(data) {
      this.isEdit = false
      this.isConcentrated = false
      this.isAssign = false
      if (data) {
        this.isEdit = true
        this.$store.commit('SET_LITIGANTID', data.litigantId)
        this.detailObj = { ...data }
        if (data.situation) { // 假如有上门情况说明是本人送达
          this.detailObj.assignSender = true
          this.isAssign = true
        }
        if (data.senderId) {
          this.detailObj.assignTogether = false
          this.isConcentrated = false
        } else {
          this.detailObj.assignTogether = false
          this.isConcentrated = true
        }
      }
      this.visible = true
    },
    onConfirm() {
      this.$refs.form.getFieldsValue().then(res => {
        const params = {
          ...res
        }
        params.sendType = '上门送达'
        params.sendProcess = this.sendProcess
        params.lawCaseId = this.getLawCaseId
        params.receiptFileIds = params.receiptFileIds && params.receiptFileIds.length > 0 ? params.receiptFileIds.map(item => item.id) : []
        params.dipIdList = this.sendFile
        if (params.relationSend) {
          params.relationLitIds = this.relationLitIds
        }
        sendDiploms(params).then(({ code, msg }) => {
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
        params.sendId = this.detailObj.sendId
        params.lawCaseId = this.getLawCaseId
        params.litigantId = res.litigantId
        params.sendType = '上门送达'

        params.remark = res.remark
        params.sendDate = res.sendDate
        params.situation = res.situation
        params.sendState = res.sendState
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
      this.$emit('delSendRecord', this.detailObj.sendId)
      this.visible = false
    },
    // 表单事件触发
    change(e) {
      if (e.field === 'litigantId') {
        this.visitRecived = e.value.visitRecived
        if (!e.value.litigantId) {
          return
        }
        queryRelationLit({ litigantId: e.value.litigantId }).then(({ code, data }) => {
          if (code === 200) {
            if (!data || data.length === 0) {
              return
            }
            this.connectList = data.map(item => {
              return {
                value: item.litId,
                label: `${item.caseNo}(${item.litName})`
              }
            })
          }
        })
        this.getSendFile(e.value.litigantId)
      }
      if (e.field === 'assignSender') {
        this.isAssign = e.value.assignSender
      }
      if (e.field === 'assignTogether') {
        this.isConcentrated = e.value.assignTogether
      }
      if (e.field === 'relationSend') {
        this.relationSend = e.value.relationSend
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
    }
  }
}
</script>

<style scoped lang="less">
.send-file-wrapper {
  padding-top: 10px;
}
.no-margin {
  margin: 0;
}
.btn {
  width: 90%;
}
</style>
