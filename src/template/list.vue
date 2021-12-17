<template>
  <div>
    <SearchForm :schema="chema" :default-value="searchForm" class="enter-X" @search="search" />
    <div class="list-content enter-X">
      <div class="list-btn-content">
        <Button class="list-btn-item" type="primary">按钮</Button>
      </div>
      <Table
        :columns="columns"
        :data-source="list"
        :loading="loading"
        :pagination="{
          total: total,
          showTotal: total => {
            return `共计${total}条`
          },
          showSizeChanger: true,
          showQuickJumper: true,
        }"
        @change="changePage"
      />
    </div>
  </div>
</template>

<script>
import SearchForm from '@/components/SearchForm'
import { Button, Table } from 'ant-design-vue'

export default {
  components: {
    SearchForm,
    Button,
    Table
  },
  props: {

  },
  data() {
    return {
      searchSchema: [
        {
          label: '是否单位提交',
          type: 'radio',
          field: 'isSubmit',
          options: [
            {
              label: '全部',
              value: 0
            },
            {
              label: '是',
              value: 1
            },
            {
              label: '否',
              value: 2
            }
          ]
        },
        {
          label: '申请流水号',
          type: 'input',
          field: 'liushui'
        },
        {
          label: '诉非号',
          type: 'input',
          field: 'sufei'
        },
        {
          label: '诉讼人',
          type: 'input',
          field: 'shusong'
        },
        {
          label: '提交时间',
          type: 'time',
          field: 'tjTime'
        },
        {
          label: '案由',
          type: 'select',
          field: 'brief',
          options: [
            {
              value: 1,
              label: '案由1'
            },
            {
              value: 2,
              label: '案由2'
            },
            {
              value: 3,
              label: '案由3'
            }
          ]
        }
      ],
      searchForm: {
        isSubmit: 1,
        liushui: '123',
        brief: 1,
        tjTime: ['2021-10-11', '2021-11-11']
      },
      searchForm1: {
        pageNum: 1,
        pageSize: 10,
        dealType: 1,
        order: 'desc',
        type: 0
      },
      columns: [
        {
          title: '标题1',
          dataIndex: 'index1',
          key: 'index1'
        },
        {
          title: '标题2',
          dataIndex: 'index2',
          key: 'index2'
        },
        {
          title: '标题3',
          dataIndex: 'index3',
          key: 'index3'
        },
        {
          title: '标题4',
          dataIndex: 'index4',
          key: 'index4'
        }
      ],
      list: [],
      total: 0,
      loading: false
    }
  },
  created() {
  },
  mounted() {

  },
  methods: {
    // 搜索
    search(e) {
      console.log(e)
    },
    // 改变页码 触发方法
    changePage(e) {
    }
  }
}
</script>

<style scoped lang="less">

</style>
