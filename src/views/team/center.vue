<template>
  <div class="flex">
    <div class="left menu">
      <CenterTree @selectTree="selectTree" />
    </div>
    <div class="right">
      <FormHeader :label-list="labelList" :is-edit="false" :info="detailData">
        <div slot="btn">
          <Button class="mr-2.5" type="primary" @click="edit">编辑</Button>
          <Button type="blue4">联络</Button>
        </div>
      </FormHeader>
      <Description
        ref="description"
        :schema="schema"
        :detail-data="detailData"
        :is-edit="true"
        :column="2"
        :is-skeleton="isSkeleton"
      />
      <AddLink :is-edit="false" :default-list="linkList" />
    </div>
    <Editcenter :id="selectKey" ref="editcenter" @done="getData" />
  </div>
</template>

<script>
import { Input, Tree, Button, Empty } from 'ant-design-vue'
import FormHeader from './components/formHeader.vue'
import Editcenter from './components/editcenter.vue'
import Description from '@/components/Description'
import AddLink from './components/addLink.vue'
import CenterTree from './components/centerTree.vue'
import { agency, centerInfo } from '@/api/team/index.js'
const defaultId = '110'
export default {
  components: {
    Input,
    Tree,
    Empty,
    CenterTree,
    Button,
    FormHeader,
    Description,
    Editcenter,
    AddLink
  },
  props: {

  },
  data() {
    return {
      treeData: [],
      isSkeleton: false,
      detailData: {},
      selectKey: '',
      searchVal: '',
      linkList: [], // 联系人数据
      defaultSelectedKeys: [defaultId], // 默认显示翔安诉非联动中心
      replaceFields: {
        children: 'containDepartment',
        title: 'name',
        key: 'id'
      },
      labelList: [],
      expandedKeys: [],
      dataList: [],
      schema: [
        {
          field: 'deptLevel',
          label: '所属级别',
          type: 'label'
        },
        {
          field: 'importTime',
          label: '接入时间',
          type: 'label'
        },
        {
          field: 'address',
          label: '办公地点',
          type: 'label',
          span: 2
        }
      ]
    }
  },
  created() {
    this.getInfo(defaultId)
  },
  mounted() {
  },
  methods: {
    edit() {
      if (!this.selectKey) {
        this.$message.error('请先选择分流中心')
        return
      }
      this.$refs.editcenter.show(this.selectKey)
    },
    // 获取详情
    getInfo(deptId) {
      this.selectKey = deptId
      if (!deptId) {
        return
      }
      this.isSkeleton = true
      centerInfo(deptId).then(({ code, data }) => {
        if (code === 200) {
          this.detailData = data
          this.detailData.importTime = this.detailData.importTime ? this.format(new Date(this.detailData.importTime), 'YYYY-MM-DD') : ''
          this.labelList = [{
            name: `下设联动单位${this.detailData.relationCount}家`
          }]
          this.linkList = data.concatPeoples
        }
        this.isSkeleton = false
      })
    },
    // 获取详情
    getData(e) {
      this.getInfo(this.selectKey)
    },
    selectTree(e) {
      this.getInfo(e[0])
    }
  }
}
</script>

<style scoped lang="less" src="./index.less">

</style>
