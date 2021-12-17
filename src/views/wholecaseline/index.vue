<template>
  <!-- 全院案线列表 -->
  <div>
    <SearchForm :schema="searchSchema" :is-skeleton="isSkeleton" class="enter-X" :default-value="defaultValue" @search="search" @change="change" />
    <div class="list-content enter-X">
      <div class="list-btn-content">
        <Button class="list-btn-item" type="org" @click="next">转到下一流程</Button>
        <Button class="list-btn-item" type="primary" @click="over">结案</Button>
        <Button class="list-btn-item" type="blue4" @click="freeze">保全</Button>
        <Button class="list-btn-item" type="blue3" @click="appraisal">鉴定</Button>
        <Button class="list-btn-item" @click="remark">添加备注</Button>

      </div>
    </div>
    <Table
      v-if="isTable"
      :scroll="{x:1400}"
      :row-selection="rowSelection"
      :columns="columns"
      :data-source="tabledata"
      :row-key="(record,index)=>{return index}"
      :loading="loading"
      :pagination="{
        total: total,
        showTotal: total => {
          return `共计${total}条`
        },
        current: searchParams.pageNumber,
        showSizeChanger: true,
        showQuickJumper: true,
      }"
      @change="changePage"
    >
      <div slot="preCaseNo" slot-scope="text, record">
        <a @click="toDetail(record)">{{ text }}</a>
      </div>
    </Table>
    <CaseOver ref="overshow" @done="getlist" />
    <AddRemark ref="remarkshow" @done="getlist" />
    <!-- 冻结案件 -->
    <Freeze ref="free" :select-key="selectedRows" @done="getlist" />

    <!-- 转下一流程 -->
    <AllNext ref="allNextShow" :selected-rows="selectedRows" :is-whole="true" @done="getlist" />
    <!-- 送达中转下一流程 -->
    <NextServicing ref="NextServicingShow" :selected-rows="selectedRows" :is-whole="true" @done="getlist" />

  </div>
</template>
<script>
import SearchForm from '@/components/SearchForm'
import AddRemark from '@/components/AddRemark'
import CaseOver from '@/views/wholecaseline/Companents/CaseOver'
import { Button, Table } from 'ant-design-vue'
import { allCase } from '@/api/freeze/index.js'
import moment from 'moment'
import Freeze from '@/views/acceptCase/readyCase/components/free'
import NextServicing from './Companents/nextServing.vue'
import AllNext from '@/components/allNext/index.vue'
import { litigationScene } from '@/type/index.js'
export default {
  components: {
    SearchForm,
    CaseOver,
    AddRemark,
    Button,
    Table,
    Freeze,
    // 转下一流程
    NextServicing, // 送达中
    AllNext
  },
  props: {
  },
  data() {
    return {
      caseState: [],
      isWhole: true,
      isTable: true,
      isSkeleton: false,
      loading: false,
      isover: false,
      type: 2,
      date: '',
      total: 0,
      form: this.$form.createForm(this, { name: 'coordinated' }),
      defaultValue: {
        lawCaseStatusStr: '全部'
      },
      searchSchema: [
        {
          label: '案件状态',
          type: 'radio',
          field: 'lawCaseStatusStr',
          options: [
            {
              value: '全部',
              label: '全部'
            },
            {
              value: '预立案待审查',
              label: '预立案待审查'
            },
            {
              value: '预立案',
              label: '预立案'
            },
            {
              value: '诉前送达',
              label: '诉前送达'
            },
            {
              value: '调解',
              label: '调解'
            },
            {
              value: '待正式立案',
              label: '待正式立案'
            },
            {
              value: '已立案待送达',
              label: '已立案待送达'
            },
            {
              value: '庭前送达',
              label: '庭前送达'
            },
            {
              value: '审理中',
              label: '审理中'
            },
            {
              value: '冻结',
              label: '冻结'
            },
            {
              value: '不予受理',
              label: '不予受理'
            },
            {
              value: '结案',
              label: '已结案'
            }
          ],
          className: 'form-item-5'
        },
        {
          label: '申请流水号',
          type: 'input',
          field: 'serialNumber'
        },
        {
          label: '案号',
          type: 'caseNo',
          field1: 'prefixPreCaseNo1',
          field2: 'prefixPreCaseNo2',
          field3: 'startNumber',
          field4: 'endNumber'
        },
        {
          label: '预立案/立案时间',
          type: 'time',
          field: ['startDate', 'endDate']
          // showTime: true
        },
        {
          label: '案由',
          type: 'brief',
          field: 'reason'
        },
        {
          label: '当事人姓名',
          type: 'input',
          field: 'litigantName'
        },
        {
          label: '诉讼场景',
          type: 'select',
          field: 'litigationScene',
          options: litigationScene
        },
        {
          label: '送达状态',
          type: 'select',
          field: 'secondState',
          options: [
            {
              value: '待指派',
              label: '待指派'
            },
            {
              value: '送达中',
              label: '送达中'
            },
            {
              value: '待复核',
              label: '待复核'
            }
          ],
          vIf: () => {
            return this.lawCaseStatusStr === '诉前送达'
          }
        },
        {
          label: '送达状态',
          type: 'select',
          field: 'secondState',
          options: [
            {
              value: '待指派',
              label: '待指派'
            },
            {
              value: '指派中',
              label: '指派中'
            }
          ],
          vIf: () => {
            return this.lawCaseStatusStr === '调解'
          }
        },
        {
          label: '送达状态',
          type: 'select',
          field: 'secondState',
          options: [
            {
              value: '待指派',
              label: '待指派'
            },
            {
              value: '送达中',
              label: '送达中'
            },
            {
              value: '待复核',
              label: '待复核'
            },
            {
              value: '待庭室接收',
              label: '待庭室接收'
            }
          ],
          vIf: () => {
            return this.lawCaseStatusStr === '庭前送达'
          }
        },
        {
          label: '送达状态',
          type: 'select',
          field: 'secondState',
          options: [
            {
              value: '诉前结案',
              label: '诉前结案'
            },
            {
              value: '诉前销案',
              label: '诉前销案'
            },
            {
              value: '结案',
              label: '结案'
            }
          ],
          vIf: () => {
            return this.lawCaseStatusStr === '已结案'
          }
        }
      ],
      selectedRows: [],
      searchSchemaParams: [],
      columns: [
        {
          title: '序号',
          dataIndex: 'index',
          key: 'index'
        },
        {
          title: '预案号',
          dataIndex: 'casePreCaseNo',
          key: 'casePreCaseNo',
          scopedSlots: { customRender: 'preCaseNo' }

        },
        {
          title: '案号',
          dataIndex: 'caseNo',
          key: 'caseNo',
          scopedSlots: { customRender: 'preCaseNo' }

        },
        {
          title: '当事人|案由',
          dataIndex: 'caseReason',
          key: 'caseReason'
        },
        {
          title: '起诉标的',
          dataIndex: 'caseSubjectAmount',
          key: 'caseSubjectAmount',
          width: 150

        },
        {
          title: '预立案时间',
          dataIndex: 'casePreFillingDate',
          key: 'casePreFillingDate',
          width: 150
        },
        {
          title: '立案时间',
          dataIndex: 'caseFillingDate',
          key: 'caseFillingDate'
        },
        {
          title: '法官助理（诉前）',
          dataIndex: 'caseAssistantJudgeName',
          key: 'caseAssistantJudgeName',
          width: 150
        },
        {
          title: '承办人',
          dataIndex: 'judgeName',
          key: 'judgeName',
          width: 150

        },

        // {
        //   title: '调解员',
        //   dataIndex: 'caseMediatornName',
        //   key: 'caseMediatornName'
        // },
        {
          title: '诉前程序时间',
          dataIndex: 'casePreMediateDate',
          key: 'casePreMediateDate'
        },
        {
          title: '排庭时间',
          dataIndex: 'caseStartTime',
          key: 'caseStartTime'
        },
        {
          title: '案件状态',
          dataIndex: 'caseState',
          key: 'caseState',
          scopedSlots: { customRender: 'caseState' }
        },

        {
          title: '结案方式',
          dataIndex: 'casecloseType',
          key: 'casecloseType'
        }
      ],
      tabledata: [],
      enableNext:
        ['已立案待送达', '诉前调查', '诉前送达 | 待指派', '诉前送达 | 送达中',
          '预立案', '调解 | 调解中', '待正式立案', '庭前送达 | 待指派',
          '庭前送达 | 送达中', '审理中'], // 能够转下一流程的状态
      // 诉前调查中
      nextList: [
        {
          value: 3,
          label: '待正式立案'
        },
        {
          value: 4,
          label: '诉前销案'
        },
        {
          value: 5,
          label: '不予受理'
        }
      ],
      searchParams: { // 列表搜索条件
        pageNumber: 1,
        pageSize: 10
      }
    }
  },
  computed: {
    rowSelection() {
      return {
        onChange: (selectedRowKeys, selectedRows) => {
          this.selectedRows = selectedRows
          console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
        }
      }
    }
  },
  created() {
    this.getlist()
  },
  mounted() {
  },
  methods: {
    search(e) {
      this.searchSchemaParams = e
      this.searchParams.pageNumber = 1
      this.getlist()
    },
    changetime(val) {
      this.date = val
    },
    over() {
      if (!this.selectedRows || this.selectedRows.length === 0) {
        this.$message.error('请选择案件')
        return
      }
      this.$refs.overshow.show(this.selectedRows)
    },
    remark() {
      if (!this.selectedRows || this.selectedRows.length === 0) {
        this.$message.error('请选择案件')
        return
      }
      if (this.selectedRows.length > 1) {
        this.$message.error('只能选择一件案件进行备注')
        return
      }
      this.$refs.remarkshow.show(this.selectedRows[0].caseId)
    },
    // 保全
    freeze() {
      if (!this.selectedRows || this.selectedRows.length === 0) {
        this.$message.error('请先选择案件')
        return
      }
      this.$refs.free.show(1)
    },
    // 鉴定
    appraisal() {
      if (!this.selectedRows || this.selectedRows.length === 0) {
        this.$message.error('请先选择案件')
        return
      }
      this.$refs.free.show(2)
    },
    toDetail(e) {
      const caseNo = e.caseNo || e.casePreCaseNo
      const path = `/case/detail?lawCase=${e.caseId}`
      const obj = {
        path,
        caseNo: caseNo,
        caseId: e.caseId
      }
      this.$store.dispatch('ToDetail', obj)
      // this.$store.commit('SET_LAWCASE', e.caseId)
      // this.$router.push(`/case/detail?lawCase=${e.caseId}`)
    },
    changePage(e) {
      if (e.pageSize !== this.searchParams.pageSize) {
        this.searchParams.pageNumber = 1
        this.searchParams.pageSize = e.pageSize
      } else {
        this.searchParams.pageNumber = e.current
      }
      this.getlist()
    },
    // 切换搜索栏
    change(value, field) {
      if (field === 'lawCaseStatusStr') {
        this.lawCaseStatusStr = value
      }
    },
    getlist() {
      this.isTable = false
      const params = {
        ...this.searchParams,
        ...this.searchSchemaParams
      }
      delete params.prefixPreCaseNo1
      delete params.prefixPreCaseNo2
      if (this.searchSchemaParams.prefixPreCaseNo1 && this.searchSchemaParams.prefixPreCaseNo2) {
        const lab1 = this.searchSchemaParams.prefixPreCaseNo1 || ''
        const lab2 = this.searchSchemaParams.prefixPreCaseNo2 || ''
        params.prefixCaseNo = '(' + lab1 + ')' + lab2
      }
      if (params.lawCaseStatusStr === '结案') {
        params.secondState = '结案'
      }
      console.log(params)
      allCase(params).then(res => {
        this.selectedRows = []
        this.loading = false
        this.isTable = true
        if (res.code === 200) {
          this.total = parseInt(res.data.totalsCount)
          this.tabledata = res.data.searchResult
          this.tabledata = res.data.searchResult.map((item, index) => {
            if (item.casePreFillingDate) {
              item.casePreFillingDate = moment(item.casePreFillingDate).format('YYYY-MM-DD')
            }
            if (item.caseFillingDate) {
              item.caseFillingDate = moment(item.caseFillingDate).format('YYYY-MM-DD')
            }
            if (item.casePreMediateDate) {
              item.casePreMediateDate = moment(item.casePreMediateDate).format('YYYY-MM-DD')
            }
            if (item.caseStartTime) {
              item.caseStartTime = moment(item.caseStartTime).format('YYYY-MM-DD')
            }
            item.index = index + 1
            return item
          })
        }
      })
    },
    // 转下一流程
    next() {
      const allNext = this.$refs.allNextShow
      if (!this.selectedRows || this.selectedRows.length === 0) {
        this.$message.error('请先选择案件')
        return
      }
      if (this.selectedRows.length > 0) {
        for (var i = 0; i < this.selectedRows.length; i++) {
          if (this.selectedRows[i].caseState != this.selectedRows[0].caseState) {
            this.$message.error('请选择相同状态的案件进行操作！')
            break
          }
        }
      }
      if (this.enableNext.indexOf(this.selectedRows[0].caseState) == -1) {
        this.$message.error('此类案件无法转下一流程!')
        return
      }
      switch (this.selectedRows[0].caseState) {
        case '已立案待送达':
          allNext.$refs.NextWaitCaseShow.show()
          break
        case '诉前调查':
          allNext.$refs.next.show()
          break
        case '诉前送达 | 待指派': {
          allNext.$refs.NextReAssignSeverdShow.show(this.selectedRows)
          break
        }
        case '诉前送达 | 送达中': {
          this.$refs.NextServicingShow.show()
          break
        }
        case '预立案':
          allNext.$refs.NextPreientationShow.show()
          break
        case '调解 | 调解中': {
          allNext.$refs.NextMediatingShow.show(this.selectedRows)
          break
        }

        case '待正式立案':
          allNext.$refs.NextPreientationShow.show()
          break
        case '庭前送达 | 待指派': {
          allNext.$refs.NextReAssignSeverdShow.show(this.selectedRows)
          break
        }

        case '庭前送达 | 送达中': {
          this.$refs.NextServicingShow.show(this.selectedRows)
          break
        }

        // case '审理中':
      }
    }
  }
}
</script>

<style scoped lang="less">
.ant-btn{
    margin:10px;
  }
  /deep/.ant-calendar-picker-input.ant-input{
    min-width: 235px;
  }
</style>
