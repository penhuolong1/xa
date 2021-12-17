<template>
  <Modal
    v-model="visible"
    title="注册"
    class="modal"
    width="500px"
    :mask-closable="false"
    :footer="false"
    @cancel="visible=false"
  >
    <Form :form="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
      <FormItem label="姓名">
        <Input v-decorator="['nickName',{rules: [{ required: true,message:'请输入姓名' }]}]" placeholder="请输入姓名" />
      </FormItem>
      <FormItem label="证件号码" class="prompt-box">
        <Input v-decorator="['username',{rules: [{ required: true,validator:validIDCard }]}]" placeholder="证件号码为账号名" />
        <Tooltip>
          <template slot="title">
            <span>(证件号码为账号名)</span>
          </template>
          <Icon type="exclamation-circle" class="prompt" />
        </Tooltip>
      </FormItem>
      <FormItem label="手机号码">
        <Input v-decorator="['phone',{rules: [{ required: true,message:'请输入手机号码' }]}]" placeholder="请输入验证码" />
      </FormItem>
      <PhoneCode
        label="验证码"
        phone-field="phone"
        :form="form"
        field="code"
        :form-options="{rules: [{ required: true,message:'请输入验证码' }]}"
      />
      <FormItem label="登录密码">
        <Input v-decorator="['password1',{rules: [{ required: true,message:'请输入登录密码' }]}]" type="password" placeholder="请输入登录密码" />
      </FormItem>
      <FormItem label="确认密码" class="no-margin">
        <Input v-decorator="['password2',{rules: [{ required: true,message:'请输入确认密码' }]}]" type="password" placeholder="请输入确认密码" />
      </FormItem>
      <Row class="mt-5">
        <Col :span="6" class="text-left" />
        <Col :span="16" class="text-right">
          <a>已有账号,去登陆?</a>
        </Col>
      </Row>
    </Form>
    <Row class="mt-5">
      <Col :span="24" class="text-center">
        <Button type="primary" class="btn" block size="large" @click="onConfirm">注册</Button>
      </Col>
    </Row>
  </Modal>
</template>
<script>
import { Modal, Form, Input, Button, Col, Row, Icon, Tooltip } from 'ant-design-vue'
import PhoneCode from '@/components/PhoneCode'
import { validIDCard, validIDCardForm } from '@/utils/validate.js'
import { registerOfPerson } from '@/api/user/user.js'
export default {
  components: {
    Modal,
    Form,
    FormItem: Form.Item,
    Col,
    Row,
    Input,
    Button,
    Icon,
    Tooltip,
    PhoneCode
  },
  props: {
  },
  data() {
    return {
      visible: false,
      loading: false,
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
    validIDCard: validIDCardForm,
    show() {
      this.visible = true
    },
    onConfirm() {
      this.form.validateFields(err => {
        if (err) {
          return
        }
        const params = {
          // lawCaseId: this.selectKey[0].lawCaseId,
          ...this.form.getFieldsValue()
        }
        console.log(params)
        this.loading = true
        registerOfPerson(params).then(({ code, msg }) => {
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
.prompt-box {
  position: relative;
  .prompt {
    position: absolute;
    right: -25px;
    font-size: 18px;
    top: 0px;
    cursor: pointer;
    color: #faad14;
  }
}
.btn {
  width: 90%;
}
</style>
