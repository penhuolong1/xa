<template>
  <div>
    <Modal
      v-model="visible"
      title="登录"
      class="modal"
      :mask-closable="false"
      width="500px"
      :footer="false"
      @cancel="visible=false"
    >
      <Form :form="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
        <!-- <FormItem v-if="role === 1" label="登录角色">
          <Select v-decorator="['type',{rules: [{ required: true,message:'请选择登录角色' }]}]" placeholder="请选择登录角色" @change="getType">
            <SelectOption value="3">法院</SelectOption>
            <SelectOption value="4">诉非机构</SelectOption>
            <SelectOption value="5">调解组织</SelectOption>
            <SelectOption value="6">调解人员</SelectOption>
          </Select>
        </FormItem>
        <FormItem v-if="role === 2" label="登录角色">
          <Select v-decorator="['type',{rules: [{ required: true,message:'请选择登录角色' }]}]" placeholder="请选择登录角色" @change="getType">
            <SelectOption value="1">当事人</SelectOption>
            <SelectOption value="2">代理人</SelectOption>
          </Select>
        </FormItem> -->
        <FormItem label="登录账号">
          <Input v-decorator="['username',{rules: [{ required: true,message:'请输入账号' }]}]" placeholder="请输入账号" />
        </FormItem>
        <FormItem v-if="type === 1" label="登录密码" class="no-margin">
          <Input v-decorator="['password',{rules: [{ required: true,message:'请输入密码' }]}]" type="password" placeholder="请输入密码" />
        </FormItem>
        <PhoneCode
          v-if="type === 2"
          class="no-margin"
          field="code"
          :form="form"
          phone-field="username"
          label="验证码"
          :data="{type: loginType}"
          :type="2"
          :form-options="{rules: [{ required: true,message:'请输入密码' }]}"
          placeholder="请输入验证码"
        />
        <Row class="mb-10 mt-2.5">
          <Col :span="6" />
          <Col :span="16">
            <Row>
              <Col :span="8" class="text-left">
                <a v-if="type === 1" @click="smsLogin">短信验证码登陆</a>
                <a v-if="type === 2" @click="accoutLogin">账号密码登陆</a>
              </Col>
              <Col :span="16" class="text-right">
                <a @click="forgetPwd">忘记密码?</a>
              </Col>
            </Row>
          </Col>
        </Row>
      </Form>
      <Row>
        <Col :span="24" class="text-center">
          <Button type="primary" class="btn" block size="large" :loading="loading" @click="login">登录</Button>
        </Col>
      </Row>
    </Modal>
    <Modal
      v-model="visible1"
      title="选择单位"
      class="modal"
      :mask-closable="false"
      width="500px"
      :footer="false"
      @cancel="visible=false"
    >
      <Form :form="form1" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
        <FormItem label="单位">
          <Select v-decorator="['deptId',{rules: [{ required: true,message:'请选择单位' }]}]" placeholder="请选择单位" @change="getType">
            <SelectOption v-for="item in deptList" :key="item.deptId" :value="item.deptId">{{ item.deptName }}</SelectOption>
          </Select>
        </FormItem>
      </Form>
      <Row>
        <Col :span="24" class="text-center">
          <Button type="primary" class="btn" block size="large" :loading="loading" @click="chooseDep">登录</Button>
        </Col>
      </Row>
    </Modal>
    <ForgetPwd ref="forgetPwd" />
  </div>
</template>
<script>
import { Modal, Form, Select, Input, Button, Col, Row } from 'ant-design-vue'
import ForgetPwd from './forgetPwd.vue'
import PhoneCode from '@/components/PhoneCode'
import { login, chooseDept } from '@/api/user/user.js'
// import axios from 'axios'

export default {
  components: {
    Modal,
    Form,
    FormItem: Form.Item,
    Select,
    Col,
    Row,
    SelectOption: Select.Option,
    Input,
    Button,
    ForgetPwd,
    PhoneCode
  },
  props: {
    role: {
      type: Number,
      default: 1 // 1 机构 2 当事人
    },
    deptList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      visible: false,
      loading: false,
      loginType: 1, // 1自然人 2法人
      type: 1, // 1 账号密码登陆 2短信验证码登陆
      visible1: false,
      token: '',
      form: this.$form.createForm(this, { name: 'form' }),
      form1: this.$form.createForm(this, { name: 'form1' })
    }
  },
  computed: {
  },
  watch: {
    visible() {
      if (!this.visible) {
        this.form.resetFields()
      }
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    show() {
      this.visible = true
    },
    show1(token) {
      console.log(token)
      this.token = token
      this.visible1 = true
    },
    forgetPwd() {
      this.$refs.forgetPwd.show()
    },
    getType(e) {
      console.log(e)
      this.loginType = e
    },
    login() {
      // axios()
      this.form.validateFields(err => {
        if (err) {
          return
        }
        const params = {
          // lawCaseId: this.selectKey[0].lawCaseId,
          ...this.form.getFieldsValue(),
          type: this.role
        }
        if (params.type === 1) {
          params.wx = true
        }
        this.loading = true
        login(params).then(async({ code, msg, token, deptList }) => {
          this.loading = false
          if (code === 200) {
            this.$message.success(msg)
            this.$emit('done')
            this.form.resetFields()
            this.token = token
            this.visible = false
            localStorage.setItem('xaTokan', token)
            if (deptList && deptList.length > 0) {
              this.deptList = deptList
              this.visible1 = true
            } else {
              await this.$store.dispatch('GetUserInfo')
              if (params.type === 3) {
                this.$router.push('/collectCase/waitReview')
              } else {
                this.$router.push('/sfCaseManage/addCaseList')
              }
            }
          }
        })
      })
    },
    // 选择机构
    chooseDep() {
      this.form1.validateFields(err => {
        if (err) {
          return
        }
        const params = {
          ...this.form1.getFieldsValue()
        }
        chooseDept(params, this.token).then(async res => {
          if (res.code === 200) {
            this.$message.success(res.msg)
            localStorage.setItem('xaTokan', this.token)
            await this.$store.dispatch('GetUserInfo')
            if (this.role === 3) {
              this.$router.push('/collectCase/waitReview')
            } else {
              this.$router.push('/sfCaseManage/addCaseList')
            }
          }
        })
      })
    },
    smsLogin() {
      this.type = 2
    },
    accoutLogin() {
      this.type = 1
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
