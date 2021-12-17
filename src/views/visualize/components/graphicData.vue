<template>
  <div class="wrapper">
    <div class="dv1">
      <div class="txt1">调解成功率:</div>
      <div class="txt2">{{ info.msuccess }}%</div>
    </div>
    <div class="dv2">
      <div class="txt1">在线调解率:</div>
      <div class="txt2">{{ info.inNum }}%</div>
    </div>
  </div>
</template>

<script>
export default {
  components: {

  },
  props: {
    info: {
      type: Object,
      default: () => {}
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
.wrapper {
  height: 160px;
  width: 340px;
  background-image: url('../../../assets/visualize/graphicDataBc.png');
  background-position: 0 0;
  background-size: 180% 110%;
  background-repeat: no-repeat;
  color: #fff;
  position: relative;
  .dv1,.dv2 {
    width: 200px;
    height: 50px;
    position: absolute;
    display: flex;
    align-items: center;
    left: 20px;
    .txt2 {
      font-size: 18px;
      margin-left: 5px;
    }
  }
  .dv1 {
    top: 15px;
  }
  .dv2 {
    top: 67px;
  }
}
</style>
