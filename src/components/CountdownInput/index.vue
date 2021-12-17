<template>
  <div class="w-full flex">
    <Input placeholder="短信验证码" />
    <Button class="btn" :disabled="!isClick" :type="isClick ? '':'info'" @click="onclick">{{ btnTxt }}</Button>
  </div>
</template>

<script>
import { Input, Button } from 'ant-design-vue'
export default {
  components: {
    Input,
    Button
  },
  props: {
    currentNum: { // 需要等待的秒数
      type: Number,
      default: 10
    }
  },
  data() {
    return {
      btnTxt: '获取验证码',
      isClick: true, // 是否可以点击
      interval: null, // 计数器
      currentCount: null // 倒计时秒数
    }
  },
  created() {

  },
  mounted() {

  },
  methods: {
    // 点击获取验证码按钮
    onclick() {
      this.interval && clearInterval(this.interval)
      this.currentCount = this.currentNum
      this.isClick = false
      this.btnTxt = `${this.currentCount}秒后重新获取`
      this.interval = setInterval(() => {
        this.btnTxt = `${this.currentCount - 1}秒后重新获取`
        if (this.currentCount !== 0) {
          this.currentCount--
        } else {
          this.isClick = true
          this.currentCount = this.currentNum
          this.btnTxt = '获取验证码'
          clearInterval(this.interval)
        }
      }, 1000)
    }
  }
}
</script>

<style scoped lang="less">
.btn {
  margin-left: 0.725rem;
}
</style>
