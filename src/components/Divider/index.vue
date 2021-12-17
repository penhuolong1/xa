<template>
  <div class="divider" :class="type">
    <span class="inner-text">{{ text }}</span>
    <div class="divider-line" />
  </div>
</template>

<script>
export default {
  components: {

  },
  props: {
    text: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'center' // center/left/right 文字的位置
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

  }
}
</script>

<style scoped lang="less">
.divider {
  position: relative;
  z-index: 0;
  width: 100%;
  overflow: hidden;
  display: flex;
  align-items: center;
  height: 25px;
  &.center {
    justify-content: center;
  }
  &.left {
    .inner-text {
      position: relative;
      left: 20px;
    }
  }
  &.right {
    .inner-text {
      position: relative;
      right: 20px;
    }
  }
  .inner-text {
    position: relative;
    z-index: 1;
    padding: 0 10px;
    background-color: #fff;
  }
  .divider-line {
    width: 100%;
    position: absolute;
    z-index: 0;
    top: 50%;
    left: 0px;
    height: 1px;
    background-color: #e8e8e8;
  }
}
</style>
