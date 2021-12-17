<template>
  <div>
    <Modal
      v-model="ischangetime"
      title="修改调解时间"
      :mask-closable="false"
      width="1300px"
      @ok="timeConfirm"
    >
      <template slot="footer">
        <Button key="back" @click="ischangetime=false">
          取消
        </Button>
        <Button key="submit" type="primary" :loading="loading" @click="timeConfirm">
          确定
        </Button>
      </template>
      <Form :form="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
        <FormItem
          label="调解时间"
        >
          <DatePicker
            v-decorator="[
              'mediationTime',
              { rules: [{ required: true, message: '请选择调解时间' }] },
            ]"
            value-format="YYYY-MM-DD HH:mm:ss"
            show-time
            @change="changeTime"
          />
        </FormItem>
        <Tribunal
          label="调解地点"
          field="mediationPlace"
          :type="2"
          :form-option="{ rules: [{ required: true,message:'请选择调解地点'}] }"
          @change="changePlace"
        />
        <FormItem label="是否短信通知">
          <RadioGroup v-decorator="['notificationLitigant', { rules: [{ required: false}],initialValue:false }] " @change="changeNotice">
            <Radio label="true" :value="true">是</Radio>
            <Radio label="false" :value="false">否</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem v-if="form.getFieldsValue().notificationLitigant" label="通知对象">
          <NoticeTable :id="selectedRows[0] ? selectedRows[0].lawCaseBean.id: ''" ref="noticeTable" @getAll="e => getAllNotificer(e)" @chooseLitigant="e => getLitigant(e)" />
        </FormItem>
        <FormItem v-if="notice" label="通知当事人内容">
          <TextArea v-decorator="['notificationLitigantMessage', { rules: [{ required: false}] ,initialValue:notificationLitigantMessage}] " :disabled="true" />
        </FormItem>
        <FormItem v-if="notice" label="通知调解员内容">
          <TextArea v-decorator="['notificationMediatorMessage', { rules: [{ required: false}] ,initialValue:notificationMediatorMessage}] " :disabled="true" />
        </FormItem>
      </Form>

    </Modal>
  </div>
</template>
<script>
import { Button, Modal, Form, Select, DatePicker, Input, Radio } from 'ant-design-vue'
import { changemediationTime, timeMessage } from '@/api/freeze/index.js'
import Tribunal from '@/components/Common/Tribunal'
import NoticeTable from '@/components/NoticeTable/index.vue'

export default {
  components: {
    Button,
    Modal,
    Form,
    FormItem: Form.Item,
    TextArea: Input.TextArea,
    DatePicker,
    Tribunal,
    Radio,
    NoticeTable,
    RadioGroup: Radio.Group
  },
  props: {
    selectedRows: {
      type: Array,
      default: () => []
    },
    litigants: {
      type: Array,
      default: () => []
    }

  },
  data() {
    return {
      ischangetime: false,
      loading: false,
      isAllNull: false,
      notice: false,
      isGetAll: false, // 是否获取所有当事人
      form: this.$form.createForm(this, { name: 'coordinated' }), // 退回表单
      mediatorTime: '', // 调解时间
      mediaPlace: '', // 调解地点
      notificationLitigantMessage: '', // 短信当事人内容
      notificationMediatorMessage: '', // 通知调解员内容
      select: '',
      messageParams: {
        mediateTime: '',
        mediatePlace: ''
      },
      litigantNoticer: [], // 通知对象
      lawCaseArr: [],
      mediationCaseArr: [],
      plaintiff: [
        { litigantPhones: [],
          litigantName: '',
          litigantAddresses: '' }
      ], // 原告
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
    // notificationLitigantMessage() {
    //   return {

    //   }
    // }

  },
  created() {
  },
  mounted() {
  },
  methods: {
    async show() {
      // this.mediatorTime = this.selectedRows[0].mediateTime
      if (this.selectedRows.length > 1) {
        this.$message.error('请选择一件案件')
        return
      }
      this.ischangetime = true
    },
    changeNotice(e) {
      this.notice = e.target.value
    },
    changeLitigant(e) {
      console.log(e instanceof Array)
      e.forEach(item => {
        console.log(item)
      })
    },
    changePlace(e, list) {
      list.map(item => {
        if (e == item.id) {
          this.messageParams.mediatePlace = item.name
        }
      })
    },
    // 修改调解时间
    changeTime(e) {
      this.messageParams.mediateTime = e
    },
    timeConfirm() {
      if (!this.notice) {
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

      this.form.validateFields((err) => {
        if (err) {
          return
        }
        this.lawCaseArr = []
        this.mediationCaseArr = []
        this.selectedRows.forEach(item => {
          this.lawCaseArr.push(item.lawCaseBean.id)
          this.mediationCaseArr.push(item.id)
        })
        const form = this.form.getFieldsValue()
        const params = {
          lawCase: this.lawCaseArr,
          ...form
        }
        if (this.notice) {
          params.notifyLitigants = this.litigantNoticer.map(item => {
            return {
              phone: item
            }
          })
        }
        params.mediationPlace = parseInt(params.mediationPlace)
        if (!params.notificationLitigant) {
          params.notificationMediatorMessage = '1'
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

        this.loading = true
        changemediationTime(params).then(res => {
          this.loading = false
          this.mediationCaseArr = []
          this.lawCaseArr = []
          if (res.code === 200) {
            this.form.resetFields()
            this.ischangetime = false
            this.$emit('refresh')
            this.notice = false
            this.$message.success(res.msg)
          }
        })
      })
    },
    // 获取发送信息
    async getMessage(e) {
      // const form = this.form.getFieldDecorator()
      for (const key in e) {
        if (e[key] === '' || !e[key]) { return }
      }
      await timeMessage(this.selectedRows[0].lawCaseBean.id, 'litigant', e).then(({ code, msg }) => {
        if (code === 200) {
          this.notificationLitigantMessage = msg
        }
      })
      await timeMessage(this.selectedRows[0].lawCaseBean.id, 'mediator', e).then(({ code, msg }) => {
        if (code === 200) {
          this.notificationMediatorMessage = msg
        }
      })
    },
    // 获取要在表单中显示的列表数据
    getTableData() {
      this.getPeopleInfo()
    },
    // 获取已选择的通知人信息
    getNotifier() {
      this.$refs.noticeTable.getCheck()
    },
    // 获取所有通知对象
    getAllNotificer(e) {
      if (e) {
        this.litigantNoticer = []
        this.selectedRows[0].lawCaseBean.litigants.map(item => {
          this.litigantNoticer.push(item.id)
        })
        this.litigantNoticer = this.litigantNoticer.map(item => {
          return {
            id: item,
            message: this.notificationLitigantMessage
          }
        })
      }
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
