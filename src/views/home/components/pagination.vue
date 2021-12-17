<template>
  <div>
    <div class="layout">
      <div>
        <a-pagination v-model="current" size="small" :total="total" :page-size="pageSize" @change="handlePageNum" />
      </div>
      <div class="page-number">共{{ pages }}页</div>
    </div>
  </div>
</template>

<script>
import { Pagination } from 'ant-design-vue'
export default {
  components: {
    'a-pagination': Pagination
  },
  props: {
    current: { // 进入是第几页
      type: Number,
      default: 1
    },
    total: { // 条数
      type: Number,
      default: 0
    },
    pageSize: {
      type: Number,
      default: 8
    },
    pages: {
      type: Number,
      default: 0
    }
  },
  methods: {
    handlePageNum(e) {
      this.$emit('handlePageNum', e)
      // console.log('14', e)
    }
  }
}
</script>

<style lang="less" scoped>
.layout {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
}
.page-number {
  margin-top: 2px;
  margin-right: -20px;
  font-size: 14px;
  font-family: Source Han Sans CN, Source Han Sans CN-Regular;
  font-weight: 400;
  color: #606266;
}
// #components-pagination-demo-mini .ant-pagination:not(:last-child) {
//   margin-bottom: 24px;
//   margin: 0 50px;
// }

/deep/.ant-pagination-item-active {
  font-weight: 500;
  background: #1890ff;
  width: 24px;
  height: 24px;
  border-radius: 50%;
}
/deep/.ant-pagination-item-active a {
  color: #fff;
}
/deep/.ant-pagination-item {
  margin: 0 32px !important;
}
/deep/.ant-pagination-item a {
  padding: 0 0px;
}
</style>
