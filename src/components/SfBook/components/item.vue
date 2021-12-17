<template>
  <div class="item-wrapper">
    <!-- 竖版 -->
    <div v-if="type === 1" class="item-vertical">
      <div class="item-vertical-content">
        <Checkbox class="check" :value="item.id" />
        <img :src="judgmentFileType(item.path)">
        <div class="item-footer-left" @click="preview(item.path)">
          {{ item.name }}
        </div>
      </div>
      <div class="item-footer lay-1">
        <div class="item-footer-right">
          <Tooltip placement="top">
            <template slot="title">
              <span>下载</span>
            </template>
            <img src="../../../assets/icons/bookItemBtn1.png" @click="down(item.path)">
          </Tooltip>
          <Tooltip placement="top">
            <template slot="title">
              <span>删除</span>
            </template>
            <img src="../../../assets/icons/bookItemBtn2.png" @click="del">
          </Tooltip>
          <Tooltip placement="top">
            <template slot="title">
              <span>移动</span>
            </template>
            <img src="../../../assets/icons/bookItemBtn3.png" @click="move">
          </Tooltip>
        </div>
      </div>
    </div>
    <!-- 横板 -->
    <div v-if="type === 2" class="item-horizontal">
      <div class="item-content">
        <div v-if="isImg(item.path)" class="file-type">
          <Checkbox class="check" :value="item.id" />
          <img :src="item.path" @click="previewImg(item.path)">
        </div>
        <div v-else class="file-type">
          <Checkbox class="check" :value="item.id" />
          <span class="tip">该类型暂不支持在线预览</span>
        </div>
      </div>
      <div class="item-footer lay-3">
        <div class="item-footer-left" @click="preview(item.path)">
          {{ item.name }}
        </div>
        <div class="item-footer-right lay-2">
          <Tooltip placement="top">
            <template slot="title">
              <span>下载</span>
            </template>
            <img src="../../../assets/icons/bookItemBtn1.png" @click="down(item.path)">
          </Tooltip>
          <Tooltip placement="top">
            <template slot="title">
              <span>删除</span>
            </template>
            <img src="../../../assets/icons/bookItemBtn2.png" @click="del">
          </Tooltip>
          <Tooltip placement="top">
            <template slot="title">
              <span>移动</span>
            </template>
            <img src="../../../assets/icons/bookItemBtn3.png" @click="move">
          </Tooltip>
        </div>
      </div>
    </div>
    <Preview ref="preview" :file-list="fileList" />
  </div>
</template>

<script>
import { Checkbox, Tooltip } from 'ant-design-vue'
import Preview from '@/components/Preview/index'
import { fileDel } from '@/api/sfBook/index.js'
import { mapGetters } from 'vuex'

export default {
  components: {
    Checkbox,
    Tooltip,
    Preview
  },
  props: {
    item: {
      type: Object,
      default: () => {}
    },
    type: {
      type: Number, // 1竖版 2横板
      default: 1
    },
    // 所有数据
    list: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      fileList: []
    }
  },
  created() {

  },
  mounted() {

  },
  computed: {
    ...mapGetters(['getSfLawCaseId'])
  },
  methods: {
    // 判断文件类型
    judgmentFileType(url) {
      if (!url) {
        return
      }
      const fileClassification = [
        ['jpg', 'IMG', 'PNG', 'png'],
        ['pdf', 'PDF'],
        ['doc', 'docx', 'DOC', 'DOCX', 'xls', 'xlsx', 'XLS', 'XLSX']
      ]
      const label = url.split('.').pop()
      const index = fileClassification.findIndex(item => {
        return item.indexOf(label) !== -1
      })
      const imgType = {
        '-1': require('@/assets/icons/fileType4.png'), // 未知
        0: require('@/assets/icons/fileType1.png'), // 图片
        1: require('@/assets/icons/fileType2.png'), // pdf
        2: require('@/assets/icons/fileType3.png') // word excel
      }
      return imgType[index]
    },
    // 预览
    preview(path) {
      if (this.isImg(path)) {
        this.previewImg(path)
        return
      }
      this.fileList = []
      this.$refs.preview.show(path, this.fileList)
    },
    // 下载
    down(path) {
      const a = document.createElement('a')
      a.href = path
      a.download = this.item.name
      a.click()
    },
    // 删除
    del() {
      this.$confirm({
        title: '是否删除该文件',
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          const params = {
            sfLawCaseId: this.getSfLawCaseId,
            fileIds: [this.item.id]
          }
          fileDel(params).then(({ code, msg }) => {
            if (code === 200) {
              this.$message.success(msg)
              this.$emit('done')
            }
          })
        },
        onCancel() {}
      })
    },
    // 判断是否为图片
    isImg(path) {
      if (!path) {
        return
      }
      const label = path.split('.').pop()
      const imgType = ['jpg', 'IMG', 'PNG', 'png']
      const index = imgType.findIndex(item => item === label)
      return index !== -1
    },
    // 移送
    move() {
      this.$emit('move', this.item.id)
    },
    // 预览图片
    previewImg(path) {
      if (!this.list) {
        this.$message.error('暂无图片')
        return
      }
      const imgList = this.list.filter(item => this.isImg(item.path)).map(item => {
        return item.path
      })
      const index = imgList.findIndex(item => item === path)
      this.$viewerApi(
        {
          images: imgList,
          options: {
            initialViewIndex: index
          }
        }
      )
    }
  }
}
</script>

<style scoped lang="less">
.item-wrapper {
  width: 100%;
  margin-top: 20px;
  border-radius: 4px;
  &:hover {
    .item-footer.lay-1 {
      display: flex;
    }
    .item-footer {
      .item-footer-right.lay-2 {
        display: flex;
      }
    }
  }
  .item-content {
    width: 100%;
    height: 240px;
    display: flex;
    border-radius: 4px 4px 0px 0px;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    background-color: rgba(0,0,0,0.15);
    position: relative;
    .check {
      position: absolute;
      top: 10px;
      left: 10px;
    }
    .file-type {
      display: flex;
      align-items: center;
      justify-content: center;
      .tip {
        font-size: 12px;
      }
    }
    img {
      width: 80%;
      max-height: 80%;
    }
  }
  .item-footer {
    &.lay-3 {
      height: 50px;
    }
    width: 100%;
    align-items: center;
    border: 1px solid rgba(0,0,0,0.10);
    padding: 0 5px;
    border-radius: 0px 0px 4px 4px;
    display: flex;
    &.lay-1 {
      display: none;
    }
    .item-footer-left {
      font-size: 14px;
      color: #333;
      overflow:hidden;
      text-overflow:ellipsis;
      display:-webkit-box;
      -webkit-box-orient:vertical;
      cursor: pointer;
      -webkit-line-clamp:2;
      flex: 1;
    }
    .item-footer-right {
      &.lay-2 {
        display: none;
      }
      width: 70px;
      display: flex;
      align-items: center;
      img {
        width: 20px;
        margin-right: 5px;
        cursor: pointer;
        &:last-child {
          margin-right: 0px;
        }
      }
    }
  }
  .item-vertical {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid rgba(0,0,0,0.10);
    padding: 20px 0px;
    .item-vertical-content {
      display: flex;
      align-items: center;
      .check {
        margin-left: 20px;
        margin-right: 30px;
      }
      img {
        width: 35px;
        margin-right: 10px;
        cursor: pointer;
      }
      .item-footer-left {
        cursor: pointer;
      }
    }
    .item-footer {
      border: none;
      width: 100px;
      img {
        margin-right: 10px;
      }
    }
  }
}
</style>
