<template>
  <div>
    <Modal
      v-model="visible"
      title="退回"
      :mask-closable="false"
      style="width:600px"
    >
      <Form ref="form" :label-col="6" :schema="schema" />

      <template slot="footer">
        <Button key="back" @click="isback=false">
          取消
        </Button>
        <Button key="submit" type="primary" :loading="loading" @click="submit">
          确定
        </Button>
      </template>
    </Modal>
  </div>
</template>
<script>
import { Button, Modal } from 'ant-design-vue'
import { handleTeam } from '@/api/sfAddcase/index.js'
import Form from '@/components/Form'

export default {
  components: {
    Button,
    Modal,
    Form
  },
  props: {
    selectedRows: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      loading: false,
      visible: false,
      form: this.$form.createForm(this, { name: 'form' }),
      schema: [
        {
          label: '退回理由',
          type: 'textArea',
          field: 'opinion',
          formOption: { rules: [{ required: true, message: '请输入理由' }] }
        }
      ]
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    show(id) {
      this.teamId = id
      this.visible = true
    },
    submit() {
      this.$refs.form.getFieldsValue().then(res => {
        const params = {
          ...res
        }
        params.id = this.teamId
        params.handleType = 2
        this.loading = true
        handleTeam(params).then(({ code, msg }) => {
          if (code === 200) {
            this.$message.success(msg)
            this.visible = false
            this.$emit('done')
          }
        })
      })
    }
  }
}
</script>

<style scoped lang="less">
</style>
