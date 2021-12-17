<template>
  <div class="title">
    <span class="icon" @click="add"><Icon type="plus" /></span>
    <span class="text">{{ title }}</span>
    <span class="icon del" @click="del"><Icon type="minus" /></span>
    <a class="del-text">删除</a>
  </div>
</template>

<script>
import { Icon } from 'ant-design-vue'
export default {
  components: {
    Icon
  },
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {

    }
  },
  created() {

  },
  mounted() {

  },
  methods: {
    add() {
      this.$emit('add')
    },
    del() {
      this.$emit('del')
    }
  }
}
</script>

<style scoped lang="less">
.title {
  padding: 12px 24px;
  background-color: #fafafa;
  border: 1px solid #e8e8e8;
  border-bottom: none;
  border-top: none;
  .icon {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    background-color: @theme-color;
    color: #fff;
    margin-right: @space-default;
    &.del {
      background-color: @err-color;
    }
  }
  .text {
    margin-right: @space-default;
    color: @theme-color;
  }
  .del-text {
    color: @err-color;
  }
}
</style>
