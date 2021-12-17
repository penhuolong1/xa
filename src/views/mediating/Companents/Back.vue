<template>
  <div>
    <Modal
      v-model="isback"
      title="退回"
      :mask-closable="false"
      style="width:600px"
    >
      <template slot="footer">
        <Button key="back" @click="isback=false">
          取消
        </Button>
        <Button key="submit" type="primary" :loading="loading" @click="backConfirm">
          确定
        </Button>
      </template>
      <Form :form="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
        <UpProcess ref="procesShow" />

        <FormItem
          label="退回理由"
        >
          <TextArea
            v-decorator="[
              'remark',
              { rules: [{ required: false, message: '请输入退回理由' }] },
            ]"
          />
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script>
import { refundonMediation } from '@/api/freeze/index.js'
import { Button, Modal, Form, Input } from 'ant-design-vue'
import UpProcess from '@/components/UpProcess/index.vue'

export default {
  components: {
    Button,
    Modal,
    Form,
    FormItem: Form.Item,
    Input,
    UpProcess,
    TextArea: Input.TextArea
  },
  props: {
    selectedRows: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      isback: false,
      loading: false,
      form: this.$form.createForm(this, { name: 'coordinated' }),
      lawCaseArr: [],
      mediationCaseArr: []
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    show() {
      this.isback = true
      setTimeout(() => {
        this.$refs.procesShow.getProcess(this.selectedRows[0].lawCaseBean.id)
      }, 10)
    },
    backConfirm() {
      this.loading = true
      this.selectedRows.forEach(item => {
        this.lawCaseArr.push(item.lawCaseBean.id)
        this.mediationCaseArr.push(item.id)
      })
      this.form.validateFields((err, values) => {
        if (err) {
          return
        }
        const form = this.form.getFieldsValue()
        const params = {
          mediationCase: this.mediationCaseArr,
          ...form,
          lawCase: this.lawCaseArr
        }
        refundonMediation(params).then(res => {
          this.loading = false
          if (res.code === 200) {
            this.$message.success(res.msg)
            this.form.resetFields()
            this.isback = false
            this.$emit('refresh')
          }
        })
      })
    }
  }
}
</script>

<style scoped lang="less">
</style>
