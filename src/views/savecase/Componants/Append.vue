<template>
  <div>
    <Modal
      v-model="record"
      :mask-closable="false"
      title="补录保全"
      style="width:600px"
      @ok="toAppend"
    >
      <template slot="footer">
        <Button key="back" @click="record=false">
          取消
        </Button>
        <Button key="submit" type="primary" :loading="loading" @click="toAppend">
          确定
        </Button>
      </template>
      <Form :form="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 14 }">
        <FormItem
          label="保全立案日期"
        >
          <DatePicker
            v-decorator="[
              'preserveDate',
              { rules: [{ required: false, message: '请选择保全立案日期' }],},
            ]"
            placeholder="请选择日期"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </FormItem>
        <FormItem
          label="保全案号"
          placeholder="请输入保全案号"
          class="required"
        >
          <CaseNo
            ref="caseNo"
            v-decorator="['caseNo', { initialValue: '' }]"
            :type-list="typelist"
            :is-need-button="false"
            :input-disabled="false"
          />
        </FormItem>
        <!-- <FormItem
          label="备注"
        >
          <TextArea
            v-decorator="[
              'remark',
            ]"
          />
        </FormItem> -->
      </Form>
    </Modal>
  </div>
</template>
<script>
import { Button, Modal, Form, Input, DatePicker } from 'ant-design-vue'
import { append } from '@/api/freeze/index.js'
import CaseNo from '@/components/CaseNo/index.vue'
import moment from 'moment'
export default {
  components: {
    Button,
    Modal,
    Form,
    FormItem: Form.Item,
    CaseNo,
    TextArea: Input.TextArea,
    DatePicker
  },
  props: {
    selectedRows: {
      type: Array,
      default: () => []
    },
    selectRow: {
      type: Object,
      default: () => {}
    },
    type: {
      type: Number,
      default: () => 0
    }
  },
  data() {
    return {
      record: false,
      form: this.$form.createForm(this, { name: 'coordinated' }),
      loading: false,
      defaultDate: '',
      typelist: [{
        label: '闽0213财保',
        value: '闽0213财保'
      }
      ]
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    show() {
      setTimeout(() => { this.record = true }, 200)
      this.record = true
      if (this.selectedRows && this.selectedRows.length != 0) {
        this.defaultDate = this.selectedRows[0].lawCaseBean.preFilingDate
      } else {
        this.defaultDate = this.selectRow.preserveDate
      }
    },
    append(params) {
      append(params).then(res => {
        this.loading = false
        if (res.code === 200) {
          this.form.resetFields()
          this.$refs.caseNo.reset()
          this.$message.success(res.msg)
          this.record = false
          this.$emit('refresh')
        }
      })
    },
    // 补录保全案号
    toAppend() {
      this.form.validateFields((err) => {
        if (err) {
          return
        }
        if (this.type === 1) {
          if (this.selectedRows[0].createBy == undefined || this.selectedRows[0].createBy == null) {
            const params = {
              ...this.form.getFieldsValue(),
              preservationCase: this.selectedRows[0].id,
              lawCase: this.selectedRows[0].lawCaseBean.id
            }

            if ((!this.$refs.caseNo.year && this.$refs.caseNo.num) || (this.$refs.caseNo.year && !this.$refs.caseNo.num)) {
              this.$message.error('请将保全案号填写完整')
              return
            }
            if (!this.$refs.caseNo.year && !this.$refs.caseNo.num) {
              this.$message.error('案号不能为空')
              return
            }
            if (this.$refs.caseNo.year && this.$refs.caseNo.num) {
              params.preserveCaseNo = this.$refs.caseNo.getCaseNo().caseNo
            }
            this.loading = true
            this.append(params)
          }
        }
        if (this.type === 2) {
          if (this.selectRow.preserveCaseBean.preserveCaseNo === null) {
            const params = {
              ...this.form.getFieldsValue(),
              preservationCase: this.selectRow.id,
              lawCase: this.selectRow.lawCase
            }
            if (this.$refs.caseNo.year && this.$refs.caseNo.num) {
              params.caseNo = this.$refs.caseNo.getCaseNo().caseNo
            }
            if ((!this.$refs.caseNo.year && this.$refs.caseNo.num) || (this.$refs.caseNo.year && !this.$refs.caseNo.num)) {
              this.$message.error('请将保全案号填写完整')
              return
            }
            if (!this.$refs.caseNo.year && !this.$refs.caseNo.num) {
              this.$message.error('案号不能为空')
              return
            }
            console.log(this.$refs.caseNo.year, this.$refs.caseNo.num)
            this.loading = true
            this.append(params)
          }
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
</style>
