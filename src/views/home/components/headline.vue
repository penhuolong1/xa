<template>
  <div class="title-box">
    <div class="title-name">{{ title }}</div>
    <div class="title-line" />
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
    }
  }
}
</script>

<style lang="less" scoped>
//标题
.title-box {
  width: 100%;
  padding: 40px 10%;
}
.title-name {
  font-size: 24px;
  font-family: Source Han Sans CN, Source Han Sans CN-Bold;
  font-weight: 1000;
  color: #303133;
  margin-bottom: 5px;
}
.title-line {
  width: 64px;
  height: 4px;
  background: #1c8bf2;
  border-radius: 39px;
}
</style>
