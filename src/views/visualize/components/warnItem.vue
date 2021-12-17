<template>
  <div v-if="info.title" class="warn-item">
    <!-- <Title :label="info.title" :label1="info.subtitle" /> -->
    <Titles class="title" :label="info.title" :label1="info.subtitle" />
    <div class="subtitle">
      <div class="subtitle-left">本年度共<span style="color:#0AB2E9;font-size:25px;margin:0 10px">{{ info.total }}</span> 起</div>
      <div class="subtitle-right"> 未办结<span style="color:#FF932A;font-size:25px;margin:0 10px">{{ info.tip }}</span>件</div>
    </div>
    <div v-if="info.list && info.list.length > 0" class="warn-case-list">
      <div v-for="(item, index) in info.list" :key="index" class="list-row">
        <div class="list-col">{{ item.name }}</div>
        <div class="list-col">{{ item.brief }}</div>
        <div class="list-col" style="color:#05ADC9;">共{{ item.caseNum }}件
          <Icon type="right" />
        </div>
        <!-- <div class="list-col other">
          <Icon type="right" />
        </div> -->
      </div>
    </div>
  </div>
</template>

<script>
import Title from './title.vue'
import Titles from './titles.vue'
import { Icon } from 'ant-design-vue'
export default {
  components: {
    Title,
    Titles,
    Icon
  },
  props: {
    info: {
      type: Object,
      default: () => {}
    },
    type: {
      // 1 蓝色 2红色 3 黄色
      type: Number,
      default: 1
    }
  },
  data() {
    return {}
  },
  created() {},
  mounted() {},
  methods: {}
}
</script>

<style scoped lang="less">
.title {
  margin-top: 15px;
  // padding: 15px;
}
.warn-item {
  background: url('../../../assets/visualize/bg9.png') no-repeat;
  background-size: 100% 100%;
  .subtitle {
    padding: 0 20px;
    display: flex;
    height: 40px;
    color: #fff;
    align-items: center;
    justify-content: space-between;
    margin-top: 10px;
    .subtitle-left {
      background-image: url('../../../assets/images/visualization/linkageUnit/unitBox.png');
      background-repeat: no-repeat;
      background-size: 100% 100%;
      flex: 1;
      height: 100%;
      //   background-size: 100% 100%;
      //   background-position: 0 0;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 20px;

      //   &.type1 {
      //     background-image: url('../../../assets/visualize/bg7.png');
      //   }
      //   &.type2 {
      //     background-image: url('../../../assets/visualize/warnItem2.png');
      //     color: rgba(251, 70, 66, 1);
      //   }
      //   &.type3 {
      //     background-image: url('../../../assets/visualize/warnItem1.png');
      //     color: rgba(253, 161, 1, 1);
      //   }
    }
    .subtitle-right {
      background-image: url('../../../assets/images/visualization/linkageUnit/unitBox.png');
      background-repeat: no-repeat;
      background-size: 100% 100%;
      height: 100%;
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  .warn-case-list {
    padding: 0 20px;
    margin-top: 10px;
    .list-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: #fff;
      height: 40px;
      font-size: 14px;
      background-color: rgba(0, 174, 255, 0.1);
      padding: 0 10px;
      margin: 5px 0;
      //   &:nth-child(even) {
      //     background-color: rgba(0, 96, 240, 0.05);
      //   }
      //   &:nth-child(1) {
      //     padding-left: 10px;
      //   }
      .other {
        color: rgba(0, 174, 255, 1);
        cursor: pointer;
      }
    }
  }
}
</style>
