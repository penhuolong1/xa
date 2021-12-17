<template>
  <Modal
    v-model="visible"
    title="扫描"
    :mask-closable="false"
    width="80%"
    class="modal"
    @cancel="visible=false"
  >
    <div class="scan-wrapper">
      <div class="mb-2.5">
        <Button type="primary" class="mr-2.5" @click="scan">扫描</Button>
        <Button type="primary" class="mr-2.5" @click="uploadOne">上传单页</Button>
        <Button type="primary" @click="uploadAll">上传所有</Button>
      </div>
      <iframe id="scanIframe" src="https://xatjtest.olcourt.cn/dist/scan.html" width="100%" height="500px" />
    </div>
    <template slot="footer">
      <Button @click="visible=false">
        取消
      </Button>
      <Button v-if="isEdit" type="primary" :loading="loading" @click="onConfirm">
        确认
      </Button>
    </template>
  </Modal>
</template>
<script>
import { Modal, Button } from 'ant-design-vue'
import { mapGetters } from 'vuex'
import { addBase64File } from '@/api/book/index.js'
export default {
  components: {
    Modal,
    Button
  },
  props: {
    isEdit: { // 是否可以编辑
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      visible: false,
      loading: false
    }
  },
  computed: {
    ...mapGetters(['getLawCaseId', 'getFileId'])
  },
  created() {
  },
  mounted() {
    window.addEventListener('message', this.handleGetMessage)
  },
  destroyed() {
    window.removeEventListener('message', this.handleGetMessage)
  },
  methods: {
    show() {
      this.visible = true
    },
    onConfirm() {
      console.log(123)
    },
    handleGetMessage(e) {
      const data = e.data
      const params = {
        lawCaseId: this.getLawCaseId,
        contentsId: this.getFileId,
        'base64': data.base64
      }
      if (!data.base64) {
        return
      }
      addBase64File(params).then(({ code, msg }) => {
        if (code === 200) {
          this.$message.success(msg)
        }
      })
      // if (data.code === 200) {
      //   this.$message.success(data.msg)
      //   this.$emit('done', e.data)
      // } else {
      //   this.$message.error(data.msg)
      // }
    },
    uploadOne(e, data) {
      if (!this.getFileId) {
        this.$message.error('请先选择卷宗目录')
        return
      }
      document.getElementById('scanIframe').contentWindow.ajax_post_1(this.getLawCaseId, this.getFileId)
    },
    uploadAll() {
      if (!this.getFileId) {
        this.$message.error('请先选择卷宗目录')
        return
      }
      document.getElementById('scanIframe').contentWindow.ajax_post_2(this.getLawCaseId, this.getFileId)
    },
    scan() {
      document.getElementById('scanIframe').contentWindow.scan()
    }
  }
}
</script>

<style scoped lang="less">
</style>
