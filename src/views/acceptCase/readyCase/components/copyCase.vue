<template>
  <Modal
    v-model="visible"
    title="复制案件"
    :mask-closable="false"
    style="width:600px"
    class="modal"
    @cancel="visible=false"
  >
    <Form :form="form" :label-col="{ span: 8 }" :wrapper-col="{ span: 12 }">
      <FormItem label="被复制案件案号">
        <Input v-decorator="['preCaseNo', {}]" type="text" disabled />
      </FormItem>
      <FormItem label="已使用最大流水号">
        <Input v-decorator="['maxNumber', {}]" type="text" disabled />
      </FormItem>
      <FormItem label="复制案件个数">
        <Input v-decorator="['copyNum', {rules: [{ required: true,message:'请输入复制案件个数' }]}]" type="number" @input="copyNum" />
      </FormItem>
      <FormItem label="复制内容">
        <CheckboxGroup v-decorator="['copyContent', {initialValue: [1], rules: [{ required: true,message:'请选择复制内容' }]}]">
          <Checkbox :value="1">案件信息</Checkbox>
          <Checkbox :value="2">当事人</Checkbox>
        </CheckboxGroup>
      </FormItem>
      <FormItem label="生成案件年度">
        <Select v-decorator="['year', {rules: [{ required: true,message:'请选择生成案件年度' }]}]">
          <SelectOption v-for="item in yearList" :key="item" :value="item">{{ item }}</SelectOption>
        </Select>
      </FormItem>
      <FormItem label="生成流水号范围" style="margin-bottom:0;">
        <FormItem
          :style="{ display: 'inline-block', width: 'calc(50% - 12px)' }"
        >
          <Input v-decorator="['serialNumbersStart', { rules: [{ required: true,message:'请输入流水号范围' }] }]" placeholder="流水号范围" style="width: 100%" @change="changeInput" />
        </FormItem>
        <span :style="{ display: 'inline-block', width: '24px', textAlign: 'center' }">
          -
        </span>
        <FormItem :style="{ display: 'inline-block', width: 'calc(50% - 12px)' }">
          <Input v-decorator="['serialNumbersEnd', { rules: [{ required: true,message:'请输入流水号范围' }] }]" disabled placeholder="流水号范围" style="width: 100%" />
        </FormItem>
      </FormItem>
      <FormItem label="流水号段号">
        <TextArea v-decorator="['unUsedNums']" type="text" rows="3" disabled />
      </FormItem>
    </Form>
    <template slot="footer">
      <Button @click="visible=false">
        取消
      </Button>
      <Button type="primary" :loading="loading" @click="onConfirm">
        确认
      </Button>
    </template>
  </Modal>
</template>
<script>
import { Modal, Form, Select, Input, Button, Checkbox } from 'ant-design-vue'
import { copyCase, getSerialInfo } from '@/api/collectCase'
import { trialFieldType } from '@/type/index.js'
export default {
  components: {
    Modal,
    Form,
    FormItem: Form.Item,
    Select,
    SelectOption: Select.Option,
    Input,
    TextArea: Input.TextArea,
    Checkbox,
    CheckboxGroup: Checkbox.Group,
    Button
  },
  props: {
    selectKey: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      visible: false,
      loading: false,
      form: this.$form.createForm(this, { name: 'form' }),
      yearList: []
    }
  },
  created() {
  },
  mounted() {
    this.getYearList()
  },
  methods: {
    show() {
      this.visible = true
      this.getData()
    },
    getYearList() {
      const nowYear = new Date().getFullYear()
      const list = [nowYear]
      for (let i = nowYear - 5; i < nowYear; i++) {
        list.push(i)
      }
      this.yearList = list
    },
    // 输入复制案件个数 获取流水号范围
    copyNum(e, startNum) {
      startNum = Number(startNum) || ''
      setTimeout(() => {
        console.log(this.form.getFieldsValue())
        const num = Number(this.form.getFieldsValue().copyNum || 0)
        if (num) {
          this.$nextTick(() => {
            this.form.setFieldsValue({
              serialNumbersStart: startNum || (this.maxNumber + 1),
              serialNumbersEnd: startNum ? (startNum + num) : (this.maxNumber + num)
            })
          })
        }
      }, 200)
    },
    onConfirm() {
      this.form.validateFields(err => {
        const params = {
          // lawCaseId: this.selectKey[0].lawCaseId,
          ...this.form.getFieldsValue()
        }
        if (params.copyNum < 1) {
          return this.$message.error('复制案件个数不能小于一个')
        }
        if (err) {
          return
        }
        if (params.copyContent.length === 2) {
          params.addCaseInfo = true
          params.addLitigantInfo = true
        } else {
          params.addCaseInfo = params.copyContent[0] === 1
          params.addLitigantInfo = params.copyContent[0] === 2
        }
        params.serialNumberId = this.maxNumberId
        params.lawCaseId = this.selectKey[0].lawCaseId
        params.serialNumbers = []
        for (let i = params.serialNumbersStart; i <= params.serialNumbersEnd; i++) {
          params.serialNumbers.push(i + '')
        }
        delete params.copyContent
        delete params.copyNum
        delete params.maxNumber
        delete params.preCaseNo
        delete params.unUsedNums
        delete params.serialNumbersStart
        delete params.serialNumbersEnd
        console.log(params)
        this.loading = true
        const hide = this.$message.loading('正在复制请稍后', 0)
        copyCase(params).then(({ code, msg }) => {
          hide()
          this.loading = false
          if (code === 200) {
            this.$message.success(msg)
            this.$emit('done')
            this.form.resetFields()
            this.visible = false
          }
        })
      })
    },
    getData() {
      console.log(this.selectKey[0])
      const caseNo = this.selectKey[0].preCaseNo
      const prefix = trialFieldType.find(item => caseNo.indexOf(item.value) !== -1).label
      const year = caseNo.split(prefix)[0].replace(/[^0-9]/ig, '')
      const params = {
        year,
        prefix
      }
      this.maxNumberId = null
      getSerialInfo(params).then(({ code, data }) => {
        if (code === 200) {
          console.log('----------')
          console.log(this.form)
          this.$nextTick(() => {
            this.form.setFieldsValue({
              maxNumber: data.maxNumber,
              preCaseNo: this.selectKey[0].preCaseNo,
              unUsedNums: data.unUsedNums && data.unUsedNums.length > 0 ? data.unUsedNums.join(',') : ''
            })
          })
          this.maxNumber = data.maxNumber
          this.maxNumberId = data.maxNumberId
        }
      })
    },
    // 输入流水号
    changeInput(e) {
      setTimeout(() => {
        if (!this.form.getFieldValue('serialNumbersStart')) {
          return
        }
        this.copyNum(this.form.getFieldValue('copyNum'), this.form.getFieldValue('serialNumbersStart'))
      }, 200)
    }
  }
}
</script>

<style scoped lang="less">
.ant-form-item{
  display: flex;
}
.ant-btn{
  margin:10px;
}
.caseno{
  display: flex;
}
.option{
  min-width:300px;
}
.financial{
  display: flex;
  /deep/.ant-select-selection{
    min-width:100px;
  }
}
</style>
