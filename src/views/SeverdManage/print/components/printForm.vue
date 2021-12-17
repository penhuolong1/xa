<template>
  <div>
    <Modal
      v-model="visible"
      :title="title"
      style="width:800px"
      :mask-closable="false"
      class="modal"
      @cancel="visible=false"
    >
      <Row class="content">
        <Col :span="2">{{ fileList.length > 1 ? '文书:':'' }}</Col>
        <Col :span="20">
          <Checkbox v-if="fileList.length > 1" :indeterminate="indeterminate" :checked="checkAll" style="margin-bottom: 0px;" @change="onCheckAllChange">
            全选
          </Checkbox>
          <CheckboxGroup v-model="selectList" @change="selectCheckBox">
            <span v-for="(item, index) in fileList" :key="index">
              <Checkbox :value="item">
                <span>{{ item }}</span>
                <a @click.stop.prevent="e => {edit(e, item)}">编辑</a>
              <!-- <div v-if="editFileInfo[item]" class="path-wrapper" @click="preview(editFileInfo[item])"><a>{{ editFileInfo[item] ? editFileInfo[item].name : '' }}</a></div> -->
              </Checkbox>
              <div class="form-wrapper">
                <Form1 v-if="showForm('应诉通知书', item)" ref="form1" :label-col="4" :schema="schema1" />
                <Form1 v-if="showForm('应诉通知书（法人）', item)" ref="form6" :label-col="4" :schema="schema6" />
                <Form1 v-if="showForm('举证通知书', item)" ref="form3" :label-col="4" :schema="schema3" />
                <Form1 v-if="showForm('质证通知书', item)" ref="form2" :label-col="4" :schema="schema2" />
                <Form1 v-if="showForm('送达回证', item)" ref="form4" :label-col="4" :schema.sync="schema4" @change="formChange" />
                <Form1 v-if="showForm('委托送达函', item)" ref="form5" :label-col="4" :schema.sync="schema5" />
                <Form1 v-if="showForm('生效证明（有盖章）', item)" ref="form7" :label-col="4" :schema="schema7" />
                <Form1 v-if="showForm('参加诉讼通知书（追加被告）', item)" ref="form8" :label-col="4" :schema="schema8" />
              </div>
            </span>
          </CheckboxGroup>
        </Col>
      </Row>
      <template slot="footer">
        <Button type="primary" :loading="loading1" @click="onConfirm(true)">
          确认申请并同意
        </Button>
        <Button type="primary" :loading="loading2" @click="onConfirm(false)">
          确认申请
        </Button>
        <Button type="primary" :loading="loading3" @click="onConfirm(null)">
          生成并预览
        </Button>
        <Button @click="visible=false">
          取消
        </Button>
      </template>
    </Modal>
    <Preview ref="preview" :file-list="fileList1" @getFile="getFile" />
  </div>
</template>
<script>
import { Modal, Form, Select, Button, Checkbox, Col, Row, Radio, Input, DatePicker } from 'ant-design-vue'
import { nextProcess } from '@/api/collectCase'
import { getPreviewUrl } from '@/api/common/index.js'
import { listTribunal } from '@/api/schedule/index.js'

import Form1 from '@/components/Form/index'

import Preview from '@/components/Preview/index'
import moment from 'moment'
import { buildDiploms, getEditDip } from '@/api/book/index.js'

// 送达材料
const sendFiles = [
  {
    value: '诉前调解通知书',
    label: '诉前调解通知书'
  },
  {
    value: '诉前调解告知书',
    label: '诉前调解告知书'
  },
  {
    value: '变更诉讼请求申请书',
    label: '变更诉讼请求申请书'
  },
  {
    value: '开庭传票',
    label: '开庭传票'
  },
  {
    value: '应诉通知书',
    label: '应诉通知书'
  },
  {
    value: '举证通知书',
    label: '举证通知书'
  },
  {
    value: '起诉状副本',
    label: '起诉状副本'
  },
  {
    value: '证据材料',
    label: '证据材料'
  },
  {
    value: '送达地址确认书',
    label: '送达地址确认书'
  },
  {
    value: '廉政监督卡',
    label: '廉政监督卡'
  },
  {
    value: '小额诉讼程序通知书',
    label: '小额诉讼程序通知书'
  },
  {
    value: '诉讼权利义务告知书',
    label: '诉讼权利义务告知书'
  },
  {
    value: '质证通知书',
    label: '质证通知书'
  },
  {
    value: '诉讼保全告知书',
    label: '诉讼保全告知书'
  },
  {
    value: '民事裁定书',
    label: '民事裁定书'
  },
  {
    value: '合议庭组成人员告知书',
    label: '合议庭组成人员告知书'
  },
  {
    value: '民事判决书',
    label: '民事判决书'
  },
  {
    value: '民事调解书',
    label: '民事调解书'
  },
  {
    value: '答辩状',
    label: '答辩状'
  },
  {
    value: '反诉状',
    label: '反诉状'
  },
  {
    value: '参加诉讼通知书',
    label: '参加诉讼通知书'
  },
  {
    value: '追加被告申请书',
    label: '追加被告申请书'
  },
  {
    value: '补充的证据材料',
    label: '补充的证据材料'
  },
  {
    value: '财产申报表',
    label: '财产申报表'
  },
  {
    value: '小额诉讼须知',
    label: '小额诉讼须知'
  },
  {
    value: '诉前保全通知书',
    label: '诉前保全通知书'
  },
  {
    value: '鉴定申请书',
    label: '鉴定申请书'
  },
  {
    value: '鉴定检材',
    label: '鉴定检材'
  }
]
// 委托附函材料
const entrustDiploms = [
  {
    value: '开庭传票',
    label: '开庭传票'
  },
  {
    value: '应诉通知书',
    label: '应诉通知书'
  },
  {
    value: '举证通知书',
    label: '举证通知书'
  },
  {
    value: '起诉状',
    label: '起诉状'
  },
  {
    value: '证据材料',
    label: '证据材料'
  },
  {
    value: '权利义务告知书',
    label: '权利义务告知书'
  },
  {
    value: '廉政监督卡',
    label: '廉政监督卡'
  },
  {
    value: '送达地址确认书',
    label: '送达地址确认书'
  },
  {
    value: '民事裁定书',
    label: '民事裁定书'
  },
  {
    value: '合议庭组成人员告知书',
    label: '合议庭组成人员告知书'
  },
  {
    value: '送达回证',
    label: '送达回证'
  },
  {
    value: '小额诉讼通知书',
    label: '小额诉讼通知书'
  }
]
export default {
  components: {
    Modal,
    Col,
    DatePicker,
    Row,
    Form,
    Input,
    Preview,
    Select,
    SelectOption: Select.Option,
    Radio,
    RadioGroup: Radio.Group,
    FormItem: Form.Item,
    TextArea: Input.TextArea,
    Checkbox,
    CheckboxGroup: Checkbox.Group,
    Button,
    Form1
  },
  props: {
    selectKey: {
      type: Array,
      default: () => []
    },
    title: { //
      type: String,
      default: ''
    },
    addressList: {
      type: Array,
      default: () => []
    },
    fileList: {
      type: Array,
      default: () => {
        return [
        ]
      }
    }
  },
  data() {
    return {
      visible: false,
      loading1: false,
      loading2: false,
      loading3: false,
      loading4: false,
      checkAll: false,
      indeterminate: false,
      selectList: [], // 选中的文书
      fileList1: [],
      editFileName: '',
      selectAdd: 1,
      editFileInfo: [], // 编辑文件的信息
      form: this.$form.createForm(this, { name: 'form' }),
      schema1: [ // 应诉，举证
        {
          label: '应诉时间',
          type: 'select',
          field: 'timeLength',
          formOption: { initialValue: 15 },
          options: [
            {
              value: 30,
              label: 30
            },
            {
              value: 15,
              label: 15
            },
            {
              value: 20,
              label: 20
            },
            {
              value: 10,
              label: 10
            },
            {
              value: 7,
              label: 7
            },
            {
              value: 5,
              label: 5
            }
          ]
        }
      ],
      schema6: [ // 应诉，举证
        {
          label: '应诉时间',
          type: 'select',
          field: 'respondDayLegal',
          formOption: { initialValue: 15 },
          options: [
            {
              value: 30,
              label: 30
            },
            {
              value: 15,
              label: 15
            },
            {
              value: 20,
              label: 20
            },
            {
              value: 10,
              label: 10
            },
            {
              value: 7,
              label: 7
            },
            {
              value: 5,
              label: 5
            }
          ]
        }
      ],
      schema3: [ // 举证通知书
        {
          label: '举证期限',
          type: 'select',
          field: 'respondDay',
          formOption: { initialValue: 10 },
          options: [
            {
              value: 30,
              label: 30
            },
            {
              value: 20,
              label: 20
            },
            {
              value: 15,
              label: 15
            },
            {
              value: 10,
              label: 10
            },
            {
              value: 7,
              label: 7
            },
            {
              value: 5,
              label: 5
            }
          ]
        }
      ],
      schema5: [
        {
          label: '委托法院',
          type: 'input',
          field: 'entrustCourt',
          formOption: { initialValue: '' }
        },
        {
          label: '委托附函',
          type: 'checkbox',
          field: 'entrustDiploms',
          indeterminate: true,
          needCheckAll: true,
          formOption: { initialValue: ['开庭传票', '应诉通知书', '举证通知书', '起诉状', '证据材料', '权利义务告知书', '廉政监督卡'] },
          options: entrustDiploms
        }
      ],
      schema7: [ // 生效证明
        {
          label: '生效时间',
          type: 'date',
          showTime: true,
          field: 'takeEffectDate'
        }
      ],
      schema8: [ // 参加诉讼通知书
        {
          label: '诉讼原因',
          type: 'input',
          field: 'joinReason'
        }
      ],
      selectSendFiles: '起诉状副本, 证据材料',
      sendInput1: '本院', // 本院
      sendInput2: '', // 其他
      triList: [], // 排庭地点
      selectTri: undefined, // 选择的排庭地点
      witnessDay: '' // 开庭时间
    }
  },
  computed: {
    showForm() {
      return (title, label) => {
        return this.selectList.findIndex(item => {
          return item === title
        }) !== -1 && label === title
      }
    },
    schema4() {
      return [
        {
          label: '送达地点',
          type: 'other',
          field: 'receiptAddress',
          content: (<FormItem label='送达地点'>
            <RadioGroup vModel={this.selectAdd}>
              <Radio value={1}>本院<Input class='send-input' vModel={this.sendInput1}/></Radio>
              <Radio value={2}>其他<Input class='send-input' vModel={this.sendInput2}/></Radio>
            </RadioGroup>
          </FormItem>)
        },
        {
          type: 'other',
          field: 'sendDiploms',
          content: (<FormItem label='已选文书'>
            <TextArea vModel={this.selectSendFiles}>
            </TextArea>
          </FormItem>)
        },
        {
          label: '送达文件',
          type: 'checkbox',
          field: 'sendDiploms1',
          indeterminate: true,
          needCheckAll: true,
          formOption: { initialValue: ['起诉状副本', '证据材料'] },
          options: sendFiles
        }
      ]
    },
    schema2() {
      return [ //
        {
          label: '排庭时间',
          type: 'other',
          showTime: true,
          field: 'witnessDay',
          content: (<FormItem label='排庭时间'>
            <DatePicker
              vModel={this.witnessDay}
              type='date'
              show-today={false}
              show-time={{
                'minute-step': 30,
                'second-step': 60,
                'disabledHours': () => {
                  const hours = []
                  for (var i = 0; i < 8; i++) {
                    hours.push(i)
                  }
                  for (var i = 17; i < 24; i++) {
                    hours.push(i)
                  }
                  return hours
                },
                defaultValue: moment('00:00', 'mm:ss')
              }}
              value-format='YYYY-MM-DD HH:mm:ss'
            />
          </FormItem>)
        },
        {
          label: '排庭地点',
          type: 'other',
          field: 'receiptAddress',
          content: (<FormItem label='排庭地点'>
            <Select vModel={this.selectTri}>
              {
                this.triList && this.triList.length > 0 ? this.triList.map(item => {
                  return (<SelectOption value={item.name}>{item.name}</SelectOption>)
                }) : ''
              }
            </Select>
          </FormItem>)
        },
        {
          label: '申请原因',
          type: 'input',
          field: 'applyReason'
        }
      ]
    }
  },
  watch: {
    visible() {
      if (!this.visible) {
        this.form.resetFields()
      }
    }
  },
  created() {
    this.getlistTribunal()
  },
  mounted() {
  },
  methods: {
    getlistTribunal() {
      listTribunal({ type: 1 }).then(({ code, data }) => {
        if (code === 200) {
          this.triList = data
        }
      })
    },
    onCheckAllChange(e) {
      Object.assign(this, {
        checkedList: e.target.checked,
        indeterminate: false,
        checkAll: e.target.checked
      })
      this.selectList = e.target.checked ? this.fileList : []
    },
    // 选择送达回证的表单触发
    formChange(e) {
      if (e.field === 'sendDiploms1') {
        this.selectSendFiles = e.value.sendDiploms1 && e.value.sendDiploms1.length > 0 ? e.value.sendDiploms1.join(',') : ''
      }
    },
    selectCheckBox(e) {
      this.selectList = e
      this.indeterminate = e.length > 0
    },
    show(info) {
      this.selectTri = info[0].tribunalName
      this.witnessDay = info[0].startTime
      this.selectList = []
      this.$nextTick(() => {
        if (this.fileList && this.fileList.length === 1) {
          this.selectList = this.fileList
        }
      })
      this.editFileInfo = []
      this.visible = true
    },
    // 编辑
    async edit(e, val) {
      if (this.selectList.indexOf(val) === -1) {
        this.$message.error('请先选择该文书')
        return
      }
      this.editFileName = val
      let params = {
        lawCaseId: this.selectKey[0].lawCaseId,
        dipNames: [val],
        litigantInfo: this.dealList(this.addressList)
      }
      if (this.selectList.indexOf('应诉通知书') !== -1) {
        await this.$refs.form1[0].getFieldsValue().then(res => {
          params = {
            ...params,
            ...res
          }
        })
      }
      if (this.selectList.indexOf('应诉通知书（法人）') !== -1) {
        await this.$refs.form6[0].getFieldsValue().then(res => {
          params = {
            ...params,
            ...res
          }
        })
      }
      if (this.selectList.indexOf('举证通知书') !== -1) {
        await this.$refs.form3[0].getFieldsValue().then(res => {
          params = {
            ...params,
            ...res
          }
        })
      }
      if (this.selectList.indexOf('质证通知书') !== -1) {
        await this.$refs.form2[0].getFieldsValue().then(res => {
          params = {
            ...params,
            ...res
          }
          params.tribunalName = this.selectTri// 选择的排庭地点
          params.witnessDay = this.witnessDay
        })
      }
      if (this.selectList.indexOf('送达回证') !== -1) {
        await this.$refs.form4[0].getFieldsValue().then(res => {
          params = {
            ...params,
            ...res
          }
          params.receiptAddress = this.selectAdd === 1 ? this.sendInput1 : this.sendInput2
          params.sendDiploms = this.selectSendFiles
        })
      }
      if (this.selectList.indexOf('委托送达函') !== -1) {
        await this.$refs.form5[0].getFieldsValue().then(res => {
          params = {
            ...params,
            ...res
          }
          params.entrustDiploms = params.entrustDiploms && params.entrustDiploms.length > 0 ? params.entrustDiploms.join(',') : ''
        })
      }
      if (this.selectList.indexOf('生效证明（有盖章）') !== -1) {
        await this.$refs.form7[0].getFieldsValue().then(res => {
          params = {
            ...params,
            ...res
          }
        })
      }
      if (this.selectList.indexOf('参加诉讼通知书（追加被告）') !== -1) {
        await this.$refs.form8[0].getFieldsValue().then(res => {
          params = {
            ...params,
            ...res
          }
        })
      }
      getEditDip(params).then(({ code, msg, data }) => {
        if (code === 200) {
          this.fileList1 = []
          // this.$refs.preview.show(data.pathList[0], this.fileList1)
          if (data.pathList && data.pathList.length > 0) {
            data.pathList.forEach(item => {
              const url = item.path
              getPreviewUrl(url, 'write').then(res => {
                if (res.code === 200) {
                  const obj = {
                    ...item,
                    fileName: this.editFileName,
                    fileId: res.data.token
                  }
                  this.editFileInfo.push(obj)
                  this.getFile(res.data)
                  window.open('/edit?id=' + res.data.token)
                  localStorage.setItem(res.data.token, res.data.wpsUrl)
                }
              })
            })
          }
        }
      })
    },
    preview(item) {
      this.$refs.preview.show(item.path, this.fileList)
    },
    async onConfirm(val) {
      let params = {
        lawCaseId: this.selectKey[0].lawCaseId,
        dipNames: this.selectList,
        litigantInfo: this.dealList(this.addressList),
        agreeSign: val
      }
      if (this.selectList.indexOf('应诉通知书') !== -1) {
        await this.$refs.form1[0].getFieldsValue().then(res => {
          params = {
            ...params,
            ...res
          }
        })
      }
      if (this.selectList.indexOf('应诉通知书（法人）') !== -1) {
        await this.$refs.form6[0].getFieldsValue().then(res => {
          params = {
            ...params,
            ...res
          }
        })
      }
      if (this.selectList.indexOf('举证通知书') !== -1) {
        await this.$refs.form3[0].getFieldsValue().then(res => {
          params = {
            ...params,
            ...res
          }
        })
      }
      if (this.selectList.indexOf('质证通知书') !== -1) {
        await this.$refs.form2[0].getFieldsValue().then(res => {
          params = {
            ...params,
            ...res
          }
          params.tribunalName = this.selectTri// 选择的排庭地点
          params.witnessDay = this.witnessDay
        })
      }
      if (this.selectList.indexOf('送达回证') !== -1) {
        await this.$refs.form4[0].getFieldsValue().then(res => {
          params = {
            ...params,
            ...res
          }
          params.receiptAddress = this.selectAdd === 1 ? this.sendInput1 : this.sendInput2
          params.sendDiploms = this.selectSendFiles
          delete params.sendDiploms1
        })
      }
      if (this.selectList.indexOf('委托送达函') !== -1) {
        await this.$refs.form5[0].getFieldsValue().then(res => {
          params = {
            ...params,
            ...res
          }
          params.entrustDiploms = params.entrustDiploms && params.entrustDiploms.length > 0 ? params.entrustDiploms.join(',') : ''
        })
      }
      if (this.selectList.indexOf('生效证明（有盖章）') !== -1) {
        await this.$refs.form7[0].getFieldsValue().then(res => {
          params = {
            ...params,
            ...res
          }
        })
      }
      if (this.selectList.indexOf('参加诉讼通知书（追加被告）') !== -1) {
        await this.$refs.form8[0].getFieldsValue().then(res => {
          params = {
            ...params,
            ...res
          }
        })
      }
      if (val === true) {
        this.loading1 = true
      } else if (val === false) {
        this.loading2 = true
      } else {
        this.loading3 = true
      }
      buildDiploms(params).then(({ code, msg, data }) => {
        if (val === true) {
          this.loading1 = false
        } else if (val === false) {
          this.loading2 = false
        } else {
          this.loading3 = false
        }
        if (code === 200) {
          if (data.error) {
            this.$message.error(data.error)
          } else {
            this.$message.success(msg)
          }
          if (val === null) {
            window.open(data.pdfPath)
          } else {
            this.$emit('done')
            this.reset()
            this.visible = false
          }
        }
      })
    },
    // 清空
    reset() {
      this.$refs.form1 && this.$refs.form1.resetFields && this.$refs.form1?.resetFields()
      this.$refs.form2 && this.$refs.form2.resetFields && this.$refs.form2?.resetFields()
      this.$refs.form3 && this.$refs.form3.resetFields && this.$refs.form3?.resetFields()
      this.$refs.form4 && this.$refs.form4.resetFields && this.$refs.form4?.resetFields()
      this.$refs.form5 && this.$refs.form5.resetFields && this.$refs.form5?.resetFields()
      this.$refs.form6 && this.$refs.form6.resetFields && this.$refs.form6?.resetFields()
      this.$refs.form7 && this.$refs.form7.resetFields && this.$refs.form7?.resetFields()
      this.$refs.form8 && this.$refs.form8.resetFields && this.$refs.form8?.resetFields()
    },
    // 处理数组
    dealList(list) {
      if (!list || list.length === 0) {
        return []
      }
      const litIds = [...new Set(list.map(item => {
        return item.split('-')[0]
      }))]
      console.log(litIds)
      let newList = []
      newList = litIds.map(item => {
        return {
          litigantId: item,
          addressList: list.filter(item1 => item1.indexOf(item) !== -1).map(item1 => {
            const editDips = []
            const ary = item1.split('-')
            const litId = ary[0]
            const address = ary[1]
            if (this.editFileInfo && this.editFileInfo.length > 0) {
              this.editFileInfo.forEach(item2 => {
                if (item2.litigantId == litId && item2.address == address) {
                  const obj = {
                    dipName: item2.fileName,
                    fileId: item2.fileId
                  }
                  editDips.push(obj)
                }
              })
            }
            return {
              address: item1.split('-')[1],
              addressType: item1.split('-')[2],
              editDips: editDips
            }
          })
        }
      })
      return newList
    },
    getFile(e) {
      this.editFileInfo[this.editFileName] = {
        fileName: this.editFileName,
        fileId: e.token
      }
    }
  }
}
</script>

<style scoped lang="less">
/deep/.ant-checkbox-wrapper {
  display: block;
  margin-bottom: 10px;
  margin-left: 8px;
}
/deep/.ant-checkbox-group {
  margin-top: 10px;
  display: inline-block;
}
.send-input {
  margin-left: 10px;
  width: 120px;
  margin-top: 5px;
}
.path-wrapper {
  white-space: nowrap;
}
.form-wrapper {
  width: 500px;
  position: relative;
  left: -50px;
}
.content {
  max-height: 600px;
  overflow-y: auto;
  overflow-x: hidden;
}
</style>
