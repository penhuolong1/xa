<template>
  <div>
    <Modal
      v-model="check"
      title="复核"
      width="900px"
      :mask-closable="false"
    >
      <template slot="footer">
        <Button key="back" @click="closeModal">
          取消
        </Button>
        <Button key="submit" type="primary" :loading="loading" @click="checkConfirm">
          确定
        </Button>
      </template>
      <Form :form="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
        <FormItem
          label="下一流程"
        >
          <Select
            v-decorator="['nextProcess',
                          { rules: [{ required: true,message:'请选择复核类型'}],initialValue:backfill.nextProcess }] "
            @change="changeProcess"
          >
            <SelectOption value="待庭室确认">待庭室确认</SelectOption>
            <SelectOption value="立案后调解">立案后调解</SelectOption>
            <SelectOption value="结案">结案</SelectOption>
          </Select>
        </FormItem>
        <div v-if="type==1">
          <FormItem
            label="移交原因"
          >
            <Select
              v-decorator="['condition',{ rules: [{ required: false}],initialValue:backfill.caseCondition }] "
            >
              <SelectOption v-for="item in selectList1" :key="item.value">{{ item.value }}</SelectOption>
            </Select>
          </FormItem>
          <FormItem
            label="建议开庭时间"
          >
            <DatePicker
              v-decorator="['suggestCourtTime',{ rules: [{ required: false}],initialValue:backfill.suggestCourtTime }] "
              show-time
              value-format="YYYY-MM-DD HH:mm:ss"
              @change="changeTime"
            />
          </FormItem>
          <Tribunal
            label="开庭地点"
            field="mediatePlaceId"
            :type="1"
            :form-option="{ rules: [{ required: false}],initialValue:backfill.mediatePlace }"
            @change="changePlace"
          />
          <FormItem
            label="送达完成时间"
          >
            <DatePicker
              v-decorator="['sendFinishTime',{ rules: [{ required: true,message:'请选择送达完成时间'}],initialValue:backfill.sendFinishTime }] "
              show-time
              value-format="YYYY-MM-DD HH:mm:ss"
            />
          </FormItem>
        </div>
        <div v-if="type==2">
          <FormItem
            label="预约调解时间"
          >
            <DatePicker
              v-decorator="['preMediateTime',{ rules: [{ required: false}],initialValue:backfill.preMediateTime }] "
              value-format="YYYY-MM-DD HH:mm:ss"
              show-time
            />
          </FormItem>
          <Tribunal
            label="调解地点"
            :type="2"
            field="mediatePlaceId"
            :form-option="{ rules: [{ required: false}],initialValue:backfill.mediatePlace }"
            @change="changePlace"
          />
          <FormItem
            label="送达完成时间"
          >
            <DatePicker
              v-decorator="['sendFinishTime', { rules: [{ required: true,message:'请选择送达完成时间'}],initialValue:backfill.sendFinishTime }] "
              value-format="YYYY-MM-DD "
              show-time
            />
          </FormItem>
        </div>
        <div v-if="type==3">
          <FormItem label="处理情况">
            <Select
              v-decorator="['condition', { rules: [{ required: true,message:'请选择处理情况'}],initialValue:backfill.caseCondition }] "
            >
              <SelectOption value="判决">判决</SelectOption>
              <SelectOption value="调解">调解</SelectOption>
              <SelectOption value="撤诉">撤诉</SelectOption>
            </Select>
          </FormItem>
          <FormItem
            label="结案日期"
          >
            <DatePicker
              v-decorator="['finishCaseTime',{ rules: [{ required: true,message:'请选择处理情况'}],initialValue:backfill.sendFinishTime }] "
              value-format="YYYY-MM-DD HH:mm:ss"
              show-time
            />
          </FormItem>
        </div>
        <FormItem label="备注">
          <TextArea
            v-decorator="['remark',{ rules: [{ required: false,message:'请填写备注'}],
                                     initialValue:backfill.remark }]"
          />
        </FormItem>
        <FormItem v-if="type==1" label="是否短信通知">
          <RadioGroup v-decorator="['notificationLitigant', { rules: [{ required: false}],initialValue:true }] " @change="changeNotice">
            <Radio label="true" :value="true">是</Radio>
            <Radio label="false" :value="false">否</Radio>
          </RadioGroup>
        </FormItem>
        <div>
          <FormItem v-if="form.getFieldsValue().notificationLitigant&&type==1" label="通知对象">
            <NoticeTable :id="selectedRows[0] ? selectedRows[0].caseId: ''" ref="noticeTable" @getAll="e => getAllNotificer(e)" @chooseLitigant="e => getLitigant(e)" />
          </FormItem>
          <FormItem v-if="notice" label="通知当事人内容">
            <TextArea v-decorator="['notificationContent', { rules: [{ required: false}] ,initialValue:notificationLitigantMessage}] " :disabled="true" />
          </FormItem>
        </div>

      </Form>
    </Modal>
  </div>
</template>
<script>
import { Button, Modal, Form, Select, Input, DatePicker, Radio } from 'ant-design-vue'
import { verifyLawCase, infoTime, reviewMessage } from '@/api/freeze/index.js'
import Tribunal from '@/components/Common/Tribunal'
import 'moment/locale/zh-cn'
import moment from 'moment'
import NoticeTable from '@/components/NoticeTable/index.vue'

export default {
  components: {
    Button,
    Modal,
    Select,
    SelectOption: Select.Option,
    Form,
    FormItem: Form.Item,
    TextArea: Input.TextArea,
    DatePicker,
    RadioGroup: Radio.Group,
    Radio,
    Tribunal,
    NoticeTable
  },
  props: {
    selectedRows: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      check: false,
      loading: false,
      notice: true,
      isAllNull: false, // 通知当事人是否为空
      noticeLitigant: {
        notificationAgent: false, // 是否通知代理人
        notificationPlaintiff: false, // 是否通知原告
        notificationDefendant: false, // 是否通知被告
        notificationThirdPerson: false // 是否通知第三人
      },
      noticePhone: { // 通知电话
        notificationPlaintiffPhones: [], // 原告手机号
        notificationDefendantPhones: [], // 被告手机号
        notificationThirdPersonPhones: [], // 第三人手机号
        notificationAgentPhones: [] // 代理人手机号
      },
      type: 1,
      mediatePlaceId: '',
      notificationLitigantMessage: '',
      sendProcessIdArr: [],
      form: this.$form.createForm(this, { name: 'coordinated' }),
      selectList1: [
        {
          value: '移交审理'
        },
        {
          value: '调解'
        },
        {
          value: '按撤诉处理'
        },
        {
          value: '撤诉'
        }
      ],
      // 表单回填信息
      backfill: {
        caseCondition: '',
        mediatePlace: '',
        preMediateTime: '',
        remark: '',
        casePreFillingDate: '',
        sumbmitReviewDate: '',
        sendFinishTime: '',
        nextProcess: '',
        suggestCourtTime: ''
      },
      // 回填清空
      backfill1: {
        caseCondition: '',
        mediatePlace: '',
        preMediateTime: '',
        remark: '',
        casePreFillingDate: '',
        sumbmitReviewDate: '',
        sendFinishTime: '',
        nextProcess: '',
        suggestCourtTime: ''
      },
      messageParams: { // 获取短信模板参数
        mediateTime: '',
        mediatePlace: ''
      }

    }
  },
  watch: {
    messageParams: {
      handler(val) {
        this.getMessage(val)
      },
      deep: true
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    changePlace(e) {
      console.log(e)
      this.mediatePlaceId = e
    },
    changeTime(e) {
      this.messageParams.mediateTime = e
    },
    show() {
      this.check = true
      this.form.resetFields()
      this.getMessage(this.messageParams)
      infoTime(this.selectedRows[0].sendProcessid).then(({ code, data }) => {
        if (code === 200) {
          if (data.caseCondition) {
            this.backfill.caseCondition = data.caseCondition
          }
          if (data.mediatePlace) {
            this.backfill.mediatePlace = data.mediatePlace
          }
          if (data.nextProcess) {
            this.backfill.nextProcess = data.nextProcess
          }
          if (data.sendFinishTime) {
            this.backfill.sendFinishTime = moment(data.sendFinishTime).format('YYYY-MM-DD HH:mm:ss')
          }
          this.backfill.remark = data.remark
          if (data.preMediateTime) {
            this.backfill.preMediateTime = moment(data.preMediateTime).format('YYYY-MM-DD HH:mm:ss')
          }
          if (data.suggestCourtTime) {
            this.backfill.suggestCourtTime = moment(data.suggestCourtTime).format('YYYY-MM-DD HH:mm:ss')
          }
        }
      })
    },
    // 判断是否短信通知
    changeNotice(e) {
      this.notice = e.target.value
    },
    closeModal() {
      this.check = false
      this.backfill = Object.assign(this.backfill, this.backfill1)

      this.form.resetFields()
    },
    changeProcess(e) {
      if (e == '待庭室确认') {
        this.type = 1
      } else if (e == '立案后调解') {
        this.type = 2
      } else {
        this.type = 3
      }
      this.form.setFieldsValue({
        // condition: undefined
      })
    },
    // 获取信息
    getMessage(params) {
      reviewMessage(this.selectedRows[0].caseId, params).then(({ code, msg }) => {
        if (code === 200) {
          this.notificationLitigantMessage = msg
        }
      })
    },
    checkConfirm() {
      if (!this.isMessage) {
        for (const key in this.noticeLitigant) {
          this.noticeLitigant[key] = false
        }
        for (const key in this.noticePhone) {
          this.noticePhone[key] = []
        }
      } else {
        this.getNoticer()
      }
      if (this.noticePhone.notificationPlaintiffPhones.length === 0 && this.noticePhone.notificationDefendantPhones.length === 0 &&
        this.noticePhone.notificationThirdPersonPhones.length === 0 && this.noticePhone.notificationAgentPhones.length === 0) {
        this.isAllNull = true
      } else {
        this.isAllNull = false
      }
      this.form.validateFields(err => {
        if (err) {
          return
        }
        if (this.isPhoneNull()) {
          return
        }
        const form = this.form.getFieldsValue()
        const params = {
          ...form,
          sendProcessId: this.selectedRows[0].sendProcessid
          // ...this.noticePhone,
          // ...this.noticeLitigant
        }
        if (!this.notice) {
          for (const key in this.noticeLitigant) {
            this.noticeLitigant[key] = false
          }
          for (const key in this.noticePhone) {
            this.noticePhone[key] = []
          }
        } else {
          this.getNoticer()
          Object.assign(params, this.noticePhone, this.noticeLitigant)
        }
        params.mediatePlaceId = this.mediatePlaceId
        params.needConform = false

        if (this.notice && this.isAllNull) {
          this.$message.error('请选择至少一个当事人')
          return
        }
        this.loading = true
        verifyLawCase(params).then(res => {
          this.loading = false
          if (res.code === 200) {
            this.check = false
            this.$message.success(res.msg)
            this.form.resetFields()
            this.$emit('refresh')
            this.form.setFieldsValue({
              notificationLitigant: false
            })
          }
        })
      })
    },
    // 获取通知人信息
    getNoticer() {
      if (this.$refs.noticeTable.getData()) {
        const litigant = this.$refs.noticeTable.getData().map(item => {
          return {
            title: item.split('-')[0],
            phone: item.split('-')[2]
          }
        })
        console.log(litigant)
        this.noticePhone.notificationPlaintiffPhones = []// 原告手机号
        this.noticePhone.notificationDefendantPhones = [] // 被告手机号
        this.noticePhone.notificationThirdPersonPhones = [] // 第三人手机号
        this.noticePhone.notificationAgentPhones = [] // 代理人手机号

        litigant.map(item => {
          switch (item.title) {
            case '原告':
              this.noticeLitigant.notificationPlaintiff = true
              this.noticePhone.notificationPlaintiffPhones.push(item.phone)
              break
            case '被告':
              this.noticeLitigant.notificationDefendant = true
              this.noticePhone.notificationDefendantPhones.push(item.phone)

              break
            case '第三人':
              this.noticeLitigant.notificationThirdPerson = true
              this.noticePhone.notificationThirdPersonPhones.push(item.phone)
              break
          }
          if (item.title.indexOf('代理人') != -1) {
            this.noticeLitigant.notificationAgent = true
            this.noticePhone.notificationAgentPhones.push(item.phone)
          }
        })
      }
    },
    isPhoneNull() {
      let flag = false
      for (const key in this.noticePhone) {
        this.noticePhone[key].map(item => {
          if (item === 'null') {
            this.$message.warning('请选择正确的手机号码，如有需要，请重新修改手机号')
            flag = true
            return
          }
        })
      }
      return flag
    }
  }
}
</script>

<style scoped lang="less">

</style>
