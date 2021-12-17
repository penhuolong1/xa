<template>
  <div class="flex">
    <div class="menu-wrapper">
      <Menu ref="menu" />
    </div>
    <div class="p-5 flex-1">
      <Content ref="content" @done="getMenu" />
    </div>
  </div>
</template>

<script>
import Menu from './components/menu.vue'
import Content from './components/content.vue'

export default {
  components: {
    Menu,
    Content
  },
  props: {

  },
  data() {
    return {
      typeList: ['1', '2']
    }
  },
  watch: {
  },
  created() {

  },
  mounted() {
    this.$store.commit('SET_FileId', '') // 刚进入页面的时候清空所选的卷宗菜单id
  },
  methods: {
    getMenu() {
      this.$refs.menu.getTreeDate()
    }
  }
}
</script>

<style scoped lang="less">
.menu-wrapper {
  width: 300px;
}
</style>
