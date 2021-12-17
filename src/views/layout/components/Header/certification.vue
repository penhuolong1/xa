<template>
  <Modal
    v-model="visible"
    title="律师认证"
    class="modal"
    width="500px"
    :mask-closable="false"
    :footer="false"
    @cancel="visible=false"
  >
    <Form ref="form" :label-col="8" :schema="schema" />
    <Row>
      <Col :span="24" class="text-center">
        <Button type="primary" class="btn" block size="large" :loading="loading" @click="submit">认证1</Button>
      </Col>
    </Row>
  </Modal>
</template>
<script>
import { Modal, Button, Col, Row } from 'ant-design-vue'
import { agentLegalize } from '@/api/user/user.js'
import Form from '@/components/Form/index'
import { mapGetters } from 'vuex'
const schema = [
  {
    type: 'input',
    label: '执业机构',
    field: 'agentUnit',
    formOption: { rules: [{ required: true, message: '请输入执业机构' }] }
  },
  {
    type: 'input',
    label: '执业证号',
    field: 'agentNo',
    formOption: { rules: [{ required: true, message: '请输入执业证号' }] }
  },
  {
    type: 'input',
    label: '发证机关',
    field: 'agentUnitIssuance',
    formOption: { rules: [{ required: true, message: '请输入发证机关' }] }
  },
  {
    type: 'input',
    label: '律师职业资格证号/律师资格证号',
    field: 'agentIdNo',
    styleClass: 'mystyle',
    formOption: { rules: [{ required: true, message: '请输入发证机关' }] }
  },
  {
    type: 'upload',
    label: '职业机构',
    field: 'agentFile',
    action: '/api/court/file/uploadProveFile'
  }
]
export default {
  components: {
    Modal,
    Col,
    Row,
    Form,
    Button
  },
  props: {
  },
  data() {
    return {
      visible: false,
      schema,
      loading: false,
      type: 1, // 1 账号密码登陆 2短信验证码登陆
      form: this.$form.createForm(this, { name: 'form' })
    }
  },
  computed: {
    ...mapGetters(['getUserInfo'])
  },
  created() {
  },
  mounted() {
  },
  methods: {
    show() {
      this.visible = true
    },
    submit() {
      this.$refs.form.getFieldsValue().then(res => {
        const params = {
          ...res
        }
        params.agentFile = params.agentFile && params.agentFile.length > 0 ? params.agentFile.map(item => item.url).join(',') : ''
        params.userId = this.getUserInfo.user.userId
        this.loading = true
        agentLegalize(params).then(({ code, msg }) => {
          this.loading = false
          if (code === 200) {
            this.$message.success(msg)
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
.no-margin {
  margin: 0;
}
.btn {
  width: 90%;
}
/deep/.mystyle {
  display: flex;
  .ant-form-item-label {
    line-height: 1.5;
  }
}
</style>
