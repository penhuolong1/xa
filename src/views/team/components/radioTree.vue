<template>
  <div>
    <Select v-model="select" class="select" style="width:135px">
      <template slot="dropdownRender">
        <RadioGroup v-model="value" class="radioGroup" @change="change">
          <Radio label="仅本级" value="self">仅本级</Radio>
          <Radio label="本级含下级" value="selfAndChild">本级含下级</Radio>
        </RadioGroup>
        <Tree
          class="treeSelect"
          :replace-fields="replaceFields"
          :tree-data="treeData"
          @select="onSelect"
        />
      </template>
    </Select>

  </div>
</template>
<script>
import { Tree, Radio, Select } from 'ant-design-vue'
import { departmentList, deptMediator } from '@/api/team/index.js'
export default {
  components: {
    Tree,
    RadioGroup: Radio.Group,
    Radio,
    Select
  },
  props: {

  },
  data() {
    return {
      value: 1,
      select: '',
      isOpen: false,
      show: false,
      value1: undefined,
      withOrg: 'with',
      replaceFields: {
        title: 'name',
        value: 'id',
        key: 'id',
        children: 'childes'
      },
      RadioTreeData: {
        treeData: '',
        withOrg: ''
      },
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
  created() {
    this.getUnit()
  },
  mounted() {
  },
  methods: {
    // 获取tree的值
    onSelect(selectedKeys, info) {
      this.RadioTreeData.treeData = selectedKeys[0]
      console.log(this.RadioTreeData.treeData)
    },
    getData() {
      this.$emit('getTree', this.RadioTreeData)
    },
    // 获取radio的值
    change(e) {
      this.RadioTreeData.withOrg = e.target.value
      this.show = true
      this.getData()
      this.isOpen = true
    },
    // 获取浏览登录账号的单位及其下属 单位 /组织（树）
    getUnit() {
      departmentList('with').then(({ code, data }) => {
        if (code === 200) {
          this.treeData = [data]
          console.log(this.treeData)
        }
      })
    }
  }
}
</script>

<style scoped lang="less">

/deep/.ant-select-option{
  min-width: 200%;
}
.radioGroup{
  padding: 5px;
  display: flex;
}
.treeSelect{
  min-width: 150%;

}
/deep/ .ant-radio-group{
  display: flex;
  flex-direction: row;
}
</style>
