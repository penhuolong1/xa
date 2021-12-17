<template>
  <div class="login w-full h-full flex red">
    <div class="flex flex-col flex-1 h-full p-14">
      <div class="my-auto pl-36">
        <img :src="loginImg" class="w-2/3 -enter-X" alt="">
        <div class="text-white text-3xl mt-14 -enter-X">开箱即用的中后台管理系统</div>
        <div class="text-white text-sm mt-2 -enter-X">输入您的个人详细信息开始使用！</div>
      </div>
    </div>
    <div class="flex-1 h-full p-20 flex justify-center items-center">
      <div :class="sysName+'-form'" class="w-3/4 enter-X max-w-sm">
        <Button @click="login">登录</Button>
        <Button @click="register">注册</Button>
        <Button @click="legalRegister">法人注册</Button>
        <Button @click="lawyerCertification">律师认证</Button>
        <LoginForm v-if="type == 1" />
        <MobileForm v-if="type == 2" />
        <QrcodeForm v-if="type == 3" />
        <Login ref="login" />
        <NormalRegister ref="normalRegister" />
        <LegalRegister ref="legalRegister" />
        <LawyerCertification ref="lawyerCertification" />
      </div>
    </div>
  </div>
</template>

<script>
import { SYS_NAME } from '@/utils/variables.js'
import { Button } from 'ant-design-vue'
import LoginForm from './components/LoginForm'
import Login from './components/login.vue'
import NormalRegister from './components/normalRegister.vue'
import MobileForm from './components/MobileForm'
import QrcodeForm from './components/QrcodeForm'
import LegalRegister from './components/legalRegister'
import LawyerCertification from './components/lawyerCertification.vue'
export default {
  components: {
    LoginForm,
    MobileForm,
    QrcodeForm,
    Button,
    Login,
    NormalRegister,
    LegalRegister,
    LawyerCertification
  },
  props: {

  },
  data() {
    return {
      sysName: SYS_NAME,
      loginImg: require('@/assets/svg/login-box-bg.png'),
      logoImg: require('@/assets/logo.png'),
      type: 1
    }
  },
  created() {
    localStorage.setItem('xaTokan', '')
  },
  mounted() {

  },
  methods: {
    login() {
      this.$refs.login.show()
    },
    // 注册
    register() {
      this.$refs.normalRegister.show()
    },
    // 法人注册
    legalRegister() {
      this.$refs.legalRegister.show()
    },
    // 律师认证
    lawyerCertification() {
      this.$refs.lawyerCertification.show()
    }
  }
}
</script>

<style scoped lang="less">
.login {
  overflow: hidden;
  &>div:first-child {
    background-image: url('../../assets/svg/login-bg.png');
    background-repeat: no-repeat;
    background-size: auto 100%;
    background-position: 100%;
  }
}
</style>
