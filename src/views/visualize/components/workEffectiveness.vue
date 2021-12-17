<template>
  <div class="box-img">
    <div class="title">
      <div class="title-img">
        <div class="work-effectiveness">工作成效</div>
      </div>
    </div>

    <div class="flex-center-around">
      <div class="flex-column accepting-cases">
        <div class="number">750</div>
        <div class="name">受理案件（件）</div>
      </div>
      <div class="flex-column resolve-cases">
        <div class="number">750</div>
        <div class="name">受理案件（件）</div>
      </div>
      <div class="flex-column resolution-success-rate">
        <div class="number">750</div>
        <div class="name">受理案件（件）</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style lang="less" scoped>
.box-img {
  width: 100%;
  height: 100%;
  padding-bottom: 20px;
  background-image: url('../../../assets/images/visualization/workeffectiveness/frame.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  //   background-position: 0 -20px;
}
.title {
  padding: 15px;
  padding-bottom: 20px;
  .title-img {
    height: 42px;
    background-image: url('../../../assets/images/visualization/workeffectiveness/title.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    .work-effectiveness {
      display: flex;
      justify-content: center;
      align-items: center;
      margin: auto;
      padding: 5px 0;
      color: #fff;
      font-weight: Bold;
      font-size: 20px;
    }
  }
}
.accepting-cases {
  color: #42fbff;
  padding: 16px 0;
  width: 120px;
  height: 120px;
  background-image: url('../../../assets/images/visualization/workeffectiveness/acceptingCases.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
.resolve-cases {
  color: #08c7f1;
  padding: 16px 0;
  width: 120px;
  height: 120px;
  background-image: url('../../../assets/images/visualization/workeffectiveness/resolveCases.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
.resolution-success-rate {
  color: #ff993b;
  padding: 16px 0;
  width: 120px;
  height: 120px;
  background-image: url('../../../assets/images/visualization/workeffectiveness/resolutionSuccessRate.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-repeat: no-repeat;
}

.number {
  font-weight: bolder;
  font-size: 34px;
  text-align: center;
}
.name {
  margin-top: 8px;
  font-weight: bold;
  text-align: center;
}
// 布局
// 横-左右
.flex-center-around {
  display: flex;
  justify-content: space-around;
}
// 竖
.flex-column {
  display: flex;
  flex-direction: column;
}
</style>
