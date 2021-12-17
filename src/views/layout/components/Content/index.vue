<template>
  <div class="xa-content" :class="getCollapsed == 1 ? 'is-collapsed':''">
    <MultipleTabs />
    <router-view v-if="!$route.meta.isKeep" id="content" class="content item1" />
    <keep-alive>
      <router-view v-if="$route.meta.isKeep" id="content" class="content item2" />
    </keep-alive>
  </div>
</template>

<script>
import MultipleTabs from './MultipleTabs'
import { mapGetters } from 'vuex'
export default {
  components: {
    MultipleTabs
  },
  props: {

  },
  data() {
    return {

    }
  },
  computed: {
    ...mapGetters(['getCollapsed'])
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
.xa-content {
  &.is-collapsed {
    width: calc(100% - @sider-collapsed-width);
  }
  height: calc(100% - 120px);
  transition: width .2s;
  width: calc(100% - @sider-width);
  background-color: #fff;
  .content {
    height: calc(100vh - 120px);
    overflow: auto;
    background-color: #fff;
    padding: @space-large;
  }
}
</style>
