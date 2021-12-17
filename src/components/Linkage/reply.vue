<template>
  <div>
    <Modal
      v-model="visible"
      title="答复"
      :mask-closable="false"
      style="width:600px"
    >
      <Form ref="form" :label-col="6" :wrapper-col="18" :schema="schema" />
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
import { Button, Modal } from 'ant-design-vue'
import { teamInfoById, updateTeam, replyTeam } from '@/api/sfAddcase/index.js'

import Form from '@/components/Form'

export default {
  components: {
    Button,
    Modal,
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
      info: {},
      form: this.$form.createForm(this, { name: 'form' })
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
          label: '联动事由',
          type: 'textArea',
          field: 'reason',
          disabled: true,
          formOption: { initialValue: this.info.reason }
        },
        {
          label: '文件',
          type: 'upload',
          field: 'input3',
          isEdit: false,
          formOption: { initialValue: '' },
          fileList: this.info.fileList
        },
        {
          label: '答复',
          type: 'textArea',
          field: 'content',
          formOption: { rules: [{ required: true, message: '答复内容不能为空' }], initialValue: '' }
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
      this.visible = true
      this.getData()
    },
    submit() {
      this.$refs.form.getFieldsValue().then(res => {
        const params = {
          id: this.teamId
        }
        params.content = res.content
        this.loading = true
        replyTeam(params).then(({ code, msg }) => {
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
          this.info = { ...data }
          this.info.createTime = data.createTime ? this.$moment(data.createTime).format('YYYY-MM-DD') : ''
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
</style>
