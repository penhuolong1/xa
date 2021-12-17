<template>
  <Modal
    title="编辑"
    :visible="visible"
    width="1200px"
    :mask-closable="false"
    :footer="null"
    @cancel="visible = false"
  >
    <FormHeader ref="formHeader" :label-list="labelList" :info="detailData">
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
      :is-skeleton="isSkeleton"
    />
    <AddLink ref="addlink" class="enter-X" :default-list="linkList" />
  </Modal>
</template>

<script>
import { Modal, Button } from 'ant-design-vue'
import FormHeader from './formHeader.vue'
import Description from '@/components/Description'
import { agency, centerInfo, updateAgency, checkPermission } from '@/api/team/index.js'
import AddLink from './addLink.vue'
export default {
  components: {
    Modal,
    Button,
    FormHeader,
    AddLink,
    Description
  },
  props: {
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
          field: 'deptLevelStr',
          label: '所属级别',
          type: 'input',
          disabled: true
        },
        {
          field: 'importTime',
          label: '接入时间',
          type: 'date'
        },
        {
          field: 'address',
          label: '办公地点',
          type: 'input',
          span: 2
        }
      ],
      id: '' // 分流中心id
    }
  },
  created() {

  },
  mounted() {

  },
  methods: {
    show(id) {
      checkPermission(id).then(({ code, msg }) => {
        if (code === 200) {
          this.visible = true
          this.id = id
          this.getInfo(id)
        }
      })
    },
    // 获取详情
    getInfo(deptId) {
      if (!deptId) {
        return
      }
      this.isSkeleton = true
      centerInfo(deptId).then(({ code, data }) => {
        if (code === 200) {
          this.detailData = data
          this.detailData.deptLevelStr = data.deptLevel
          this.labelList = [{
            name: `下设联动单位${this.detailData.relationCount}家`
          }]
          this.linkList = data.concatPeoples
          console.log(this.linkList)
        }
        this.isSkeleton = false
      })
    },
    // 保存
    save() {
      console.log(this.$refs.addlink.list)
      const params = this.detailData
      if (this.$refs.formHeader.avator) {
        params.avatar = this.$refs.formHeader.avator
      }
      const { data } = this.$refs.description.getDate()
      params.address = data.address
      params.importTime = data.importTime
      params.concatPeoples = this.$refs.addlink.list
      params.deletePeoples = this.$refs.addlink.deletePeoples || null
      delete params.deptLevel
      updateAgency(params).then(({ code, msg }) => {
        if (code === 200) {
          this.$message.success(msg)
          this.visible = false
          this.$emit('done')
        }
      })
    }
  }
}
</script>

<style scoped lang="less">

</style>
