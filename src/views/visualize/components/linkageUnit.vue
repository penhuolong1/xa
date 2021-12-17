<template>
  <div class="box-img">
    <!-- 标题 -->
    <div class="title">
      <div class="title-img">
        <div class="work-effectiveness flex-center-center">联动单位</div>
      </div>
    </div>
    <!-- 联动单位网格图 -->
    <!-- <div class="title sub-title">
      <div class="unit-grid-img">
        <div class="unit-grid-title flex-center-center" @click="toHelp">
          <img
            style="margin-right: 10px"
            src="../../../assets/images/visualization/linkageUnit/login.png"
          >
          联动单位网格图
        </div>
      </div>
    </div> -->
    <!-- 区级联动单位 街道/镇级联动单位 -->
    <div class="unit" style="margin-bottom: 20px;">
      <div class="dst-level-img" style="width: calc(100% - 10px);">
        <div class="dst-level-title flex-center-center">
          区级联动单位<span>120</span>家
        </div>
      </div>
    </div>
    <div class="unit">
      <div class="dst-level-img">
        <div class="dst-level-title street-town-level flex-center-center">
          街道/镇级联动单位<span style="color:#FEC752">120</span> <span class="unit-name">家</span>
        </div>
      </div>
      <div class="dst-level-img">
        <div class="dst-level-title street-town-level flex-center-center">
          社区级联动单位<span>120</span> <span class="unit-name">家</span>
        </div>
      </div>
    </div>
    <!-- 联动单位排名 -->
    <div class="title sub-title sub-title2">
      <div class="ranking-img">
        <div class="ranking">联动单位排名</div>
      </div>
    </div>
    <div class="echart-box">
      <div class="bar-type-wrapper">
        <li :class="menuIndex === 1 ? 'active':''" @click="selectMenu(1)">区级</li>
        <li :class="menuIndex === 2 ? 'active':''" @click="selectMenu(2)">街道级</li>
      </div>
      <BarChart class="echart" :echarts-data="echartsData" />
    </div>
  </div>
</template>

<script>
import BarChart from './barChart.vue'
export default {
  components: {
    BarChart
  },
  data() {
    return {
      echartsData: {
        yAxis: [
          '翔安区人民法院',
          '翔安区司法局',
          '翔安区工商局',
          '翔安区公安局',
          '翔安区妇联',
          '翔安区市政园林',
          '翔安区公安局',
          '翔安区妇联',
          '翔安区市政园林',
          '翔安区公安局'
        ],
        rate: [
          '80%',
          '80%',
          '80%',
          '80%',
          '80%',
          '80%',
          '80%',
          '80%',
          '80%',
          '80%'
        ],
        data1: [500, 500, 500, 500, 500, 500, 500, 500, 500, 500],
        data2: [300, 300, 300, 300, 300, 300, 300, 300, 300, 300]
      },
      menuIndex: 1
    }
  },
  mounted() {},
  methods: {
    selectMenu(index) {
      this.menuIndex = index
    },
    toHelp() {
      this.$router.push('/visualize/help')
    }
  }
}
</script>

<style lang="less" scoped>
.box-img {
  width: 597px;
  // height: 951px;
  background-image: url('../../../assets/images/visualization/linkageUnit/frame.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
.title {
  padding: 15px;
  padding-bottom: 20px;
  display: flex;
  justify-content: center;
  .title-img {
    width: 459px;
    height: 42px;
    background-image: url('../../../assets/images/visualization/workeffectiveness/title.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    .work-effectiveness {
      margin: auto;
      padding: 5px 0;
      color: #fff;
      font-weight: Bold;
      font-size: 20px;
    }
  }
  .unit-grid-img {
    width: 100%;
    height: 28.5px;
    background-image: url('../../../assets/images/visualization/linkageUnit/unitGrid.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    .unit-grid-title {
      margin: auto;
      padding: 3px 0;
      font-size: 14px;
      color: #00bdfc;
    }
  }
  .ranking-img {
    width: 100%;
    height: 42px;
    background-image: url('../../../assets/images/visualization/linkageUnit/ranking.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    .ranking {
      margin: 10px 10px 0;
      color: #dfeef3;
      font-weight: Bold;
      font-size: 16px;
    }
  }
}
.sub-title {
  padding: 0 30px;
  padding-bottom: 25px;
  &.sub-title2 {
    margin-top: 35px;
    padding-bottom: 0px;
  }
}
.unit {
  display: flex;
  justify-content: space-around;
  padding: 0px 30px 0px;
  .dst-level-img {
    width: calc((100% - 20px) / 2);
    height: 63px;
    background-image: url('../../../assets/images/visualization/linkageUnit/unitBox.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    .dst-level-title {
      color: #eff0f1;
      font-size: 14px;
      margin: 12px 0 0;
      span {
        margin: -10px 10px 0;
        color: #0bb2e9;
        font-weight: Bold;
        font-size: 40px;
      }
    }
    .street-town-level {
      font-size: 14px;
      margin: 15px 0 0;
      span {
        margin: -14px 10px 0;
        color: #2cfffd;
        font-weight: Bold;
        font-size: 40px;
      }
      .unit-name {
        color: #eff0f1;
        font-size: 16px;
        margin: 1px 0 0;
        font-weight: 500;
      }
    }
  }
}

.echart-box {
  position: relative;
  width: 100%;
  padding: 10px 30px;
  height: calc(100% - 300px);
  .bar-type-wrapper {
    li {
      display: inline-block;
      color: #155373;
      padding: 5px;
      font-size: 14px;
      margin-right: 10px;
      z-index: 100;
      cursor: pointer;
      &.active {
        color: #fff;
        border-bottom: 2px solid #0abef8;
        // border-bottom: #0ABEF8;
      }
    }
    position: absolute;
    z-index: 100;
  }
  .echart {
    z-index: 1;
  }
}

// 布局
// 横-左右
.flex-center-center {
  display: flex;
  justify-content: center;
  align-items: center;
}
// 竖
.flex-column {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
