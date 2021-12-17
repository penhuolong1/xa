<template>
  <Modal
    v-model="visible"
    title="添加备注"
    style="width:600px"
    :mask-closable="false"
    class="modal"
    @cancel="visible = false"
  >
    <Form :form="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 14 }">
      <FormItem label="备注">
        <TextArea
          v-decorator="['content', { rules: [{ required: true,message:'请添加备注内容' }], initialValue:isEdit?remark:''},]"
          placeholder="备注内容"
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
import { Modal, Form, Input, Button } from 'ant-design-vue'
import { sfaddremark } from '@/api/freeze/index.js'
import { mapGetters } from 'vuex'

export default {
  components: {
    Modal,
    Form,
    FormItem: Form.Item,
    TextArea: Input.TextArea,
    Button
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      id: null,
      remark: '备注内容',
      visible: false,
      loading: false,
      litigantList: [],
      form: this.$form.createForm(this, { name: 'form' })
    }
  },

  computed: {
    ...mapGetters(['getSfLawCaseId'])
  },

  created() {
  },

  mounted() {
  },

  methods: {
    show(e) {
      this.visible = true
      if (e) {
        this.id = e.id
        this.remark = e.content
      } else {
        this.remark = ''
      }
    },
    onConfirm() {
      this.form.validateFields(err => {
        if (err) {
          return
        }
        const params = {
          ...this.form.getFieldsValue(),
          lawCase: this.getSfLawCaseId
        }
        if (this.id) {
          params.id = this.id
        }
        this.loading = true
        sfaddremark(params).then(({ code, msg }) => {
          this.loading = false
          if (code === 200) {
            this.$message.success(msg)
            this.$emit('done')
            this.form.resetFields()
            this.remark = ''
            this.visible = false
          }
        })
      })
    }
  }
}
</script>

<style scoped lang="less">
</style>
