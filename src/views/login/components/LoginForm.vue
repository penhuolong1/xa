<template>
  <div class="w-full">
    <h1 class="font-bold text-3xl enter-X mb-6">登陆</h1>
    <Form :form="form">
      <FormItem class="enter-X">
        <Input
          v-decorator="[
            'username',
            { rules: [{ required: true, message: 'Please input your name' }] },
          ]"
          size="large"
          placeholder="账号"
        />
      </FormItem>
      <FormItem class="enter-X">
        <Input
          v-decorator="[
            'password',
            { rules: [{ required: true, message: 'Please input your name' }] },
          ]"
          type="password"
          size="large"
          placeholder="账号"
        />
      </FormItem>
      <FormItem class="enter-X">
        <Row type="flex" align="middle">
          <Col :span="12">
            <Checkbox v-model="rememberMe" size="small">
              记住我
            </Checkbox>
          </Col>
          <Col :span="12" class="text-right">
            <Button type="link">忘记密码?</Button>
          </Col>
        </Row>
      </FormItem>
      <FormItem class="enter-X">
        <Button type="primary" size="large" class="w-full" @click="login">登陆</Button>
      </FormItem>
      <Row class="enter-X" type="flex" :gutter="20" align="middle">
        <Col :span="8">
          <Button class="w-full">手机登陆</Button>
        </Col>
        <Col :span="8">
          <Button class="w-full">二维码登陆</Button>
        </Col>
        <Col :span="8">
          <Button class="w-full">注册</Button>
        </Col>
      </Row>
      <Divider class="my-5 enter-X">其他登录方式</Divider>
      <div class="flex enter-X">
        <Svg-icon icon-class="github" class="icon" />
        <Svg-icon icon-class="wx" class="icon" />
        <Svg-icon icon-class="zfb" class="icon" />
        <Svg-icon icon-class="google" class="icon" />
        <Svg-icon icon-class="twitter" class="icon" />
      </div>
      <img v-show="false" height="32px" style="vertical-align: middle;" :src="userCodeSrc" alt="验证码">
    </Form>
  </div>
</template>

<script>
import { Form, Input, Row, Col, Checkbox, Button, Divider, message as Message } from 'ant-design-vue'
import { login2 } from '@/api/user/user.js'
import MD5 from 'MD5'
export default {
  components: {
    Form,
    FormItem: Form.Item,
    Input,
    Col,
    Row,
    Checkbox,
    Button,
    Divider
  },
  props: {

  },
  data() {
    return {
      form: this.$form.createForm(this, { name: 'dynamic_rule' }),
      rememberMe: false,
      userCodeSrc: '/api/main/code.jhtml?tm=' + Math.random()
    }
  },
  created() {
  },
  mounted() {

  },
  methods: {
    login() {
      const params = {
        ...this.form.getFieldsValue(),
        code: '123',
        lit: false
      }
      console.log(this.form.getFieldValue('password'))
      params.password = MD5(params.password)
      login2(params).then(async({ state, message }) => {
        if (state === 100) {
          Message.success(message)
          await this.$store.dispatch('GetUserInfo')
          this.$router.push('/home')
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
/deep/ .inner-text{
  font-size: 12px;
  color: rgba(0, 0, 0, 0.45);
}
.icon {
  color: #888;
  flex: 1;
  font-size: 25px;
  cursor: pointer;
  &:hover {
    color: #0960bd;
  }
}
</style>
