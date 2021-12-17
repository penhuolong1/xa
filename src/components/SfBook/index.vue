<template>
  <div class="flex">
    <div class="menu-wrapper">
      <Menu />
    </div>
    <div class="p-5 flex-1">
      <Content />
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
    this.$store.commit('SET_FileId', '')
  },
  methods: {
  }
}
</script>

<style scoped lang="less">
.menu-wrapper {
  width: 300px;
}
</style>
