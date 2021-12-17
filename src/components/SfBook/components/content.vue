<template>
  <div class="content-wrapper">
    <div class="header-btn-wrapper">
      <div class="btn-left">
        <Checkbox :checked="checkAll" :indeterminate="indeterminate" class="check-all" @change="onCheckAllChange" />
        <div class="btn-item" @click="print">
          <img src="../../../assets/icons/bookbtn1.png">
          打印
        </div>
        <div class="btn-item" @click="scan">
          <img src="../../../assets/icons/bookbtn2.png">
          扫描
        </div>
        <div class="btn-item" @click="downAll">
          <img src="../../../assets/icons/bookbtn3.png">
          下载
        </div>
        <div class="btn-item" @click="upload">
          <img src="../../../assets/icons/bookbtn4.png">
          <input ref="file" type="file" :accept="needSign ? '.docx':'.bmp, .gif, .jpg, .jpeg, .png, .doc, .docx, .xls, .xlsx, .ppt, .pptx, .html, .htm, .txt, .rar, .zip, .gz, .bz2, .pdf'" style="display:none;" @change="getFile($event)">
          上传
        </div>
        <div class="btn-item" @click="del">
          <img src="../../../assets/icons/bookbtn5.png">
          删除
        </div>
        <div class="btn-item" @click="move(false)">
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
        <CheckboxGroup v-else v-model="checkList">
          <Col
            v-for="(item, index) in list"
            :key="index"
            class="my-col"
            :xl="layoutType === 1 ? 24:5"
            :lg="layoutType === 1 ? 24:6"
            :md="layoutType === 1 ? 24:6"
          >
            <Item :type="layoutType" :item="item" :list="list" @done="getList" @move="move" />
          </Col>
        </CheckboxGroup>
      </Row>
    </div>
    <Modal
      title="卷宗目录"
      :visible="visible"
      width="500px"
      :mask-closable="false"
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
    <Modal
      title="上传"
      :visible="visible1"
      width="500px"
      :mask-closable="false"
      @cancel="visible1 = false"
    >
      <div>
        <span>是否需要签字: </span>
        <RadioGroup v-model="needSign" class="radio" button-style="solid">
          <Radio :value="true">是</Radio>
          <Radio :value="false">否</Radio>
        </RadioGroup>
      </div>
      <div v-if="needSign" class="tip">*如果需要签字请上传docx格式的文件</div>
      <template slot="footer">
        <Button @click="visible1 = false">
          取消
        </Button>
        <Button type="primary" @click="uploadFile">
          确认
        </Button>
      </template>
    </Modal>
  </div>
</template>

<script>
import { Row, Col, Checkbox, Empty, Modal, Tree, Button, Radio } from 'ant-design-vue'
import Item from './item.vue'
import { mapGetters } from 'vuex'
import { listOfCatalog, fileAdd, fileDel, listOfCase, fileMove } from '@/api/sfBook/index.js'
import { printImgArchive } from '@/api/book/index.js'
import { ORIGINHTTP } from '@/utils/constVal.js'

export default {
  components: {
    Radio,
    RadioGroup: Radio.Group,
    Item,
    Row,
    Col,
    Checkbox,
    CheckboxGroup: Checkbox.Group,
    Empty,
    Modal,
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
      visible1: false,
      isTree: true,
      checkList: [], // 选中的文书的id
      layoutType: 2, // 文书布局 1纵向 2横向
      list: [], // 文书列表
      visible: false,
      loading: false,
      needSign: false,
      selectId: '', // 移送目录的id
      singleMove: false, // 单个移送
      singleFileId: '',
      indeterminate: false,
      checkAll: false
    }
  },
  computed: {
    ...mapGetters(['getFileId', 'getSfLawCaseId'])
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
      window.open(`/dist/scan.html?caseId=${this.getSfLawCaseId}&fileId=${this.getFileId}&type=2`)
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
        sfLawCaseId: this.getSfLawCaseId,
        catalogId: this.getFileId,
        pageSize: 100
      }
      this.list = []
      listOfCatalog(params).then(({ code, data }) => {
        if (code === 200) {
          this.checkList = []
          this.list = data.files
        }
      })
    },
    // 上传文书
    upload() {
      if (!this.getFileId) {
        this.$message.error('请先选择卷宗目录')
        return
      }
      this.visible1 = true
      // this.$refs.file.dispatchEvent(new MouseEvent('click'))
    },
    // 上传文书
    uploadFile() {
      const event2 = document.createEvent('MouseEvents')
      event2.initEvent('click', false, true)
      this.$refs.file.dispatchEvent(event2)
    },
    // 上传文件
    getFile(e) {
      const file = e.target.files[0]
      if (!file) return
      console.log(file)
      const param = new FormData() // 创建form对象
      param.append('file', file) // 通过append向form对象添加数据
      param.append('catalogId', this.getFileId)
      param.append('signFlag', this.needSign)
      param.append('sfLawCaseId', this.getSfLawCaseId)
      const hide = this.$message.loading('正在上传')
      fileAdd(param).then(({ code, msg }) => {
        hide()
        if (code === 200) {
          this.$refs.file.value = ''
          this.visible1 = false
          console.log(this.coverData)
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
            sfLawCaseId: this.getSfLawCaseId,
            fileIds: this.checkList
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
      listOfCase({ sfLawCaseId: this.getSfLawCaseId }).then(({ code, data }) => {
        if (code === 200) {
          this.treeData = data
          this.isTree = false
          setTimeout(() => {
            this.isTree = true
          })
        }
      })
    },
    // 移动提交
    moveHandleOk() {
      if (!this.selectId || this.selectId.length === 0) {
        this.$message.error('请先选择卷宗目录')
        return
      }
      const params = {
        fileIds: this.singleMove ? [this.singleFileId] : this.checkList,
        catalogId: this.selectId[0],
        sfLawCaseId: this.getSfLawCaseId
      }
      fileMove(params).then(({ code, msg }) => {
        if (code === 200) {
          this.$message.success(msg)
          this.selectId = []
          this.getList()
          this.visible = false
        }
      })
    },
    downAll() {
      const list = this.list.filter(item => {
        return this.checkList.findIndex(item1 => {
          return item.id === item1
        }) !== -1
      })
      if (list && list.length > 0) {
        list.forEach(item => {
          this.down(item.path, item.name)
        })
      } else {
        this.$message.error('请先选择文件')
        return
      }
    },
    down(path, name) {
      const a = document.createElement('a')
      a.href = path
      a.download = name
      a.click()
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
    isTypeJpg(url) {
      var eTyp = url.substring(url.lastIndexOf('.') + 1).toUpperCase()
      var oArr = ['JPG', 'PNG', 'JPEG']
      for (var index = 0; index < oArr.length; index++) {
        if (eTyp == oArr[index]) {
          return true
        }
      }
      return false
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
        &:nth-child(2) {
          background-color: @theme-color;
          &:hover {
            background-color: @theme-color-hover;
          }
        }
        &:nth-child(3) {
          background-color: @blue-4;
          &:hover {
            background-color: @blue-4-hover;
          }
        }
        &:nth-child(4) {
          background-color: @blue-3;
          &:hover {
            background-color: @blue-3-hover;
          }
        }
        &:nth-child(5) {
          background-color: @btn2-color;
          &:hover {
            background-color: @btn2-color-hover;
          }
        }
        &:nth-child(6) {
          background-color: @err-color;
          &:hover {
            background-color: @err-color-hover;
          }
        }
        &:nth-child(7) {
          color: #000;
          border: 1px solid #d9d9d9;
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

/deep/.ant-checkbox-group {
  width: 100%;
}
/deep/.ant-tree li span.ant-tree-switcher, .ant-tree li span.ant-tree-iconEle {
  line-height: 15px;
}
.tip {
  margin-top: 10px;
  color: rgba(0, 0, 0, 0.25);
}
</style>
