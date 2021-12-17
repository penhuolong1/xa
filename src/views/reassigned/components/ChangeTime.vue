<template>
  <div>
    <Modal
      v-model="ischangetime"
      title="修改调解时间"
      style="width:600px"
      :mask-closable="false"
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
              { rules: [{ required: true, message: '请选择调解时间' }],initialValue:selectedRows[0]. mediateTime},
            ]"
            value-format="YYYY-MM-DD HH:mm:ss"
            show-time
          />
        </FormItem>
        <Tribunal
          label="调解地点"
          field="mediationPlace"
          :type="2"
          placeholder="请选择调解地点"
        />
        <!-- <FormItem label="短信通知当事人">
          <RadioGroup v-decorator="['notificationLitigant', { rules: [{ required: false}] ,initialValue: false}] " @change="changeNotice">
            <Radio label="true" :value="true">是</Radio>
            <Radio label="false" :value="false">否</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem v-if="notice" label="通知对象">
          <CheckboxGroup v-decorator="['litigant', { rules: [{ required: true,message:'请选择当事人' }]}]">
            <Checkbox v-for="item in litigants" :key="item.id" :value="item.id">{{ item.name }}</Checkbox>
          </CheckboxGroup>
        </FormItem>
        <FormItem v-if="notice" label="通知内容">
          <TextArea v-decorator="['notificationMessage']" />
        </FormItem> -->
      </Form>
    </Modal>
  </div>
</template>
<script>
import { Button, Modal, Form, Select, DatePicker, Input, Radio, Checkbox } from 'ant-design-vue'
import { changemediationTime } from '@/api/freeze/index.js'
import Tribunal from '@/components/Common/Tribunal.vue'
import { litigantNameByCaseId } from '@/api/schedule/index.js'

import 'moment/locale/zh-cn'
import moment from 'moment'
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
    Checkbox,
    CheckboxGroup: Checkbox.Group,
    Tribunal
  },
  props: {
    selectedRows: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      ischangetime: false,
      loading: false,
      notice: false,
      form: this.$form.createForm(this, { name: 'coordinated' }), // 退回表单
      litigants: [],
      lawCaseArr: [],
      mediationCaseArr: []

    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    show(e) {
      this.caseId = e
      this.ischangetime = true
      this.selectedRows[0].mediateTime = this.selectedRows[0].mediateTime + ' 12:00:00'
      this.getData()
      this.lawCaseArr = []
      this.mediationCaseArr = []
      this.selectedRows.map(item => {
        this.lawCaseArr.push(item.lawCaseBean.id)
        this.mediationCaseArr.push(item.id)
      })
    },
    changeNotice(e) {
      this.notice = e.target.value
    },
    timeConfirm() {
      this.form.validateFields((err) => {
        if (err) {
          return
        }
        this.loading = true
        const params = {
          // mediationCase: this.mediationCaseArr,
          lawCase: this.lawCaseArr,
          ...this.form.getFieldsValue()
        }
        params.notificationLitigant = false
        params.notificationMediatorMessage = '1'
        if (params.notificationLitigant) {
          delete params.notificationMessage
          delete params.litigant
          params.litigants = this.litigants.map(item => {
            return {
              id: item.id,
              message: this.form.getFieldsValue().notificationMessage
            }
          })
        }
        changemediationTime(params).then(res => {
          this.loading = false
          if (res.code === 200) {
            this.form.resetFields()
            this.ischangetime = false
            this.$message.success(res.msg)
            this.$emit('refresh')
            this.notice = false
          }
        })
      })
    },
    // 获取当事人信息
    getData() {
      litigantNameByCaseId({ caseId: this.caseId }).then(({ code, data }) => {
        if (code === 200) {
          if (!data || data.length === 0) {
            this.litigants = []
            return
          }
          this.litigants = data.filter(item => !item.agentFlag)
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
</style>
