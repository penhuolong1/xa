<template>
  <div>
    <Header @change="tabMenu" />
    <BaseInfo v-if="menuIndex === 1" /> <!-- 基本信息 -->
    <LitigantList v-if="menuIndex === 2" /> <!-- 当事人 -->
    <CaseHandle v-if="menuIndex === 3" /> <!-- 案件办理 -->
    <Book v-if="menuIndex === 4" /> <!-- 卷宗 -->
    <Collaborate v-if="menuIndex === 9" />  <!-- 联动 -->
    <MediateList v-if="menuIndex === 5" />  <!-- 调解 -->
    <Deliverecord v-if="menuIndex === 6" /> <!--送达管理-->
    <RemarkList v-if="menuIndex === 7" /> <!--送达管理-->
    <AllProcess v-if="menuIndex ===8" /> <!--案件整体流程-->
  </div>
</template>

<script>
import Header from './components/header.vue'
import BaseInfo from './baseInfo/index.vue'
import LitigantList from './litigantList/index.vue'
import CaseHandle from '@/components/CaseHandle/index.vue'
import Book from './book/index.vue'
import Collaborate from './collaborate/index.vue'
import MediateList from './mediateList/index.vue'
import Deliverecord from './deliverecord/index.vue'
import RemarkList from './remarkList/index.vue'
import AllProcess from './allProcess/index.vue'
export default {
  components: {
    Header,
    BaseInfo,
    CaseHandle,
    Book,
    LitigantList,
    Collaborate,
    MediateList,
    Deliverecord,
    RemarkList,
    AllProcess
  },
  props: {

  },
  data() {
    return {
      menuIndex: 1
    }
  },
  created() {
    this.$store.commit('SET_FileId', '')
  },
  mounted() {
  },
  methods: {
    tabMenu(index) {
      this.menuIndex = index
    }
  }
}
</script>

<style scoped lang="less">

</style>
