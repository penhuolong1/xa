<template>
  <div>
    <Modal
      v-model="visible"
      title="办结"
      :mask-closable="false"
      style="width:600px"
    >
      <div v-if="type === 1" style="margin-left: 50px;">是否结束本次发起的联动调解事项?</div>
      <div v-if="type === 2" style="margin-left: 50px;">是否结束本次发起的咨询事项?</div>
      <Form v-if="type === 1" ref="form" :label-col="10" :schema="schema" />
      <template slot="footer">
        <Button key="back" @click="visible=false">
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
import { finishTeam } from '@/api/sfAddcase/index.js'
import Form from '@/components/Form'

export default {
  components: {
    Button,
    Modal,
    Form
  },
  props: {
  },
  data() {
    return {
      loading: false,
      visible: false,
      form: this.$form.createForm(this, { name: 'form' }),
      schema: [
        {
          label: '联动者是否有参与调解',
          type: 'radio',
          field: 'partMediate',
          formOption: { rules: [{ required: true, message: '请输入理由' }], initialValue: true },
          options: [
            {
              value: true,
              label: '是'
            },
            {
              value: false,
              label: '否'
            }
          ]
        }
      ],
      type: null,
      teamId: ''
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    show(params) {
      this.type = params.type
      this.teamId = params.teamId
      this.visible = true
    },
    submit() {
      if (this.type == 1) {
        this.$refs.form.getFieldsValue().then(res => {
          const params = {
            ...res
          }
          params.id = this.teamId
          this.loading = true
          finishTeam(params).then(({ code, msg }) => {
            this.loading = false
            if (code === 200) {
              this.$message.success(msg)
              this.$emit('done')
              this.visible = false
            }
          })
        })
      } else {
        const params = {
        }
        params.id = this.teamId
        this.loading = true
        finishTeam(params).then(({ code, msg }) => {
          this.loading = false
          if (code === 200) {
            this.$message.success(msg)
            this.$emit('done')
            this.visible = false
          }
        })
      }
    }
  }
}
</script>

<style scoped lang="less">
</style>
