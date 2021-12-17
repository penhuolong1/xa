<template>
  <div class="wrapper">
    <Form1 ref="form1" :label-col="6" :schema="schema" @change="change" @done="getFilesList" />
    <Col :span="6" />
    <Button v-if="!hasInfo" type="primary" :loading="loading" @click="handleTeam">
      确认
    </Button>
    <Preview ref="preview" :file-list="fileList" />
  </div>
</template>

<script>
import { Button, Col, Form } from 'ant-design-vue'
import Form1 from '@/components/Form'
import { moveCourt, getMoveInfo, queryForMoveCourt } from '@/api/sfAddcase/index.js'
import { closeCaseSuccess } from '@/type/index.js'
import { mapGetters } from 'vuex'
import Preview from '@/components/Preview/index'
export default {
  components: {
    Button,
    Col,
    Preview,
    FormItem: Form.Item,
    Form1
  },
  props: {

  },
  data() {
    return {
      loading: false,
      obj: {},
      fileList: [],
      resultState: undefined,
      hasInfo: true, // 存在富强信息
      allFilesList: [], // 获取卷宗所有文件的信息
      moveCourtList: [], // 获取移送法院材料
      moveResult: null, // 申请结果
      form: this.$form.createForm(this, { name: 'form' }),
      fileIds: {
        plaintiffIds: [], // 申请人身份材料
        defendantIds: [], // 被申请人身份材料
        complaintIds: [], // 起诉状(调解申请书)
        sendAddressIds: [], // 送达地址确认书
        mediateFileIds: [], // 调解协议
        applyFileIds: [], // 司法确认申请书
        noteIds: [], // 调解笔录
        moveIds: [], // 移送函
        noticeIds: [], // 权利义务告知书
        preservationIds: [], // 保全材料
        identifyIds: [], // 鉴定材料
        otherIds: [] // 其他材料
      },
      fileIdMap: {
        申请人材料: 'plaintiffIds',
        被申请人材料: 'defendantIds',
        调解申请书: 'complaintIds',
        送达地址确认书: 'sendAddressIds',
        调解协议书: 'mediateFileIds',
        司法确认申请书: 'applyFileIds',
        调解笔录: 'noteIds',
        移送函: 'moveIds',
        权利义务告知书: 'noticeIds',
        保全材料: 'preservationIds',
        鉴定材料: 'identifyIds',
        其他材料: 'otherIds'
      }
    }
  },
  computed: {
    ...mapGetters(['getSfCaseInfo', 'getSfLawCaseId']),
    // 判断案件是否成功
    isSuccess() {
      return closeCaseSuccess.findIndex(item => item === this.getSfCaseInfo.mediateResult) !== -1
    },
    schema() {
      const list1 = [
        {
          label: '申请人材料',
          name: '申请人材料',
          type: 3 // 1申请司法确认 2申请立案 3 //申请司法确认和申请立案都显示
        },
        {
          label: '被申请人材料',
          name: '被申请人材料',
          type: 3
        },
        {
          label: '起诉状',
          name: '调解申请书',
          type: 3
        },
        {
          label: '送达地址确认书',
          name: '送达地址确认书',
          type: 3
        },
        {
          label: '调解协议书',
          name: '调解协议书',
          type: 1
        },
        {
          label: '司法确认申请书',
          name: '司法确认申请书',
          type: 1
        },
        {
          label: '调解笔录',
          name: '调解笔录',
          type: 1
        },
        {
          label: '移送函',
          name: '移送函',
          type: 1
        },
        {
          label: '权利义务告知书',
          name: '权利义务告知书',
          type: 1
        },
        {
          label: '保全材料',
          name: '保全材料',
          type: 2
        },
        {
          label: '鉴定材料',
          name: '鉴定材料',
          type: 2
        },
        {
          label: '其他材料',
          name: '其他材料',
          type: 3
        }
      ]
      const fileLists = list1.map(item => {
        return {
          type: 'other',
          content: (<FormItem label={item.label}>
            {
              this.moveCourtList && this.moveCourtList.length > 0 ? this.moveCourtList.filter(item1 => {
                return item1.catalogName === item.name
              }).map(item => {
                return (<a class='file-name' onclick={() => { this.preview(item) }}>{item.fileName}</a>)
              }) : <span>暂无</span>
            }
          </FormItem>),
          vIf: () => {
            if (item.type === 3) {
              return this.hasInfo
            }
            if (item.type === 1) {
              return this.isSuccess && this.hasInfo
            }
            if (item.type === 2) {
              return !this.isSuccess && this.hasInfo
            }
          }
        }
      })
      return [
        {
          label: '移送类型',
          type: 'input',
          field: 'type',
          disabled: true,
          formOption: { initialValue: this.isSuccess ? '司法确认' : '立案' }
        },
        {
          label: '移送时间',
          type: 'date',
          field: 'moveTime',
          showTime: true,
          disabled: this.hasInfo,
          formOption: { rules: [{ required: true, message: '请选择移送时间' }], initialValue: this.obj?.moveTime ? this.obj.moveTime : this.format(new Date(), 'YYYY-MM-DD H:m:s') }
        },
        {
          label: '诉讼请求',
          type: 'textArea',
          field: 'newClaim',
          disabled: this.hasInfo,
          formOption: { rules: [{ required: true, message: '请输入诉讼请求' }], initialValue: this.obj?.newClaim ? this.obj.newClaim : this.getSfCaseInfo.claim }
        },
        {
          label: '事实与理由',
          type: 'textArea',
          field: 'newFactReason',
          disabled: this.hasInfo,
          formOption: { rules: [{ required: true, message: '请输入事实与理由' }], initialValue: this.obj?.newFactReason ? this.obj.newFactReason : this.getSfCaseInfo.factReason }
        },
        // 司法确认需要的文书
        {
          label: '申请人材料',
          type: 'uploadFile',
          field: 'plaintiffIds',
          fileType: 10,
          formOption: { rules: [{ required: true, message: '请选择原告身份信息材料' }], initialValue: this.fileIds.plaintiffIds },
          vIf: () => {
            return !this.hasInfo
          }
        },
        {
          label: '被申请人材料',
          type: 'uploadFile',
          field: 'defendantIds',
          fileType: 11,
          formOption: { rules: [{ required: true, message: '请选择被告身份信息材料' }], initialValue: this.fileIds.defendantIds },
          vIf: () => {
            return !this.hasInfo
          }
        },
        {
          label: '起诉状',
          type: 'uploadFile',
          field: 'complaintIds',
          fileType: 6, // //1 解协议书 2司法确认申请书 3调解笔录、4移送函、5权利义务告知书 6起诉状  7保全材料   8鉴定材料 9 其他材料
          formOption: { rules: [{ required: true, message: '请选择起诉状' }], initialValue: this.fileIds.complaintIds },
          vIf: () => {
            return !this.hasInfo
          }
        },
        {
          label: '送达地址确认书',
          type: 'uploadFile',
          field: 'sendAddressIds',
          fileType: 9,
          formOption: { rules: [{ required: true, message: '请选择送达地址确认书' }], initialValue: this.fileIds.sendAddressIds },
          vIf: () => {
            return !this.hasInfo
          }
        },
        {
          label: '调解协议书',
          type: 'uploadFile',
          field: 'mediateFileIds',
          fileType: 1,
          formOption: { rules: [{ required: true, message: '请选择调解协议' }], initialValue: this.fileIds.mediateFileIds },
          vIf: () => {
            return this.isSuccess && !this.hasInfo
          }
        },
        {
          label: '司法确认申请书',
          type: 'uploadFile',
          field: 'applyFileIds',
          fileType: 2,
          formOption: { rules: [{ required: true, message: '请选择司法确认申请书' }], initialValue: this.fileIds.applyFileIds },
          vIf: () => {
            return this.isSuccess && !this.hasInfo
          }
        },
        {
          label: '调解笔录',
          type: 'uploadFile',
          field: 'noteIds',
          fileType: 3,
          formOption: { rules: [{ required: true, message: '请选择调解笔录' }], initialValue: this.fileIds.noteIds },
          vIf: () => {
            return this.isSuccess && !this.hasInfo
          }
        },
        {
          label: '移送函',
          type: 'uploadFile',
          field: 'moveIds',
          fileType: 4,
          formOption: { rules: [{ required: true, message: '请选择移送函' }], initialValue: this.fileIds.moveIds },
          vIf: () => {
            return this.isSuccess && !this.hasInfo
          }
        },
        {
          label: '权利义务告知书',
          type: 'uploadFile',
          field: 'noticeIds',
          fileType: 5,
          formOption: { rules: [{ required: true, message: '请选择权利义务告知书' }], initialValue: this.fileIds.noticeIds },
          vIf: () => {
            return this.isSuccess && !this.hasInfo
          }
        },
        {
          label: '保全材料',
          type: 'uploadFile',
          field: 'preservationIds',
          fileType: 7,
          formOption: { initialValue: this.fileIds.preservationIds },
          vIf: () => {
            return !this.isSuccess && !this.hasInfo
          }
        },
        {
          label: '鉴定材料',
          type: 'uploadFile',
          field: 'identifyIds',
          fileType: 8,
          formOption: { initialValue: this.fileIds.identifyIds },
          vIf: () => {
            return !this.isSuccess && !this.hasInfo
          }
        },
        {
          label: '其他材料',
          type: 'uploadFile',
          field: 'otherIds',
          fileType: 99,
          formOption: { initialValue: this.fileIds.otherIds },
          vIf: () => {
            return !this.hasInfo
          }
        },
        ...fileLists
      ]
    }
  },
  created() {
    this._getMoveInfo()
    this.getFilesList()
  },
  mounted() {

  },
  methods: {
    // 获取卷宗所有文书得信息
    getFilesList() {
      queryForMoveCourt({ sfLawCaseId: this.getSfLawCaseId }).then(({ code, data }) => {
        if (code === 200) {
          this.allFilesList = data
        }
      })
    },
    handleTeam() {
      this.$refs.form1.getFieldsValue().then(res => {
        const params = {
          ...res
        }
        params.sfLawCaseId = this.getSfCaseInfo.id
        delete params.type
        const fileIds = Object.keys(this.fileIds)
        for (const key in params) {
          const index = fileIds.findIndex(item => item === key)
          if (index !== -1) {
            if (this.moveResult === 2) { // 补正材料
              params[key] = params[key] && params[key].length > 0 ? params[key].map(item => {
                const id = this.moveCourtList.find(item1 => item1.catalogName === item) ? this.moveCourtList.find(item1 => item1.catalogName === item).fileId : this.allFilesList.find(item1 => item1.name === item).id
                return id
              }) : []
            } else {
              params[key] = params[key] && params[key].length > 0 ? params[key].map(item => {
                const id = this.allFilesList.find(item1 => {
                  console.log(item1)
                  return item1.name === item
                }).id
                return id
              }) : []
            }
          }
        }
        moveCourt(params).then(({ code, msg }) => {
          this.loading = false
          if (code === 200) {
            this.$message.success(msg)
            this.$refs.form1.resetFields()
            this._getMoveInfo()
            this.$store.dispatch('GetSfCaseInfo')
            this.$store.dispatch('GetHandleOfCase')
            this.$store.dispatch('GetOperateLogOfCase')
          }
        })
      })
    },
    // 获取赋强信息
    _getMoveInfo() {
      this.obj = {}
      this.hasInfo = false
      getMoveInfo({ sfLawCaseId: this.getSfCaseInfo.id }).then(({ code, data }) => {
        if (code === 200) {
          // if (data.judicialApplyFlag) {
          //   this.hasInfo = true
          // } else {
          //   this.hasInfo = false
          // }
          this.moveCourtList = data.fileInfo
          this.moveResult = data.moveResult
          if (this.getSfCaseInfo.state === '申请司法确认' || this.getSfCaseInfo.state === '申请立案') {
            if (data.moveResult === 2) { // 0 暂未处理 1 审批通过 2 补正材料 3 不予受理
              this.hasInfo = false
              for (const key in this.fileIdMap) {
                const list = data.fileInfo.filter(item => item.catalogName === key)
                this.fileIds[this.fileIdMap[key]] = list && list.length > 0 ? list.map(item => item.fileName) : []
              }
            } else {
              this.hasInfo = true
            }
          } else {
            this.hasInfo = false
          }
          const info = {}
          if (data.fileInfo && data.fileInfo.length > 0) {
            data.fileInfo.forEach(item => {
              if (info[item.catalogName]) {
                info[item.catalogName].push({
                  fileName: item.fileName,
                  filePath: item.filePath
                })
              } else {
                info[item.catalogName] = [{
                  fileName: item.fileName,
                  filePath: item.filePath
                }]
              }
            })
          }
          this.obj = data
          this.obj.info = info
        }
      })
    },
    change(e) {
      console.log(e)
      if (e.field === 'resultState') {
        this.resultState = e.value.resultState
      }
    },
    preview(e) {
      console.log(e)
      this.$refs.preview.show(e.filePath, [])
    }
  }
}
</script>

<style scoped lang="less">
.wrapper {
  padding-top: 20px;
}
.file-name {
  display: block;
  #ellipsis();
}
</style>
