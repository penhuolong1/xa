<template>
  <!--案件鉴定 -->
  <div>
    <SearchForm :is-skeleton="isSkeleton" :schema="searchSchema" class="enter-X" @search="search" @change="change" />
    <div class="list-btn-content enter-X mb-5">
      <!-- <Button class="list-btn-item" type="green" @click="addcase">新增案件</Button> -->
    </div>
    <Table
      class="enter-X"
      :row-key="(record,index)=>{return record.id}"
      :columns="columns"
      :data-source="list"
      :loading="loading"
      :pagination="{
        total: total,
        showTotal: total => {
          return `共计${total}条`
        },
        current: searchParams.pageNum,
        showSizeChanger: true,
        showQuickJumper: true,
      }"
      @change="changePage"
    >
      <div slot="caseNo" slot-scope="text, record">
        <a @click="toAddCase(record)">{{ text }}</a>
      </div>
      <div slot="operate" slot-scope="text, record">
        <div><a @click="toAddCase(record)">进入</a></div>
        <div><a v-if="record.mediatorName" @click="toRtc(record)">调解室</a></div>
      </div>
    </Table>
  </div>

</template>
<script>
import SearchForm from '@/components/SearchForm'
import { Button, Table } from 'ant-design-vue'
import { sfCaseSource } from '@/type/index.js'
import { intoSfRoom, intoRoom } from '@/api/rtc/index.js'
import { listMediateOfCase } from '@/api/sfAddcase/index.js'
import { trialFieldType2 } from '@/type/index.js'

export default {
  components: {
    SearchForm,
    Button,
    Table
  },
  props: {},
  data() {
    return {
      loading: false,
      total: 0, // 列表总数
      list: [], // 列表数据
      columns: [
        {
          title: '序号',
          dataIndex: 'index',
          rowkey: 'index',
          width: 80
        },
        {
          title: '案号',
          dataIndex: 'caseNo',
          rowkey: 'caseNo',
          width: 150,
          scopedSlots: { customRender: 'caseNo' }
        },
        {
          title: '立案日期',
          dataIndex: 'registerDate',
          rowkey: 'registerDate',
          width: 150
        },
        {
          title: '当事人 | 案由',
          dataIndex: 'reason',
          rowkey: 'reason',
          width: 250
        },
        {
          title: '调解单位/组织名称',
          dataIndex: 'deptName',
          rowkey: 'deptName',
          width: 150
        },
        {
          title: '调解员',
          dataIndex: 'mediatorName',
          rowkey: 'mediatorName',
          width: 150
        },
        {
          title: '调解地点',
          dataIndex: 'mediatePlaceName',
          rowkey: 'mediatePlaceName',
          width: 200
        },
        {
          title: '预约调解时间',
          dataIndex: 'mediateDate',
          rowkey: 'mediateDate',
          width: 150
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'operate' }
        }
      ],
      isSkeleton: false, // 是否显示骨架屏
      searchParams: { // 列表搜索条件
        pageNum: 1,
        pageSize: 10
      },
      searchSchema: [
        {
          label: '办理状态',
          type: 'select',
          field: 'doType',
          options: [
            {
              value: 0,
              label: '全部'
            },
            {
              value: 1,
              label: '已办理'
            },
            {
              value: 2,
              label: '未办理'
            }
          ]
        },
        {
          label: '纠纷来源',
          type: 'select',
          field: 'caseSource',
          options: sfCaseSource
        },
        {
          label: '案号',
          type: 'caseNo',
          field1: 'prefixPreCaseNo1',
          field2: 'prefixPreCaseNo2',
          field3: 'startNumber',
          field4: 'endNumber',
          trialFieldType: [
            {
              value: '诉非',
              label: '诉非'
            },
            ...trialFieldType2
          ]
        },
        {
          label: '立案时间',
          type: 'time',
          field: ['registerDateStart', 'registerDateEnd'],
          showTime: true
        },
        {
          label: '当事人名称',
          type: 'input',
          field: 'litigantName'
        },
        {
          label: '纠纷案由',
          type: 'brief',
          field: 'briefId'
        },
        {
          label: '调解单位',
          type: 'mediates',
          medType: 'unit',
          field: 'unitId'
        },
        {
          label: '调解组织',
          type: 'mediates',
          medType: 'organization',
          field: 'orgId'
        }
      ],
      remarkInfo: {}, // 备注需要的信息
      isTable: true
    }
  },
  computed: {
  },
  created() {},
  mounted() {
  },
  activated() {
    this.getList()
  },
  methods: {
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
    // 跳转到录入案件
    search(e) {
      const params = { ...e }
      const lab1 = params.prefixPreCaseNo1 || ''
      const lab2 = params.prefixPreCaseNo2 || ''
      if (lab1 && lab2) {
        params.prefixStr = `(${lab1})${lab2}`
      }
      delete params.prefixPreCaseNo1
      delete params.prefixPreCaseNo2
      this.searchParams = {
        ...params,
        // pageNum: this.searchParams.pageNum,
        pageNum: 1,
        pageSize: this.searchParams.pageSize
      }
      this.getList()
    },
    getList(e) {
      this.loading = true
      listMediateOfCase(this.searchParams).then(({ code, data }) => {
        this.loading = false
        if (code === 200) {
          this.list = data.rows.map((item, index) => {
            item.index = index + 1
            item.registerDate = item.registerDate ? this.format(new Date(item.registerDate), 'YYYY-MM-DD') : ''
            item.teamCreateTime = item.teamCreateTime ? this.format(new Date(item.teamCreateTime), 'YYYY-MM-DD H:m:s') : ''
            item.mediateDate = item.mediateDate ? this.format(new Date(item.mediateDate), 'YYYY-MM-DD H:m:s') : ''
            item.endTime = item.endTime ? this.format(new Date(item.endTime), 'YYYY-MM-DD H:m:s') : ''
            return item
          })
          this.total = data.total
        }
      })
    },
    toAddCase(e) {
      if (e.sfType == 1) { // 法院的案件
        this.$store.commit('SET_SFLAWCASE', e.id)
        const caseNo = e.caseNo || e.preCaseNo
        const path = '/case/detail?lawCase=' + e.lawCaseId + '&type=2'
        const obj = {
          path,
          caseNo: caseNo,
          caseId: e.lawCaseId
        }
        this.$store.dispatch('ToDetail', obj)
      } else {
        const caseNo = e.caseNo
        const path = `/sfcase/detail?caseId=${e.id}`
        const obj = {
          path,
          caseNo: caseNo,
          caseId: e.id,
          type: 2 // type为2是诉非的案件
        }
        this.$store.dispatch('ToSfDetail', obj)
      }
    },
    // 选择搜索条件触发
    change(e, type, val) {
    },
    toRtc(e) {
      if (e.sfType == 1) {
        intoRoom({ lawCaseId: e.lawCaseId }).then(({ code, data }) => {
          if (code === 200) {
            this.$store.commit('SET_ISOPEN', data.is_open ? '1' : '')
            this.$store.commit('SET_RTCTOKEN', data.result)
            let chatRoomId = ''
            let type = null
            chatRoomId = e.lawCaseId
            this.$store.commit('SET_LAWCASE', e.lawCaseId)
            type = 1 // 法院
            this.$router.push(`/rtc?chatRoomId=` + chatRoomId + '&type=' + type)
          }
        })
      } else {
        intoSfRoom({ sfLawCaseId: e.id }).then(({ code, data }) => {
          if (code === 200) {
            this.$store.commit('SET_ISOPEN', data.is_open ? '1' : '')
            this.$store.commit('SET_RTCTOKEN', data.result)
            let chatRoomId = ''
            let type = null
            chatRoomId = e.id
            this.$store.commit('SET_SFLAWCASE', e.id)
            type = 2 // 诉非
            this.$router.push(`/rtc?chatRoomId=` + chatRoomId + '&type=' + type)
          }
        })
      }
    }
  }
}
</script>

<style scoped lang="less">
.ant-btn{
  margin:10px;
}

</style>
