<template>
  <div class="wrapper">
    <h1>{{ label }}</h1>
    <h4>{{ label1 }}</h4>
    <img v-if="isVideo" :src="url" alt="">
    <slot />
  </div>
</template>

<script>
export default {
  components: {
  },
  props: {
    label: { // 主标题
      type: String,
      default: ''
    },
    label1: { // 次标题
      type: String,
      default: ''
    },
    isVideo: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      url: require('@/assets/visualize/video.png')
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
.wrapper {
  width: 100%;
  height: 40px;
  background-image: url('../../../assets/visualize/title.png');
  background-position: 0 0;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  display: flex;
  align-items: center;
  padding-left: 20px;
  justify-content: space-between;
  position: relative;
  h1 {
    color: #fff;
    font-size: 18px;
    text-shadow: 0 0 10px #fff;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  h4 {
    margin-left: 10px;
    font-size: 14px;
    color: #fff;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  img {
    width: 23px;
    height: 19px;
    cursor: pointer;
  }
}
</style>
