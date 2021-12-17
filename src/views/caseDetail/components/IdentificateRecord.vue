<template>
  <div>
    <div class="wrapper">
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
          <a v-if="!record.appraisalCase.appraisalEndTime" @click="change(record)">修改鉴定类别</a>
          <tr />
          <a v-if="!record.appraisalCase.appraisalEndTime" @click="over(record)">结束鉴定</a>
        </div>
      </template>
    </Table>
    <ChangeType ref="changeShow" :select-row="selectRow" :type="type" @refresh="getList" />
    <Over ref="overShow" :select-row="selectRow" :type="type" @refresh="getList" />
    <Modal
      v-model="isadd"
      title="添加案件"
      :mask-closable="false"
      style="width:600px"
      class="modal"
    >
      <template slot="footer">
        <Button key="back" @click="isadd=false">
          取消
        </Button>
        <Button key="submit" type="primary" :loading="loading1" @click="onConfirm">
          确定
        </Button>
      </template>
      <Form :form="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">

        <FormItem label="移送鉴定时间">
          <DatePicker
            v-decorator="['appraisalStartTime', { rules: [{ required: true,message:'请选择移送鉴定时间' }] }]"
            style="width: 238px"
            value-format="YYYY-MM-DD HH:mm:ss"
            show-time
          />
        </FormItem>
        <FormItem label="鉴定类别">
          <Select v-decorator="['appraisalType', { rules: [{ required: true,message:'请选择鉴定类别' }] }]">
            <SelectOption v-for="(item) in typeselect" :key="item.value" class="option">{{ item.value }}</SelectOption>
          </Select>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
import { Table, Button, Select, Form, Modal, DatePicker } from 'ant-design-vue'
import { appraisalCaseFocus } from '@/api/freeze/index.js'
import moment from 'moment'
import ChangeType from '../../appraisalcase/components/ChangeType.vue'
import Over from '../../appraisalcase/components/Over.vue'
import { addappraisalCase } from '@/api/freeze/index.js'

export default {
  components: {
    Table,
    ChangeType,
    Over,
    DatePicker,
    Button,
    Modal,
    Form,
    FormItem: Form.Item,
    Select,
    SelectOption: Select.Option
  },
  props: {

  },
  data() {
    return {
      isadd: false,
      loading: false,
      loading1: false,
      type: 2,
      selectRow: {},
      form: this.$form.createForm(this, { name: 'coordinated' }),
      columns: [
        {
          title: '序号',
          dataIndex: 'index',
          key: 'index',
          className: 'index'

        },
        {
          title: '鉴定类别',
          dataIndex: 'appraisalCase.appraisalType',
          key: 'appraisalCase.appraisalType'

        },
        {
          title: '鉴定开始时间',
          dataIndex: 'appraisalCase.appraisalStartTime',
          key: 'appraisalCase.appraisalStartTime'
        },
        {
          title: '鉴定结束时间',
          dataIndex: 'appraisalCase.appraisalEndTime',
          key: 'appraisalCase.appraisalEndTime'
        },
        {
          title: '鉴定时长',
          dataIndex: 'appraisalCase.appraisalDuration',
          key: 'appraisalCase.appraisalDuration'
        },
        {
          title: '终止人员',
          dataIndex: 'endPeopleBean.name',
          key: 'endPeopleBean.name'
        },
        {
          title: '编辑',
          scopedSlots: { customRender: 'edit' }
        }
      ],
      tabledata: [],
      lawCaseArr: [],
      typeselect: [
        {
          value: '法医病理'
        },
        {
          value: '文书'
        },
        {
          value: '亲权'
        },
        {
          value: '电子数据'
        },
        {
          value: '车辆检测'
        }, {
          value: '机动车评估'
        }, {
          value: '文物'
        }, {
          value: '税务审计'
        }, {
          value: '法医精神病'
        }, {
          value: '其他'
        }

      ],
      searchParams: { // 列表搜索条件
        pageNumber: 1,
        pageSize: 10
      },
      total: 0
    }
  },
  created() {
    this.getList()
  },
  mounted() {
  },
  methods: {
    over(e) {
      this.selectRow = e
      console.log(e)
      this.$refs.overShow.show()
    },
    change(e) {
      this.selectRow = e
      this.$refs.changeShow.show()
    },
    addCase() {
      this.isadd = true
    },
    onConfirm() {
      this.form.validateFields(err => {
        if (err) {
          return
        }
        this.loading1 = true
        this.lawCaseArr = []
        this.lawCaseArr.push(this.$route.query.lawCase)
        const params = {
          lawCase: this.lawCaseArr,
          ...this.form.getFieldsValue()
        }
        console.log(params)
        addappraisalCase(params).then(res => {
          this.loading1 = false
          if (res.code === 200) {
            this.getList()
            this.form.resetFields()
            this.$message.success(res.msg)
            this.isadd = false
          }
        })
      })
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
    getList() {
      this.loading = true
      const params = {
        ...this.searchParams
      }
      appraisalCaseFocus(params, this.$route.query.lawCase).then(res => {
        this.loading = false
        this.total = parseInt(res.data.totalsCount)
        this.tabledata = res.data.searchResult.map((item, index) => {
          if (item.appraisalCase.appraisalDuration) {
            item.appraisalCase.appraisalDuration = item.appraisalCase.appraisalDuration + '天'
          }
          if (item.appraisalCase.appraisalStartTime) {
            item.appraisalCase.appraisalStartTime = moment(item.appraisalCase.appraisalStartTime).format('YYYY-MM-DD HH:mm:ss')
          }
          if (item.appraisalCase.appraisalEndTime) {
            item.appraisalCase.appraisalEndTime = moment(item.appraisalCase.appraisalEndTime).format('YYYY-MM-DD HH:mm:ss')
          } else {
            item.appraisalCase.appraisalDuration = '已持续' + item.appraisalCase.appraisalDuration
          }
          item.index = index + 1
          return item
        })
      })
    }
  }
}
</script>
<style scoped lang="less">

/deep/.index{
  width:120px;
}
</style>
