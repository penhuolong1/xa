<template>
  <Modal
    v-model="visible"
    title="电话通知"
    class="modal"
    width="500px"
    :mask-closable="false"
    @cancel="visible=false"
  >
    <Form1 ref="form" :schema="schema" :wrapper-col="15" @change="change" />
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
import { relation, callState } from '@/type/index.js'
import { sendDiploms, editSendInfo, queryRelationLit } from '@/api/send/index.js'
import { mapGetters } from 'vuex'
import { formatDate } from '@/utils/format.js'

import Audio from '@/components/Audio/index.vue'
import Phone from './phone.vue'
import Form1 from '@/components/Form'
const nowTime = formatDate(new Date(), 'YYYY-MM-DD H:m:s')

export default {
  components: {
    Modal,
    Form1,
    Audio,
    phoneVisible: false,
    Phone,
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
      detail: {},
      connectList: [],
      isEdit: false,
      relationSend: false,
      visitRecived: true,
      relationLitIds: [],
      phone: '',
      phoneType: null, // 电话类型，1为当事人2为代理人
      phoneNums: null, // 需要拨打的电话号码
      phoneUid: null, // 打电话的当事人id
      type: 1, // 1 账号密码登陆 2短信验证码登陆
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
          field: 'litigantId',
          disabled: this.isEdit,
          formOption: { rules: [{ required: true, message: '请选择受送达人' }], initialValue: this.detail?.litigantId || undefined }
        },
        {
          label: '使用关联关系',
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
          formOption: { rules: [{ required: true, message: '请选择关联关系' }], initialValue: false },
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
          label: '呼叫号码',
          type: 'phoneList',
          field: 'phone',
          isNoReset: this.isEdit,
          isNeedCall: true,
          disabled: this.isEdit,
          formOption: { rules: [{ required: true, message: '请选择呼叫号码' }], initialValue: this.detail?.phoneRecord?.phone || undefined }
        },
        {
          label: '与当事人关系',
          type: 'select',
          field: 'relation',
          options: relation,
          formOption: { initialValue: this.detail?.phoneRecord?.relation || '本人' }
        },
        {
          label: '呼叫时间',
          type: 'date',
          showTime: true,
          field: 'callTime',
          disabled: this.isEdit,
          formOption: { rules: [{ required: true, message: '请选择呼叫时间' }], initialValue: this.detail?.phoneRecord?.callTime || nowTime }
        },
        {
          type: 'other',
          content: (<FormItem label='呼叫记录'>
            <Audio ref='audio' phone={this.phone}></Audio>
          </FormItem>)
        },
        {
          label: '通话情况',
          type: 'select',
          field: 'callState',
          formOption: { rules: [{ required: true, message: '请选择通话情况' }], initialValue: this.detail?.phoneRecord?.callState || '本人接听' },
          options: callState
        },
        {
          label: '备注',
          type: 'textArea',
          field: 'remark',
          formOption: { initialValue: this.detail?.remark || undefined }
        },
        {
          label: '送达结果',
          type: 'select',
          field: 'sendState',
          disabled: this.isEdit,
          formOption: { rules: [{ required: true, message: '请选择送达结果' }], initialValue: this.detail?.state },
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
          ]
        },
        {
          label: '是否来院领取',
          type: 'radio',
          field: 'visitRecived',
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
          formOption: { initialValue: this.detail?.visitRecived || true }
        },
        {
          label: '预约领取时间',
          type: 'date',
          showTime: true,
          field: 'orderDate',
          formOption: { rules: [{ required: true, message: '请选择预约领取时间' }], initialValue: this.detail?.orderDate || undefined },
          vIf: () => {
            return this.visitRecived
          }
        }
      ]
    }
  },
  watch: {
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
    show(data) {
      this.isEdit = false
      this.$refs.audio && this.$refs.audio.reset()
      if (data) {
        this.isEdit = true
        this.$store.commit('SET_LITIGANTID', data.litigantId)
        this.detail = { ...data }
        this.$nextTick(() => {
          this.$refs.audio.setData(data.phoneRecord.path)
        })
      }
      this.visible = true
    },
    onConfirm() {
      this.$refs.form.getFieldsValue().then(res => {
        const params = {
          ...res
        }
        params.sendProcess = this.sendProcess
        params.sendType = '电话通知'
        params.lawCaseId = this.getLawCaseId
        params.callFile = this.$refs.audio.url
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
          } else {
            this.$refs.form.resetPhoneCode()
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
        params.sendType = '电话通知'
        params.lawCaseId = this.getLawCaseId
        params.litigantId = res.litigantId
        params.callFile = this.$refs.audio.url
        const ary = this.schema.filter(item => !item.disabled).map(item => item.field)
        ary.forEach(item => {
          params[item] = res[item]
        })
        editSendInfo(params).then(({ code, msg }) => {
          this.loading = false
          if (code === 200) {
            this.$message.success(msg)
            this.$refs.form.resetFields()
            this.$emit('done')
            this.visible = false
          } else {
            this.$refs.form.resetPhoneCode()
          }
        })
      })
    },
    // 打电话
    call(id, phoneNums, row) {
      console.log(id, phoneNums, row)
      this.phoneNums = parseInt(phoneNums)
      this.phoneType = row.type
      this.phoneUid = id
      this.phoneVisible = true
    },
    // val 从子组件中获取到的值
    onChildValue(val) {
      this.Phoneremark = val.Phoneremark
      this.isAnswer = val.isAnswer
      this.noAnswerReason = val.noAnswerReason
    },
    del() {
      this.$emit('delSendRecord', this.detail.sendId)
      this.visible = false
    },
    // 预约领取时间
    change(e) {
      console.log(e)
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
      }
      if (e.field === 'phone') {
        this.phone = e.value.phone
      }
      if (e.field === 'visitRecived') {
        this.visitRecived = e.value.visitRecived
      }
      if (e.field === 'relationSend') {
        this.relationSend = e.value.relationSend
      }
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
</style>
