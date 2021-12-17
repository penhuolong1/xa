<template>
  <div class="book-menu">
    <h3>
      <span>卷宗管理</span>
      <div class="img-wrapper">
        <Tooltip placement="top">
          <template slot="title">
            <span>下载所有卷宗</span>
          </template>
          <!-- 根目录的parentid为0 -->
          <img src="../../../assets/icons/downAll.png" alt="" @click="downAll()">
        </Tooltip>
        <Tooltip placement="top">
          <template slot="title">
            <span>添加主目录</span>
          </template>
          <!-- 根目录的parentid为0 -->
          <img src="../../../assets/icons/addFile.png" alt="" @click="add({id:'0'})">
        </Tooltip>
      </div>
    </h3>
    <div>
      <Tree :tree-data="treeData" :replace-fields="replaceFields" @select="selectTreeFun">
        <template slot="custom" slot-scope="item">
          <div class="tree-item">
            <div class="txt">
              <div v-show="!item.edit" @dblclick="edit(item)">{{ item.name }}{{ item.fileNum ? '('+item.fileNum+')':'' }}</div>
              <Input v-show="item.edit" :ref="'input'+item.id" v-model="item.name" size="small" placeholder="回车保存修改" @click.stop @blur="e => inputBlur(e, item)" @pressEnter="e => saveEdit(e, item)" />
            </div>
            <div class="icon-wrapper">
              <Tooltip placement="top" title="删除目录">
                <img src="../../../assets/icons/bookdel.png" @click.stop="del(item)">
              </Tooltip>
              <Tooltip placement="top" title="新增目录">
                <img src="../../../assets/icons/bookadd.png" @click.stop="add(item)">
              </Tooltip>
            </div>
          </div>
        </template>
      </Tree>
    </div>
    <Modal
      title="新增目录"
      :visible="visible"
      :mask-closable="false"
      width="500px"
      @cancel="visible = false"
    >
      <div class="form">
        <div class="label">名称:</div>
        <div class="name">
          <Input v-model="name" placeholder="请输入目录名称" /></div>
      </div>
      <template slot="footer">
        <Button @click="visible = false">
          取消
        </Button>
        <Button type="primary" :loading="loading" @click="handleOk">
          确认
        </Button>
      </template>
    </Modal>
  </div>
</template>

<script>
import { queryAllContents, addOrUpdateContents, delContents, downArchiveFile } from '@/api/book/index.js'
import { Tooltip, Tree, Button, Input, Modal } from 'ant-design-vue'
import { mapGetters } from 'vuex'
export default {
  components: {
    Tooltip,
    Tree,
    Input,
    Modal,
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
      visible: false,
      loading: false,
      name: '', // 目录名称
      isSave: false, // 处于保存编辑状态
      selectTree: {} // 所选中的数据
    }
  },
  computed: {
    ...mapGetters(['getLawCaseId'])
  },
  created() {
    this.getTreeDate()
  },
  mounted() {

  },
  methods: {
    // 点击树节点触发
    selectTreeFun(e) {
      this.$store.commit('SET_FileId', e[0])
    },
    // 获取卷宗目录
    getTreeDate() {
      const params = {
        lawCaseId: this.getLawCaseId
      }
      queryAllContents(params).then(({ code, data }) => {
        if (code === 200) {
          this.treeData = this.traversideTree(data)
          console.log(this.treeData)
        }
      })
    },
    // 添加
    add(item) {
      console.log(item)
      this.visible = true
      this.selectTree = item
    },
    // 遍历树
    traversideTree(list) {
      let newList = []
      if (!list || list.length === 0) {
        return newList
      }
      newList = list.map(item => {
        if (item.childrenList && item.childrenList.length !== 0) {
          item.childrenList = this.traversideTree(item.childrenList)
        }
        item.scopedSlots = { title: 'custom' }
        return item
      })
      return newList
    },
    // 添加目录
    handleOk() {
      if (!this.name) {
        this.$message.error('请输入目录名称')
      }
      const params = {
        id: null,
        parentId: this.selectTree.id,
        name: this.name,
        lawCaseId: this.getLawCaseId
      }
      addOrUpdateContents(params).then(({ code, msg }) => {
        if (code === 200) {
          this.$message.success(msg)
          this.visible = false
          this.name = ''
          this.getTreeDate()
        }
      })
    },
    // 双击打开编辑弹框
    edit(e) {
      console.log(e)
      const id = e.id
      this.treeData = this.dealTree(this.treeData, id)
      this.$nextTick(() => {
        this.$refs[`input${e.id}`].focus()
      })
    },
    dealTree(list, id, name) {
      let newList = []
      if (!list && list.length === 0) {
        return newList
      }
      newList = list.map(item => {
        if (item.childrenList && item.childrenList.length !== 0) {
          item.childrenList = this.dealTree(item.childrenList)
        }
        if (item.id === id) {
          item.edit = !item.edit
          if (name) {
            item.name = name
          }
        }
        return item
      })
      return newList
    },
    // 回车保存修改
    saveEdit(e, item) {
      console.log('---')
      console.log(e)
      console.log(item)
      const params = {
        id: item.id,
        name: item.name,
        parentId: item.parentId,
        lawCaseId: this.getLawCaseId
      }
      this.isSave = true
      addOrUpdateContents(params).then(({ code, msg }) => {
        if (code === 200) {
          setTimeout(() => {
            this.isSave = false
          }, 1000)
          this.$message.success(msg)
          this.treeData = this.dealTree(this.treeData, item.id, item.name)
          console.log(this.treeData)
        }
      })
    },
    // 编辑框取消焦点触发
    inputBlur(e, item) {
      if (this.isSave) {
        return
      }
      this.treeData = this.dealTree(this.treeData, item.id)
    },
    // 删除
    del(item) {
      this.$confirm({
        title: '是否删除该目录',
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          console.log(item)
          const params = {
            id: item.id
          }
          delContents(params).then(({ code, msg }) => {
            if (code === 200) {
              this.$message.success(msg)
              this.getTreeDate()
            }
          })
        },
        onCancel() {}
      })
    },
    // 下载内容
    downAll() {
      downArchiveFile({ lawCaseId: this.getLawCaseId }).then(({ code, msg, data }) => {
        if (code === 200) {
          this.$message.success(msg)
          const a = document.createElement('a')
          a.href = data.path
          a.download = ''
          a.click()
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
.book-menu {
  width: 100%;
  max-height: 650px;
  overflow-y: auto;
  overflow-x: hidden;
  background-color: #F7F7F7;
  padding: @space-large;
  box-shadow: 0px 6px 14px 0px rgba(0,0,0,0.07), 0px 1px 3px 0px rgba(0,0,0,0.03);
  h3 {
    color: #242424;
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .img-wrapper {
      display: flex;
      img {
        width: 20px;
        margin-left: 5px;
        cursor: pointer;
        position: relative;
        right: -13px;
      }
    }
  }
}
.tree-item {
  display: flex;
  justify-content: space-between;
  .txt {
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
.form {
  display: flex;
  align-items: center;
  .label {
    margin-right: 10px;
  }
  .name {
    flex: 1;
  }
}
.icon-wrapper {
  display: inline-flex;
  float: left;
  width: 50px;
  img {
    width: 20px;
    cursor: pointer;
    height: 20px;
    margin-left: 5px;
  }
}
/deep/.ant-tree li .ant-tree-node-content-wrapper {
  padding-right: 10px;
}
/deep/.ant-tree-node-content-wrapper {
  width: 100%;
}
/deep/.ant-tree li span.ant-tree-switcher, .ant-tree li span.ant-tree-iconEle {
  line-height: 15px;
}
</style>
