<template>
  <div>
    <SearchForm :schema="schema2" @search="search" @add="add" />
    <div class="flex">
      <div class="left menu">
        <div class="title mb-2.5">
          分流中心
        </div>
        <CenterTree :is-search="false" @selectTree="selectTree" />
      </div>
      <div class="left menu">
        <div class="title mb-2.5">
          联动单位
        </div>
        <UnitTree ref="unitTree" :is-search="false" @selectTree="selectUnit" />
      </div>
      <div class="right">
        <Empty v-if="!unitId" style="margin-top: 100px;" />
        <span v-if="unitId">
          <FormHeader :label-list="labelList" :is-edit="false" :info="detailData">
            <div slot="btn">
              <Button class="mr-2.5" type="primary" @click="edit">编辑</Button>
              <Button class="mr-2.5" type="blue4" @click="remove">{{ detailData.status == 0 ? '解除' : '绑定' }}</Button>

              <Button type="blue3">联络</Button>
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
          <Description
            ref="description"
            class="des1"
            :schema="schema1"
            :detail-data="detailData"
            :is-edit="true"
            :column="2"
            :is-skeleton="isSkeleton"
          />
        </span>
      </div>
      <AddOrEditUnit ref="addOrEditUnit" :is-add="isAdd" @done="getUnitTree" />
    </div>

  </div>
</template>

<script>
import { Button, Empty } from 'ant-design-vue'
import FormHeader from './components/formHeader.vue'
import AddOrEditUnit from './components/addOrEditUnit.vue'
import CenterTree from './components/centerTree.vue'
import UnitTree from './components/unitTree1.vue'
import Description from '@/components/Description'
import AddLink from './components/addLink.vue'
import { unitInfo, searchUnit, banOrLinkageUnit } from '@/api/team/index.js'
import { deptTypeList } from '@/type/index.js'
import SearchForm from './components/searchFrom.vue'

export default {
  components: {
    SearchForm,
    CenterTree,
    Empty,
    UnitTree,
    AddLink,
    Button,
    FormHeader,
    Description,
    AddOrEditUnit
  },
  props: {

  },
  data() {
    return {
      treeData: [],
      isSkeleton: false,
      detailData: {},
      searchSchema: [
        {
          label: '单位名称',
          type: 'input',
          field: 'deptName'
        },
        {
          label: '组织类型',
          type: 'select',
          field: 'deptType',
          options: deptTypeList
        },
        {
          label: '主要职责',
          type: 'input',
          field: 'mainResponsibility'
        }
      ],
      schema2: [
        {
          label: '所属单位/组织',
          type: 'treeSelect',
          field: 'orgName'
        },
        {
          label: '组织类型',
          type: 'select',
          field: 'deptType'
        },
        {
          label: '单位名称',
          type: 'input',
          field: 'serialNumber'
        },
        {
          label: '专业领域',
          type: 'input',
          field: 'mainResponsibility'
        }],
      labelList: [
        {
          name: '下设联动单位0家'
        },
        {
          name: '下设联动单位0家'
        },
        {
          name: '下设联动单位0家'
        }
      ],
      isAdd: false, // 是否新增联动单位
      linkList: [],
      schema: [
        {
          field: 'deptLevel',
          label: '所属级别',
          type: 'label'
        },
        {
          field: 'deptLevel',
          label: '上级单位',
          type: 'label'
        },
        {
          field: 'deptType',
          label: '组织类型',
          type: 'label'
        },
        {
          field: 'ancients',
          label: '分流中心',
          type: 'label'
        },
        {
          field: 'importTime',
          label: '接入时间',
          type: 'label'
        },
        {
          label: ''
        },
        {
          field: 'address',
          label: '办公地点',
          type: 'label'
        }
      ],
      schema1: [
        {
          field: 'mainResponsibility',
          label: '主要职责',
          type: 'label',
          span: 2
        },
        {
          field: 'deptType',
          label: '文件依据',
          type: 'upload',
          isEdit: false,
          span: 2
        }
      ],
      unitId: '' // 联动单位id
    }
  },
  created() {

  },
  mounted() {

  },
  methods: {
    edit() {
      if (!this.unitId) {
        this.$message.error('请先选择联动单位')
        return
      }
      this.isAdd = false
      this.$refs.addOrEditUnit.show(this.isAdd, this.unitId)
    },
    // 选择树
    selectTree(e) {
      this.$refs.unitTree.searchListByParentId(e[0])
    },
    // 选择单位
    selectUnit(e) {
      console.log(e)
      this.isSkeleton = true
      this.unitId = (e && e.length > 0) ? e[0] : ''
      if (!this.unitId) {
        return
      }
      this.linkList = []
      unitInfo(this.unitId).then(({ code, data }) => {
        if (code === 200) {
          this.detailData = data
          this.detailData.name = this.detailData.deptName
          this.detailData.importTime = this.detailData.importTime ? this.format(new Date(this.detailData.importTime), 'YYYY-MM-DD') : ''
          this.labelList = [{
            name: `下设解纷组织${this.detailData.containOrigCount}家`
          }, {
            name: `下设解纷员${this.detailData.mediatorCount}个`
          }, {
            name: `解纷数${this.detailData.mediateCaseCount || 0}个`
          }]
          this.linkList = data.concatPeoples
        }
        this.isSkeleton = false
      })
    },
    // 搜索
    search(e) {
      this.$refs.unitTree.search(e)
    },
    // 添加
    // add() {
    //   this.isAdd = true
    //   this.$refs.addOrEditUnit.show()
    // },
    add(e) {
      if (e) {
        this.isAdd = false
      } else {
        this.isAdd = true
      }
      this.$refs.addOrEditUnit.show(this.isAdd, e)
    },
    // 解除
    remove() {
      if (this.unitId) {
        this.$confirm({
          title: this.detailData.status == 0 ? '是否解除联系？' : '是否绑定联系？',
          okText: '确定',
          cancelText: '取消',
          onOk: () => {
            banOrLinkageUnit(this.unitId).then(({ code, msg }) => {
              if (code === 200) {
                this.$message.success(msg)
                this.selectUnit()
              }
            })
          },
          onCancel() {}
        })
      }
    },
    change(e) {
      console.log(e)
    },
    getUnitTree() {
      this.$refs.unitTree.getCenterTreeData()
    }
  }
}
</script>

<style scoped lang="less" src="./index.less">

</style>
<style scoped lang="less">
.title {
  color: #424242;
  font-weight: bold;
}
.flex {
  height: calc(100vh - 120px);
}
.des1 {
  position: relative;
  top: -1px;
}
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
