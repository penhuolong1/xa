<template>
  <div class="wrapper">
    <Sticky :sticky-top="120" :z-index="100">
      <div class="btn-wrapper">
        <Form :form="form" layout="inline">
          <FormItem label="送达环节">
            <Select
              v-decorator="['sendLink', { rules: [{ required: true,message:'请选择送达环节' }], initialValue: undefined}]"
              placeholder="请选择送达环节"
              style="width: 200px"
            >
              <SelectOption value="庭前送达">庭前送达</SelectOption>
              <SelectOption value="开庭通知">开庭通知</SelectOption>
              <SelectOption value="庭前送达+开庭通知">庭前送达+开庭通知</SelectOption>
              <SelectOption value="裁判文书送达">裁判文书送达</SelectOption>
              <SelectOption value="其他">其他</SelectOption>
              <SelectOption value="诉讼前财产保全">诉讼前财产保全</SelectOption>
              <SelectOption value="立案">立案</SelectOption>
              <SelectOption value="诉讼中财产保全">诉讼中财产保全</SelectOption>
              <SelectOption value="管辖异议">管辖异议</SelectOption>
              <SelectOption value="申请延长举证期限">申请延长举证期限</SelectOption>
              <SelectOption value="其他程序及程序转换">其他程序及程序转换</SelectOption>
              <SelectOption value="排期">排期</SelectOption>
              <SelectOption value="延长审限">延长审限</SelectOption>
              <SelectOption value="结案归档">结案归档</SelectOption>
              <SelectOption value="报告财产令">报告财产令</SelectOption>
            </Select>
          </FormItem>
          <FormItem label="送达机构">
            <Select
              v-decorator="['sendOrganization', { rules: [{ required: true,message:'请选择送达环节' }], initialValue: '全省集约送达'}]"
              style="width: 200px"
            >
              <SelectOption value="全省集约送达">全省集约送达</SelectOption>
              <SelectOption value="测试">测试</SelectOption>
              <SelectOption value="办公室">办公室</SelectOption>
            </Select>
          </FormItem>
          <FormItem label="要求完成时间">
            <DatePicker
              v-decorator="['completedDay', { rules: [{ required: true,message:'请选择要求完成时间' }], initialValue: time}]"
              style="width: 200px"
              type="date"
              value-format="YYYY-MM-DD HH:mm:ss"
            />
          </FormItem>
        </Form>
        <Button type="primary" :loading="loadBtn" @click="send">确认推送</Button>
      </div>
    </Sticky>
    <div class="content-wrapper mt-2.5">
      <CheckboxGroup v-if="!loading" v-model="caseIds" class="w-full">
        <div v-for="item in caseList" :key="item.lawCaseId" class="item">
          <div class="item-header">
            <h3><Checkbox :value="item.lawCaseId" @change="changeCase"><span @click="e => toDetail(e, item)">{{ item.caseNo || item.preCaseNo }}</span></Checkbox></h3>
          </div>
          <div class="item-table">
            <Spin v-if="loading" />
            <CheckboxGroup v-if="!loading" v-model="item.litId" class="w-full">
              <Table
                bordered
                :columns="columns"
                :data-source="item.data"
                :row-key="(record,index)=>{return index}"
                :pagination="false"
              >
                <div slot="name" slot-scope="text,record">
                  <div>
                    <Checkbox :value="record.litigantId" @change="e => changeCheck(e, item)">
                      <span>
                        <div class="litigation-status">{{ record.litigationStatus }}</div>
                        {{ record.litigantName }}
                      </span>
                    </Checkbox>
                  </div>
                </div>
                <div slot="phone" slot-scope="text, record">
                  <RadioGroup v-if="record.litigantPhones && record.litigantPhones.length > 0" v-model="record.phone" class="radio" button-style="solid" @change="changeRadio">
                    <Radio v-for="item1 in record.litigantPhones" :key="item1.phone" :value="item1.phone">{{ item1.phone }}
                      <span v-if="item1.active" class="active"><Icon type="check" /></span>
                    </Radio>
                  </RadioGroup>
                </div>
                <div slot="address" slot-scope="text, record">
                  <RadioGroup v-if="record.litigantAddresses && record.litigantAddresses.length > 0" v-model="record.address" class="radio" button-style="solid" @change="changeRadio">
                    <div>
                      <Radio v-for="item1 in record.litigantAddresses" :key="item1.address" class="address" :value="item1.address">
                        {{ item1.address }}<span v-if="item1.active" class="active"><Icon type="check" /></span>
                      </Radio>
                    </div>
                  </RadioGroup>
                </div>
                <div slot="content" slot-scope="text, record">
                  <div class="send-wrapper">
                    <div class="file-wrapper">
                      <Files :type="2" :case-id="item.lawCaseId" :check-list.sync="record.chooseFileList" :lit-id="record.litigantId" />
                    </div>
                    <div class="file-wrapper">
                      <Files :type="1" :check-list.sync="record.dipIdList" :lit-id="record.litigantId" />
                    </div>
                  </div>
                </div>
              </Table>
            </CheckboxGroup>
          </div>
        </div>
      </CheckboxGroup>
    </div>
  </div>
</template>

<script>
import { Button, Table, Checkbox, Radio, Spin, Icon, Form, Select, DatePicker } from 'ant-design-vue'
import Sticky from '@/components/Sticky/index.vue'
import { listLitInfo } from '@/api/addCase/index.js'
import { listLitDip, intranetSend } from '@/api/send/index.js'
import Files from './files.vue'
const columns = [
  { title: '受送达人', dataIndex: 'name', align: 'left', width: 200, key: 'name', scopedSlots: { customRender: 'name' }},
  { title: '联系电话', dataIndex: 'phone', align: 'left', width: 250, key: 'phone', scopedSlots: { customRender: 'phone' }},
  { title: '详细地址', dataIndex: 'address', align: 'left', width: 250, key: 'address', scopedSlots: { customRender: 'address' }},
  { title: '发送材料', align: 'content', scopedSlots: { customRender: 'content' }}
]
export default {
  components: {
    Button,
    Sticky,
    Icon,
    Checkbox,
    Spin,
    CheckboxGroup: Checkbox.Group,
    Table,
    RadioGroup: Radio.Group,
    Radio,
    Files,
    Select,
    DatePicker,
    SelectOption: Select.Option,
    Form,
    FormItem: Form.Item
  },
  props: {

  },
  data() {
    return {
      caseInfos: [], // 综合送达的全部案件id
      caseList: [],
      form: this.$form.createForm(this, { name: 'form' }),
      loading: false,
      time: this.$moment((new Date().getTime()) + 9 * 24 * 60 * 60 * 1000).format('YYYY-MM-DD HH:mm:ss'),
      loadBtn: false,
      columns: columns,
      caseIds: [] // 所选案件id
    }
  },
  created() {

  },
  mounted() {
    this.init()
  },
  methods: {
    // 初始化数据
    init() {
      this.caseInfos = JSON.parse(localStorage.getItem('sendComplexIdCaseInfo'))
      this.caseList = []
      this.loading = true
      this.caseInfos.forEach(item => {
        const params = {
          lawCaseId: item.lawCaseId
        }
        listLitInfo(params).then(({ code, data }) => {
          if (code === 200) {
            if (!data || data.length === 0) {
              return
            }
            data.forEach(async item => {
              item.litigationStatus = item.litigationStatus.indexOf('代理人') !== -1 ? '代理人' : item.litigationStatus
              item.chooseCheckAll = false
              item.chooseIndeterminate = false
              item.dipCheckAll = false
              item.dipIndeterminate = false
              await listLitDip({ litigantId: item.litigantId }).then(({ code, data }) => {
                if (code === 200) {
                  item.files = data
                }
              })
            })
            const obj = {
              ...item,
              data
            }
            this.caseList.push(obj)
          }
        })
      })
      setTimeout(() => {
        this.loading = false
        this.caseIds = this.caseInfos.map(item => item.lawCaseId)
        this.caseList.forEach(item => {
          this.dealData(item)
        })
      }, 1000)
    },
    // 选中所有数据
    dealData(item) {
      item.litId = item.data.map(item => item.litigantId)
      item.data.forEach(item1 => {
        const phonelist = [] // 明确送达电话的列表
        if (item1.litigantPhones && item1.litigantPhones.length > 0) {
          item1.litigantPhones.forEach(item2 => {
            if (item2.remark && item2.remark.indexOf('明确送达联系方式') !== -1) {
              item2.active = true
              phonelist.push(item2)
            }
          })
        }
        if (phonelist && phonelist.length) { // 假如明确的送达联系有多个则选择第一个
          item1.phone = phonelist[0].phone
        } else {
          item1.phone = item1.litigantPhones && item1.litigantPhones.length > 0 ? item1.litigantPhones[0].phone : ''
        }
        const addressList = [] // 明确送达地址的列表
        if (item1.litigantAddresses && item1.litigantAddresses.length > 0) {
          item1.litigantAddresses.forEach(item2 => {
            if (item2.remark && item2.remark.indexOf('明确送达地址') !== -1) {
              item2.active = true
              addressList.push(item2)
            }
          })
        }
        if (addressList && addressList.length > 0) {
          item1.address = addressList[0].address
        } else {
          item1.address = item1.litigantAddresses && item1.litigantAddresses.length > 0 ? item1.litigantAddresses[0].address : ''
        }
      })
    },
    // 取消对应案件下面的所有选中
    cancelSelect(item) {
      item.litId = []
    },
    // 确认推送
    send() {
      this.form.validateFields(err => {
        if (err) {
          return
        }
        const list = [...this.caseList]
        let params = []
        list.forEach(item => {
          const litId = item.litId
          const litInfoList = item.data
          if (!litId || litId.length === 0) {
            return
          }
          let selectLit = litInfoList.filter(item1 => {
            return litId.findIndex(item2 => {
              return item1.litigantId === item2
            }) !== -1
          })
          selectLit = selectLit && selectLit.length > 0 ? selectLit.map(item1 => {
            const obj = {
              lawCaseId: item.lawCaseId,
              litigantId: item1.litigantId,
              phone: item1.phone,
              address: item1.address,
              dipIdList: item1.dipIdList && item1.dipIdList.length > 0 ? item1.dipIdList.map(item2 => item2.id) : [],
              chooseFileList: item1.chooseFileList && item1.chooseFileList.length > 0 ? item1.chooseFileList.map(item2 => {
                return {
                  name: item2.name,
                  path: item2.path
                }
              }) : []
            }
            return obj
          }) : []
          params = [...params, ...selectLit]
          params = params.map(item => {
            return {
              ...item,
              ...this.form.getFieldsValue()
            }
          })
        })
        this.loadBtn = true
        intranetSend(params).then(({ code, msg }) => {
          this.loadBtn = false
          if (code === 200) {
            this.$message.success(msg)
            this.$store.dispatch('DelTags', '/case/compresend')
            this.$router.push('/caseHandle/print')
          }
        })
      })
    },
    // 跳转详情
    toDetail(e, item) {
      if (e.preventDefault) {
        e.preventDefault()
      } else {
        window.event.returnValue == false
      }
      const caseNo = item.caseNo || item.preCaseNo
      const path = `/case/detail?lawCase=${item.lawCaseId}`
      const obj = {
        path,
        caseNo: caseNo,
        caseId: item.lawCaseId
      }
      this.$store.dispatch('ToDetail', obj)
    },
    changeRadio() {
      this.$forceUpdate()
    },
    changeCheck(e, item) {
      console.log(e)
      console.log(item)
      const caseId = item.lawCaseId
      const litId = e.target.value
      if (e.target.checked) {
        this.caseList.forEach(item => {
          if (item.lawCaseId === caseId) {
            item.data.forEach(item1 => {
              if (item1.litigantId === litId) {
                const phonelist = [] // 明确送达电话的列表
                if (item1.litigantPhones && item1.litigantPhones.length > 0) {
                  item1.litigantPhones.forEach(item2 => {
                    if (item2.remark && item2.remark.indexOf('明确送达联系方式') !== -1) {
                      item2.active = true
                      phonelist.push(item2)
                    }
                  })
                }
                if (phonelist && phonelist.length) { // 假如明确的送达联系有多个则选择第一个
                  item1.phone = phonelist[0].phone
                } else {
                  item1.phone = item1.litigantPhones && item1.litigantPhones.length > 0 ? item1.litigantPhones[0].phone : ''
                }
                const addressList = [] // 明确送达地址的列表
                if (item1.litigantAddresses && item1.litigantAddresses.length > 0) {
                  item1.litigantAddresses.forEach(item2 => {
                    if (item2.remark && item2.remark.indexOf('明确送达地址')) {
                      item2.active = true
                      addressList.push(item2)
                    }
                  })
                }
                if (addressList && addressList.length > 0) {
                  item1.address = addressList[0].address
                } else {
                  item1.address = item1.litigantAddresses && item1.litigantAddresses.length > 0 ? item1.litigantAddresses[0].address : ''
                }
              }
            })
          }
        })
      } else {
        this.caseList.forEach(item => {
          if (item.lawCaseId === caseId) {
            item.data.forEach(item1 => {
              if (item1.litigantId === litId) {
                item1.phone = ''
                item1.address = ''
                item1.dipIdList = []
                item1.chooseFileList = []
              }
            })
          }
        })
      }
      this.$forceUpdate()
    },
    // 选择案件
    changeCase(e) {
      const caseId = e.target.value
      console.log(this.list)
      if (e.target.checked) {
        this.caseList.forEach(item => {
          if (item.lawCaseId === caseId) {
            this.dealData(item)
          }
        })
      } else {
        this.caseList.forEach(item => {
          if (item.lawCaseId === caseId) {
            item.litId = []
            item.data.forEach(item1 => {
              item1.phone = ''
              item1.address = ''
              item1.dipIdList = []
              item1.chooseFileList = []
            })
          }
        })
      }
    }
  }
}
</script>

<style scoped lang="less">
.btn-wrapper {
  display: flex;
  justify-content: space-between;
  background-color: #fff;
}
.item-header {
  background: rgba(232,244,255,1);
  display: flex;
  height: 60px;
  align-items: center;
  padding: 0 20px;
  h3 {
    font-weight: bolder;
  }
}
.litigation-status {
  display: inline-block;
  background: rgba(101,183,243,0.2);
  border-radius: 20px;
  color: #65B7F3;
  padding: 5px 10px;
}
.address {
  display: block;
  max-width: 200px;
  white-space: normal;
}
.send-wrapper {
  display: flex;
  text-align: left;
  .file-wrapper {
    flex: 1;
    &:first-child {
      border-right: 1px solid #e8e8e8;
      padding-right: 10px;
    }
    &:last-child {
      border-right: 1px solid #e8e8e8;
      padding-left: 10px;
    }
  }
  .send-button {
    border-radius: 20px;
  }
}
.active {
  display: inline-flex;
  width: 20px;
  height: 20px;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  color: #fff;
  background-color: #A3D9AB;
  margin-left: 10px;
}
</style>
