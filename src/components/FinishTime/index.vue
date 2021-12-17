<template>
  <div class="wrapper">
    <div class="item">
      <Input v-model="timeFinish" placeholder="请输入" />
    </div>
    <div class="item">
      天内
    </div>
  </div>
</template>
<script>
import { Input } from 'ant-design-vue'

export default {
  components: {
    Input
  },
  props: {
  },
  data() {
    return {
      timeFinish: null
    }
  },
  watch: {
    timeFinish() {
      console.log(this.timeFinish)
      this.getFinishTime()
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    getFinishTime() {
      const lastFinish = this.timeFinish
      this.$emit('input', lastFinish)
    }
  }
}
</script>

<style scoped lang="less">
.wrapper {
  display: flex;
  .item {
    margin-right: 5px;
    display: flex;
    align-items: center;
    .item-span {
      min-width: 100px;
      display: flex;
      justify-content: center;
    }
  }
  /deep/.ant-select {
    min-width: 100px;
  }
  /deep/.ant-input {
    min-width: 100px;
  }
}
</style>
