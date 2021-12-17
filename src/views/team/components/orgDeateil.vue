<template>
  <Modal
    title="详情信息"
    :visible="visible"
    width="1200px"
    :mask-closable="false"
    :footer="null"
    @cancel="visible = false"
  >
    <FormHeader ref="formHeader" :is-add="isAdd" :label-list="labelList" :info="detailData">
      <div slot="btn">
        <Button class="mr-2.5" type="primary" @click="save">保存</Button>
        <Button type="green" @click="visible == false">取消</Button>
      </div>
    </FormHeader>
    <Description
      ref="description"
      class="enter-X"
      :schema="schema"
      :detail-data="detailData"
      :is-edit="true"
      :column="2"
      :rules="rules"
      :is-skeleton="isSkeleton"
    />
    <AddLink ref="addlink" class="enter-X" :default-list="linkList" />
    <MedItem v-for="(item,index) in detailData.mediators" :key="index" :med-info="item" />
  </Modal>
</template>

<script>
import { Modal, Button } from 'ant-design-vue'
import MedItem from './medItem.vue'
import FormHeader from './formHeader.vue'
import Description from '@/components/Description'
import { orgInfo } from '@/api/team/index.js'
import AddLink from './addLink.vue'
import { deptTypeList, deptLevel, updateOrgInfo } from '@/type/index.js'

export default {
  components: {
    Modal,
    Button,
    FormHeader,
    AddLink,
    MedItem,
    Description
  },
  props: {
    isAdd: { // 是否新增
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      visible: false,
      isSkeleton: false,

      detailData: {},
      labelList: [],
      linkList: [],
      schema: [
        {
          field: 'belongs',
          label: '组织名称',
          type: 'select',
          disabled: !this.isAdd,
          required: true,
          options: deptLevel
        },
        {
          field: 'deptLevel',
          label: '隶属单位',
          type: 'select',
          disabled: !this.isAdd,
          required: true,
          options: deptLevel
        },
        {
          field: 'deptType',
          label: '组织类型',
          type: 'select',
          require: true,
          required: true,
          options: deptTypeList
        },
        {
          field: 'ancients',
          label: '分流中心',
          disabled: !this.isAdd,
          required: true,
          type: 'center'
        },
        {
          field: 'importTime',
          label: '接入时间',
          type: 'date'
        },
        {
          label: ''
        },
        {
          field: 'address',
          label: '办公地点',
          type: 'input'
        },
        {
          label: ''
        },
        {
          field: 'address',
          label: '联络人1',
          type: 'select',
          required: true
        },
        {
          field: 'address',
          label: '联系方式',
          type: 'input',
          required: true
        }

      ],

      id: '' // 联动单位id
    }
  },
  created() {

  },
  mounted() {

  },
  methods: {
    show(id) {
      console.log(id)
      if (this.isAdd) { // 当是新增的时候清楚缓存
        this.detailData = {}
        this.labelList = []
        this.linkList = []
        this.id = ''
      }
      this.visible = true
      this.id = id
      this.getInfo(id)
    },
    // 获取详情
    getInfo(deptId) {
      console.log(deptId)
      if (!deptId) {
        return
      }
      // this.isSkeleton = true
      this.linkList = []
      orgInfo(deptId).then(({ code, data }) => {
        this.detailData = data
      })
    },
    // 保存
    save() {
      console.log(this.$refs.addlink.list)
      let params = {}
      if (this.isAdd) {
        const obj1 = this.$refs.description.getDate()
        if (!obj1.flag) {
          return
        }
        const data1 = this.$refs.description.getDate().data
        const data2 = this.$refs.description1.getDate().data
        params = {
          ...data1,
          ...data2
        }
        params.deptName = this.$refs.formHeader.name
        params.avatar = this.$refs.formHeader.avator
      } else {

      }
      console.log(params)
    }
  }
}
</script>

<style scoped lang="less">
.des1 {
  position: relative;
  top: -1px;
}
</style>
