<template>
  <Modal
    :title="title"
    :visible.sync="dialogVisible"
    width="80%"
    :mask-closable="false"
    :modal-append-to-body="false"
    :close-on-click-modal="false"
    :append-to-body="true"
    :footer="null"
    @cancel="handleCancel"
  >
    <div class="preview-btn-wrapper">
      <Button v-if="isDown" type="primary" @click="downLoad">下载</Button>
      <!-- <Button type="primary" @click="edit">在线编辑(仅支持.doc,.docx,.xls,.xlsx格式文件)</Button> -->
    </div>
    <div class="wrapper">
      <div v-if="fileList && fileList.length > 0 && fileIndex!==0" class="prev btn" @click="prev">
        <Icon type="left" />
      </div>
      <div class="content">
        <img v-if="fileType === 1" :src="url" alt="">
        <iframe v-if="fileType === 2 || fileType === 5" class="iframe" :src="url" alt="" />
        <video v-if="fileType === 3" class="pre-video" :src="url" controls />
        <audio v-if="fileType === 4" :src="url" controls />
      </div>
      <div v-if="fileList && fileList.length > 0 && fileIndex < fileList.length-1" class="next btn" @click="next">
        <Icon type="right" />
      </div>
    </div>
  </Modal>
</template>

<script>
import { Modal, Button, Icon } from 'ant-design-vue'
import { getPreviewUrl, getFile } from '@/api/common/index.js'
export default {
  components: {
    Modal,
    Button,
    Icon
  },
  props: {
    title: {
      type: String,
      default: '预览'
    },
    fileList: {
      type: Array,
      default: null
    },
    fileUrl: {
      type: String,
      default: ''
    },
    isDown: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialogVisible: false,
      url: '',
      fileIndex: 0,
      isImgFlag: true,
      isEdit: false,
      fileEditId: '', // 在线编辑id
      fileType: null // 文件类型 1图片 2word文档 3视频 4音频 5 pdf
    }
  },
  computed: {
  },
  watch: {
    fileUrl() {
      this.init()
    }
  },
  created() {
    this.init()
  },
  mounted() {

  },
  methods: {
    // 初始化数据
    init() {
      if (!this.fileUrl) {
        return
      }
      this.fileEditId = ''
      this.getUrl(this.fileUrl)
      this.getFileIndex()
    },
    async getUrl(url) {
      if (!url || url.length == 0) {
        return
      }
      this.url = ''
      this.isFileType(url)
      if (this.fileType === 2) { // 如果文件类型是文档
        console.log('pdf')
        console.log(url)
        await getPreviewUrl(url).then(res => {
          this.isEdit = true
          if (res.code === 200) {
            this.url = res.data.wpsUrl
            this.fileEditId = res.data.token
          } else {
            this.$message.error('预览文件失败')
          }
        })
      } else {
        this.url = url[0] === '/' ? url : '/' + url
      }
      if (!url) {
        return
      }
    },
    isPdf(url) {
      if (url.indexOf('pdf') > -1) {
        return true
      } else {
        return false
      }
    },
    isImg(url) { // 判断是不是图片
      if (!url || url.length == 0) {
        return
      }
      const imgArr = ['img', 'IMG', 'png', 'PNG', 'jpg', 'JPG', 'jpeg', 'JPEG']
      const label = url.split('.').pop()
      let flag = false
      if (
        imgArr.indexOf(label) == -1
      ) {
        flag = false
      } else {
        flag = true
      }
      this.isImgFlag = flag
      return flag
    },
    getFileIndex(list, url) {
      list = list || this.fileList
      const url1 = url || this.fileUrl
      this.fileIndex = list.findIndex(item => {
        return item.url === url1
      })
      console.log(this.fileIndex)
    },
    prev() {
      this.fileIndex--
      this.url = this.fileList[this.fileIndex].url
      this.getUrl(this.url)
    },
    next() {
      this.fileIndex++
      this.url = this.fileList[this.fileIndex].url
      this.getUrl(this.url)
    },
    show(url, list) {
      this.isEdit = false
      this.fileEditId = ''
      this.url = url || this.fileUrl
      this.getUrl(url || this.fileUrl)
      this.getFileIndex(list, url)
      this.dialogVisible = true
    },
    handleCancel() {
      this.dialogVisible = false
    },
    downLoad() {
      // let url = this.fileList[this.fileIndex]
      // if (url.indexOf(HWYURL) === -1) {
      //   url = SERVICEURL + url
      // }
      // fileDownload(url)
    },
    // 判断文件类型
    isFileType(url) {
      if (!url) {
        return
      }
      const imgType = ['img', 'IMG', 'png', 'PNG', 'jpg', 'JPG', 'jpeg', 'JPEG']
      const wordType = ['doc', 'DOC', 'docx', 'DOCX', 'xls', 'XLS', 'xlsx', 'XLSX', 'pdf', 'PDF']
      const videoType = ['mp4', 'MP4', 'avi', 'AVI']
      const audioType = ['mp3', 'MP3', 'wav', 'WAV']
      // const pdfType = ['pdf', 'PDF', 'wav', 'WAV']
      const label = url.split('.').pop()
      if (imgType.indexOf(label) !== -1) {
        this.fileType = 1
      }
      if (wordType.indexOf(label) !== -1) {
        this.fileType = 2
      }
      if (videoType.indexOf(label) !== -1) {
        this.fileType = 3
      }
      if (audioType.indexOf(label) !== -1) {
        this.fileType = 4
      }
      // if (pdfType.indexOf(label) !== -1) {
      //   this.fileType = 5
      // }
    },
    // 保存文件
    edit() {
      if (this.fileEditId) {
        window.open('/edit?id=' + this.fileEditId)
        localStorage.setItem(this.fileEditId, this.url)
      } else {
        this.$message.error('在线编辑仅支持.doc,.docx,.xls,.xlsx格式文件')
      }
    }
  }
}
</script>

<style scoped lang="less">
.wrapper {
  min-height: 300px;
  position: relative;
  display: flex;
  align-content: center;
  padding: 0 100px;
  .content {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    img {
      max-width: 100%;
    }
    .iframe {
      width: 100%;
      min-height: 600px;
    }
  }
  .btn {
    position: absolute;
    top: 50%;
    width: 50px;
    height: 50px;
    left: 0px;
    color: #000;
    border-radius: 50%;
    font-size: 25px;
    display: flex;
    justify-content: center;
    align-items: center;
    transform: translateY(-50%);
    cursor: pointer;
    &.next {
      right: 0px;
      left: auto;
    }
  }
}
.pre-video {
  width: 80%;
}
.preview-btn-wrapper {
  display: flex;
  margin-bottom: 10px;
}
</style>
