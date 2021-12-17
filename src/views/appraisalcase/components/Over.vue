<template>
  <div>
    <Modal
      v-model="isover"
      title="鉴定结束"
      :mask-closable="false"
      style="width:600px"
    >
      <template slot="footer">
        <Button key="back" @click="isover=false">
          取消
        </Button>
        <Button key="submit" type="primary" :loading="loading" @click="endConfirm">
          确定
        </Button>
      </template>
      <Form :form="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
        <FormItem
          label="鉴定结束时间"
        >
          <DatePicker
            v-decorator="[
              'date',
              { rules: [{ required: true, message: '请选择鉴定时间' }] },
            ]"
            placeholder="请选择时间"
            show-time
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </FormItem>
        <FormItem
          label="备注"
        >
          <TextArea
            v-decorator="[
              'remark',
            ]"
          />
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script>
import { Button, Modal, Form, DatePicker, Input } from 'ant-design-vue'
import { finishappraisalCase } from '@/api/freeze/index.js'
import 'moment/locale/zh-cn'
import moment from 'moment'
export default {
  components: {
    Button,
    Modal,
    Form,
    FormItem: Form.Item,
    DatePicker,
    TextArea: Input.TextArea
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
      default: () => 1
    }
  },
  data() {
    return {
      isover: false,
      loading: false,
      lawCaseArr: [],
      idArr: [],
      form: this.$form.createForm(this, { name: 'coordinated' })
    }
  },
  computed: {

  },
  created() {

  },

  mounted() {
  },

  methods: {
    show() {
      this.isover = true
    },
    end(params) {
      finishappraisalCase(params).then(res => {
        this.loading = false
        if (res.code === 200) {
          this.$emit('refresh')
          this.isover = false
          this.form.resetFields()
          this.$message.success(res.msg)
        }
      })
    },
    endConfirm() {
      this.lawCaseArr = []
      this.idArr = []
      this.selectedRows.forEach(item => {
        this.lawCaseArr.push(item.lawCaseBean.id)
        this.idArr.push(item.id)
      })
      this.form.validateFields((err) => {
        if (err) {
          return
        }
        this.loading = true
        if (this.type === 1) {
          const params = {
            id: this.idArr,
            lawCase: this.lawCaseArr,
            appraisalEndTime: this.form.getFieldsValue().date,
            remark: this.form.getFieldsValue().remark
          }
          this.end(params)
        } else {
          const params = {
            id: this.selectRow.id.split(),
            lawCase: this.selectRow.lawCase.split(),
            remark: this.form.getFieldsValue().remark,
            appraisalEndTime: this.form.getFieldsValue().date
          }
          this.end(params)
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
</style>
