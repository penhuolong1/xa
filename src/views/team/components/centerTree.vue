<template>
  <div>
    <div class="serach">
      <div class="search-input">
        <Input v-model="searchVal" placeholder="请输入" />
      </div>
      <div class="search-btn">
        <a @click="getCenterTreeData">搜索</a>
      </div>
    </div>
    <div class="menu-content">
      <Tree
        v-if="treeData && treeData.length > 0"
        :tree-data="treeData"
        :replace-fields="replaceFields"
        :default-expand-all="true"
        :default-selected-keys="defaultSelectedKeys"
        @select="selectTree"
      />
      <Empty v-else class="mt-2.5" />
    </div>
  </div>
</template>

<script>
import { Input, Tree, Empty } from 'ant-design-vue'
import { agency } from '@/api/team/index.js'
import { defaultId } from './index.js'

export default {
  components: {
    Input,
    Tree,
    Empty
  },
  props: {

  },
  data() {
    return {
      defaultSelectedKeys: [defaultId], // 默认显示翔安诉非联动中心
      replaceFields: {
        children: 'containDepartment',
        title: 'name',
        key: 'id'
      },
      searchVal: '',
      treeData: [],
      selectKey: ''
    }
  },
  created() {
    this.getCenterTreeData()
  },
  mounted() {

  },
  methods: {
    // 获取分流中心数据
    getCenterTreeData() {
      agency().then(({ code, data }) => {
        if (code === 200) {
          this.treeData = data
          this.search(this.treeData)
        }
      })
    },
    // 搜索
    search(data) {
      this.dataList = []
      if (!this.searchVal) {
        this.treeData = data
      } else {
        this.generateList(data)
        console.log(this.dataList)
        this.treeData = this.dataList.filter(item => item.name.indexOf(this.searchVal) !== -1)
      }
    },
    generateList(data) {
      for (let i = 0; i < data.length; i++) {
        const node = data[i]
        const id = node.id
        this.dataList.push({ id, name: node.name })
        if (node.containDepartment) {
          this.generateList(node.containDepartment)
        }
      }
    },
    // 选择树节点触发
    selectTree(e) {
      this.$emit('selectTree', e)
    }
  }
}
</script>

<style scoped lang="less" src="../index.less">

</style>
<style scoped lang="less">
.serach {
  display: flex;
  align-items: center;
  justify-content: center;
  /deep/.ant-input {
    border: none;
  }
  /deep/.ant-input:focus {
    box-shadow: none;
  }
  .search-btn {
    width: 80px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
