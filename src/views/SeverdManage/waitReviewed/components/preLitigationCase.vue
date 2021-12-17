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
      <Form :form="form" :label-col="{ span: 8 }" :wrapper-col="{ span: 12 }">
        <FormItem
          label="下一流程"
        >
          <Select
            v-decorator="['nextProcess', { rules: [{ required: true,message:'请选择复核类型'}] ,initialValue:backfill.nextProcess}] "
            @change="changeProcess"
          >
            <SelectOption label="诉前程序" value="诉前程序">诉前程序</SelectOption>
            <SelectOption label="待正式立案" value="待正式立案">待正式立案</SelectOption>
          </Select>
        </FormItem>
        <div v-if="type==1">
          <FormItem
            label="送达情况"
          >
            <Select
              v-decorator="['condition', { rules: [{ required: true,message:'请选择送达情况'}],initialValue:backfill.caseCondition }] "
              @change="changeSe"
            >
              <SelectOption v-for="(item) in selectList1" :key="item.value">{{ item.value }}</SelectOption>
            </Select>
          </FormItem>
          <FormItem
            label="预约诉前程序时间"
          >
            <DatePicker
              v-decorator="['preMediateTime', { rules: [{ required: true,message:'请输入预约诉前程序时间'}],initialValue:backfill.preMediateTime }] "
              value-format="YYYY-MM-DD HH:mm:ss"
              show-time
              suffix="天内"
              @change="changeTime"
            />
          </FormItem>
          <Tribunal
            field="mediatePlaceId"
            :form-option="{ rules: [{ required: true,message:'请输入调解地点'}],initialValue:backfill.mediatePlace }"
            label="调解地点"
            :type="2"
            @change="changePlace"
          />
          <FormItem
            label="送达完成时间"
          >
            <DatePicker
              v-decorator="['sendFinishTime', { rules: [{ required: true,message:'请输入诉前程序时间'}],initialValue:backfill.sendFinishTime }] "
              value-format="YYYY-MM-DD HH:mm:ss"
              suffix="天内"
            />
          </FormItem>
        </div>
        <div v-if="type==2">
          <FormItem label="处理情况">
            <Select
              v-decorator="['condition1', { rules: [{ required: true,message:'请选择处理情况'}] }] "

              @change="changeSe"
            >
              <SelectOption v-for="(item) in selectList2" :key="item.value">{{ item.value }}</SelectOption>
            </Select>
          </FormItem>
          <FormItem
            label="诉前结案时间"
          >
            <DatePicker
              v-decorator="['preFinishCaseTime',
                            { rules: [{ required: true,message:'请选择诉前结案时间'}],
                              initialValue:backfill.sendFinishTime }] "
              value-format="YYYY-MM-DD HH:mm:ss"
              show-time
              suffix="天内"
            />
          </FormItem>
        </div>
        <FormItem label="备注">
          <TextArea
            v-decorator="['remark',{ rules: [{ required: false,message:'请填写备注'}],
                                     initialValue:backfill.remark }]"
          />
        </FormItem>
        <FormItem v-if="type===1" label="是否短信通知">
          <RadioGroup v-decorator="['notificationLitigant', { rules: [{ required: false}],initialValue:true }] " @change="changeNotice">
            <Radio label="true" :value="true">是</Radio>
            <Radio label="false" :value="false">否</Radio>
          </RadioGroup>
        </FormItem>
        <div v-if="notice && type===1">
          <FormItem label="通知对象">
            <NoticeTable :id="selectedRows[0] ? selectedRows[0].caseId: ''" ref="noticeTable" />
          </FormItem>
          <FormItem label="通知当事人内容">
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
import NoticeTable from '@/components/NoticeTable/index.vue'

import 'moment/locale/zh-cn'
import moment from 'moment'
// import { Handler } from 'pili-rtc-web/build/models/Connection/Handler'
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
    Tribunal,
    NoticeTable,
    RadioGroup: Radio.Group,
    Radio
  },
  props: {
    selectedRows: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      // 回填信息
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
      notificationLitigantMessage: '',
      // 清空回填信息
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
      NetxProcess: '诉前程序',
      type: 1,
      check: false,
      form: this.$form.createForm(this, { name: 'coordinated' }),
      loading: false,
      isAllNull: false, // 通知当事人为空
      sendProcessIdArr: [],
      selectList1: [
        {
          value: '诉前送达成功-适宜调解'
        },
        {
          value: '诉前送达不成功-不适宜调解'
        },
        {
          value: '送达失败'
        },
        {
          value: '电话送达成功-适宜调解'
        },
        {
          value: '现场送达成功'
        }, {
          value: '其他'
        }
      ],
      selectList2: [
        {
          value: '移送'
        },
        {
          value: '调解'
        },
        {
          value: '撤诉'
        },
        {
          value: '其他'
        }
      ],
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
      notice: true,

      mediatePlaceId: '',
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
      this.messageParams.mediatePlace = e
    },
    show() {
      this.check = true
      this.form.resetFields()
      this.getMessage()
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
    // 关闭模态框
    closeModal() {
      this.check = false
      this.backfill = Object.assign(this.backfill, this.backfill1)
      this.form.resetFields()
    },
    changeSe(e) {
      console.log(e)
      this.backfill.caseCondition = e
    },
    changeProcess(e) {
      this.NetxProcess = e
      if (e == '诉前程序') {
        this.type = 1
      } else {
        this.type = 2
      }
      this.form.setFieldsValue({
        // condition: undefined
      })
    },
    changeNotice(e) {
      this.notice = e.target.value
    },
    // 获取信息
    getMessage(param) {
      reviewMessage(this.selectedRows[0].caseId, param).then(({ code, msg }) => {
        if (code === 200) {
          this.notificationLitigantMessage = msg
        }
      })
    },
    changeTime(e) {
      console.log(e)
      this.messageParams.mediateTime = e
      this.getMessage(this.messageParams)
    },
    checkConfirm() {
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
          sendProcessId: this.selectedRows[0].sendProcessid,
          ...this.noticePhone,
          ...this.noticeLitigant
        }

        // delete params.notificationContent
        params.mediatePlaceId = this.mediatePlaceId
        if (this.type === 2) {
          params.condition = form.condition1
          delete params.condition1
          delete params.mediatePlaceId
        }

        if (!this.notice) {
          for (const key in this.noticeLitigant) {
            this.noticeLitigant[key] = false
          }
          for (const key in this.noticePhone) {
            this.noticePhone[key] = []
          }
          delete form.notificationContent
        } else {
          this.getNoticer()
          Object.assign(params, this.noticePhone, this.noticeLitigant)
          params.notificationContent = form.notificationContent
        }
        console.log(params)
        if (this.noticePhone.notificationPlaintiffPhones.length === 0 && this.noticePhone.notificationDefendantPhones.length === 0 &&
        this.noticePhone.notificationThirdPersonPhones.length === 0 && this.noticePhone.notificationAgentPhones.length === 0) {
          this.isAllNull = true
        } else {
          this.isAllNull = false
        }
        if (this.notice && this.isAllNull) {
          this.$message.error('请选择至少一个当事人')
          return
        }
        this.loading = true
        verifyLawCase(params).then(res => {
          this.loading = false
          if (res.code === 200) {
            this.form.resetFields()
            this.$message.success(res.msg)
            this.$emit('refresh')
            this.closeModal()
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
    // 判断电话号码是否为空
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
