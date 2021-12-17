<template>
  <!-- 竖的导航菜单 -->
  <div>
    <a-menu
      :default-selected-keys="['1']"
      :open-keys.sync="openKeys"
      mode="inline"
      @click="handleClick"
    >
      <a-sub-menu v-for="(item,key) in list" :key="key" @titleClick="titleClick">
        <span slot="title"><span>{{ item.name }}</span></span>
        <a-menu-item v-for="(items , index) in item.sub" :key="index">
          {{ items.name }}
        </a-menu-item>
      </a-sub-menu>
    </a-menu>
  </div>
</template>

<script>
import { Menu } from 'ant-design-vue'
export default {
  components: {
    'a-menu': Menu,
    'a-menu-item': Menu.Item,
    [Menu.SubMenu.name]: Menu.SubMenu

  },
  data() {
    return {
      current: ['mail'],
      openKeys: ['sub1'],
      list: [
        {
          name: '起诉状',
          key: '1',
          sub: [
            {
              name: '起诉状模板',
              key: '1-1'
            },
            {
              name: '民事起诉状',
              key: '1-2'
            },
            {
              name: '欠条起诉状范本上',
              key: '1-3'
            },
            {
              name: '欠条起诉状范本下',
              key: '1-4'
            },
            {
              name: '欠条起诉状范本下',
              key: '1-5'
            },
            {
              name: '欠条起诉状范本中',
              key: '1-6'
            }
          ]
        },
        {
          name: '起诉状',
          key: '2',
          sub: [
            {
              name: '起诉状模板',
              key: '2-1'
            },
            {
              name: '民事起诉状',
              key: '2-2'
            },
            {
              name: '欠条起诉状范本上',
              key: '2-3'
            },
            {
              name: '欠条起诉状范本下',
              key: '2-4'
            },
            {
              name: '欠条起诉状范本下',
              key: '2-5'
            }
          ]
        }
      ]
    }
  },
  watch: {
    openKeys(val) {
      console.log('openKeys', val)
    }
  },
  methods: {
    handleClick(e) {
      console.log('click', e)
    },
    titleClick(e) {
      console.log('titleClick', e)
    }
  }
}

</script>

<style lang="less" scoped>
// .layout{
//   width: 245px;
//   margin: 30px 30px;
//   background: #ffffff;
//   border-radius: 8px;
//   box-shadow: 0px 4px 20px 0px rgba(0,86,170,0.05);
// }
</style>
