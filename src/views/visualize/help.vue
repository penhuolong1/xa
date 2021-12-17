<template>
  <Layout ref="layout" :menu-num="2">
    <div class="help-content">
      <div class="help-box left">
        <div class="help-row">
          <div class="help-item">
            <div><span class="num">30</span>件</div>
            <div class="text">区委台港办</div>
          </div>
          <div class="help-item yellow">
            <div><span class="num">76</span>件</div>
            <div class="text">区委政法委</div>
          </div>
        </div>
        <div class="help-row">
          <div class="help-item">
            <div><span class="num">46</span>件</div>
            <div class="text">区检测院</div>
          </div>
          <div class="help-item">
            <div><span class="num">970</span>件</div>
            <div class="text">区公安分局</div>
          </div>
          <div class="help-item">
            <div><span class="num">1088</span>件</div>
            <div class="text">区司法局</div>
          </div>
          <div class="help-item">
            <div><span class="num">76</span>件</div>
            <div class="text">区人社局</div>
          </div>
        </div>
        <div class="help-row">
          <div class="help-item">
            <div><span class="num">46</span>件</div>
            <div class="text">区文旅局</div>
          </div>
          <div class="help-item">
            <div><span class="num">302</span>件</div>
            <div class="text">区卫健局</div>
          </div>
          <div class="help-item">
            <div><span class="num">19</span>件</div>
            <div class="text">区退役军人事务局</div>
          </div>
          <div class="help-item">
            <div><span class="num">76</span>件</div>
            <div class="text">区侨联</div>
          </div>
        </div>
        <div class="help-row">
          <div class="help-item">
            <div><span class="num">46</span>件</div>
            <div class="text">区总工会</div>
          </div>
          <div class="help-item">
            <div><span class="num">970</span>件</div>
            <div class="text">区妇联</div>
          </div>
          <div class="help-item">
            <div><span class="num">66</span>件</div>
            <div class="text">区团委</div>
          </div>
          <div class="help-item">
            <div><span class="num">76</span>件</div>
            <div class="text">资源规划局翔安分局</div>
          </div>
        </div>
      </div>
      <div class="help-box">
        <div class="center">
          <div class="center-line center-line1" />
          <div class="center-line center-line2" />
          <div class="center-line center-line3" />
          <div class="center-line center-line4" />
          <div class="center-line center-line1 right" />
          <div class="center-line center-line2 right" />
          <div class="center-line center-line3 right" />
          <div class="center-line center-line4 right" />
          <div class="center-box">
            <div class="center-box-num">3000件</div>
            <div class="center-box-text">翔安矛盾纠纷</div>
          </div>
        </div>
      </div>
      <div class="help-box right">
        <div class="help-row">
          <div class="help-item">
            <div><span class="num">23</span>件</div>
            <div class="text">区武装部</div>
          </div>
          <div class="help-item yellow">
            <div><span class="num">698</span>件</div>
            <div class="text">区法院</div>
          </div>
        </div>
        <div class="help-row">
          <div class="help-item">
            <div><span class="num">46</span>件</div>
            <div class="text">区教育局</div>
          </div>
          <div class="help-item">
            <div><span class="num">277</span>件</div>
            <div class="text">区民政局</div>
          </div>
          <div class="help-item">
            <div><span class="num">191</span>件</div>
            <div class="text">区建设与交通局</div>
          </div>
          <div class="help-item">
            <div><span class="num">82</span>件</div>
            <div class="text">区农业农村局</div>
          </div>
        </div>
        <div class="help-row">
          <div class="help-item">
            <div><span class="num">277</span>件</div>
            <div class="text">区工商联</div>
          </div>
          <div class="help-item">
            <div><span class="num">11</span>件</div>
            <div class="text">区应急局</div>
          </div>
          <div class="help-item">
            <div><span class="num">191</span>件</div>
            <div class="text">区城管局</div>
          </div>
          <div class="help-item">
            <div><span class="num">82</span>件</div>
            <div class="text">区信访局</div>
          </div>
        </div>
        <div class="help-row">
          <div class="help-item">
            <div><span class="num">64</span>件</div>
            <div class="text">翔安生态环境局</div>
          </div>
          <div class="help-item">
            <div><span class="num">57</span>件</div>
            <div class="text">区市场监督管理局</div>
          </div>
          <div class="help-item">
            <div><span class="num">54</span>件</div>
            <div class="text">区税务局</div>
          </div>
          <div class="help-item">
            <div><span class="num">334</span>件</div>
            <div class="text">其他组织</div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script>
import Layout from './components/Layout.vue'
export default {
  components: {
    Layout
  },
  props: {

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
.help-content {
  position: absolute;
  left: 0px;
  top: 90px;
  width: 100%;
  height: calc(100vh - 90px);
  display: flex;
  padding: 20px;
  padding-top: 0px;
  border-left: none;
  justify-content:space-around;
  .help-box {
    display: flex;
    width: 100%;
    justify-content: center;
    flex: 1;
    height: 100%;
    flex-direction: column;
    background-repeat: no-repeat;
    background-size: 100% 100%;
      background-position: 100% 100%;

    &.left {
      background-image: url('../../assets/visualize/leftBox.png');
    }
    &.right {
      background-image: url('../../assets/visualize/rightBox.png');
    }
    .center {
      width: 100%;
      height: 100%;
      position: relative;
      .center-line {
        position: absolute;
        z-index: 1;
        &.center-line1 {
          width: 20rem;
          height: 18rem;
          background-image: url('../../assets/visualize/line-left-1.png');
          background-size: 100% 100%;
          left: 0px;
          top: 7.55rem;
          &.right {
            right: 0;
            left: auto;
            background-image: url('../../assets/visualize/line-right-1.png');
          }
        }
        &.center-line2 {
          width: 20rem;
          height: 6.75rem;
          background-image: url('../../assets/visualize/line-left-2.png');
          background-size: 100% 100%;
          left: 0px;
          top: 19rem;
           &.right {
            right: 0;
            left: auto;
            background-image: url('../../assets/visualize/line-right-2.png');
          }
        }
        &.center-line3 {
          width: 20rem;
          height: 6.75rem;
          background-image: url('../../assets/visualize/line-left-3.png');
          background-size: 100% 100%;
          left: 0px;
          top: 26rem;
           &.right {
            right: 0;
            left: auto;
            background-image: url('../../assets/visualize/line-right-3.png');
          }
        }
        &.center-line4 {
          width: 20rem;
          height: 18.125rem;
          background-image: url('../../assets/visualize/line-left-4.png');
          background-size: 100% 100%;
          left: 0px;
          top: 26rem;
           &.right {
            right: 0;
            left: auto;
            background-image: url('../../assets/visualize/line-right-4.png');
          }
        }
      }
      #center();
      .center-box {
        width: 30rem;
        height: 30rem;
        position: relative;
        z-index: 2;
        background-image: url('../../assets/visualize/helpCenter.png');
        background-size: 100% 100%;
        #center();
        flex-direction: column;
        color: #fff;
        .center-box-num {
          font-size: 30px;
          font-weight: bolder;
          margin-left: 5px;
          position: relative;
          top: -10px;
        }
        .center-box-text {
          margin-left: 5px;
          margin-top: -7px;
          position: relative;
          top: -8px;
        }
      }
    }
    .help-row {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-around;
      .help-item {
        background-image: url('../../assets/visualize/helpItemBlue.png');
        &.yellow {
          background-image: url('../../assets/visualize/helpItemYellow.png');
        }
        height: 7.125rem;
        width: 8.75rem;
        background-size: 100% 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        color: #fff;
        font-size: 14px;
        text-align: center;
        .num {
          font-weight: bold;
          font-size: 18px;
        }
        .text {
          width: 5rem;
          #ellipsis()
        }
      }
    }
  }
}
</style>
