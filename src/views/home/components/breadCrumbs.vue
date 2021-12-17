<template>
  <div style="width: 100%;">
    <a-breadcrumb separator=">">
      <a-breadcrumb-item v-for="(item,index) in breadList" :key="index"> <router-link :to="item.path">{{ item.name }}</router-link> </a-breadcrumb-item>
      <!-- <a-breadcrumb-item>Home</a-breadcrumb-item>
      <a-breadcrumb-item href="">Application Center</a-breadcrumb-item>
      <a-breadcrumb-item href="">Application List</a-breadcrumb-item>
      <a-breadcrumb-item>An Application</a-breadcrumb-item> -->
    </a-breadcrumb>
  </div>
</template>

<script>
import { Breadcrumb } from 'ant-design-vue'
export default {
  components: {
    'a-breadcrumb': Breadcrumb,
    'a-breadcrumb-item': Breadcrumb.Item
  },
  props: {
    breadList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {

    }
  },
  methods: {

  }
}
</script>
<style lang="less" scoped>
@font-family: Source Han Sans CN, Source Han Sans CN-Regular;
@color: #303133;
@font-weight: 500;
@font-weight-bold: 700;

/deep/.ant-breadcrumb {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-variant: tabular-nums;
  line-height: 1.5;
  list-style: none;
  -webkit-font-feature-settings: "tnum";
  font-feature-settings: "tnum";
  font-size: 16px;
  font-weight: @font-weight;
  color: @color;
  font-family: @font-family;
}
/deep/.ant-breadcrumb a {
  color: @color;
  -webkit-transition: color 0.3s;
  transition: color 0.3s;
  font-size: 16px;
}
/deep/.ant-breadcrumb > span:last-child {
  color: @color;
}
/deep/.ant-breadcrumb-separator {
  margin: 0 8px;
  color: @color;
}

</style>

