<template>
  <div class="wrapper">
    <div class="case-no">
      <Icon type="arrow-left" class="icon" @click="back" />
      {{ list[0] ? (list[0].caseNo || list[0].preCaseNo) : '' }}
      <div class="btn" @click="showType">{{ isShowType ? '隐藏':'显示' }}状态栏</div>
    </div>
    <Table
      v-show="isShowType"
      :row-key="(record,index)=>{return index}"
      :columns="columns"
      :data-source="list"
      :pagination="false"
      class="case-header"
    />
  </div>
</template>

<script>
import { Table, Icon } from 'ant-design-vue'
import { preCaseInfo } from '@/api/addCase/index.js'
import { lawCaseStatus } from '@/type/index'
import { mapGetters } from 'vuex'
export default {
  components: {
    Table,
    Icon
  },
  props: {

  },
  data() {
    return {
      columns: [
        {
          title: '状态',
          dataIndex: 'state',
          rowkey: 'state'
        },
        {
          title: '原告',
          dataIndex: 'appLitigantName',
          rowkey: 'appLitigantName'
        },
        {
          title: '被告',
          dataIndex: 'resLitigantName',
          rowkey: 'resLitigantName'
        },
        {
          title: '案由',
          dataIndex: 'briefName',
          rowkey: 'briefName'
        },
        {
          title: '标的',
          dataIndex: 'subjectAmount',
          rowkey: 'subjectAmount'
        },
        {
          title: '预立案时间',
          dataIndex: 'preFilingDate',
          rowkey: 'preFilingDate'
        },
        {
          title: '诉前结案日期',
          dataIndex: 'preCloseDate',
          rowkey: 'preCloseDate'
        },
        {
          title: '法官助理',
          dataIndex: 'assistantJudge',
          rowkey: 'assistantJudge'
        },
        {
          title: '调解员',
          dataIndex: 'mediator',
          rowkey: 'mediator'
        },
        {
          title: '诉前程序时间',
          dataIndex: 'startTime',
          rowkey: 'startTime'
        }
      ],
      isShowType: true,
      list: []
    }
  },
  computed: {
    ...mapGetters(['getLawCaseId'])
  },
  watch: {
  },
  created() {
    this.getData()
  },
  mounted() {
  },
  methods: {
    back() {
      this.$router.go(-1)
    },
    getData() {
      if (!this.getLawCaseId) {
        return
      }
      const params = {
        caseId: this.getLawCaseId
      }
      preCaseInfo(params).then(({ code, data }) => {
        if (code === 200) {
          this.list = [data]
          const obj = lawCaseStatus.find(item => item.value == data.state)
          this.list[0].state = obj.label
        }
      })
    },
    showType() {
      this.isShowType = !this.isShowType
    }
  }
}
</script>

<style scoped lang="less">
.case-header {
  box-shadow: 0px 1px 2px 0px rgba(0,0,0,0.06), 0px 1px 3px 0px rgba(0,0,0,0.10);
  margin-bottom: 20px;
  /deep/.ant-table-thead > tr > th {
    background-color: #e8f4ff;
  }
}
.case-no {
  display: flex;
  line-height: 30px;
  align-items: center;
  font-size: 16px;
  font-weight: bolder;
  margin-bottom: 10px;
  .icon {
    margin-right: 10px;
  }
}
.btn {
  background: rgba(101,183,243,0.20);
  border-radius: 26px;
  height: 30px;
  font-size: 14px;
  color: rgba(101,183,243,1);
  padding: 0 20px;
  margin-left: 10px;
  cursor: pointer;
}
</style>
