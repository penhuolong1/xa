<template>
  <div class="strength-header">
    <div class="title">{{ title }}</div>
    <div class="subtitle">
      <div v-for="(item, index) in subTitleList" :key="index" class="txt-box">
        <div class="label">{{ item.label }}</div>
        <div class="text">{{ item.text }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {

  },
  props: {
    title: {
      type: String,
      default: ''
    },
    subTitleList: {
      type: Array,
      default: () => []
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
.strength-header {
  width: 100%;
  .title {
    height: 50px;
    background-image: url('../../../assets/visualize/strengthTitle.png');
    background-position: 0 0;
    background-size: 100% 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    text-shadow: 0 0 10px #fff;
    font-size: 20px;
  }
  .subtitle {
    padding: 0 10px;
    display: flex;
    .txt-box {
      flex: 1;
      margin-right: 10px;
      height: 80px;
      margin-top: 20px;
      background-position: 0 0;
      background-size: 100% 100%;
      background-image: url('../../../assets/visualize/strengthSubTitle1.png');
      text-align: center;
      color: #fff;
      .label {
        line-height: 40px;
      }
      .text {
        line-height: 30px;
        font-size: 24px;
        color: rgba(60,220,255,1);
      }
      &:nth-child(2) {
        margin-right: 0px;
        margin-left: 10px;
        background-image: url('../../../assets/visualize/strengthSubTitle2.png');
        .text {
          color: rgba(255,184,60,1)
        }
      }
    }
  }
}
</style>
