<template>
  <div>
    <Modal
      v-model="isnext"
      title="转下一流程"
      width="600px"
      :mask-closable="false"
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
        <FormItem v-if="caseType==1" label="转下一流程">
          <Select v-decorator="['nextProcess', { rules: [{ required: true,message:'请选择下一流程' }] }]" @change="changeNextType">
            <SelectOption v-for="(item, index) in nextList" :key="index" :value="item.value">{{ item.value }}</SelectOption>
          </Select>
        </FormItem>
        <FormItem v-if="caseType==2" label="转下一流程">
          <Select v-decorator="['nextProcess', { rules: [{ required: true,message:'请选择下一流程' }] }]" @change="changeNextType">
            <SelectOption v-for="(item, index) in nextList1" :key="index" :value="item.value">{{ item.value }}</SelectOption>
          </Select>
        </FormItem>
        <!-- 诉前程序 -->
        <div v-if="type==1">
          <FormItem label="送达情况">
            <Select v-decorator="['condition', { rules: [{ required: true,message:'请选择是否送达' }] }]">
              <SelectOption v-for="(item, index) in list" :key="index" :value="item.value">{{ item.value }}</SelectOption>
            </Select>
          </FormItem>
          <FormItem label="预约诉前程序时间">
            <DatePicker
              v-decorator="['preMediateTime', { rules: [{ required: true,message:'请选择预约诉前程序时间'}] }]"
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
            />
          </FormItem>
          <Tribunal
            label="地点"
            :type="2"
            field="mediatePlaceId"
            @change="changePlace"
          />
          <FormItem label="送达完成时间">
            <DatePicker
              v-decorator="['sendFinishTime',{ rules: [{ required: true , message: '请选择送达完成时间'}] },] "
              show-time
              value-format="YYYY-MM-DD HH:mm:ss"
            />
          </FormItem>
        </div>
        <!-- 待庭室确认 -->
        <div v-if="type==2">
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

        <FormItem v-if="type==2" label="需要组长审核">
          <RadioGroup v-decorator="['needConform',{ rules: [{ required: false,message:'请选择是否需要组长审核' }],initialValue: true }] " @change="changeNeed">
            <Radio :value="true">是</Radio>
            <Radio :value="false">否</Radio>

          </RadioGroup>
        </FormItem>
        <div v-if="!needConform&&type==2">
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
      </Form>
    </Modal>
  </div>
</template>
<script>

import moment from 'moment'
import 'moment/locale/zh-cn'

import { Button, Modal, Form, Input, Select, DatePicker, Radio } from 'ant-design-vue'
import Tribunal from '@/components/Common/Tribunal'
import { unSendNextProcess, allCaseNext } from '@/api/freeze/index.js'
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
    Tribunal
  },
  props: {
    selectedRows: {
      type: Array,
      default: () => []
    },
    selectedKey: {
      type: Array,
      default: () => []
    },
    isWhole: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isnext: false,
      loading: false,
      form: this.$form.createForm(this, { name: 'coordinated' }),
      type: 1,
      caseType: 1,
      allCaseSelected: [], // 全部案件的列表数据
      caseTypeArr: [], // 判断用户选择的案件是否同一类型
      isUpdate: false,
      nextProcess: '诉前程序',
      needConform: 'true',
      mediatePlaceId: '',
      lawCaseArr: [],
      nullArr: [],
      valueArr: [],
      nextList: [
        {
          value: '诉前程序'
        }
      ],
      nextList1: [
        {
          value: '待庭室确认'
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
      ]
    }
  },
  watch: {
    caseType(newVal, oldVale) {
      if (newVal !== oldVale) {
        this.isUpdate = true
      } else {
        this.isUpdate = false
      }
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
    show(e) {
      console.log(e)
      this.allCaseSelected = e
      console.log(this.allCaseSelected)
      // this.form.resetFields()
      if (this.selectedRows.length === 1) {
        if (!this.isWhole) {
          if (!this.selectedRows[0].lawCaseBean.caseNo) {
            this.caseType = 1
          } else {
            this.caseType = 2
          }
          if (this.isUpdate) {
            this.form.resetFields()
          }
        } else {
          if (!this.allCaseSelected[0].caseNo) {
            this.caseType = 1
          } else {
            this.caseType = 2
          }
          if (this.isUpdate) {
            this.form.resetFields()
          }
        }
      }
      if (this.selectedRows.length > 1) {
        this.selectedRows.forEach(item => {
          this.caseTypeArr.push(item.lawCaseBean.caseNo)
        })
        console.log(this.caseTypeArr)
        for (let i = 0; i <= this.caseTypeArr.length; i++) {
          if (this.caseTypeArr[i] == null) {
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
      if (!this.isWhole) {
        this.lawCaseArr = []
        this.selectedRows.map(item => {
          this.lawCaseArr.push(item.lawCaseBean.id)
        })
      }
      if (this.isWhole) {
        this.lawCaseArr = []
        this.selectedRows.map(item => {
          this.lawCaseArr.push(item.caseId)
        })
      }
      console.log(this.lawCaseArr)
      this.nullArr = []
      this.valueArr = []
      this.caseTypeArr = []
      this.isnext = true
    },
    // 是否需要组长审核
    changeNeed(e) {
      this.needConform = e.target.value
    },
    // 修改送达类型
    changeNextType(e) {
      this.nextProcess = e
      this.form.setFieldsValue({
        condition: undefined
      })
      if (e == '诉前程序') {
        this.type = 1
      } else if (e == '待庭室确认') {
        this.type = 2
      }
    },
    nextConfirm() {
      this.form.validateFields(err => {
        if (err) {
          return
        }
        const params = {
          ...this.form.getFieldsValue(),
          lawCases: this.lawCaseArr
        }
        params.mediatePlaceId = this.mediatePlaceId
        console.log(params)
        this.loading = true
        if (!this.isWhole) {
          unSendNextProcess(params).then(res => {
            this.isOK(res)
          })
        }
        if (this.isWhole) {
          params.process = this.form.getFieldsValue().condition
          allCaseNext(params).then(res => {
            this.isOK(res)
          })
        }
      })
    },
    isOK(res) {
      this.loading = false
      if (res.code === 200) {
        this.$emit('refresh')
        this.loading = false
        this.isnext = false
        this.form.resetFields()
        this.$message.success(res.msg)
      }
    }

  }
}
</script>

<style scoped lang="less">
</style>
