<template>
  <Layout>
    <div class="content-left">
      <IndexLeft class="item1" />
      <IndexLeftBottom class="item2" />
    </div>
    <!-- <div class="content-middle"> -->
    <!-- <XaMap /> -->
    <!-- <CourtList /> -->
    <!-- </div> -->
    <div class="content-right">
      <CourtList />
    </div>
  </Layout>
</template>

<script>
import DataStatistics from './components/dataStatistics.vue'
import DataStatisticstow from './components/dataStatisticstow.vue'
import IndexLeft from './components/indexLeft.vue'
import Privilege from './components/privilege.vue'
import Privileges from './components/privileges.vue'
import IndexLeftBottom from './components/indexLeftBottom.vue'
import Layout from './components/Layout.vue'
import CourtList from './components/courtList.vue'
import XaMap from './components/xaMap.vue'
export default {
  components: {
    IndexLeft,
    Layout,
    DataStatistics,
    DataStatisticstow,
    Privilege,
    IndexLeftBottom,
    Privileges,
    CourtList,
    XaMap
  },
  props: {},
  data() {
    return {}
  },
  created() {},
  mounted() {},
  methods: {}
}
</script>

<style scoped lang="less">
.content-left {
  position: absolute;
  left: 20px;
  top: 90px;
  width: 27.75rem;
  height: calc(100vh - 90px);
  // border: 1px solid #62a2cd;
  display: flex;
  flex-direction: column;
  //   padding: 20px;
  border-left: none;
  z-index: 1;
  .item1 {
    width: 27.75rem;
    height: 35%;
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .item2 {
    width: 27.75rem;
    height: calc((100% - 35%) - 40px);
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
}
// .content-left {
//   position: absolute;
//   left: 20px;
//   top: 90px;
//   //   width: 25.75rem;
//   width: 482px;
//   height: calc(100vh - 90px);
//   display: flex;
//   flex-direction: column;
//   //   padding: 20px;
//   border-left: none;
//   z-index: 1;

//   .content-left-1 {
//     width: 100%;
//     height: calc((100vh - 90px) / 2);
//     // flex: 3;
//     margin-bottom: 20px;
//   }
//   .content-left-2 {
//     height: calc((100vh - 90px) / 2);
//     width: 100%;
//     // flex: 2;
//   }
//   &::before {
//     content: '';
//     position: absolute;
//     top: 0;
//     bottom: 0;
//     left: 0;
//     right: 0;
//     background: rgba(3, 16, 47, 1);
//     filter: blur(10px);
//     z-index: -1;
//   }
// }
.content-middle {
  position: absolute;
  top: 90px;
  right: 500px;
  width: 480px;
  height: calc(100vh - 150px);
  background: url('../../assets/visualize/bg8.png') no-repeat;
  background-size: 100% 100%;
  z-index: 1;
  overflow: auto;
}
.content-right {
  position: absolute;
  right: 10px;
  top: 90px;
  bottom: 20px;
  width: 900px;
  height: calc(100vh - 110px);
  z-index: 1;
}
</style>
