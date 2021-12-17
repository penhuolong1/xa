<template>
  <div class="wrapper">
    <div class="wrapper-content">
      <div v-for="(item, index) in schema" :key="index" class="form-item">
        <span class="label">{{ item.label }}</span>
        <Select v-if="item.type==='select'" v-model="searchParams[item.field]" allow-clear>
          <SelectOption v-for="item1 in item.options" :key="item1.value" :value="item1.value">{{ item1.label }}</SelectOption>
        </Select>
        <Input v-if="item.type==='input'" v-model="searchParams[item.field]" />

        <RadioTree v-if="item.type==='radioTree'" v-model="tree" @getTree="getTreeData" />

        <TreeSelect
          v-if="item.type==='treeSelect'"
          v-model="value"
          style="width: 100%"
          :replace-fields="replaceFields"
          :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
          :tree-data="treeData"
          :show-checked-strategy="SHOW_PARENT"
        />
      </div>
      <Button type="primary" class="mr-2.5" @click="search">搜索</Button>
      <Button class="mr-2.5" @click="reset">重置</Button>
      <Button type="blue3" @click="add">添加</Button>
    </div>
  </div>
</template>

<script>
import { Select, Input, Button, TreeSelect, Radio } from 'ant-design-vue'
import RadioTree from './radioTree.vue'
import { departmentList } from '@/api/team/index.js'
const SHOW_PARENT = TreeSelect.SHOW_PARENT
export default {
  components: {
    Select,
    SelectOption: Select.Option,
    Input,
    Button,
    RadioTree,
    RadioGroup: Radio.Group,
    TreeSelect
  },
  props: {
    schema: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      searchParams: {},
      SHOW_PARENT,
      show: true,
      tree: {},
      value: '',
      replaceFields: {
        title: 'name',
        value: 'id',
        key: 'id',
        children: 'childes'
      },
      radioTreeData: [
        {
          childes: [],
          deptLevel: '区级',
          id: '111',
          name: '翔安区'
        }
      ],
      treeData: [
        {
          childes: [],
          deptLevel: '区级',
          id: '111',
          name: '翔安区'
        }
      ]
    }
  },
  watch: {
    value(new1, old) {
      console.log(new1, old)
    }
  },
  created() {
    this.getData()
  },
  mounted() {

  },
  methods: {
    changeTree(e) {
      console.log(e)
    },
    // 获取浏览登录账号的单位及其下属 单位 /组织
    getData() {
      this.show = false
      if (this.$route.fullPath === '/team/med') {
        this.getUnitData('with')
      }
      if (this.$route.fullPath === '/team/org') {
        this.getUnitData('ignore')
      }
    },
    // 获取数据
    getUnitData(params) {
      departmentList(params).then(res => {
        if (res.code === 200) {
          this.treeData = [res.data]
          console.log(this.treeData)
          this.show = true
        }
      })
    },
    search() {
      if (this.tree) {
        this.searchParams.viewType = this.tree.withOrg
        this.searchParams.deptId = this.tree.treeData
      }
      this.$emit('search', this.searchParams)
    },
    reset() {
      this.searchParams = {}
      this.$emit('search', this.searchParams)
    },
    add() {
      this.$emit('add')
    },
    getTreeData(e) {
      this.tree = e
      console.log(e)
    }

  }
}
</script>

<style scoped lang="less" src="@/components/SearchForm/index.less">

</style>
<style scoped lang="less">
.wrapper {
  background: #fdfdfd;
  border-radius: 2px;
  box-shadow: 0px 4px 4px 0px rgba(0,0,0,0.05);
  border: none;
  margin-bottom: 20px;
}
.formItem-radioTree{
  width: 40%;
}
</style>
