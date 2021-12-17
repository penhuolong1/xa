<template>
  <div class="content-wrapper">
    <!-- <object id="wordPrintActiveX" width="0" height="0" classid="clsid:F8CFFFD2-4F58-4E1B-AB76-5DFDBD4FCEFE" /> -->
    <div class="header-btn-wrapper">
      <div class="btn-left">
        <Checkbox :checked="checkAll" :indeterminate="indeterminate" class="check-all" @change="onCheckAllChange" />
        <div class="btn-item btn1" @click="print">
          <img src="../../../assets/icons/bookbtn1.png">
          打印
        </div>
        <div class="btn-item btn2" @click="scan">
          <img src="../../../assets/icons/bookbtn2.png">
          扫描
        </div>
        <div class="btn-item btn3" @click="downLoad">
          <img src="../../../assets/icons/bookbtn3.png">
          下载
        </div>
        <div class="btn-item btn7" @click="combinePdf">
          <img src="../../../assets/icons/bookbtn7.png">
          合并pdf
        </div>
        <div class="btn-item btn4" @click="upload">
          <img src="../../../assets/icons/bookbtn4.png">
          <input ref="file" type="file" accept=".bmp, .gif, .jpg, .jpeg, .png, .doc, .docx, .xls, .xlsx, .ppt, .pptx, .html, .htm, .txt, .rar, .zip, .gz, .bz2, .pdf" style="display:none;" @change="getFile($event)">
          上传
        </div>
        <div class="btn-item btn5" @click="del">
          <img src="../../../assets/icons/bookbtn5.png">
          删除
        </div>
        <div class="btn-item btn6" @click="move(false)">
          <img src="../../../assets/icons/bookbtn6.png">
          移动
        </div>
      </div>
      <div class="btn-right">
        <div class="btn-box" @click="switchLayout(1)">
          <img src="../../../assets/icons/bookLayoutBtn2.png">
        </div>
        <div class="btn-box" @click="switchLayout(2)">
          <img src="../../../assets/icons/bookLayoutBtn1.png">
        </div>
      </div>
    </div>
    <div class="content">
      <Row :gutter="20">
        <div v-if="!list || list.length === 0" class="no-data">
          <Empty />
        </div>
        <CheckboxGroup v-else v-model="checkList" @change="onChange">
          <Col
            v-for="(item, index) in list"
            :key="index"
            class="my-col"
            :xl="layoutType === 1 ? 24:5"
            :lg="layoutType === 1 ? 24:6"
            :md="layoutType === 1 ? 24:6"
          >
            <Item :type="layoutType" :item="item" :list="list" :img-index="index" @done="getList" @move="move" />
          </Col>
        </CheckboxGroup>
      </Row>
    </div>
    <Modal
      title="卷宗目录"
      :visible="visible"
      :mask-closable="false"
      width="500px"
      @cancel="visible = false"
    >
      <Tree v-if="isTree" :tree-data="treeData" :replace-fields="replaceFields" @select="selectTreeFun" />
      <template slot="footer">
        <Button @click="visible = false">
          取消
        </Button>
        <Button type="primary" :loading="loading" @click="moveHandleOk">
          确认
        </Button>
      </template>
    </Modal>
    <Scan ref="scan" @done="scanDone" />
  </div>
</template>

<script>
import { Row, Col, Checkbox, Empty, Modal, Tree, Button } from 'ant-design-vue'
import Item from './item.vue'
import { mapGetters } from 'vuex'
import Scan from '@/components/Scan/index.vue'
import { queryArchiveFile, uploadFile, fileDel } from '@/api/book/index.js'
import { queryAllContents, fileChange, printImgArchive, printImgToPdf } from '@/api/book/index.js'
import { getPreviewUrl } from '@/api/common/index.js'
import { ORIGINHTTP } from '@/utils/constVal.js'

export default {
  components: {
    Item,
    Row,
    Col,
    Checkbox,
    CheckboxGroup: Checkbox.Group,
    Empty,
    Modal,
    Scan,
    Tree,
    Button
  },
  props: {

  },
  data() {
    return {
      treeData: [],
      replaceFields: {
        title: 'name',
        key: 'id',
        children: 'childrenList'
      },
      checkAll: false,
      isTree: true,
      checkList: [], // 选中的文书的id
      layoutType: 2, // 文书布局 1纵向 2横向
      list: [], // 文书列表
      visible: false,
      loading: false,
      selectId: '', // 移送目录的id
      singleMove: false, // 单个移送
      singleFileId: '',
      indeterminate: false
    }
  },
  computed: {
    ...mapGetters(['getFileId', 'getLawCaseId'])
  },
  watch: {
    getFileId() {
      this.getList()
    }
  },
  created() {

  },
  mounted() {
    this.getList()
  },
  methods: {
    // 扫描
    scan() {
      if (!this.getFileId) {
        this.$message.error('请先选择卷宗目录')
        return
      }
      // this.$refs.scan.show()
      window.open(`/dist/scan.html?caseId=${this.getLawCaseId}&fileId=${this.getFileId}&type=1`)
    },
    onChange(checkedList) {
      this.indeterminate = !!checkedList.length && checkedList.length < this.list.length
      this.checkAll = checkedList.length === this.list.length
    },
    // 全选
    onCheckAllChange(e) {
      Object.assign(this, {
        checkList: e.target.checked ? this.list.map(item => item.id) : [],
        indeterminate: false,
        checkAll: e.target.checked
      })
    },
    // 扫描成功
    scanDone(data) {
      this.getList()
    },
    // 选择目录
    selectTreeFun(e) {
      this.selectId = e
    },
    // 切换布局
    switchLayout(index) {
      this.layoutType = index
    },
    // 获取对应文件
    getList() {
      const params = {
        lawCaseId: this.getLawCaseId,
        contentsId: this.getFileId,
        pageSize: 100
      }
      this.list = []
      queryArchiveFile(params).then(({ code, data }) => {
        if (code === 200) {
          this.checkList = []
          this.checkAll = false
          this.indeterminate = false
          this.list = data.rows
          this.$emit('done')
        }
      })
    },
    // 上传文书
    upload() {
      if (!this.getFileId) {
        this.$message.error('请先选择卷宗目录')
        return
      }
      const event2 = document.createEvent('MouseEvents')
      event2.initEvent('click', false, true)
      this.$refs.file.dispatchEvent(event2)
    },
    // 上传文件
    getFile(e) {
      const files = e.target.files
      const param = new FormData() // 创建form对象
      if (!files || files.length === 0) {
        return
      }
      // for (let i = 0; i < files.length; i++) {
      //   param.append('image', files[i])
      // }
      param.append('image', e.target.files[0])
      param.append('contentsId', this.getFileId)
      param.append('lawCaseId', this.getLawCaseId)
      const hide = this.$message.loading('正在上传')
      uploadFile(param).then(({ code, msg }) => {
        hide()
        if (code === 200) {
          this.$refs.file.value = ''
          this.$message.success(msg)
          this.getList()
        }
      })
    },
    // 批量删除文书
    del() {
      if (!this.checkList || this.checkList.length === 0) {
        this.$message.error('请先选择需要删除的文件')
        return
      }
      this.$confirm({
        title: '是否删除该文件',
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          const params = {
            fileIds: this.checkList.join(',')
          }
          fileDel(params).then(({ code, msg }) => {
            if (code === 200) {
              this.$message.success(msg)
              this.getList()
            }
          })
        },
        onCancel() {}
      })
    },
    // 移动
    move(id) {
      this.singleMove = !!id
      this.singleFileId = id
      if (!id) {
        if (!this.checkList || this.checkList.length === 0) {
          this.$message.error('请先选择需要移动的文件')
          return
        }
      }
      this.visible = true
      queryAllContents({ lawCaseId: this.getLawCaseId }).then(({ code, data }) => {
        if (code === 200) {
          this.treeData = data
          this.isTree = false
          setTimeout(() => {
            this.isTree = true
          })
        }
      })
    },
    // 下载
    downLoad() {
      if (!this.checkList || this.checkList.length === 0) {
        this.$message.error('请先选择需要下载的文件')
        return
      }

      const list = this.list.filter(item => this.checkList.findIndex(item1 => item1 === item.id) !== -1)
      list.forEach(item => {
        const a = document.createElement('a')
        a.href = item.path
        a.download = item.name
        a.click()
      })
    },
    // 移动提交
    moveHandleOk() {
      if (!this.selectId || this.selectId.length === 0) {
        this.$message.error('请先选择卷宗目录')
        return
      }
      const params = {
        fileIds: this.singleMove ? this.singleFileId : this.checkList.join(','),
        contentsId: this.selectId[0]
      }
      fileChange(params).then(({ code, msg }) => {
        if (code === 200) {
          this.$message.success(msg)
          this.selectId = []
          this.getList()
          this.visible = false
        }
      })
    },
    // 打印
    async print() {
      const list = this.list.filter(item => this.checkList.findIndex(item1 => item1 === item.id) !== -1)
      var printFile = []
      var imageList = []
      const href = ORIGINHTTP
      if (list && list.length > 0) {
        list.forEach(item => {
          if (this.isTypeJpg(item.path)) {
            imageList.push(item.path)
          } else {
            printFile.push(href + item.path)
          }
        })
      }
      const hide = this.$message.loading('正在打印')
      if (imageList && imageList.length > 0) {
        await printImgArchive({ images: imageList.join(',') }).then(({ code, data, msg }) => {
          if (code === 200) {
            try {
              wordPrintActiveX.batchPrint(href + data.path)
            } catch (e) {
              if (!!window.ActiveXObject || 'ActiveXObject' in window) {
                hide()
                this.$message.success('请点击右上角控件下载，下载批量打印插件并安装！')
              } else {
                hide()
                this.$message.success('非IE浏览器不支持批量打印！')
              }
            }
          } else {
            hide()
            this.$message.success(msg)
          }
        })
      }
      if (printFile && printFile.length > 0) {
        try {
          wordPrintActiveX.batchPrint(printFile.join(','))
          hide()
          this.$message.success('打印结束')
        } catch (e) {
          if (!!window.ActiveXObject || 'ActiveXObject' in window) {
            hide()
            this.$message.success('请点击右上角控件下载，下载批量打印插件并安装！')
          } else {
            hide()
            this.$message.success('非IE浏览器不支持批量打印！')
          }
        }
      } else {
        hide()
        this.$message.success('打印结束')
      }
    },
    isTypeJpg(url) {
      var eTyp = url.substring(url.lastIndexOf('.') + 1).toUpperCase()
      var oArr = ['JPG', 'PNG', 'JPEG']
      for (var index = 0; index < oArr.length; index++) {
        if (eTyp == oArr[index]) {
          return true
        }
      }
      return false
    },
    // 把image合并成pdf
    combinePdf() {
      const list = this.list.filter(item => this.checkList.findIndex(item1 => item1 === item.id) !== -1)
      var imageList = []
      if (list && list.length > 0) {
        list.forEach(item => {
          if (this.isTypeJpg(item.path)) {
            imageList.push(item.path)
          }
        })
      }
      if (!this.getFileId) {
        this.$message.error('请先选择目录')
        return
      }
      if (!imageList || imageList.length === 0) {
        this.$message.error('请先选择所需合并的图片')
        return
      }
      const params = {
        lawCaseId: this.getLawCaseId,
        contentId: this.getFileId,
        images: imageList.join(',')
      }
      printImgToPdf(params).then(({ code, data, msg }) => {
        if (code === 200) {
          this.$message.success(msg)
          this.getList()
        }
      })
    }
  }
}
</script>
<style lang="less">
@media (min-width: 1200px) {
  .my-col.ant-col-xl-5 {
    display: block;
    box-sizing: border-box;
    width: 20%;
  }
}
</style>
<style scoped lang="less">
.check-all {
  margin-top: 5px;
  margin-right: 10px;
}
.content-wrapper {
  .header-btn-wrapper {
    display: flex;
    justify-content: space-between;
    .btn-left {
      display: flex;
      .btn-item {
        display: flex;
        padding: 5px 15px;
        align-items: center;
        color: #fff;
        cursor: pointer;
        margin-right: 20px;
        border-radius: 2px;
        &.btn1 {
          background-color: @theme-color;
          &:hover {
            background-color: @theme-color-hover;
          }
        }
        &.btn2 {
          background-color: @blue-4;
          &:hover {
            background-color: @blue-4-hover;
          }
        }
        &.btn3 {
          background-color: @blue-3;
          &:hover {
            background-color: @blue-3-hover;
          }
        }
        &.btn4 {
          background-color: @btn2-color;
          &:hover {
            background-color: @btn2-color-hover;
          }
        }
        &.btn5 {
          background-color: @err-color;
          &:hover {
            background-color: @err-color-hover;
          }
        }
        &.btn6 {
          color: #000;
          border: 1px solid #d9d9d9;
        }
        &.btn7 {
          background-color: rgba(123, 203, 248);
          &:hover {
            background-color: rgba(123, 203, 248, 0.8);
          }
        }
        img {
          width: 20px;
          margin-right: 10px;
        }
      }
    }
    .btn-right {
      display: flex;
      .btn-box {
        background-color: rgba(143,146,161,0.05);
        padding: 5px 15px;
        cursor: pointer;
        &:nth-child(1) {
          border-right: 1px solid rgba(143,146,161,0.1);
        }
      }
      img {
        width: 20px;
      }
    }
  }
}
.no-data {
  margin-top: 40px;
}
.content {
  max-height: 530px;
  overflow-y: auto;
  overflow-x: hidden;
}
/deep/.ant-checkbox-group {
  width: 100%;
}
/deep/.ant-tree li span.ant-tree-switcher, .ant-tree li span.ant-tree-iconEle {
  line-height: 15px;
}
</style>
