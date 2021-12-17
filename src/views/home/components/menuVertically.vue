<template>
  <!-- 橫的导航菜单 -->
  <div>
    <a-menu v-model="current" mode="horizontal">
      <a-menu-item v-for="(item,key) in menuList" :key="key" v-bind="item" @click="choice(item)">
        <!-- <a v-bind="item" href="item.url" target="_blank" rel="noopener noreferrer">{{ item.name }}</a> -->
        {{ item.name }}
      </a-menu-item>
    </a-menu>
  </div>
</template>

<script>
import { Menu } from 'ant-design-vue'
export default {
  components: {
    'a-menu': Menu,
    'a-menu-item': Menu.Item
  },
  props: {
    current: {
      type: Array,
      default: () => []
    },
    menuList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {

    }
  },
  methods: {
    choice(item) {
      this.$emit('choice', item)
    }
  }

}
</script>

<style lang="less" scoped>
@font-family: Source Han Sans CN, Source Han Sans CN-Regular;
/deep/.ant-menu-horizontal {
    line-height: 46px;
    white-space: nowrap;
    border: 0;
    -webkit-box-shadow: none;
    box-shadow: none;
    margin: 0 0 10px 0;
}
/deep/ *, *::before, *::after {
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    font-size: 18px;
    font-weight: 400;
    font-family: @font-family;
}

</style>
