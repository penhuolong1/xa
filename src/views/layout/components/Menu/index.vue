<template>
  <div class="xa-menu" :class="getCollapsed == 1 ? 'is-collapsed':''">
    <Menu
      mode="inline"
      class="menu-inner"
      :open-keys="openKeys"
      :inline-collapsed="getCollapsed == 1"
      :selected-keys="[$route.path]"
      @openChange="onOpenChange"
      @click="clickMenu"
    >
      <template v-for="item in menuList">
        <MenuItem v-if="(item.children && item.children.length === 1 && !item.hidden)" :key="item.children[0].path">
          <span><Icon class="menu-icon" :type="item.meta ? item.meta.icon : ''" /><span>{{ item.title }}</span></span>
        </MenuItem>
        <SubMenu v-if="(item.children.length > 1 && !item.hidden)" :key="item.path" :item="item" />
      </template>
    </Menu>
    <div class="collapsed-tab" @click="collapsedToggle">
      <Icon :type="getCollapsed == 1 ? 'right':'left'" class="collapsed-tab-icon" />
    </div>
  </div>
</template>

<script>
import { Menu, Icon } from 'ant-design-vue'
import { mapGetters } from 'vuex'
import menu from '@/router/menu.js'
import sfmenu from '@/router/sfMenu.js'
import SubMenu from './Item.vue'
export default {
  components: {
    Menu,
    MenuItem: Menu.Item,
    // SubMenu: Menu.SubMenu,
    SubMenu,
    Icon
  },
  props: {

  },
  data() {
    return {
      rootSubmenuKeys: ['sub2', 'sub4'],
      menu: menu,
      selectedKeys: [],
      openKeys: []
    }
  },
  computed: {
    ...mapGetters(['getCollapsed', 'getUserInfo', 'getUserRole', 'getCaseNo', 'getSfCaseNo']),
    menuList() {
      let list = []
      if (this.getUserRole === 'court') {
        list = menu
      } else {
        list = sfmenu
      }
      return list
    }
  },
  watch: {
    '$route.path': {
      handler() {
        this.openKeys = this.$route.matched && this.$route.matched.length > 0 ? this.$route.matched.map(item => item.path) : []
      }
    }
  },
  created() {
    this.openKeys = this.$route.matched && this.$route.matched.length > 0 ? this.$route.matched.map(item => item.path) : []
    // if (this.$route.path === '/case')
    console.log(this.$route.path)
    if (this.$route.path === '/case/detail') { // 假如案件是法院的案件
      const obj = {
        path: this.$route.fullPath,
        caseNo: this.getCaseNo,
        caseId: this.$route.query.lawCase
      }
      this.$store.commit('ADD_TAGVIEWCASE', obj)
    } else if (this.$route.path === '/sfcase/detail') { // 假如是诉非的案件
      const obj = {
        path: this.$route.fullPath,
        caseNo: this.getSfCaseNo,
        caseId: this.$route.query.caseId,
        type: 2
      }
      this.$store.commit('ADD_TAGVIEWCASE', obj)
    } else {
      this.$store.commit('ADD_TAGVIEWLIST', this.$route.path)
    }
  },
  mounted() {

  },
  methods: {
    // 打开菜单的时候关闭其他菜单
    onOpenChange(openKeys) {
      const latestOpenKey = openKeys.find(key => this.openKeys.indexOf(key) === -1)
      if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
        this.openKeys = openKeys
      } else {
        this.openKeys = latestOpenKey ? [latestOpenKey] : []
      }
    },
    // 展开和收索菜单
    collapsedToggle() {
      this.$store.commit('SET_COLLAPSED', this.getCollapsed == 0 ? 1 : 0)
    },
    // 点击
    clickMenu(e) {
      if (this.$route.path == e.key) {
        return
      }
      this.$router.push(e.key)
      this.$store.commit('ADD_TAGVIEWLIST', e.key)
    }
  }
}
</script>
<style scoped lang="less">
@import './menu.less';
</style>
