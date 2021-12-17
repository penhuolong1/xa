<template>
  <Modal
    v-model="visible"
    title="法人"
    class="modal"
    :mask-closable="false"
    width="600px"
    :footer="false"
    @cancel="visible=false"
  >
    <Form :form="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
      <FormItem label="组织类型">
        <Select v-decorator="['type',{rules: [{ required: true,message:'请选择组织类型' }]}]">
          <SelectOption :value="1">法人</SelectOption>
          <SelectOption :value="2">非法人</SelectOption>
        </Select>
      </FormItem>
      <FormItem label="主体名称">
        <Input v-decorator="['nickName',{rules: [{ required: true,message:'请输入主体名称'}]}]" placeholder="请输入主体名称" />
      </FormItem>
      <FormItem label="社会统一信息代码" class="prompt-box">
        <Input v-decorator="['username',{rules: [{ required: true,message:'请输入社会统一信用代码' }]}]" placeholder="请输入社会统一信用代码" />
        <Tooltip>
          <template slot="title">
            <span>(证件号码为账号名)</span>
          </template>
          <Icon type="exclamation-circle" class="prompt" />
        </Tooltip>
      </FormItem>
      <FormItem label="登录密码">
        <Input v-decorator="['password1',{rules: [{ required: true,message:'请输入登录密码' }]}]" type="password" placeholder="请输入登录密码" />
      </FormItem>
      <FormItem label="确认密码">
        <Input v-decorator="['password2',{rules: [{ required: true,message:'请输入确认密码' }]}]" type="password" placeholder="请输入确认密码" />
      </FormItem>
      <Row class="mt-5">
        <Col :span="6" class="text-right" />
        <Col :span="16" class="text-left">
          <h1 class="form-title">法定代表人信息</h1>
        </Col>
      </Row>
      <FormItem label="姓名">
        <Input v-decorator="['legalName',{rules: [{ required: true,message:'请输入姓名' }]}]" placeholder="请输入姓名" />
      </FormItem>
      <FormItem label="手机号">
        <Input v-decorator="['legalPhone',{rules: [{ required: true,message:'请输入手机号' }]}]" placeholder="请输入手机号" />
      </FormItem>
      <FormItem label="身份证号" class="prompt-box">
        <Input v-decorator="['legalIdCard',{rules: [{ required: true,validator:validIDCard }]}]" placeholder="请输入身份证号" />
        <Tooltip>
          <template slot="title">
            <span>(也可通过法定代表人身份证号登陆)</span>
          </template>
          <Icon type="exclamation-circle" class="prompt" />
        </Tooltip>
      </FormItem>
      <FormItem label="单位证明文件">
        <Upload
          ref="upload"
          action="/api/court/file/uploadProveFile"
        />
      </FormItem>
      <Row class="mt-5">
        <Col :span="6" class="text-right" />
        <Col :span="16" class="text-left">
          <h1 class="form-title">操作者信息</h1>
        </Col>
      </Row>
      <FormItem label="身份">
        <Select v-decorator="['operateType',{rules: [{ required: true,message:'请选择组织类型' }]}]" @change="getOperateType">
          <SelectOption :value="1">法定代表人本人</SelectOption>
          <SelectOption :value="2">法定代表委托人</SelectOption>
        </Select>
      </FormItem>
      <FormItem v-if="operateType===2" label="姓名">
        <Input v-decorator="['operateName',{rules: [{ required: true,message:'请输入姓名' }]}]" placeholder="请输入姓名" />
      </FormItem>
      <FormItem v-if="operateType===2" class="prompt-box" label="身份证号">
        <Input v-decorator="['operateIdNo',{rules: [{ required: true,validator:validIDCard }]}]" placeholder="请输入身份证号" />
        <Tooltip>
          <template slot="title">
            <span>(也可通过法定代表委托人身份证号登陆)</span>
          </template>
          <Icon type="exclamation-circle" class="prompt" />
        </Tooltip>
      </FormItem>
      <FormItem v-if="operateType===2" label="委托书">
        <Upload
          ref="upload1"
          action="/api/court/file/uploadProveFile"
        />
      </FormItem>
      <FormItem label="手机号码">
        <Input v-decorator="['operatePhone',{rules: [{ required: true,validator:validPhoneForm }]}]" placeholder="请输入手机号码" />
      </FormItem>
      <PhoneCode
        label="验证码"
        phone-field="operatePhone"
        :form="form"
        field="code"
        :form-options="{rules: [{ required: true,message:'请输入验证码' }]}"
      />
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
import { Modal, Form, Input, Button, Col, Row, Select, Icon, Tooltip } from 'ant-design-vue'
import Upload from '@/components/Upload'
import PhoneCode from '@/components/PhoneCode'
import { validPhoneForm, validIDCardForm } from '@/utils/validate.js'
import { registerOfUint } from '@/api/user/user.js'
export default {
  components: {
    Modal,
    Form,
    FormItem: Form.Item,
    Col,
    Row,
    Input,
    Button,
    Select,
    Icon,
    SelectOption: Select.Option,
    Upload,
    Tooltip,
    PhoneCode
  },
  props: {
  },
  data() {
    return {
      visible: true,
      loading: false,
      operateType: 1,
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
    validPhoneForm,
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
        params.unitCertificate = this.$refs.upload.fileList && this.$refs.upload.fileList.length > 0 ? this.$refs.upload.fileList.map(item => item.url).join(',') : ''
        params.operateCommission = this.$refs.upload1?.fileList && this.$refs.upload1?.fileList.length > 0 ? this.$refs.upload1.fileList.map(item => item.url).join(',') : ''
        if (params.operateType == 2) {
          if (!params.operateCommission) {
            this.$message.error('请上传委托书')
            return
          }
        } else {
          params.operateIdNo = params.legalIdCard
        }
        this.loading = true
        registerOfUint(params).then(({ code, msg }) => {
          this.loading = false
          if (code === 200) {
            this.$message.success(msg)
            this.form.resetFields()
            this.visible = false
          }
        })
      })
    },
    // 获取操作者身份类型
    getOperateType(e) {
      this.operateType = e
    }
  }
}
</script>

<style scoped lang="less">
.no-margin {
  margin: 0;
}
.form-title {
  color: #177DDC;
}
h1 {
  margin-bottom: 20px;
  font-size: 16px;
  font-weight: bold;
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
.modal {
  /deep/.ant-form {
    max-height: 500px;
    overflow: auto;
  }
}
.btn {
  width: 90%;
}
</style>
