<!--vue中的函数式组件也称为无状态组件，与Flutter中的无状态组件类似，其内部没有任何状态。函数式组件中只接受一个props参数，没有其他参数。-->
<template>
  <!-- 有多个子节点 -->
  <a-sub-menu v-bind="$props" v-on="$listeners">
    <span slot="title"><Icon v-if="item.meta" class="menu-icon" :type="item.meta ? item.meta.icon : ''" /><span>{{ item.title }}</span></span>
    <template v-for="item1 in item.children">
      <a-menu-item v-if="((item1.children && item1.children.length === 1) || !item1.children) && !item1.hidden" :key="item1.path">
        {{ item1.title }}
      </a-menu-item>
      <SubMenu v-else :key="item1.path" :item="item1" />
    </template>
  </a-sub-menu>
</template>

<script>
import { Menu, Icon } from 'ant-design-vue'
export default {
  name: 'SubMenu',
  isSubMenu: true,
  components: {
    Icon,
    [Menu.Item.name]: Menu.Item,
    [Menu.SubMenu.name]: Menu.SubMenu
  },
  props: {
    ...Menu.SubMenu.props,
    item: {
      type: Object,
      default: () => {}
    }
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
@import './menu.less';
</style>
