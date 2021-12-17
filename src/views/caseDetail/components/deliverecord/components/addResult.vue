<template>
  <Modal
    v-model="visible"
    title="送达结果"
    class="modal"
    :mask-closable="false"
    width="500px"
    @cancel="visible=false"
  >
    <Form ref="form" :schema="schema" :wrapper-col="16" />
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
import { Modal, Button } from 'ant-design-vue'
import { addSendResult } from '@/api/send/index.js'
import Form from '@/components/Form'
import { mapGetters } from 'vuex'
export default {
  components: {
    Modal,
    Form,
    Button
  },
  props: {
    sendProcess: {
      type: Number,
      default: 1 // 1 诉前送达 2 庭前送达
    }
  },
  data() {
    return {
      visible: false,
      loading: false,
      schema: [
        // 送达结果
        {
          label: '受送达人',
          type: 'input',
          disabled: true,
          field: 'litigantId',
          formOption: { rules: [{ required: true, message: '请输入受送达人' }] }
        },
        {
          label: '送达结果',
          type: 'select',
          field: 'sendResult',
          options: [
            {
              value: 0,
              label: '送达中'
            },
            {
              value: 1,
              label: '送达成功'
            },
            {
              value: 2,
              label: '送达失败'
            }
          ],
          formOption: { rules: [{ required: true, message: '请选择送达结果' }] }
        }
      ],
      litigantId: '',
      form: this.$form.createForm(this, { name: 'form' })
    }
  },
  computed: {
    ...mapGetters(['getLawCaseId'])
  },
  watch: {
    title() {
      this.$refs?.form?.resetFields()
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    show(item) {
      this.litigantId = item.litigant.litigantId
      this.schema[0].formOption = { rules: [{ required: true, message: '请输入受送达人' }], initialValue: item.litigant.litigantName }
      this.visible = true
    },
    onConfirm() {
      this.$refs.form.getFieldsValue().then(res => {
        const params = {
          ...res
        }
        params.sendProcess = this.sendProcess
        params.litigantId = this.litigantId
        addSendResult(params).then(({ code, msg }) => {
          this.loading = false
          if (code === 200) {
            this.$message.success(msg)
            this.$refs.form.resetFields()
            this.$emit('done')
            this.visible = false
          }
        })
      })
    }
  }
}
</script>

<style scoped lang="less">
.no-margin {
  margin: 0;
}
.btn {
  width: 90%;
}
</style>
