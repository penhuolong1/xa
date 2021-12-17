<template>
  <div class="court-item-wrapper" @mouseleave="mouseLeave">
    <div>
      <div class="title">
        {{ item.streetName }}
      </div>
      <div class="address">地址：{{ item.splace }}</div>
      <div class="phone">联络人: 张三159123123123</div>
    </div>
    <div style="display: flex;color:#fff;text-align: center;">
      <div style="flex:1;">
        <div class="bg4">40</div>
        <div>案件数量</div>
      </div>
      <div style="flex:1;">
        <div class="bg4">11.55%</div>
        <div>受理案件占比</div>
      </div>
    </div>

  </div>
</template>

<script>
import Title from './title.vue'
export default {
  components: {
    Title
  },
  props: {
    item: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {}
  },
  created() {},
  mounted() {
    this.init()
  },
  methods: {
    // 移入
    mouseOver(item) {
      console.log(item.streetName)
      this.$emit('display', item.streetName)
    },
    // 移出
    mouseLeave() {
      this.$emit('displayNone')
    }
  }
}
</script>

<style scoped lang="less">
.court-item-wrapper {
  display: flex;
  align-items: center;
  margin-top: 10px;
  padding-left: 20px;
  background: url('../../../assets/visualize/bg3.png');
  background-size: 482px 116px;
  height: 116px;
  .title {
    font-size: 18px;
    font-family: Source Han Sans CN;
    font-weight: 400;
    color: #1cfeff;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    .jiedao {
      padding: 2px 5px;
      font-size: 10px;
      background: #0e6e96;
      margin-left: 10px;
      display: flex;
      align-items: center;
    }
  }
  & > div {
    flex: 1;
  }
  .address {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    font-size: 10px;
    font-family: Source Han Sans CN;
    font-weight: 400;
    color: #ffffff;
    opacity: 0.5;
    margin-bottom: 10px;
  }
  .phone {
    margin-top: 5px;
    font-size: 10px;
    font-family: Source Han Sans CN;
    font-weight: 400;
    color: #ffffff;
    opacity: 0.5;
  }
  .bg4 {
    width: 60px;
    height: 60px;
    line-height: 60px;
    background: url('../../../assets/visualize/bg4.png') no-repeat;
    background-size: 60px 60px;
    font-size: 12px;
    font-family: Source Han Sans CN;
    font-weight: bold;
    color: #3efff4;
    text-align: center;
    margin: 0 auto;
    margin-bottom: 10px;
  }
}
</style>
