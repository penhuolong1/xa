<template>
  <div class="wrapper">
    <Tabs :active-key="defaultKey" type="editable-card" @edit="del" @tabClick="tabClick">
      <TabPane v-if="getUserInfo && getUserInfo.loginRole && getUserInfo.loginRole.roleId==4" :key="workbench" tab="工作台" class="workbench" />
      <TabPane v-for="item in getTagsViewList" :key="item.path" :tab="item.title" :closable="getTagsViewList.length > 1" />
    </Tabs>
    <div class="clear" @click="clear">清空</div>
  </div>
</template>

<script>
import { Tabs } from 'ant-design-vue'
import { mapGetters } from 'vuex'
export default {
  components: {
    Tabs,
    TabPane: Tabs.TabPane
  },
  props: {

  },
  data() {
    return {
      defaultKey: null,
      workbench: '/workBench/index',
      pathList: []
    }
  },
  computed: {
    ...mapGetters(['getTagsViewList', 'getUserInfo'])
  },
  watch: {
    '$route.fullPath': {
      handler(e) {
        this.pathList.push(e)
        this.defaultKey = this.$route.fullPath
      },
      immediate: true
    }
  },
  created() {
    this.defaultKey = this.$route.fullPath
  },
  mounted() {

  },
  methods: {
    tabClick(e) {
      if (e === this.workbench) {
        this.$router.replace({ path: '/redirect' + this.workbench })
        return
      }
      const obj = this.getTagsViewList.find(item => item.path === e)
      if (obj.caseId) {
        if (obj.type == 2) { // 为诉非的情况下
          this.$store.commit('SET_SFLAWCASE', obj.caseId)
          this.$store.commit('SET_SFCASENO', obj.title)
        } else { // 当为法院的情况下
          this.$store.commit('SET_LAWCASE', obj.caseId)
          this.$store.commit('SET_CASENO', obj.title)
        }
      }
      this.$router.replace({ path: '/redirect' + e })
    },
    del(e) {
      const params = {
        path: e,
        isNow: e === this.$route.fullPath
      }
      this.$store.dispatch('DelTags', params)
    },
    // 清空
    clear() {
      console.log(this.$route.fullPath)
      this.$store.commit('CLEAR_TAGVIEWLIST', this.$route.fullPath)
    }
  }
}
</script>

<style scoped lang="less">
@bg-color: #f9fafb;
.wrapper {
  width: 100%;
  padding-right: 50px;
  background-color: @bg-color;
  position: relative;
  .clear {
    position: absolute;
    right: 10px;
    top: 10px;
    cursor: pointer;
    color: #177DDC;
  }
}
/deep/.ant-tabs-nav-wrap {
  background-color: @bg-color;
  .ant-tabs-tab {
    color: #434343;
    border: none!important;
  }
  .ant-tabs-tab-active {
    color:#177DDC;
    font-weight: bold;
  }
}
/deep/.ant-tabs-extra-content {
  display: none;
}
/deep/.ant-tabs-bar {
  margin-bottom: 0px;
  background-color: @bg-color;
  border-bottom: none;
}
/deep/.ant-tabs-tab-prev-icon{
  top: 42%;
}
/deep/.ant-tabs-tab-next-icon{
  top: 42%;
}
.workbench{
  /deep/.anticon-close{
    display: none;
  }
}
</style>
