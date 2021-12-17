<template>
  <div>
    <div v-if="isSearch" class="serach">
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
        :default-selected-keys="defaultSelectedKeys"
        @select="selectTree"
      />
      <Empty v-else class="mt-2.5" />
    </div>
  </div>
</template>

<script>
import { Input, Tree, Empty } from 'ant-design-vue'
import { unitList, searchUnit } from '@/api/team/index.js'
import { defaultId } from './index.js'

export default {
  components: {
    Input,
    Tree,
    Empty
  },
  props: {
    isSearch: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      defaultSelectedKeys: [defaultId], // 默认显示翔安诉非联动中心
      replaceFields: {
        children: 'containDepartment',
        title: 'name',
        key: 'id'
      },
      allTreeData: [],
      searchVal: '',
      treeData: [],
      parentId: defaultId, // 传过来分流中心的id
      selectKey: ''
    }
  },
  created() {
    this.getCenterTreeData()
  },
  mounted() {

  },
  methods: {
    // 获取联动单位数据
    getCenterTreeData() {
      unitList().then(({ code, data }) => {
        if (code === 200) {
          this.allTreeData = [...data]
          this.searchListByParentId(this.parentId, this.allTreeData)
        }
      })
    },
    // 通过分流id查询底下数据
    searchListByParentId(id, data1) {
      const data = data1 || this.allTreeData
      this.parentId = id
      if (!data || data.length === 0) {
        this.treeData = []
      }
      data.forEach(item => {
        // console.log('--------' + item.id)
        if (item.id === id) {
          this.treeData = item.containDepartment
        }
        if (item.containDepartment && item.containDepartment.length > 0) {
          this.searchListByParentId(id, item.containDepartment)
        }
      })
    },
    // 选择树节点触发
    selectTree(e) {
      this.$emit('selectTree', e)
    },
    // 搜索
    search(e) {
      if (!e.deptName && !e.deptType && !e.mainResponsibility) {
        this.getCenterTreeData()
        return
      }
      const params = {
        ...e,
        parentId: this.parentId
      }
      searchUnit(params).then(({ code, data }) => {
        if (code === 200) {
          if (!data || data.length === 0) {
            this.treeData = []
            return
          }
          this.treeData = data.map(item => {
            return {
              id: item.dept_id,
              name: item.dept_name
            }
          })
        }
      })
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
