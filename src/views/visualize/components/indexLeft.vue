<template>
  <div class="dataStatistics-wrapper">
    <div class="privilege-title">
      翔安区诉非联动中心
    </div>
    <div class="content">
      <div class="item1">
        <div class="leber">1人</div>
        <div class="title">区中心</div>
      </div>
      <div class="item2">
        <div class="leber">9个</div>
        <div class="title">街道分中心</div>
      </div>
      <div class="item3">
        <div class="leber">128个</div>
        <div class="title">社区联动点</div>
      </div>
      <div class="item4">
        <div class="leber">274个</div>
        <div class="title">解纷组织、解纷量</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  data() {
    return {
      data1: {}
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {}
}
</script>

<style scoped lang="less">
.dataStatistics-wrapper {
  position: relative;
  background: url('../../../assets/visualize/bg1.png') no-repeat;
  background-size: 100% 100%;
  // height: 421px;
  height: calc((100% - 65%) -40px);
  //   height: 271px;
  // width: 480px;
  padding: 15px 0 10px;
  .privilege-title {
    font-weight: bold;
    text-align: center;
    color: #fff;
    font-size: 20px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    background: url('../../../assets/visualize/titles.png') no-repeat;
    background-size: 100% 100%;
    height: 42px;
    line-height: 42px;
    // margin-left: 30px;
  }
}

.content {
  position: relative;
  background: url('../../../assets/visualize/bg18.png') no-repeat;
  background-size: 100% 100%;
  width: 400px;
  height: 160px;
  color: #fff;
  font-size: 14px;
  margin-top: 50px;
  .item1 {
    position: absolute;
    top: -20px;
    left: 60px;
  }
  .item2 {
    position: absolute;
    top: 15px;
    right: 60px;
  }
  .item3 {
    position: absolute;
    top: 50px;
    left: 30px;
  }
  .item4 {
    position: absolute;
    top: 80px;
    right: 0px;
  }
  .leber {
    font-size: 20px;
    color: #9dbacf;
    margin-bottom: 5px;
  }
  .title {
    color: #296a9e;
  }
}
</style>
