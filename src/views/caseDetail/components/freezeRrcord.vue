<template>
  <div>
    <div class="button">
      <Button type="primary" @click="addCase">添加</Button>

    </div>
    <Table
      :loading="loading"
      :scroll="{x:1400}"
      :columns="columns"
      :data-source="tabledata"
      :row-key="(record,index)=>{return index}"
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
      >
      <template slot="edit" slot-scope="record">
        <div>
          <a v-if="!record.preserveCaseBean.preserveCaseNo&&!record.preserveCaseBean.frozenEndTime" @click="append(record)">补录保全案号</a>
          <tr />
          <a v-if="!record.preserveCaseBean.frozenEndTime" @click="over(record)">结束保全</a>
        </div>
      </template>
    </Table>
    <Append ref="appendShow" :select-row="selectRow" :type="type" @refresh="getList" />
    <Over ref="overShow" :select-row="selectRow" :type="type" @refresh="getList" />
    <Modal
      v-model="isadd"
      :loading="loading"
      :mask-closable="false"
      title="冻结案件"
      style="width:600px"
      width="600px"
      class="modal"
    >
      <template slot="footer">
        <Button @click="isadd=false">
          取消
        </Button>
        <Button type="primary" :loading="loading1" @click="onConfirm">
          确认
        </Button>
      </template>
      <div class="pop-wrapper">
        <Form :form="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">

          <FormItem label="是否冻结送达">
            <RadioGroup v-decorator="['enableSend', { rules: [{ required: true,message:'请选择是否送达' }], initialValue: '1'}]" @change="changetype">
              <Radio label="yes" value="1">是</Radio>
              <Radio label="no" value="0">否</Radio>
            </RadioGroup>
          </FormItem>
          <DateTo
            v-if="enableSendtype==='1'"
            field="canSendDate"
            :form-option="{ rules: [{ required: true,message:'请选择保全期限'}] }"
          />
          <FormItem label="保全立案日期">
            <DatePicker
              v-decorator="['preserveDate']"
              placeholder="请选择时间"
              style="width: 240px"
              value-format="YYYY-MM-DD HH:mm:ss"
            />
          </FormItem>
          <FormItem label="保全案号" class="financial">
            <CaseNo ref="caseNo" v-decorator="['caseNo', { initialValue: '' }]" :type-list="typelist" :is-need-button="false" :input-disabled="false" />

          </FormItem>
        </Form>
      </div>
    </Modal>
  </div>
</template>

<script>
import { Table, Button, Modal, Form, Radio, DatePicker } from 'ant-design-vue'
import { preservationCaseFocus, addpreservationCase } from '@/api/freeze/index.js'
import moment from 'moment'
import Append from '../../savecase/Componants/Append.vue'
import Over from '../../savecase/Componants/Over.vue'
import CaseNo from '@/components/CaseNo/index.vue'
import DateTo from '@/views/savecase/Componants/dateTo.vue'

export default {
  components: {
    Table, Append, Over, Button, Modal, Form, Radio, DatePicker, CaseNo, FormItem: Form.Item, RadioGroup: Radio.Group, DateTo
  },
  props: {
  },
  data() {
    return {
      isadd: false,
      loading: false,
      loading1: false,
      type: 2, // 保全记录中的补录保全
      selectRow: {},
      lawCaseArr: [],
      enableSendtype: '1',
      caseNo: '',
      isNeedButton: false,
      inputDisabled: false,
      enableSendList: {
        true: '是',
        false: '否'
      },
      typelist: [{
        label: '闽2013财保',
        value: '闽2013财保'
      }
      ],
      columns: [
        {
          title: '序号',
          dataIndex: 'index',
          key: 'index',
          className: 'index'
        },
        {
          title: '保全案号',
          dataIndex: 'preserveCaseBean.preserveCaseNo',
          key: 'preserveCaseBean.preserveCaseNo'
        },
        {
          title: '保全立案日期',
          dataIndex: 'preserveDate',
          key: 'preserveDate'
        },
        {
          title: '保全开始时间',
          dataIndex: 'preserveCaseBean.frozenStartTime',
          key: 'preserveCaseBean.frozenStartTime'
        },
        {
          title: '保全结束时间',
          dataIndex: 'preserveCaseBean.frozenEndTime',
          key: 'preserveCaseBean.frozenEndTime'
        },
        {
          title: '保全时长',
          dataIndex: 'preserveCaseBean.frozenDuration',
          key: 'preserveCaseBean.frozenDuration'
        },
        {
          title: '是否冻结送达',
          dataIndex: 'enableSend',
          key: 'enableSend'
        },
        {
          title: '可启用送达日期',
          dataIndex: 'enableSendDate',
          key: 'enableSendDate'
        },
        {
          title: '终止人员',
          dataIndex: 'preserveCaseBean.endPeopleBean.name',
          key: 'epreserveCaseBean.endPeopleBean.name'
        },
        {
          title: '编辑',
          scopedSlots: { customRender: 'edit' }
        }
      ],
      tabledata: [],
      searchParams: { // 列表搜索条件
        pageNumber: 1,
        pageSize: 10
      },
      total: 0,
      form: this.$form.createForm(this, { name: 'coordinated' })

    }
  },
  created() {
    this.getList()
  },
  mounted() {
  },
  methods: {
    over(e) {
      console.log(e)
      this.selectRow = e
      this.$refs.overShow.show()
    },
    changetype(e) {
      this.enableSendtype = e.target.value
    },
    // 分页触发
    changePage(e) {
      if (e.pageSize !== this.searchParams.pageSize) {
        this.searchParams.pageNumber = 1
        this.searchParams.pageSize = e.pageSize
      } else {
        this.searchParams.pageNumber = e.current
      }
      this.getList()
    },
    // 获取列表
    getList() {
      this.loading = true
      const params = {
        ...this.searchParams
      }
      preservationCaseFocus(params, this.$route.query.lawCase).then(res => {
        this.loading = false
        this.total = parseInt(res.data.totalsCount)
        this.tabledata = res.data.searchResult.map((item, index) => {
          item.enableSend = this.enableSendList[item.enableSend]
          if (item.preserveCaseBean.frozenDuration) {
            item.preserveCaseBean.frozenDuration = item.preserveCaseBean.frozenDuration + '天'
          }
          if (item.preserveDate) {
            item.preserveDate = moment(item.preserveDate).format('YYYY-MM-DD ')
          }
          if (item.enableSendDate) {
            item.enableSendDate = moment(item.enableSendDate).format('YYYY-MM-DD ')
          }
          if (item.preserveCaseBean.frozenEndTime) {
            item.preserveCaseBean.frozenEndTime = moment(item.preserveCaseBean.frozenEndTime).format('YYYY-MM-DD HH:mm:ss')
          } else {
            item.preserveCaseBean.frozenDuration = '已持续' + item.preserveCaseBean.frozenDuration
          }
          if (item.preserveCaseBean.frozenStartTime) {
            item.preserveCaseBean.frozenStartTime = moment(item.preserveCaseBean.frozenStartTime).format('YYYY-MM-DD HH:mm:ss')
          }
          item.index = index + 1
          return item
        })
      })
    },
    // 补录保全案号
    append(e) {
      this.selectRow = e
      this.$refs.appendShow.show()
    },
    onConfirm() {
      this.form.validateFields(err => {
        if (err) {
          return
        }
        const canSendDate = this.form.getFieldsValue().canSendDate
        const preserveDate = this.form.getFieldsValue().preserveDate
        const params = {
          lawCase: this.$route.query.lawCase,
          preserveDate: preserveDate,
          enableSend: parseInt(this.form.getFieldsValue().enableSend),
          lawCaseBean: { 'canSendDate': canSendDate }
        }
        if ((!this.$refs.caseNo.year && this.$refs.caseNo.num) || (this.$refs.caseNo.year && !this.$refs.caseNo.num)) {
          this.$message.error('请将保全案号填写完整')
          return
        }
        if (this.$refs.caseNo.year && this.$refs.caseNo.num) {
          params.preserveCaseNo = this.$refs.caseNo.getCaseNo().caseNo
        }
        this.loading1 = true
        addpreservationCase(params).then(res => {
          this.loading1 = false
          if (res.code === 200) {
            this.$refs.caseNo.reset()
            this.isadd = false
            this.getList()
            this.form.resetFields()
          }
        })
      })
    },
    addCase() {
      this.isadd = true
    }
  }
}
</script>
<style scoped lang="less">

  /deep/.index{
  width:120px;
}
</style>
