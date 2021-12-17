<template>
  <div>
    <SearchForm :is-skeleton="isSkeleton" :default-value="defaultValue" :schema="searchSchema" class="enter-X" @search="search">
      <div slot="header" class="search-form">
        <OtherRadio v-model="signatureState" :default-value="signatureState" label="签章状态" :list="options" @change="changeSignature" />
      </div>
    </SearchForm>
    <div class="list-btn-content">
      <span v-if="signatureState === 99">
        <Button class="list-btn-item" type="green" @click="sendComplex()">推送综合送达平台</Button>
        <Button class="list-btn-item" type="green" @click="print('批量生成')">批量生成</Button>
        <Button class="list-btn-item" type="primary" @click="print('诉前调解通知书')">诉前调解通知书</Button>
        <Button class="list-btn-item" type="primary" @click="print('诉前调解告知书')">诉前调解告知书</Button>
        <Button class="list-btn-item" type="primary" @click="print('传票')">传票</Button>
        <Button class="list-btn-item" type="primary" @click="print('应诉通知书')">应诉通知书</Button>
        <!-- <Button class="list-btn-item" type="primary" @click="print('参加诉讼通知书')">参加诉讼通知书</Button> -->
        <Button class="list-btn-item" type="primary" @click="print('举证通知书')">举证通知书</Button>
        <Button class="list-btn-item" type="primary" @click="print('质证通知书')">质证通知书</Button>
        <Button class="list-btn-item" type="primary" @click="getSendFile('送达流程表')">送达流程表</Button>
        <!-- <Button class="list-btn-item" type="primary" @click="print('EMS邮单')">EMS邮单</Button> -->
      </span>
      <Button v-if="signatureState === 0" class="list-btn-item" type="primary" @click="signature(1)">同意盖章</Button>
      <Button v-if="signatureState === 0" class="list-btn-item" type="primary" @click="signature(2)">不同意盖章</Button>
      <Button v-if="signatureState === 1" class="list-btn-item" type="primary" @click="batchPrint()">打印</Button>
    </div>
    <Table
      v-if="isTable & signatureState==99 "
      :row-selection="rowSelection"
      :scroll="{x:1400}"
      :columns="columns"
      :data-source="tabledata"
      :loading="loading"
      :row-key="(record,index)=>{return record.lawCaseId}"
      :expanded-row-keys="expandedRowKeys"
      :pagination="{
        total: total,
        showTotal: total => {
          return `共计${total}条`
        },
        current: searchParams.pageNum,
        showSizeChanger: true,
        showQuickJumper: true,
      }"
      @expand="expand"
      @change="changePage"
    >
      <div slot="preCaseNo" slot-scope="text, records">
        <a @click="toDetail(records)">{{ text }}</a>
      </div>
      <div slot="caseNo" slot-scope="text, records">
        <a @click="toDetail(records)">{{ text }}</a>
      </div>
      <CheckboxGroup
        slot="expandedRowRender"
        v-model="records.select"
        slot-scope="records"
      >
        <Table
          class="inner-table"
          bordered
          :columns="innercolumns"
          :row-key="(record,index)=>{return index}"
          :data-source="records.list"
          :pagination="false"
        >
          <div slot="address" slot-scope="text, row">
            <Checkbox v-if="text" :value="row.litigantId + '-' + text + '-' +row.addressType+'-3'">{{ text }}</Checkbox>
          </div>
        </Table>
      </CheckboxGroup>
    </Table>
    <SignatureTable v-if="signatureState !=99" ref="signatureTable" :signature-state="signatureState" @done="changeSignature(0)" />
    <PrintForm ref="printForm" :select-key="selectedRows" :title="modalTitle" :address-list="addressList" :file-list="fileList" @done="getList" />
  </div>
</template>
<script>
import SearchForm from '@/components/SearchForm'
import { Button, Table, Checkbox, Icon } from 'ant-design-vue'
import { lawCaseStatus } from '@/type/index.js'
import { listLitAddr } from '@/api/freeze/index.js'
import { queryCaseInfo, downSendInfoFile } from '@/api/addCase'
import OtherRadio from '@/components/OtherRadio'
import PrintForm from './components/printForm.vue'
import Tag from '@/components/Tag/index.vue'
import SignatureTable from './components/signatureTable.vue'
import Preview from '@/components/Preview/index'

export default {
  components: {
    Preview,
    SearchForm,
    Icon,
    Tag,
    Button,
    OtherRadio,
    Table,
    Checkbox,
    CheckboxGroup: Checkbox.Group,
    PrintForm,
    SignatureTable
  },
  props: {
  },
  data() {
    return {
      isTable: true,
      loading: false,
      isSkeleton: false,
      selectedRows: [],
      signatureState: 99,
      options: [
        {
          value: 99,
          label: '全部'
        },
        {
          value: 0,
          label: '待签章'
        },
        {
          value: 3,
          label: '签章中'
        },
        {
          value: 1,
          label: '已签章'
        },
        {
          value: 2,
          label: '不同意签章'
        }
      ],
      fileList: [],
      total: 0,
      modalTitle: '', // 打印模态框标题
      addressList: [],
      defaultValue: {
      },
      searchSchema: [
        {
          label: '预案号/案号',
          type: 'caseNo',
          field1: 'prefixPreCaseNo1',
          field2: 'prefixPreCaseNo2',
          field3: 'startNumber',
          field4: 'endNumber'
        },
        {
          label: '预立案/立案时间',
          type: 'time',
          field: ['fillingDateStart', 'fillingDateEnd'],
          showTime: true
        },
        {
          label: '案件状态',
          type: 'select',
          field: 'lawCaseState',
          options: lawCaseStatus.map(item => {
            return {
              value: item.label,
              label: item.label
            }
          })
        },
        {
          label: '案由',
          type: 'brief',
          field: 'briefId'
        },
        {
          label: '当事人姓名',
          type: 'input',
          field: 'litigantName'
        }
      ],
      columns: [
        {
          title: '序号',
          dataIndex: 'index',
          key: 'index'
        },
        {
          title: '预立案号',
          dataIndex: 'preCaseNo',
          key: 'preCaseNo',
          scopedSlots: { customRender: 'preCaseNo' }

        },
        {
          title: '案号',
          dataIndex: 'caseNo',
          key: 'caseNo',
          scopedSlots: { customRender: 'caseNo' }

        },
        {
          title: '预立案时间',
          dataIndex: 'preFilingDate',
          key: 'preFilingDate'
        },

        {
          title: '立案时间',
          dataIndex: 'filingDate',
          key: 'filingDate'
        },
        {
          title: '承办部门',
          dataIndex: 'takingDepartment',
          key: 'takingDepartment'
        },
        {
          title: '承办人',
          dataIndex: 'judgeName',
          key: 'judgeName'
        },
        {
          title: '法官助理',
          dataIndex: 'assistantJudgeName',
          key: 'assistantJudgeName'
        },

        {
          title: '诉前程序时间',
          dataIndex: 'preStartTime',
          key: 'preStartTime'
        },
        {
          title: '排庭时间',
          dataIndex: 'startTime',
          key: 'startTime'
        },
        {
          title: '案件状态',
          dataIndex: 'preCloseType',
          key: 'preCloseType'
        }

      ],
      tabledata: [],
      searchParams: { // 列表搜索条件
        pageNum: 1,
        pageSize: 10
      },
      innercolumns: [
        {
          title: '',
          dataIndex: 'litigationStatus',
          key: 'litigationStatus',
          scopedSlots: { customRender: 'litigationStatus' },
          width: 100,
          customRender: (text, row, index) => {
            const obj = {
              children: <Checkbox onchange={(e) => this.getCheck(e, row)} value={row.litigationStatus + '-' + row.caseId + '-1'}>{text}</Checkbox>,
              attrs: {}
            }
            obj.attrs.rowSpan = row.litigationStatusRowSpan
            return obj
          }
        },
        {
          title: '',
          dataIndex: 'litigantName',
          key: 'litigantName',
          customRender: (text, row, index) => {
            const tag1 = row.pushIntranetPre > 0 ? (<Tag class='ml-2.5' text='诉前已推送'/>) : ''
            const tag2 = row.pushIntranet > 0 ? (<Tag class='ml-2.5' text='正式已推送'/>) : ''
            return {
              children: <Checkbox onchange={(e) => this.getCheck(e, row)} value={row.litigantId + '-2'}>{text}{tag1}{tag2}</Checkbox>,
              attrs: {
                rowSpan: row.litigantNameRowSpan
              }
            }
          }
        },
        {
          title: '',
          dataIndex: 'addressType',
          key: 'addressType',
          customRender: (text) => {
            return {
              children: '地址类型:' + (text || '')
            }
          }
        },
        {
          title: '',
          dataIndex: 'address',
          key: 'address',
          scopedSlots: { customRender: 'address' }
        }
        // {
        //   title: '邮单号',
        //   dataIndex: 'email',
        //   key: 'email',
        //   scopedSlots: { customRender: 'email' }
        // }
      ],
      expandedRowKeys: [] // 展开的数组
    }
  },
  computed: {
    rowSelection() {
      return {
        onChange: (selectedRowKeys, selectedRows, e) => {
          this.selectedRows = selectedRows
          this.expandedRowKeys = selectedRowKeys
        },
        onSelect: (record, selected) => {
          this.expand(selected, record)
        }
      }
    }
  },
  watch: {
  },
  created() {
    this.getList()
  },
  mounted() {
  },
  methods: {
    expand(e, info) {
      if (!e) {
        const index = this.expandedRowKeys.findIndex(item => item === info.lawCaseId)
        this.expandedRowKeys.splice(index, 1)
        return
      }
      this.expandedRowKeys.push(info.lawCaseId)
      info.list = []
      listLitAddr({ lawCaseId: info.lawCaseId }).then(({ code, data }) => {
        if (code === 200) {
          if (!data || data.length === 0) {
            return
          }
          const list1 = []
          const list2 = []
          const list3 = []
          data.forEach(item => {
            console.log(item)
            item.caseId = info.lawCaseId
            if (item.litigationStatus === '原告') {
              list1.push(item)
            }
            if (item.litigationStatus === '被告') {
              list2.push(item)
            }
            if (item.litigationStatus === '第三人') {
              list3.push(item)
            }
          })
          const list = []
          if (list1 && list1.length > 0) {
            const list4 = this.dealList(list1)
            list.push({
              name: '原告',
              list: list4
            })
          }
          if (list2 && list2.length > 0) {
            const list5 = this.dealList(list2)
            list.push({
              name: '被告',
              list: list5
            })
          }
          if (list3 && list3.length > 0) {
            const list6 = this.dealList(list3)
            list.push({
              name: '第三人',
              list: list6
            })
          }
          const newList = []
          list.forEach(item => {
            item.list.forEach(item1 => {
              item1.forEach(item2 => {
                newList.push(item2)
              })
            })
          })
          newList.forEach((item, index) => {
            const obj = list.find(item1 => item1.name === item.litigationStatus)
          })
          info.list = newList.map(item => {
            item.parentIndex = info.index
            return item
          })
          info.list = this.rowSpan('litigationStatus', info.list)
          info.list = this.rowSpan('litigantName', info.list)
          this.$forceUpdate()
        }
      })
    },
    rowSpan(key, list) {
      const arr = list
        .reduce((result, item) => {
          if (result.indexOf(item[key]) < 0) {
            result.push(item[key])
          }
          return result
        }, [])
        .reduce((result, keys) => {
          const children = list.filter((item) => item[key] === keys)
          result = result.concat(
            children.map((item, index) => ({
              ...item,
              [`${key}RowSpan`]: index === 0 ? children.length : 0
            }))
          )
          return result
        }, [])
      return arr
    },
    getCheck(e, row) {
      console.log(row)
      const target = e.target
      const list = this.tabledata[row.parentIndex - 1].list
      const selectList = []
      const value = target.value
      const type = value.split('-').pop() // 1为原被告 2 当事人id 3 地址
      let litId = ''
      if (type == 2) {
        litId = value.split('-')[0]
      }
      list.forEach(item => {
        if (type == 1) {
          if (item.litigationStatus === value.split('-')[0]) {
            selectList.push(item.litigantId + '-2')
            if (item.address) {
              selectList.push(item.litigantId + '-' + item.address + '-' + item.addressType + '-3')
            }
          }
        }
        if (type == 2) {
          if (item.litigantId === litId) {
            selectList.push(item.litigantId + '-' + item.address + '-' + item.addressType + '-3')
          }
        }
      })
      if (target.checked) {
        console.log(123333)
        console.log(this.selectedRows)
        this.$nextTick(() => {
          let ary = [...this.tabledata[row.parentIndex - 1].select, ...selectList]
          ary = [...new Set(ary)]
          this.tabledata[row.parentIndex - 1].select = ary
        })
      } else {
        this.$nextTick(() => {
          const ary = this.removeSameDate(selectList, this.tabledata[row.parentIndex - 1].select)
          this.tabledata[row.parentIndex - 1].select = ary
        })
      }
    },
    removeSameDate(arr, arr2) {
      const temp = []
      arr2.forEach(res => {
        const index = arr.indexOf(res)
        if (index == -1) {
          temp.push(res)
        }
      })
      return temp
    },
    // 案件详情
    toDetail(e) {
      const caseNo = e.caseNo || e.preCaseNo
      const path = `/case/detail?lawCase=${e.lawCaseId}`
      const obj = {
        path,
        caseNo: caseNo,
        caseId: e.lawCaseId
      }
      this.$store.dispatch('ToDetail', obj)
    },
    dealList(arr) {
      var mp = {}
      var ret = []
      arr.forEach(item => {
        if (typeof mp[item.litigantName] === 'number') {
          ret[mp[item.litigantName]].push(item)
        } else {
          mp[item.litigantName] = ret.length
          ret.push([item])
        }
      })
      return ret
    },
    // 分页触发
    changePage(e) {
      if (e.pageSize !== this.searchParams.pageSize) {
        this.searchParams.pageNum = 1
        this.searchParams.pageSize = e.pageSize
      } else {
        this.searchParams.pageNum = e.current
      }
      this.getList()
    },
    // 搜索
    search(e) {
      const params = { ...e }
      const lab1 = params.prefixPreCaseNo1 || ''
      const lab2 = params.prefixPreCaseNo2 || ''
      if (lab1 && lab2) {
        params.prefixCaseNo = '(' + lab1 + ')' + lab2
      }
      delete params.prefixPreCaseNo1
      delete params.prefixPreCaseNo2
      this.searchParams = {
        ...params,
        // pageNumber: this.searchParams.pageNumber,
        pageNum: 1,
        pageSize: this.searchParams.pageSize
      }
      if (this.signatureState === 99) {
        this.getList()
      } else {
        const params = {
          ...this.searchParams
        }
        params.signState = this.signatureState
        this.$refs.signatureTable.getList(params)
      }
    },
    getList() {
      const params = {
        ...this.searchParams
      }
      this.isTable = false
      queryCaseInfo(params).then(res => {
        this.expandedRowKeys = []
        this.selectedRows = []
        this.addressList = []
        this.isTable = true
        if (res.code === 200) {
          this.tabledata = res.data.rows
          this.total = res.data.total
          this.tabledata = res.data.rows.map((item, index) => {
            item.index = index + 1
            return item
          })
        }
      })
    },
    print(title) {
      console.log(this.selectedRows)
      if (!this.selectedRows || this.selectedRows.length === 0) {
        this.$message.error('请先选择案件')
        return
      }
      if (this.selectedRows.length > 1) {
        this.$message.error('一次只能选择一件案件')
        return
      }
      console.log(this.selectedRows[0].select)
      if (!this.selectedRows[0].select) {
        this.$message.error('请选择有效地址')
        return
      }
      const list = this.getAddressList([...this.selectedRows[0].select])
      if (!list || list.length === 0) {
        this.$message.error('请选择有效地址')
        return
      }
      this.modalTitle = title
      this.addressList = list
      if (title === '批量生成') {
        this.fileList = ['诉前调解通知书', '诉前调解告知书', '传票', '传票（存根）', '应诉通知书', '应诉通知书（法人）', '举证通知书', '质证通知书', '送达回证', '小额诉讼须知', '送达地址、送达方式确认书', '财产申报表（离婚）', '告知当事人诉讼权利义务通知书', '参加诉讼通知书（第三人）', '参加诉讼通知书（第三人诉前）', '参加诉讼通知书（追加被告）', '公告告知笔录（代理人）', '公告告知笔录', '生效证明（有盖章）', '委托监狱（看守所）送达羁押人员用', '委托送达函', '廉政监督卡']
      } else if (title === '传票') {
        this.fileList = ['传票', '传票（存根）']
      } else if (title === '应诉通知书') {
        this.fileList = ['应诉通知书', '应诉通知书（法人）', '小额诉讼须知']
      } else if (title === '举证通知书') {
        this.fileList = ['举证通知书', '生效证明（有盖章）']
      } else {
        this.fileList = [title]
      }
      this.$refs.printForm.show(this.selectedRows)
    },
    getAddressList(list) {
      if (!list || list.length === 0) {
        console.log('未选择地址')
        return []
      }
      return list.filter(item => {
        const ary = item.split('-')
        return ary.pop() == 3 // 返回地址类型的数组
      })
    },
    changeSignature(e) {
      if (e !== 99) {
        this.searchParams.pageNum = 1
        const params = {
          ...this.searchParams
        }
        params.signState = e
        this.$nextTick(() => {
          this.$refs.signatureTable.getList(params)
        })
      }
    },
    // 签章
    signature(type) {
      this.$refs.signatureTable.signature(type)
    },
    // 打印
    batchPrint() {
      this.$refs.signatureTable.batchPrint()
    },
    // 获取送达流程
    getSendFile() {
      if (!this.selectedRows || this.selectedRows.length === 0) {
        this.$message.error('请先选择案件')
        return
      }
      if (this.selectedRows.length > 1) {
        this.$message.error('一次只能选择一件案件')
        return
      }
      const params = {
        lawCaseId: this.selectedRows[0].lawCaseId
      }
      downSendInfoFile(params).then(({ code, data, msg }) => {
        if (code === 200) {
          this.$message.success(msg)
          window.open(data.path)
        }
      })
    },
    // 综合送达
    sendComplex() {
      if (!this.selectedRows || this.selectedRows.length === 0) {
        this.$message.error('请先选择案件')
        return
      }
      const caseInfo = this.selectedRows.map(item => {
        return {
          lawCaseId: item.lawCaseId,
          caseNo: item.caseNo,
          preCaseNo: item.preCaseNo
        }
      })
      const path = '/case/compresend'
      localStorage.setItem('sendComplexIdCaseInfo', JSON.stringify(caseInfo))
      this.$router.push(path)
      this.$store.commit('ADD_TAGVIEWLIST', path)
    }
  }
}
</script>
<style scoped lang="less">
.ant-btn{
    margin:10px;
  }
/deep/tr.ant-table-expanded-row, tr.ant-table-expanded-row:hover{
  background-color: #fff;
}
.inner-table {
  /deep/.ant-table-thead {
    display: none;
  }
}
</style>
