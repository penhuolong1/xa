<template>
  <!--案件鉴定 -->
  <div>
    <SearchForm :is-skeleton="isSkeleton" :default-value="defaultValue" :schema="searchSchema" class="enter-X" @search="search" @change="change" />
    <div class="list-btn-content enter-X mb-2.5" />
    <Table
      class="enter-X"
      :row-key="(record,index)=>{return record.name}"
      :columns="columns"
      :scroll="{x: 1400}"
      :data-source="list"
      :loading="loading"
      :pagination="false"
    />
    <div class="mt-2.5">备注：本表统计立案时间查询范围内承办部门，承办人的未完成送达案件数量的统计数据。</div>
  </div>
</template>
<script>
import SearchForm from '@/components/SearchForm'
import { Button, Table, Radio } from 'ant-design-vue'
import { getNotSend } from '@/api/statistics/index'
const { dateRangeUtil } = require('@/utils/dateRangUtil.js')
export default {
  components: {
    SearchForm,
    Table
  },
  props: {},
  data() {
    return {
      loading: false,
      list: [], // 列表数据
      defaultValue: {
      },
      isSkeleton: false, // 是否显示骨架屏
      searchParams: { // 列表搜索条件
      },
      searchSchema: [
        {
          label: '送达员',
          type: 'judge',
          field: 'sendPeopleId'
        }
      ],
      isTable: true
    }
  },
  computed: {
    columns() {
      const mouthList = this.getLastSixMon()
      const list = [
        {
          title: '送达员',
          dataIndex: 'name',
          rowkey: 'name',
          width: 100
        }
      ]
      mouthList.forEach(item => {
        const obj = {
          title: item,
          dataIndex: item,
          rowkey: item,
          customRender: (text, row, index) => {
            return (<a onclick={() => { this.lookCaseList(row) }}>{text}</a>)
          }
        }
        list.push(obj)
      })
      return list
    }
  },
  created() {},
  mounted() {
    this.getList()
  },
  methods: {
    search(e) {
      this.searchParams = e
      this.getList()
    },
    getList(e) {
      this.loading = true
      const mouthList = this.getLastSixMon()
      getNotSend(this.searchParams).then(({ code, data }) => {
        this.loading = false
        if (code === 200) {
          if (!data || data.length === 0) {
            this.list = []
            return
          }
          this.list = data.map(item => {
            mouthList.forEach(item1 => {
              if (item.date === item1) {
                item[item1] = item.notSendNum
              } else {
                item[item1] = 0
              }
            })
            return item
          })
          const numObj = { name: '合计' }
          mouthList.forEach(item => {
            numObj[item] = 0
            this.list.forEach(item1 => {
              numObj[item] = numObj[item] + item1[item]
            })
          })
          this.list.push(numObj)
        }
      })
    },
    changeType() {
      this.getList()
    },
    change(vaule, filed) {
      if (filed === 'timeType') {
        this.timeType = vaule
      }
    },
    getLastSixMon() {
      var data = new Date()
      // 获取年
      var year = data.getFullYear()
      // 获取月
      var mon = data.getMonth() + 1
      var arry = new Array()
      for (var i = 0; i < 6; i++) {
        if (mon <= 0) {
          year = year - 1
          mon = mon + 12
        }
        if (mon < 10) {
          mon = '0' + mon
        }
        arry[i] = year + '-' + mon
        mon = mon - 1
      }
      return arry
    },
    lookCaseList(row) {
      console.log(row)
    }
  }
}
</script>

<style scoped lang="less">
.ant-btn{
  margin:10px;
}

</style>
