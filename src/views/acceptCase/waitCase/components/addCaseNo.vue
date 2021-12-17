<template>
  <Modal
    v-model="visible"
    title="录入案号"
    width="800px"
    :mask-closable="false"
    class="modal"
    @cancel="visible=false"
  >
    <Form :form="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
      <FormItem label="案号" class="required">
        <CaseNo ref="caseNo" v-decorator="['caseNo', { initialValue: '' }]" default-value="(2021)闽0213民初" :type-list="trialFieldType1" :is-need-button="false" :input-disabled="false" />
      </FormItem>
      <FormItem label="承办部门">
        <Select
          v-decorator="['takingDepartmentId', { rules: [{ required: true,message:'承办部门不能为空'}] }]"
          placeholder="请选择"
        >
          <SelectOption v-for="item in departmentList" :key="item.id" :value="item.id">{{ item.name }}</SelectOption>
        </Select>
      </FormItem>
      <Judge
        form
        label="承办人"
        field="judgeId"
        :type="1"
        :form-option="{rules: [{ required: true,message:'承办人不能为空'}]}"
        placeholder="请选择"
      />
      <Judge
        form
        label="书记员"
        field="clerkId"
        :type="2"
        :form-option="{rules: [{ required: true,message:'书记员不能为空'}]}"
        placeholder="请选择"
      />
      <FormItem label="立案日期">
        <DatePicker
          v-decorator="['filingDate', { rules: [{ required: true,message:'立案日期不能为空'}] }]"
          type="date"
          value-format="YYYY-MM-DD HH:mm:ss"
        />
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
import { Modal, Form, Select, DatePicker, Button } from 'ant-design-vue'
import { filingCase } from '@/api/collectCase'
import { queryDepartment } from '@/api/addCase/index.js'
import CaseNo from '@/components/CaseNo'
import Judge from '@/components/Common/Judge.vue'
import { trialFieldType1 } from '@/type/index.js'
export default {
  components: {
    Modal,
    Form,
    FormItem: Form.Item,
    Select,
    SelectOption: Select.Option,
    DatePicker,
    Button,
    Judge,
    CaseNo
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
      list: [],
      departmentList: [],
      trialFieldType1
    }
  },
  created() {
  },
  mounted() {
    this.init()
  },
  methods: {
    show() {
      this.visible = true
    },
    init() {
      queryDepartment().then(({ code, data }) => {
        if (code === 200) {
          if (!data || data.length === 0) {
            return
          }
          this.departmentList = data
        }
      })
    },
    onConfirm() {
      this.form.validateFields(err => {
        if (err) {
          return
        }
        const params = {
          lawCaseId: this.selectKey[0].lawCaseId,
          ...this.form.getFieldsValue()
        }
        if (!this.$refs.caseNo.year || !this.$refs.caseNo.typeLabel || !this.$refs.caseNo.num) {
          this.$message.error('请输入完整的案号')
          return
        }
        params.caseNo = this.$refs.caseNo.getCaseNo().caseNo
        if (!params.caseNo) {
          this.$message.error('案号不能为空')
          return
        }
        params.number = this.$refs.caseNo.num
        this.loading = true
        filingCase(params).then(({ code, msg }) => {
          this.loading = false
          if (code === 200) {
            this.$message.success(msg)
            this.$emit('done')
            this.form.resetFields()
            this.visible = false
          }
        })
      })
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
