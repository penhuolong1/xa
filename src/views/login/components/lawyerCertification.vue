<template>
  <Modal
    v-model="visible"
    title="律师认证"
    class="modal"
    :mask-closable="false"
    width="500px"
    :footer="false"
    @cancel="visible=false"
  >
    <!-- <Form :form="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
      <FormItem label="登录角色">
        <Select v-decorator="['type',{rules: [{ required: true,message:'请选择登录角色' }]}]" placeholder="请选择登录角色">
          <SelectOption value="1">当事人</SelectOption>
          <SelectOption value="2">代理人</SelectOption>
          <SelectOption value="3">调解角色</SelectOption>
        </Select>
      </FormItem>
      <FormItem label="登录账号">
        <Input v-decorator="['username',{rules: [{ required: true,message:'请输入账号' }]}]" placeholder="请输入账号" />
      </FormItem>
      <FormItem label="登录密码" class="no-margin">
        <Input v-decorator="['password',{rules: [{ required: true,message:'请输入密码' }]}]" type="password" placeholder="请输入密码" />
        <Col :span="8" class="text-left">
          <a @click="smsLogin">短信验证码登陆</a>
        </Col>
        <Col :span="16" class="text-right">
          <a>忘记密码?</a>
        </Col>
      </FormItem>
    </Form> -->
    <Form :schema="schema" />
    <Row>
      <Col :span="24" class="text-center">
        <Button type="primary" class="btn" block size="large" :loading="loading" @click="login">登录</Button>
      </Col>
    </Row>
  </Modal>
</template>
<script>
import { Modal, Select, Input, Button, Col, Row } from 'ant-design-vue'
import { login } from '@/api/user/user.js'
import Form from '@/components/Form/index'
const schema = [
  {
    type: 'input',
    field: ''
  }
]
export default {
  components: {
    Modal,
    Select,
    Col,
    Row,
    SelectOption: Select.Option,
    Input,
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
  },
  created() {
  },
  mounted() {
  },
  methods: {
    show() {
      this.visible = true
    },
    login() {
      this.form.validateFields(err => {
        if (err) {
          return
        }
        const params = {
          // lawCaseId: this.selectKey[0].lawCaseId,
          ...this.form.getFieldsValue()
        }
        this.loading = true
        login(params).then(({ code, msg }) => {
          this.loading = false
          if (code === 200) {
            this.$message.success(msg)
            this.$emit('done')
            this.form.resetFields()
            this.visible = false
          }
        })
      })
    },
    smsLogin() {
      this.type = 2
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
