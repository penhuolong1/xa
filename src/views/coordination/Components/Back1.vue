<template>
  <div>
    <Modal
      v-model="isback"
      title="退回"
      :mask-closable="false"
      style="width:600px"
      @ok="backConfirm"
    >
      <template slot="footer">
        <Button key="back" @click="isback=false">
          取消
        </Button>
        <Button key="submit" type="primary" :loading="loading" @click="backConfirm()">
          确定
        </Button>
      </template>
      <Form :form="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
        <FormItem
          label="退回理由"
        >
          <TextArea
            v-decorator="[
              'opinion',
              { rules: [{ required: true, message: '请输入退回理由' }] },
            ]"
          />
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script>
import { Button, Modal, Form, Input } from 'ant-design-vue'
import { handleTeam } from '@/api/sfAddcase/index.js'

export default {
  components: {
    Button,
    Modal,
    Form,
    FormItem: Form.Item,
    Input,
    TextArea: Input.TextArea
  },
  props: {
    type: {
      type: Number,
      default: () => 1
    },
    collaborativeCase: {
      type: Number,
      default: () => 1
    },
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
      collaborativecaseArr: []
    }
  },
  created() {

  },
  mounted() {
  },
  methods: {
    show() {
      this.isback = true
    },
    backConfirm() {
      this.form.validateFields(err => {
        if (err) {
          return
        }
        const params = {
          id: this.selectedRows[0].teamId,
          handleType: 2,
          opinion: this.form.getFieldsValue().opinion
        }
        this.loading = true
        handleTeam(params).then(res => {
          this.loading = false
          if (res.code == 200) {
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
