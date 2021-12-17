<template>
  <Modal
    v-model="visible"
    title="推送综合送达平台"
    class="modal"
    width="500px"
    :mask-closable="false"
    @cancel="visible=false"
  >
    <Form1 ref="form" :schema="schema" :label-col="8" :wrapper-col="14" @change="change" />
    <template slot="footer">
      <Button @click="visible=false">
        取消
      </Button>
      <Button v-if="!isEdit" type="primary" :loading="loading" @click="onConfirm">
        确认
      </Button>
      <Button v-if="isEdit" type="primary" :loading="loading" @click="onEdit">
        编辑
      </Button>
      <Button v-if="isEdit" type="danger" @click="del">
        删除
      </Button>
    </template>
    <Preview ref="preview" :file-list="[]" />

  </Modal>
</template>
<script>
import { Modal, Button, Form, Checkbox } from 'ant-design-vue'
import { sendDiploms, editSendInfo, queryRelationLit, listLitDip, intranetSend } from '@/api/send/index.js'
import Form1 from '@/components/Form'
import { formatDate } from '@/utils/format.js'
import Preview from '@/components/Preview/index'
import { mapGetters } from 'vuex'
const nowTime = formatDate(new Date(), 'YYYY-MM-DD H:m:s')
export default {
  components: {
    Modal,
    Form1,
    Checkbox,
    CheckboxGroup: Checkbox.Group,
    Button,
    Preview,
    FormItem: Form.Item
  },
  props: {
    sendProcess: {
      type: Number,
      default: 1 // 1 诉前送达 2 庭前送达
    }
  },
  data() {
    return {
      visible: false,
      loading: false,
      sendFileList: [],
      title: '',
      nowTime: this.format(new Date(), 'YYYY-MM-DD h:m:s'),
      sendType: '',
      detailObj: {},
      isConcentrated: true, // 集中指派
      isAssign: false, // 指派上门送达员
      isEdit: false,
      relationSend: false,
      connectList: [],
      sendFile: [],
      relationLitIds: [],
      type: null, // 3电子送达
      form: this.$form.createForm(this, { name: 'form' })
    }
  },
  computed: {
    ...mapGetters(['getLawCaseId']),
    schema() {
      return [
        {
          label: '受送达人',
          type: 'litigant',
          placeholder: '请选择受送达人',
          field: 'litigantId',
          disabled: this.isEdit,
          formOption: { rules: [{ required: true, message: '请选择受送达人' }], initialValue: this.detailObj?.litigantId || undefined }
        },
        {
          type: 'other',
          content: (
            <FormItem label='送达材料'>
              <CheckboxGroup vModel={this.sendFile}>
                {
                  this.sendFileList && this.sendFileList.length > 0 ? this.sendFileList.map(item => {
                    return (<div><Checkbox value={item.id}>
                      <a onclick={(e) => { this.preview(item, e) }}>{item.name}</a>
                    </Checkbox></div>)
                  }) : (<span>暂无数据</span>)
                }
              </CheckboxGroup>
            </FormItem>
          )
        }
      ]
    }
  },
  watch: {
    visible() {
      if (!this.visible && this.isEdit) {
        this.$refs.form.resetFields()
        this.detailObj = {}
      }
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    show(data) {
      this.isEdit = false
      if (data) {
        this.isEdit = true
        this.$store.commit('SET_LITIGANTID', data.litigantId)
        this.detailObj = { ...data }
      }
      this.visible = true
    },
    onConfirm() {
      this.$refs.form.getFieldsValue().then(res => {
        const params = {
          ...res
        }
        params.lawCaseId = this.getLawCaseId
        params.dipIdList = this.sendFile
        intranetSend(params).then(({ code, msg }) => {
          this.loading = false
          if (code === 200) {
            this.$message.success(msg)
            this.$refs.form.resetFields()
            this.$emit('done')
            this.visible = false
          }
        })
      })
    },
    // 编辑
    onEdit() {
      this.$refs.form.getFieldsValue().then(res => {
        const params = {
        }
        params.sendId = this.detailObj.sendId
        params.lawCaseId = this.getLawCaseId
        params.litigantId = res.litigantId
        params.sendType = '上门送达'

        params.remark = res.remark
        params.sendDate = res.sendDate
        params.situation = res.situation
        params.sendState = res.sendState
        editSendInfo(params).then(({ code, msg }) => {
          this.loading = false
          if (code === 200) {
            this.$message.success(msg)
            this.$refs.form.resetFields()
            this.$emit('done')
            this.visible = false
          }
        })
      })
    },
    del() {
      this.$emit('delSendRecord', this.detailObj.sendId)
      this.visible = false
    },
    // 表单事件触发
    change(e) {
      if (e.field === 'litigantId') {
        this.visitRecived = e.value.visitRecived
        if (!e.value.litigantId) {
          return
        }
        queryRelationLit({ litigantId: e.value.litigantId }).then(({ code, data }) => {
          if (code === 200) {
            if (!data || data.length === 0) {
              return
            }
            this.connectList = data.map(item => {
              return {
                value: item.litId,
                label: `${item.caseNo}(${item.litName})`
              }
            })
          }
        })
        this.getSendFile(e.value.litigantId)
      }
      if (e.field === 'assignSender') {
        this.isAssign = e.value.assignSender
      }
      if (e.field === 'assignTogether') {
        this.isConcentrated = e.value.assignTogether
      }
      if (e.field === 'relationSend') {
        this.relationSend = e.value.relationSend
      }
    },
    getSendFile(id) {
      if (!id) {
        this.sendFileList = []
        return
      }
      listLitDip({ litigantId: id }).then(({ code, data }) => {
        if (code === 200) {
          this.sendFileList = data
        }
      })
    },
    preview(item, e) {
      e.preventDefault() // 阻止默认发生的事情
      e.stopPropagation()
      this.$refs.preview.show(item.path || item.dipPath, [])
    }
  }
}
</script>

<style scoped lang="less">
.no-margin {
  margin: 0;
}
.btn {
  width: 90%;
}
</style>
