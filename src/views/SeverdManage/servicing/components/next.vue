<template>
  <div>
    <Modal
      v-model="isnext"
      title="转下一流程"
      :mask-closable="false"
      width="900px"
    >
      <template slot="footer">
        <Button key="back" @click="isnext=false">
          取消
        </Button>
        <Button key="submit" type="primary" :loading="loading" @click="nextConfirm">
          确定
        </Button>
      </template>
      <Form :form="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
        <FormItem v-if="caseType==1" label="下一流程">
          <Select v-decorator="['nextProcess', { rules: [{ required: true,message:'请选择是否送达' }] }]" @change="changeNextType">
            <SelectOption v-for="(item, index) in nextList" :key="index" :value="item.value">{{ item.value }}</SelectOption>
          </Select>
        </FormItem>
        <FormItem v-if="caseType==2" label="下一流程">
          <Select v-decorator="['nextProcess', { rules: [{ required: true,message:'请选择是否送达' }] }]" @change="changeNextType">
            <SelectOption v-for="(item, index) in nextList1" :key="index" :value="item.value">{{ item.value }}</SelectOption>
          </Select>
        </FormItem>
        <!-- 诉前程序 -->
        <div v-if="type=='1'">
          <FormItem label="送达情况">
            <Select v-decorator="['condition', { rules: [{ required: true,message:'请选择是否送达' }] }]">
              <SelectOption v-for="(item, index) in list" :key="index" :value="item.value">{{ item.value }}</SelectOption>
            </Select>
          </FormItem>
          <FormItem label="预约诉前程序时间">
            <DatePicker
              v-decorator="['preMediateTime',{ rules: [{ required: true , message: '请选择预约诉前程序时间'}] ,initialValue:selectedRows[0].casePreMediateDate},] "
              type="date"
              :show-today="false"
              :show-time="{
                'minute-step': 30,
                'second-step': 60,
                'disabledHours': () => {
                  let hours = []
                  for (var i = 0; i < 8; i++) {
                    hours.push(i)
                  }
                  for (var i = 17; i < 24; i++) {
                    hours.push(i)
                  }
                  return hours
                },
                defaultValue: moment('00:00', 'mm:ss')
              }"
              value-format="YYYY-MM-DD HH:mm:ss"
              @change="changeTime"
            />
          </FormItem>
          <Tribunal
            label="调解地点"
            field="mediatePlaceId"
            :type="2"
            :form-option="{ rules: [{ required: true,message:'请选择调解地点'}],}"
            @change="changePlace"
          />
        </div>
        <!-- 待正式立案 -->
        <div v-if="type=='2'">
          <FormItem label="处理情况">
            <Select v-decorator="['condition', { rules: [{ required: true,message:'请选择处理情况' }] }]">
              <SelectOption v-for="(item, index) in list1" :key="index" :value="item.value">{{ item.value }}</SelectOption>
            </Select>
          </FormItem>
          <FormItem label="诉前结案时间">
            <DatePicker
              v-decorator="['preFinishCaseTime',{ rules: [{ required: true , message: '请选择诉前结案时间'}] },] "
              show-time
              value-format="YYYY-MM-DD HH:mm:ss"
            />
          </FormItem>
        </div>
        <!-- 待庭室确认 -->
        <div v-if="type=='3'">
          <FormItem label="移交原因">
            <Select v-decorator="['condition', { rules: [{ required: true,message:'请选择是否送达' }] }]">
              <SelectOption v-for="(item, index) in list2" :key="index" :value="item.value">{{ item.value }}</SelectOption>
            </Select>
          </FormItem>
          <FormItem label="建议开庭时间">
            <DatePicker
              v-decorator="['suggestCourtTime',{ rules: [{ required: true , message: '请选择建议开庭时间'}] },] "
              show-time
              value-format="YYYY-MM-DD HH:mm:ss"
            />
          </FormItem>
          <Tribunal
            label="地点"
            :type="1"
            field="mediatePlaceId"
            @change="changePlace"
          />
        </div>
        <!-- 结案 -->
        <div v-if="type=='4'&&caseType==2 ">
          <FormItem label="处理情况">
            <Select v-decorator="['condition', { rules: [{ required: true,message:'请选择是否送达' }] }]">
              <SelectOption v-for="(item, index) in list3" :key="index" :value="item.value">{{ item.value }}</SelectOption>
            </Select>
          </FormItem>
          <FormItem label="结案日期">
            <DatePicker
              v-decorator="['finishCaseTime',{ rules: [{ required: true , message: '请选择结案日期'}] },] "
              show-time
              value-format="YYYY-MM-DD HH:mm:ss"
            />
          </FormItem>
        </div>
        <div v-if="!form.getFieldsValue().needConform">
          <FormItem label="送达完成时间">
            <DatePicker
              v-decorator="['sendFinishTime',{ rules: [{ required: true , message: '请选择送达完成时间'}] },] "
              show-time
              value-format="YYYY-MM-DD HH:mm:ss"
            />
          </FormItem>
        </div>
        <FormItem label="备注">
          <TextArea v-decorator="['remark'] " />
        </FormItem>
        <FormItem v-if="type==1||type==3" label="需要组长审核">
          <RadioGroup v-decorator="['needConform',{ rules: [{ required: false,message:'请选择是否需要组长审核' }],initialValue: false }] " @change="changeNeed">
            <Radio :value="true">是</Radio>
            <Radio :value="false">否</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem v-if="(type==3||type==1)&&isneed" label="是否短信通知">
          <RadioGroup v-decorator="['notificationLitigant',{ rules: [{ required: false,message:'请选择' }],initialValue: false }] " @change="isNotice">
            <Radio :value="true">是</Radio>
            <Radio :value="false">否</Radio>
          </RadioGroup>
        </FormItem>
        <div v-if="isMessage">
          <FormItem v-if="form.getFieldsValue().notificationLitigant" label="通知对象">
            <NoticeTable :id="selectedRows[0] ? selectedRows[0].caseId: ''" ref="noticeTable" />
          </FormItem>
          <FormItem v-if="form.getFieldsValue().notificationLitigant" label="通知内容">
            <TextArea
              v-decorator="['notificationContent',{ rules: [{ required: false,message:'请选择' }],initialValue: notificationContent } ] "
              disabled
            />
          </FormItem>
        </div>

      </Form>
    </Modal>
  </div>
</template>
<script>

import moment from 'moment'
import { refundedLawCase, reviewMessage } from '@/api/freeze/index.js'
import { Button, Modal, Form, Input, Select, DatePicker, Radio } from 'ant-design-vue'
import Tribunal from '@/components/Common/Tribunal'
import { sendingNextProcess, allCaseNext } from '@/api/freeze/index.js'
import NoticeTable from '@/components/NoticeTable/index.vue'

export default {
  components: {
    Button,
    Modal,
    Form,
    FormItem: Form.Item,
    TextArea: Input.TextArea,
    Select,
    SelectOption: Select.Option,
    DatePicker,
    Radio,
    RadioGroup: Radio.Group,
    Tribunal,
    NoticeTable
  },
  props: {
    selectedRows: {
      type: Array,
      default: () => []
    },
    isWhole: {
      type: Boolean,
      default: false
    },
    isLeagal: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      isnext: false,
      loading: false,
      isMessage: false,
      isneed: true, // 是否需要组长审核，
      form: this.$form.createForm(this, { name: 'coordinated' }),
      type: 1,
      caseType: 1, // 判断诉前案件与正式案件
      nextProcess: '诉前程序',
      needConform: true,
      notificationContent: '',
      mediatePlaceId: '0',
      nullArr: [],
      valueArr: [],
      lawCaseArr: [],
      caseTypeArr: [],
      allCaseNext: [], // 全部案件转下一流程列表
      nextList: [
        {
          value: '诉前程序'
        },
        {
          value: '待正式立案'
        }

      ],
      nextList1: [
        {
          value: '待庭室确认'
        },
        {
          value: '结案'
        }
      ],
      // 送达情况-诉前程序
      list: [
        {
          value: '诉前送达成功-适宜调解',
          label: '诉前送达成功-适宜调解'
        },
        {
          value: '诉前送达不成功-不适宜调解',
          label: '诉前送达不成功-不适宜调解'
        },
        {
          value: '送达失败',
          label: '送达失败'
        },
        {
          value: '电话送达成功-适宜调解',
          label: '电话送达成功-适宜调解'
        },
        {
          value: '现场送达成功',
          label: '现场送达成功'
        },
        {
          value: '其他',
          label: '其他'
        }
      ],
      // 送达情况-待正式立案
      list1: [
        {
          value: '移送'
        },
        {
          value: '调解'
        },
        {
          value: '撤诉'
        }

      ],
      // 送达情况-待庭室确认
      list2: [
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
      // 送达情况-结案
      list3: [
        {
          value: '判决'
        },
        {
          value: '调解'
        },
        {
          value: '撤诉'
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
      messageParams: { // 获取短信模板参数
        mediateTime: '',
        mediatePlace: ''
      },
      isAllNull: false
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
    moment,
    changePlace(e) {
      this.mediatePlaceId = e
    },
    changeTime(e) {
      this.messageParams.mediateTime = e
    },
    show(e) {
      this.isnext = true
      console.log(1)
      this.allCaseNext = e
      if (this.selectedRows.length == 1) {
        if (!this.selectedRows[0].caseNo) {
          this.caseType = 1
        } else {
          this.caseType = 2
        }
      }
      if (this.isLeagal != 0) {
        this.caseType = this.isLeagal
      }
      if (this.selectedRows.length > 1) {
        this.selectedRows.forEach(item => {
          this.caseTypeArr.push(item.caseNo)
        })
        for (let i = 0; i <= this.caseTypeArr.length; i++) {
          if (!this.caseTypeArr[i]) {
            this.nullArr.push(this.caseTypeArr[i])
          } else {
            this.valueArr.push(this.caseTypeArr[i])
          }
          if (this.nullArr.length > 1 && this.valueArr.length >= 1) {
            this.$message.error('请选择相同类型的案件进行操作！')
            this.nullArr = []
            this.valueArr = []
            this.caseTypeArr = []
            return
          }
        }
      }
      this.isnext = true
      this.nullArr = []
      this.valueArr = []
      this.caseTypeArr = []
    },
    changePage(e) {
      if (e.pageSize !== this.searchParams.pageSize) {
        this.searchParams.pageNum = 1
        this.searchParams.pageSize = e.pageSize
      } else {
        this.searchParams.pageNum = e.current
      }
    },
    isNotice(e) {
      this.isMessage = e.target.value
      if (this.isMessage) {
        this.getMessage(this.messageParams)
      }
    },
    nextConfirm() {
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
      if (this.isMessage && this.isAllNull) {
        this.$message.error('请选择至少一个当事人')
        return
      }
      this.lawCaseArr = []
      this.selectedRows.forEach(item => {
        this.lawCaseArr.push(item.caseId)
      })
      this.form.validateFields(err => {
        if (err) {
          return
        }
        if (this.isPhoneNull()) {
          return
        }
        const params = {
          ...this.form.getFieldsValue(),
          lawCases: this.lawCaseArr,
          ...this.noticeLitigant,
          ...this.noticePhone
        }
        if (this.needConform) {
          params.notificationLitigant = false
        }
        params.mediatePlaceId = this.mediatePlaceId
        console.log(params)
        // return
        this.loading = true
        if (!this.isWhole) { // 是否为全院案件转下一流程
          sendingNextProcess(params).then(res => {
            this.loading = false
            if (res.code === 200) {
              this.$emit('refresh')
              this.isnext = false
              this.form.resetFields()
            }
          })
        }
        if (this.isWhole) {
          allCaseNext(params).then(res => {
            this.loading = false
            if (res.code === 200) {
              this.$emit('done')
              this.isnext = false
              this.form.resetFields()
              this.form.setFieldsValue({
                notificationLitigant: false
              })
            }
          })
        }
      })
    },
    changeNeed(e) {
      console.log(e)
      this.needConform = e.target.value
      if (this.needConform) {
        this.isneed = false
        this.isMessage = false
      } else {
        this.isneed = true
      }
    },
    changeNextType(e) {
      this.nextProcess = e
      this.form.setFieldsValue({
        condition: undefined
      })
      if (e == '诉前程序') {
        this.type = 1
      } else if (e == '待正式立案') {
        this.type = 2
      } else if (e == '待庭室确认') {
        this.type = 3
      } else {
        this.type = 4
      }
    },
    // 获取信息
    getMessage(params) {
      reviewMessage(this.selectedRows[0].caseId, params).then(({ code, msg }) => {
        if (code === 200) {
          this.notificationContent = msg
        }
      })
    },
    // 获取通知人信息
    getNoticer() {
      console.log(this.$refs.noticeTable.getData())
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
