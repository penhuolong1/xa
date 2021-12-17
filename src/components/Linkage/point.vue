<template>
  <div>
    <Modal
      v-model="visible"
      title="指派"
      :mask-closable="false"
      style="width:600px"
    >
      <Form :form="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 14 }">
        <!-- <SfDepCount
          v-if="info.unitId"
          field="unitId"
          :form-option="{ initialValue: info.unitId }"
          codes="11,12,13"
          :ancestor-id="info.unitId"
          label="联动单位"
          @change="getUnitId"
        /> -->
        <FormItem label="联动单位">
          <Select
            v-decorator="['unitId', { rules: [{ required: true,message:'请选择联动单位' }], initialValue: info.unitId}]"
            :disabled="!!info.orgId"
            placeholder="请选择联动单位"
            @change="getUnitId"
          >
            <SelectOption v-for="item in unitList" :key="item.deptId" :value="item.deptId">{{ item.deptName }}</SelectOption>
          </Select>
        </FormItem>
        <FormItem v-if="ancestorId == 116" label="流转至">
          <RadioGroup
            v-decorator="[
              'orCadre',
              { rules: [{ required: true, message: '请选择' }], initialValue: false},
            ]"
            @change="getOrCadre"
          >
            <Radio :value="true">法院诉前案管</Radio>
            <Radio :value="false">法院诉非平台</Radio>
          </RadioGroup>
        </FormItem>
        <Judge
          v-if="ancestorId == 116 && orCadre"
          label="联络人员"
          field="judgeId"
          :form-option="{ rules: [{ required: true,message:'请选择联络人员'}], initialValue: info.judgeId}"
        />
        <SfDepCount
          v-if="!(ancestorId == 116 && orCadre)"
          field="orgId"
          :form-option="{ initialValue: info.orgId }"
          :form="form"
          :ancestor-id="ancestorId"
          codes="14"
          label="联动组织"
          @change="getOrgId"
        />
        <SfMediator
          v-if="!(ancestorId == 116 && orCadre)"
          field="mediatorId"
          :form-option="{ initialValue: undefined }"
          :form="form"
          :dept-id="depId"
          label="联动员"
        />
      </Form>
      <template slot="footer">
        <Button key="back" @click="visible=false">
          取消
        </Button>
        <Button key="submit" type="primary" :loading="loading" @click="submit">
          确定
        </Button>
      </template>
    </Modal>
  </div>
</template>
<script>
import { Button, Row, Col, Form, Radio, Modal, Select } from 'ant-design-vue'
import { listDeptListByArgs } from '@/api/sfAddcase/index'

import SfDepCount from '@/components/Common/SfDepCount.vue'
import Judge from '@/components/Common/Judge.vue'
import SfMediator from '@/components/Common/SfMediator.vue'
import { teamInfoById, handleTeam } from '@/api/sfAddcase/index.js'

export default {
  components: {
    Form,
    FormItem: Form.Item,
    Button,
    Judge,
    Modal,
    Radio,
    Select,
    SelectOption: Select.Option,
    RadioGroup: Radio.Group,
    SfMediator,
    SfDepCount
  },
  props: {
    selectedRows: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      resultState: undefined,
      orCadre: false,
      visible: false,
      num: 1,
      form: this.$form.createForm(this, { name: 'form' }),
      ancestorId: '',
      accept: true,
      menuIndex: 0,
      type: undefined,
      depId: '',
      loading: false,
      teamId: '',
      unitList: [], // 联动单位数组
      info: {}
    }
  },
  computed: {
  },
  created() {
  },
  mounted() {
  },
  methods: {
    getOrCadre(e) {
      this.orCadre = e.target.value
    },
    getType(e) {
      this.type = e
    },
    getUnitId(e) {
      this.ancestorId = e
      this.depId = e
    },
    getOrgId(e) {
      this.depId = e
    },
    show(id) {
      this.teamId = id
      this.getData()
      this.visible = true
    },
    submit() {
      this.form.validateFields(err => {
        if (err) {
          return
        }
        const params = {
          ...this.form.getFieldsValue()
        }
        params.id = this.teamId
        params.handleType = 3
        this.loading = true
        handleTeam(params).then(({ code, msg }) => {
          this.loading = false
          if (code === 200) {
            this.$message.success(msg)
            this.visible = false
            this.$emit('done')
          }
        })
      })
    },
    // 获取数据
    getData() {
      teamInfoById({ sfTeamId: this.teamId }).then(({ code, data }) => {
        if (code === 200) {
          this.type = data.type
          this.info = { ...data }
          this.info.type = data.type === 1 ? '申请联动' : '咨询'
          this.info.unitId = data.partInfo ? data.partInfo.unitId : ''
          if (data.partInfo.unitId) {
            this.ancestorId = data.partInfo.unitId
          }
          this.info.orgName = data.partInfo ? data.partInfo.orgName : ''
          this.info.orgId = data.partInfo ? data.partInfo.orgId : ''
          this.info.mediatorName = data.partInfo ? data.partInfo.mediatorName : ''
          this.info.mediatorId = data.partInfo ? data.partInfo.mediatorId : ''
          this.info.judgeName = data.partInfo ? data.partInfo.judgeName : ''
          this.info.judgeId = data.partInfo ? data.partInfo.judgeId : ''
          this.depId = this.info.orgId || ''
          if (data.partInfo.unitId) {
            this.getList(data.partInfo.unitId, data.partInfo.unitName)
          }
          if (data.fileInfoList && data.fileInfoList.length) {
            this.info.fileList = data.fileInfoList.map(item => {
              return {
                uid: item.fileId,
                name: item.fileName,
                url: item.filePath,
                ...item
              }
            })
          }
        }
      })
    },
    // 获取 单位数据
    getList(id, name) {
      listDeptListByArgs({ ancestorId: id, codes: '11,12,13' }).then(({ code, data }) => {
        if (code === 200) {
          this.unitList = [{ deptId: id, deptName: name }, ...data]
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
</style>
