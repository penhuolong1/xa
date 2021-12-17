<template>
  <div>
    <Modal
      v-model="visible"
      title="申请联动"
      :mask-closable="false"
      style="width:600px"
    >
      <Form ref="form" :label-col="6" :wrapper-col="14" :schema="schema" @change="change" />
      <span v-for="item in group" :key="item.key">
        <LinkagePersonForm :ref="'linkagePersonForm'+item.key" :link-agetype="type" @del="del(item.key)" @isLinkPeople="e=>getLinkPeople(e)" />
      </span>
      <Form ref="form1" :label-col="6" :wrapper-col="14" :schema="schema1" />
      <Row>
        <Col :span="6" />
        <Col :span="18">注意: 单位/组织必选一项填写</Col>
      </Row>
      <template slot="footer">
        <Button @click="visible=false">
          取消
        </Button>
        <Button v-if="type === 1" type="primary" @click="addGroup">
          新增一组
        </Button>
        <Button type="primary" :loading="loading" @click="submit">
          确定
        </Button>
      </template>
    </Modal>
  </div>
</template>
<script>
import { Button, Modal, Row, Col } from 'ant-design-vue'
import Form from '@/components/Form'
import { addTeam } from '@/api/sfAddcase/index.js'
import { collaborativeMessage } from '@/api/freeze/index.js'
import LinkagePersonForm from './linkagePersonForm.vue'
export default {
  components: {
    Button,
    Modal,
    Row,
    Col,
    LinkagePersonForm,
    Form
  },
  props: {
    selectedRows: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      loading: false,
      visible: false,
      days: '',
      form: this.$form.createForm(this, { name: 'form' }),
      type: null, // 1协助调解 2咨询
      caseId: '',
      messageType: false, // 发送模板,false发送给组织/单位， true发送模板为联动员
      notificationMessage: '',
      messageParams: {
        days: null,
        type: ''
      },
      group: [
        {
          key: (new Date()).getTime()
        }
      ]
    }
  },
  computed: {
    schema() {
      return [
        {
          label: '联动类型',
          type: 'select',
          field: 'type',
          formOption: { rules: [{ required: true, message: '请选择联动类型' }], initialValue: undefined },
          options: [
            {
              value: 1,
              label: '协助调解'
            },
            {
              value: 2,
              label: '咨询'
            }
          ]
        },
        {
          label: '最迟完成',
          type: 'input',
          field: 'days',
          suffix: '天内',
          formOption: { rules: [{ required: true, message: '最迟完成天数' }], initialValue: '' },
          vIf: () => {
            return this.type === 2
          }

        },
        {
          label: '联动事由',
          type: 'textArea',
          field: 'reason',
          formOption: { rules: [{ required: true, message: '联动事由' }], initialValue: '' }
        },
        {
          label: '文件',
          type: 'upload',
          field: 'fileIds',
          showType: 'filePath',
          action: '/api/sf/file/uploadSfFile',
          formOption: { rules: [{ required: true, message: '联动事由' }], initialValue: '' }
        }

      ]
    },
    schema1() {
      return [
        {
          label: '通知内容',
          type: 'textArea',
          field: 'notificationMessage',
          formOption: { rules: [{ required: true, message: '联动事由' }], initialValue: this.notificationMessage },
          disabled: true,
          vIf: () => {
            return this.type === 2
          }
        }
      ]
    }
  },
  watch: {
    messageParams: {
      handler(val) {
        this.getMessage(val)
      },
      deep: true
    }

  },
  created() {
  },
  mounted() {
  },
  methods: {
    show(id) {
      this.caseId = id
      this.visible = true
    },
    submit() {
      this.$refs.form.getFieldsValue().then(res => {
        const params = {
          ...res
        }
        console.log(params)
        params.fileIds = params.fileIds && params.fileIds.length ? params.fileIds.map(item => item.id) : []
        params.bos = []
        if (!this.group || this.group.length === 0) {
          this.$message.error('至少填写一组的数据')
          return
        }
        this.group.forEach(item => {
          const refsName = 'linkagePersonForm' + item.key
          const obj = this.$refs[refsName][0].getData()
          if (!obj.unitId && !obj.orgId) {
            this.$message.error('单位和组织至少选一个')
            return
          }
          params.bos.push(obj)
        })
        params.type = this.type
        params.days = this.messageParams.days
        params.caseId = this.caseId
        if (this.type === 2) {
          this.$refs.form1.getFieldsValue().then(res => {
            params.notificationMessage = res.notificationMessage
          })
        }
        this.loading = true
        addTeam(params).then(({ code, msg }) => {
          this.loading = false
          if (code === 200) {
            this.$message.success(msg)
            this.visible = false
            this.$emit('done')
            this.$refs.form1.resetFields()
            this.$refs.form.resetFields()
            this.notificationMessage = ''
          }
        })
      })
    },
    // 新增一组
    addGroup() {
      this.group.push(
        {
          key: (new Date()).getTime()
        }
      )
    },
    // 表单选择触发
    change(e) {
      if (e.field === 'type') {
        this.type = e.value.type
      }
      if (e.field === 'days') {
        this.messageParams.days = e.value.days
      }
    },
    // 删除
    del(key) {
      this.group = this.group.filter((item, index) => {
        return item.key !== key
      })
    },
    // 获取短信模板
    getMessage(messageParams) {
      const type = messageParams.type ? 'mediator' : 'dept'
      collaborativeMessage(this.caseId, type, { mediateDuration: messageParams.days || null }).then(({ code, msg }) => {
        if (code === 200) {
          this.notificationMessage = msg
        }
      })
    },
    getLinkPeople(e) {
      console.log(e)
      this.messageParams.type = e
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
