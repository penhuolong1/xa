<template>
  <Modal
    v-model="visible"
    title="忘记密码"
    class="modal"
    width="500px"
    :mask-closable="false"
    :footer="false"
    @cancel="visible=false"
  >
    <Form ref="form" :schema="schema" />
    <Row class="mb-10 mt-2.5">
      <Col :span="6" />
      <Col :span="16">
        <Row>
          <Col :span="8" class="text-left" />
          <Col :span="16" class="text-right">
            <a @click="toLogin">用户登陆</a>
          </Col>
        </Row>
      </Col>
    </Row>
    <Row>
      <Col :span="24" class="text-center">
        <Button type="primary" class="btn" block size="large" :loading="loading" @click="submit">确认</Button>
      </Col>
    </Row>
  </Modal>
</template>
<script>
import { Modal, Select, Input, Button, Col, Row } from 'ant-design-vue'
import PhoneCode from '@/components/PhoneCode'
import { validPhoneForm, validIDCardForm } from '@/utils/validate.js'
import { resetPwd } from '@/api/user/user.js'
import Form from '@/components/Form'
const schema = [
  {
    label: '姓名',
    type: 'input',
    field: 'nickName',
    formOption: { rules: [{ required: true, message: '请输入用户名' }] }
  },
  {
    label: '证件号',
    type: 'input',
    field: 'userName',
    formOption: { rules: [{ required: true, message: '请输入证件号' }] }
  },
  {
    label: '手机号码',
    type: 'input',
    field: 'phone',
    formOption: { rules: [{ required: true, validator: validPhoneForm }] }
  },
  {
    label: '验证码',
    type: 'phoneCode',
    field: 'code',
    phoneCodeType: 3,
    phoneField: 'phone',
    formOption: { rules: [{ required: true, message: '请输入验证码' }] }
  },
  {
    label: '新密码',
    type: 'input',
    inputType: 'password',
    field: 'password1',
    formOption: { rules: [{ required: true, message: '请输入密码' }] }
  },
  {
    label: '确认密码',
    type: 'input',
    inputType: 'password',
    field: 'password2',
    formOption: { rules: [{ required: true, message: '请输入密码' }] }
  }
]
export default {
  components: {
    Modal,
    Form,
    Col,
    Row,
    Button
  },
  props: {
  },
  data() {
    return {
      visible: false,
      loading: false,
      schema,
      type: 1, // 1 账号密码登陆 2短信验证码登陆
      form: this.$form.createForm(this, { name: 'form' })
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
      this.visible = true
    },
    submit() {
      this.$refs.form.getFieldsValue().then(res => {
        const params = {
          ...res
        }
        params.type = 1
        resetPwd(params).then(({ code, msg }) => {
          this.loading = false
          if (code === 200) {
            this.$message.success(msg)
            this.$refs.form.resetFields()
            this.visible = false
          } else {
            this.$refs.form.resetPhoneCode()
          }
        })
      })
    },
    toLogin() {
      this.visible = false
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
