<template>
  <div class="box-img">

    <div class="flex-center-around">
      <div class="flex-column">
        <div class="title">
          <div class="number">21421</div>
          <div class="name">收案</div>
          <div class="name1">(件)</div>
        </div>
        <div class="accepting-cases1" />
      </div>
      <div class="flex-column">
        <div class="title">
          <div class="number">21421</div>
          <div class="name">分流</div>
          <div class="name1">(件)</div>
        </div>
        <div class="accepting-cases2" />
      </div>
      <div class="flex-column">
        <div class="title">
          <div class="number">21421</div>
          <div class="name">处理</div>
          <div class="name1">(件)</div>
        </div>
        <div class="accepting-cases3" />
      </div>
      <div class="flex-column">
        <div class="title">
          <div class="number">21421</div>
          <div class="name">化解</div>
          <div class="name1">(件)</div>
        </div>
        <div class="accepting-cases4" />
      </div>
      <div class="flex-column">
        <div class="title">
          <div class="number" style="color:#23FFFC">12%</div>
          <div class="name">纠纷解化率</div>
          <div class="name1">(%)</div>
        </div>
        <div class="accepting-cases5" />
      </div>
      <div class="flex-column">
        <div class="title">
          <div class="number" style="color:#FFDA30">30%</div>
          <div class="name">在线调节率</div>
          <div class="name1">(%)</div>
        </div>
        <div class="accepting-cases6" />
      </div>

    </div>
    <div class="foot1" />
    <div class="foot2" />
  </div>
</template>

<script>
export default {}
</script>

<style lang="less" scoped>
.box-img {
  position: relative;
  left: 2%;
  width: 96%;
  height: 100%;
  //   padding-bottom: 20px;
}

.accepting-cases1 {
  z-index: 999;
  padding: 16px 0;
  width: 103px;
  height: 114px;
  background-image: url('../../../assets/visualize/bg12.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
.accepting-cases2 {
  z-index: 999;
  padding: 16px 0;
  width: 103px;
  height: 114px;
  background-image: url('../../../assets/visualize/bg13.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
.accepting-cases3 {
  z-index: 999;
  padding: 16px 0;
  width: 103px;
  height: 114px;
  background-image: url('../../../assets/visualize/bg14.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
.accepting-cases4 {
  z-index: 999;
  padding: 16px 0;
  width: 103px;
  height: 114px;
  background-image: url('../../../assets/visualize/bg15.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
.accepting-cases5 {
  z-index: 999;
  padding: 16px 0;
  width: 103px;
  height: 114px;
  background-image: url('../../../assets/visualize/bg16.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
.accepting-cases6 {
  z-index: 999;
  padding: 16px 0;
  width: 103px;
  height: 114px;
  background-image: url('../../../assets/visualize/bg17.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
.title {
  position: relative;
  top: 40px;
  .number {
    color: #0bb2e9;
    font-weight: bolder;
    text-align: center;
  }
  .name {
    color: #ccd6d6;
    margin-top: 4px;
    font-weight: bold;
    text-align: center;
  }
  .name1 {
    color: #ccd6d6;
    margin-top: 4px;
    font-weight: bold;
    text-align: center;
  }
}

.foot1 {
  position: absolute;
  bottom: 10px;
  width: 100%;
  height: 75px;
  padding-bottom: 20px;
  background-image: url('../../../assets/visualize/bg10.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  //   background-repeat: no-repeat;
}
.foot2 {
  position: absolute;
  bottom: 20px;
  width: 100%;
  height: 75px;
  padding-bottom: 20px;
  background-image: url('../../../assets/visualize/bg11.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
// 布局
// 横-左右
.flex-center-around {
  position: absolute;
  bottom: 40px;
  width: 100%;
  display: flex;
  justify-content: space-around;
}
// 竖
.flex-column {
  display: flex;
  flex-direction: column;
}
</style>
