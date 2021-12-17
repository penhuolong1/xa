<template>
  <div class="audio-wrapper">
    <audio controls :src="url" />
    <a @click="upload">上传</a>
    <input v-show="false" ref="file" accept=".mp3,.wav" type="file" @change="getFile($event)">
  </div>
</template>

<script>
import { uploadPhoneFile, uploadFreeFile } from '@/api/send/index.js'
import { getByCode } from '@/api/case/index.js'
export default {
  components: {
  },
  props: {
    type: {
      type: Number,
      default: 1, // 1送达 2 诉前记录
      iframeSrc: ''
    },
    phone: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      url: '',
      visible: false,
      iframeUrl: '/dist/testconnect.htm'
    }
  },
  created() {

  },
  mounted() {
    window.addEventListener('message', this.getAudioSrc)
  },
  destroyed() {
    window.removeEventListener('message', this.getAudioSrc)
  },
  methods: {
    // 上传文书
    upload() {
      const event2 = document.createEvent('MouseEvents')
      event2.initEvent('click', false, true)
      this.$refs.file.dispatchEvent(event2)
    },
    // 赋值
    setData(url) {
      this.url = url
    },
    reset() {
      this.url = ''
    },
    getAudioSrc(e) {
      const data = e.data
      if (data.type === 'callPhone') {
        const params = {
          code: localStorage.getItem('xaCallPhoneCodes')
        }
        getByCode(params).then(({ code, file }) => {
          if (code === 200) {
            this.url = file.path
          }
        })
      }
    },
    // 提交
    submit() {
      const params = {
        code: localStorage.getItem('codes')
      }
      getByCode(params).then(({ code, file }) => {
        if (code === 200) {
          this.url = file.path
          this.visible = false
        }
      })
    },
    // 上传文件
    getFile(e) {
      const file = e.target.files[0]
      if (!file) return
      console.log(file)
      const param = new FormData() // 创建form对象
      param.append('file', file) // 通过append向form对象添加数据
      const hide = this.$message.loading('正在上传')
      if (this.type === 1) {
        uploadPhoneFile(param).then(({ code, msg, data }) => {
          if (code === 200) {
            this.$refs.file.value = ''
            this.url = data.path
            hide()
            this.$message.success(msg)
          }
        })
      } else {
        uploadFreeFile(param).then(({ code, msg, data }) => {
          hide()
          if (code === 200) {
            this.$refs.file.value = ''
            this.url = data.path
            this.$message.success(msg)
          }
        })
      }
    }
  }
}
</script>

<style scoped lang="less">
.audio-wrapper {
  position: relative;
  height: 30px;
  audio {
    width: 100%;
    height: 40px;
  }
  a {
    position: absolute;
    right: -40px;
    top: 0px;
    &.call {
      right: -70px;
    }
  }
}
</style>
