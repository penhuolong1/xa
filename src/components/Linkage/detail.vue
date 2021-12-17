<template>
  <div>
    <Modal
      v-model="visible"
      title="详情"
      :mask-closable="false"
      style="width:600px"
    >
      <Collapse v-model="activeKey">
        <CollapsePanel key="1" header="发起事项">
          <Form ref="form" :label-col="6" :schema="schema" />
        </CollapsePanel>
        <CollapsePanel v-if="type == 2" key="2" header="回复内容">
          <div>回复内容:{{ info.replyContent }}</div>
        </CollapsePanel>
        <CollapsePanel key="3" header="协同日志" :force-render="true">
          <CollLog :id="teamId" refs="collLog" />
        </CollapsePanel>
      </Collapse>
      <template slot="footer">
        <Button key="back" @click="visible=false">
          取消
        </Button>
        <!-- <Button key="submit" type="primary" :loading="loading" @click="submit">
          确定
        </Button> -->
      </template>
    </Modal>
  </div>
</template>
<script>
import { Button, Modal, Collapse } from 'ant-design-vue'
import { teamInfoById } from '@/api/sfAddcase/index.js'
import CollLog from './collLog.vue'
import Form from '@/components/Form'

export default {
  components: {
    Button,
    Modal,
    CollLog,
    Collapse,
    CollapsePanel: Collapse.Panel,
    Form
  },
  props: {
  },
  data() {
    return {
      loading: false,
      visible: false,
      activeKey: [1],
      form: this.$form.createForm(this, { name: 'form' }),
      teamId: '',
      type: null,
      info: {} // 联动信息
    }
  },
  computed: {
    schema() {
      return [
        {
          label: '发起者',
          type: 'input',
          field: 'initiatorName',
          disabled: true,
          formOption: { initialValue: this.info.initiatorName }
        },
        {
          label: '发起时间',
          type: 'input',
          disabled: true,
          field: 'createTime',
          formOption: { initialValue: this.info.createTime }
        },
        {
          label: '联动类型',
          type: 'input',
          disabled: true,
          field: 'type',
          formOption: { initialValue: this.info.type }
        },
        {
          label: '最迟完成',
          type: 'input',
          suffix: '天内',
          disabled: true,
          field: 'days',
          formOption: { initialValue: this.info.days },
          vIf: () => {
            return this.type == 2
          }
        },
        {
          label: '联动事由',
          type: 'textArea',
          disabled: true,
          field: 'reason',
          formOption: { initialValue: this.info.reason }
        },
        {
          label: '文件',
          type: 'upload',
          isEdit: false,
          field: 'input3',
          fileList: this.info.fileList
        },
        {
          label: '联动单位',
          type: 'input',
          field: 'input4',
          disabled: true,
          formOption: { initialValue: this.info.unitName || '' },
          vIf: () => {
            return !this.info.judgeName
          }
        },
        {
          label: '联动组织',
          type: 'input',
          field: 'input5',
          disabled: true,
          formOption: { initialValue: this.info.orgName || '' },
          vIf: () => {
            return !this.info.judgeName
          }
        },
        {
          label: '联动者',
          type: 'input',
          field: 'input6',
          disabled: true,
          formOption: { initialValue: this.info.mediatorName || '' },
          vIf: () => {
            return !this.info.judgeName
          }
        },
        {
          label: '法官',
          type: 'input',
          field: 'input7',
          disabled: true,
          formOption: { initialValue: this.info.judgeName || '' },
          vIf: () => {
            return !!this.info.judgeName
          }
        }
      ]
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    show(id) {
      this.teamId = id
      this.getData()
      this.visible = true
    },
    // 获取数据
    getData() {
      teamInfoById({ sfTeamId: this.teamId }).then(({ code, data }) => {
        if (code === 200) {
          this.type = data.type
          this.info = { ...data }
          this.info.type = data.type === 1 ? '申请联动' : '咨询'
          this.info.unitName = data.partInfo ? data.partInfo.unitName : ''
          this.info.unitId = data.partInfo ? data.partInfo.unitId : ''
          this.info.orgName = data.partInfo ? data.partInfo.orgName : ''
          this.info.orgId = data.partInfo ? data.partInfo.orgId : ''
          this.info.mediatorName = data.partInfo ? data.partInfo.mediatorName : ''
          this.info.mediatorId = data.partInfo ? data.partInfo.mediatorId : ''
          this.info.judgeName = data.partInfo ? data.partInfo.judgeName : ''
          this.info.judgeId = data.partInfo ? data.partInfo.judgeId : ''
          this.info.createTime = data.createTime ? this.$moment(data.createTime).format('YYYY-MM-DD') : ''
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
    }
  }
}
</script>

<style scoped lang="less">
/deep/.ant-modal-body {
  max-height: 500px;
  overflow: auto;
}
</style>
