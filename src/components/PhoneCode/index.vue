<template>
  <FormItem ref="item" :label="label" class="wrapper">
    <Input
      v-decorator="[field, formOptions]"
      type="text"
      :placeholder="placeholder"
    />
    <a class="code" @click="getCode">{{ codeText }}</a>
  </FormItem>
</template>

<script>
import { Input, Form } from 'ant-design-vue'
import { codeOfRegister, codeOfLogin, codeOfResetPwd } from '@/api/common/index.js'
import { validPhoneForm } from '@/utils/validate.js'
export default {
  components: {
    Input,
    FormItem: Form.Item
  },
  props: {
    form: {
      type: Object,
      default: () => {}
    },
    phoneField: {
      type: String,
      default: ''
    },
    data: { // 登录所需要的参数
      type: Object,
      default: () => {}
    },
    label: {
      type: String,
      default: ''
    },
    field: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: '请输入'
    },
    formOptions: {
      type: Object,
      default: () => {}
    },
    type: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      codeText: '获取验证码',
      codeTime: 60,
      inputVal: ''
    }
  },
  created() {

  },
  mounted() {

  },
  methods: {
    reset() {
      this.codeText = '获取验证码'
      this.timmer && clearInterval(this.timmer)
      this.codeTime = 60
    },
    // 获取验证码
    getCode() {
      const phone = this.form.getFieldsValue()[this.phoneField]
      if (this.codeText !== '获取验证码') {
        return
      }
      const params = {
        phone: phone,
        ...this.data
      }
      if (!params.phone) {
        this.$message.error('请输入手机号码')
        return
      }
      const api = {
        1: codeOfRegister,
        2: codeOfLogin,
        3: codeOfResetPwd
      }
      api[this.type](params).then(({ code, msg }) => {
        if (code == 200) {
          this.$message.success(msg)
          var that = this
          this.timmer = setInterval(function() {
            that.codeTime--
            that.codeText = `(${that.codeTime})秒后重新获取验证码`
            if (that.codeTime == 0) {
              that.codeText = '获取验证码'
              clearInterval(this.timmer)
              that.codeTime = 60
            }
          }, 1000)
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
.wrapper {
  position: relative;
  .code {
    position: absolute;
    top: -10px;
    right: 10px;
  }
  /deep/.ant-input {
    padding-right: 160px;
  }
}
</style>
