<template>
  <!-- 指派调解员 -->
  <div>
    <Modal
      v-model="isassign"
      title="指派"
      :mask-closable="false"
      width="900px"
    >
      <template slot="footer">
        <Button key="back" @click="isassign=false">
          取消
        </Button>
        <Button key="submit" type="primary" :loading="loading" @click="assignConfirm">
          确定
        </Button>
      </template>
      <Form :form="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
        <FormItem label="是否本院调解">
          <Select
            v-decorator="[
              'localMediate',
              { rules: [{ required: true, message: '请选择' }] },
            ]"
            @change="changetype"
          >
            <SelectOption value="yes">是</SelectOption>
            <SelectOption value="no">否</SelectOption>
          </Select>
        </FormItem>
        <FormItem v-if="assigntype!=2" label="特邀调解组织">
          <Select
            v-decorator="[
              'organization',
            ]"
            :allow-clear="allowClear"
            :filter-option="filterOption"
            :show-search="true"
            @change="changeOrg"
          >
            <SelectOption v-for="(item) in organizationSpecial" :key="item.id" class="option">{{ item.name }}</SelectOption>
          </Select>
        </FormItem>
        <FormItem v-if="assigntype==2" label="单位">
          <Select
            v-decorator="[
              'unit',
            ]"
            :allow-clear="allowClear"
            :filter-option="filterOption"
            :show-search="true"
            @change="changeunit"
          >
            <SelectOption v-for="(item) in unit" :key="item.value" class="option">{{ item.label }}</SelectOption>

          </Select>
        </FormItem>
        <FormItem v-if="assigntype==2" label="调解组织">
          <Select
            v-decorator="[
              'organization',
            ]"
            :filter-option="filterOption"
            :show-search="true"
            :allow-clear="allowClear"
            @change="changeOrg"
          >
            <SelectOption v-for="(item) in organization" :key="item.id" class="option">{{ item.name }}</SelectOption>

          </Select>
        </FormItem>
        <FormItem v-if="assigntype==2" label="调解员">
          <Select
            v-decorator="[
              'mediator',
              { rules: [{ required: false, message: '请选择调解员' }] },
            ]"
            :filter-option="filterOption"
            :show-search="true"
            :allow-clear="allowClear"
            @change="changeMediator"
          >
            <SelectOption v-for="(item) in people" :key="item.value" class="option">{{ item.label }}</SelectOption>

          </Select>
        </FormItem>
        <span v-if="assigntype==2">注意：单位/组织必选一样填写！</span>
        <FormItem
          v-if="assigntype==1"
          label="专职调解员"
        >
          <Select
            v-decorator="[
              'mediator',
            ]"
            allow-clear
            :filter-option="filterOption"
            :show-search="true"
            @change="changeMediator"
          >
            <SelectOption v-for="(item) in people" :key="item.value" class="option">{{ item.label }}</SelectOption>

          </Select>
        </FormItem>
        <span v-if="assigntype==1" style="margin-left:200px">注意：专职调解员/特邀调解组织必选一样填写！</span>
        <FormItem
          label="调解期限"
        >
          <div class="deadline">
            <!-- <Input
              v-decorator="[
                'duration',
                { rules: [{ required: true, message: '请输入调解期限' }] },
              ]"
              suffix="天内"
            /> -->
            <Input v-model="duration" suffix="天内" />
          </div>
        </FormItem>
        <FormItem label="委托调解时间">
          <DatePicker
            v-decorator="[
              'mediateTime',
              { rules: [{ required: true, message: '请选择委托调解时间' }],initialValue:updateTime},
            ]"
            show-time
            value-format="YYYY-MM-DD HH:mm:ss"
            style="width: 240px"
            @change="changeTime"
          />
        </FormItem>
        <FormItem label="推送方式">
          <Select
            v-decorator="[
              'notificationWay',
              { rules: [{ required: true,message:'请选择推送方式'}],initialValue:'tel' },
            ]"
            style="width: 240px"
          >
            <SelectOption v-for="item in litigantlist" :key="item.value" class="option">{{ item.label }}</SelectOption>
          </Select>
        </FormItem>
        <FormItem label="是否短信通知">
          <RadioGroup v-decorator="['notificationLitigant', { rules: [{ required: false}],initialValue:false }] " @change="changeNotice">
            <Radio label="true" :value="true">是</Radio>
            <Radio label="false" :value="false">否</Radio>
          </RadioGroup>
        </FormItem>
        <div v-if="notice">
          <FormItem label="通知对象">
            <NoticeTable :id="selectedRows[0] ? selectedRows[0].lawCaseBean.id: ''" ref="noticeTable" />
          </FormItem>
          <FormItem label="通知当事人内容">
            <TextArea
              v-decorator="[
                'notificationLitigantMessage',
                { rules: [{ required: false,message:'请输入通知内容'}], initialValue:notificationLitigantMessage},
              ]"
              :disabled="true"
            />
          </FormItem>
          <FormItem label="通知调解员/组织/单位内容">
            <TextArea
              v-decorator="[
                'notificationMediatorMessage',
                { rules: [{ required: false,message:'请输入通知内容'}], initialValue:notificationMediatorMessage},
              ]"
              :disabled="true"
            />
          </FormItem>
        </div>

      </Form>
    </Modal>
  </div>
</template>
<script>
import { Button, Modal, Form, Input, Select, DatePicker, Radio } from 'ant-design-vue'
import { appointed, listDeptListByArgs, sfmediator, getMediatePlace, appointMessage, mediateOrDeptMessage } from '@/api/freeze/index.js'
import { queryMediates } from '@/api/collectCase/index.js'
import { listDetp, listMediator, queryById, listLitInfo } from '@/api/addCase/index.js'
import NoticeTable from '@/components/NoticeTable/index.vue'

import 'moment/locale/zh-cn'
import moment from 'moment'
export default {
  components: {
    Button,
    Modal,
    Form,
    FormItem: Form.Item,
    Input,
    Select,
    SelectOption: Select.Option,
    DatePicker,
    TextArea: Input.TextArea,
    NoticeTable,
    Radio,
    RadioGroup: Radio.Group
  },
  props: {
    selectedRows: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      isassign: false,
      loading: false,
      allowClear: true,
      duration: 15, // 调解期限
      assigntype: 1, // 指派类型：1：本院调解&&无特邀调解组织  2：不是本院调解 3：本院调解&&有特邀调解组织
      form: this.$form.createForm(this, { name: 'coordinated' }), // 退回表单
      litigantlist: [
        {
          label: '短信',
          value: 'tel'
        }
      ],
      // 诉非端单位、组织、调解员
      organization: [],
      people: [],
      unit: [],
      // 法院端单位、组织、调解员
      courtOrganization: [],
      courtUnit: [],
      courtPeople: [],
      caseInfo: {},
      listLitInfo: [],
      unitId: null,
      orgId: null,
      mediatorId: null,
      plaintiff: [], // 原告
      defendant: [], // 被告
      thirdParty: [], // 第三人
      organizationSpecial: [], // 特邀调解组织
      mediaPlace: '', // 获取到的调解地址
      meidator: '', // 调解员
      noticeLitigant: { // 通知对象
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
      messageAppointParams: {
        mediateTime: '',
        mediator: ''
      },
      messageMediatePrams: {
        mediateTime: '',
        mediateDuration: 15,
        mediator: null
      },
      notice: false,
      isAllNull: false,
      notificationMediatorMessage: '', // 发送短信内容
      notificationLitigantMessage: ''
    }
  },
  watch: {
    messageAppointParams: {
      handler(val) {
        if (val && this.notice) {
          this.getAppointMessage(val)// 获取短信
        }
      },
      deep: true,
      immediate: true
    },
    messageMediatePrams: {
      handler(val) {
        if (val) {
          this.getMediateMessage(val)// 获取短信
        }
      },
      deep: true,
      immediate: true
    },
    notice(val) {
      if (val) {
        this.getMediateMessage(this.messageMediatePrams)// 获取短信
        this.getAppointMessage(this.messageAppointParams)// 获取短信
      }
    },
    duration(val) {
      this.messageMediatePrams.mediateDuration = val
    },
    meidator(val) {
      if (!val) {
        this.notificationLitigantMessage = ''
      }
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    show() {
      this.getCurrentTime()
      this.messageAppointParams.mediateTime = this.updateTime
      this.messageMediatePrams.mediateTime = this.updateTime
      this.isassign = true
    },
    changeNotice(e) {
      this.notice = e.target.value
    },
    // 通知当事人短信
    getAppointMessage(params1) {
      for (const key in params1) {
        if (params1[key] === '' && !params1[key]) {
          return
        }
      }
      appointMessage(this.selectedRows[0].lawCaseBean.id, params1).then(({ code, msg }) => {
        if (code === 200) {
          this.notificationLitigantMessage = msg
        }
      })
    },
    // 通知调解员、调解组织/单位短信
    getMediateMessage(params) {
      if (params.mediateTime == '' || params.mediateDuration == '') {
        return
      }
      mediateOrDeptMessage(this.selectedRows[0].lawCaseBean.id, params).then(({ code, msg }) => {
        if (code === 200) {
          this.notificationMediatorMessage = msg
        }
      })
    },
    getData() {
      if (this.assigntype !== 1) {
        const params = {
          codes: '10,11,12,13'
        }
        listDeptListByArgs(params).then(({ code, data }) => {
          if (code === 200) {
            this.unit = data.map(item => {
              return {
                value: item.deptId,
                label: item.deptName
              }
            })
          }
        })
        const params1 = {
          codes: '14'
        }
        listDeptListByArgs(params1).then(({ code, data }) => {
          if (code === 200) {
            this.organization = data.map(item => {
              return {
                id: item.deptId,
                name: item.deptName
              }
            })
          }
        })
        this.getMed()
      } else {
        this.getListDetp()
        this.getListMediator()
      }
    },
    // 法院获取单位和组织
    getListDetp() {
      const params = {
        codes: '14'
      }
      listDetp(params).then(({ code, deptList }) => {
        if (code === 200) {
          if (!deptList || deptList.length === 0) {
            return
          }
          this.unit = deptList.map(item => {
            return {
              value: item.deptId,
              label: item.deptName
            }
          })
        }
      })
    },

    // 法院获取调解员
    getListMediator(id) {
      const params = {
        dept: id
      }
      listMediator(params).then(({ code, mediators }) => {
        if (code === 200) {
          this.people = mediators.map(item => {
            return {
              value: item.id,
              label: item.name
            }
          })
        }
      })
    },
    // 单位
    changeunit(e) {
      console.log(e)
      this.unitId = e
      if (!e && !this.form.getFieldsValue().orgId) {
        this.notificationMediatorMessage = ''
      }
      if (!e && !this.form.getFieldsValue().orgId && this.form.getFieldsValue().mediator) {
        this.notificationLitigantMessage = ''
      }
      this.getOrg()
      this.getMed(e)
      this.form.setFieldsValue({
        organization: undefined,
        mediator: undefined
      })
    },
    // 获取组织
    getOrg() {
      const params = {
        codes: 14,
        ancestorId: this.unitId
      }
      listDeptListByArgs(params).then(({ code, data }) => {
        if (code === 200) {
          this.organization = data.map(item => {
            return {
              id: item.deptId,
              name: item.deptName
            }
          })
        }
      })
    },
    changeOrg(e) {
      this.orgId = e
      if (!e && !this.unitId) {
        this.notificationMediatorMessage = ''
      }
      this.getMed(e)
      this.form.setFieldsValue({
        mediator: undefined
      })
    },
    // 获取调解员
    getMed(id) {
      const params = {
        deptId: id
      }
      sfmediator(params).then(({ code, data }) => {
        if (code === 200) {
          this.people = data.map(item => {
            return {
              value: item.id,
              label: item.name
            }
          })
        }
      })
    },
    changetype(value) {
      listDeptListByArgs({ ancestorId: 116 }).then(({ code, data }) => {
        if (code === 200) {
          this.organizationSpecial = data.map(item => {
            return {
              id: item.deptId,
              name: item.deptName
            }
          })
        }
        this.getListMediator(116)
        this.notificationLitigantMessage = ''
        this.notificationMediatorMessage = ''
        this.form.setFieldsValue({
          mediator: undefined
        //   // mediateOrDeptMessage:null,
        //   notificationLitigantMessage: null,
        //   notificationMediatorMessage: null
        })
      })

      if (value === 'yes') {
        this.assigntype = 1
      } else {
        this.assigntype = 2
      }
      this.getData()
    },
    // 修改时间调用短信模板接口
    changeTime(e) {
      this.messageAppointParams.mediateTime = e
      this.messageMediatePrams.mediateTime = e
    },
    changeorganization(value) {
      console.log(value)
      if (value !== undefined) {
        this.assigntype = 3
      } if (value === undefined) {
        this.assigntype = 1
      }
    },
    changeassign(value) {
      console.log(`selected ${value}`)
    },
    // 修改调解员并传值给发送短信
    changeMediator(e) {
      console.log(e)
      this.meidator = e
      if (e) {
        const mediator = this.people.find(item => {
          return e == item.value
        })
        this.mediator = mediator.label
        this.messageAppointParams.mediator = mediator.label
        this.messageMediatePrams.mediator = mediator.label
      } else {
        this.litigantFalse()
        this.messageMediatePrams.mediator = null
      }
    },
    // 指派确认
    assignConfirm() {
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
      this.form.validateFields((err, values) => {
        if (err) {
          return
        }
        if (this.isPhoneNull()) {
          return
        }
        if (this.notice && this.isAllNull) {
          this.$message.error('请选择至少一个当事人')
          return
        }
        this.loading = true
        const form = this.form.getFieldsValue()
        if (this.assigntype === 2) {
          if (!form.unit && !form.organization) {
            this.$message.error('单位/组织必选一样填写！')
            this.loading = false
            return
          }
        }
        if (this.assigntype === 1) {
          if (!form.organization && !form.mediator) {
            this.$message.error('特邀调解组织/专职调解员必选一样填写！')
            this.loading = false
            return
          }
        }
        if (!this.notice) {
          this.litigantFalse()
        }
        const params = {
          ...form,
          ...this.noticePhone,
          ...this.noticeLitigant
        }
        if (!form.mediator) {
          this.litigantFalse()
          params.notificationMediator = false
        } else {
          params.notificationMediator = true
        }
        params.mediateTime = moment(params.mediateTime).format('YYYY-MM-DD HH:mm:ss')
        params.mediationCase = this.selectedRows[0].id
        params.duration = this.duration
        console.log(params)
        const lawCase = this.selectedRows[0].lawCaseBean.id
        this.loading = false
        params.notificationMediatorMessage = this.notificationMediatorMessage
        appointed(params, lawCase).then(res => {
          this.loading = false
          if (res.code === 200) {
            this.$message.success(res.msg)
            this.form.resetFields()
            this.isassign = false
            this.$emit('refresh')
            this.notice = false
            this.duration = ''
            this.notificationLitigantMessage = ''
            this.notificationMediatorMessage = ''
          }
        })
      })
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
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
        console.log(this.noticeLitigant)
        console.log(this.noticePhone)
      }
    },
    // 判断发送短信中是否有空值
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
    },
    // 当调解员位空时，发送当事人状态为false
    litigantFalse() {
      for (const key in this.noticeLitigant) {
        this.noticeLitigant[key] = false
      }
      for (const key in this.noticePhone) {
        this.noticePhone[key] = []
      }
    },
    getCurrentTime() {
      // 获取当前时间并打印
      var _this = this
      const yy = new Date().getFullYear()
      const mm = new Date().getMonth() + 1
      const dd = new Date().getDate()
      const hh = new Date().getHours()
      const mf = new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes()
      const ss = new Date().getSeconds() < 10 ? '0' + new Date().getSeconds() : new Date().getSeconds()
      _this.updateTime = yy + '-' + mm + '-' + dd + ' ' + hh + ':' + mf + ':' + ss
    }

  }
}
</script>

<style scoped lang="less">
</style>
