<template>
  <div class="wpsPage">
    <Button class="btn" type="primary" @click="save">保存</Button>
    <div class="wpsBox">
      <div
        id="custom-mount"
        style="width: 100vw;
        height: 100vh;"
      />
    </div>
  </div>
</template>

<script>
import { Button } from 'ant-design-vue'
import { getFile, getPreviewUrl } from '@/api/common/index.js'
import WebOfficeSDK from './js/web-office-sdk-v1.1.14.umd'
export default {
  components: {
    Button
  },
  props: {

  },
  data() {
    return {
      wpsUrl: '',
      jssdk: '',
      beforeUnload_time: 0
    }
  },
  created() {
    console.log(this.$route.query.url)
    this.openWps()
  },
  mounted() {
    window.addEventListener('beforeunload', e => this.beforeunloadFn())
    window.addEventListener('unload', e => this.unloadFn())
  },
  destroyed() {
    window.removeEventListener('beforeunload', e => this.beforeunloadFn())
    window.removeEventListener('unload', e => this.unloadFn())
  },
  methods: {
    openWps() {
      const url = localStorage.getItem(this.$route.query.id)
      this.jssdk = WebOfficeSDK.config({
        mount: document.querySelector('#custom-mount'),
        url: url
      })
    },
    async save() {
      const result = await this.jssdk.save()
      if (result.result === 'ok') {
        this.$message.success('保存成功')
        getFile(this.$route.query.id).then(res => {
          console.log(res)
        })
      }
      if (result.result === 'nochange') {
        this.$message.success('页面信息没有改变')
      }
    },
    beforeunloadFn() {
      this.beforeUnload_time = new Date().getTime()
    },
    unloadFn() {
      this.gap_time = new Date().getTime() - this.beforeUnload_time
      if (this.gap_time <= 5) {
        localStorage.removeItem(this.$route.query.id)
      }
    }
  }
}
</script>

<style lang="less">
#office-iframe {
  top: 30px!important;
}
.web-office-default-container {
  top: 30px!important;
}
.wpsPage {
  background-color: #f2f4f7;
}
.btn {
  float: right;
}
</style>
