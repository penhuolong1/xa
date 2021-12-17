<template>
  <Upload
    :class="isEdit ? '':'is-edit'"
    :accept="accept"
    :action="action"
    :data="data"
    :file-list="fileList"
    :remove="removeFile"
    @change="fileChange"
    @preview="preview"
  >
    <Button v-if="isEdit" icon="upload" class="upload-btn">上传文件</Button>
    <span v-if="isEdit" class="tip">{{ tip }}</span>
    <Preview ref="preview" :file-list="fileList" />
  </Upload>
</template>

<script>
import { Upload, Button } from 'ant-design-vue'
import Preview from '@/components/Preview/index'
export default {
  components: {
    Upload,
    Button,
    Preview
  },
  props: {
    tip: {
      type: String,
      default: '支持上传doc.docx.pdf.jpg.png文件'
    },
    accept: {
      type: String,
      default: '.doc,.docx,.pdf,.jpg,.png'
    },
    action: {
      type: String,
      default: ''
    },
    data: {
      type: Object,
      default: () => {}
    },
    defaultFileList: {
      type: Array,
      default: () => []
    },
    showType: {
      type: String,
      default: ''
    },
    showTypeId: {
      type: String,
      default: 'id'
    },
    remove: {
      type: Function,
      default: () => {
        return {}
      }
    },
    isEdit: { // 是否可以编辑
      type: Boolean,
      default: true
    }
    // fileList: {
    //   type: Array,
    //   default: () => []
    // }
  },
  data() {
    return {
      fileList: []
    }
  },
  watch: {
    fileList() {
      this.$emit('change', this.fileList)
    },
    defaultFileList() {
      this.init()
    }
  },
  created() {
    this.init()
  },
  mounted() {

  },
  methods: {
    init() {
      if (!this.defaultFileList || this.defaultFileList.length === 0) {
        this.fileList = []
        return
      }
      this.fileList = [...this.defaultFileList]
    },
    fileChange({ file, fileList }) {
      if (file.status === 'removed') { // 点击删除触发
        const index = this.fileList.findIndex(item => item.uid === file.uid)
        this.fileList.splice(index, 1)
      }
      if (file.status === 'uploading') { // 上传loading状态
        this.fileList = fileList
      }
      if (file.status === 'done') { // 上传完成
        this.dealList()
        this.$emit('success', file)
      }
    },
    // 处理数组
    dealList() {
      if (!this.fileList || this.fileList.length === 0) {
        return
      }
      this.fileList.forEach(item => {
        if (item.response) {
          if (this.showType) {
            item.url = this.showType === 'data' ? item.response.data : item.response.data[this.showType]
            item.id = this.showType === 'data' ? '' : item.response.data[this.showTypeId]
          } else {
            item.url = item.response.data
          }
          item.data = item.response.data
        }
      })
      console.log(this.fileList)
    },
    removeFile(e) {
      return this.remove(e)
    },
    // 预览
    preview(e) {
      this.$refs.preview.show(e.url, this.fileList)
    },
    reset() {
      this.fileList = []
    }
  }
}
</script>

<style scoped lang="less">
.upload-btn {
  background-color: rgba(48, 108, 151, 0.15);
  color: @theme-color;
  border: none;
  font-weight: bold;
  &:hover {
    background-color: rgba(48, 108, 151, 0.15);
    color: @theme-color;
  }
  /deep/ i{
    position: relative;
    top: -2px;
    font-size: 18px;
  }
}
/deep/.ant-upload-list-text {
  width: 100%;
}
.tip {
  color: #bdbdbd;
  display: block;
  font-size: 12px;
  margin-left: 10px;
}
.is-edit {
  display: flex;
  /deep/.ant-upload-list-item:hover .ant-upload-list-item-card-actions {
    opacity: 0;
    display: none;
  }
}
</style>
