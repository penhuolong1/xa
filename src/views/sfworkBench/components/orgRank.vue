<template>
  <div v-if="orgRank.length>0" style="overflow:auto">
    <div v-for="(item,index) in orgRank" :key="index" class="container">
      <div class="title">{{ item.deptName }}</div>
      <div class="value">{{ item.caseCount }}</div>
    </div>
  </div>
  <div v-else>
    <Empty />
  </div>
</template>
<script>
import { Empty } from 'ant-design-vue'
export default {
  components: {
    Empty
  },
  props: {
    orgRank: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      list: [{
        title: 123,
        value: 1234555
      },
      {
        title: 123,
        value: 1234555
      },
      {
        title: 123,
        value: 1234555
      }
      ]
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
  }
}
</script>

<style scoped lang="less">
.container{
  display: flex;
  padding: 0 10px;
  margin-bottom:18px;
  align-items: center;
  justify-content: space-between;
}
.title{
  width: 180px;
  font-size: 18px;
  color: #242f57;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 600;
}
.value{
   width:80px;
     color: #65BF73;
    font-size: 16px;
     font-weight: 600;
}
</style>
