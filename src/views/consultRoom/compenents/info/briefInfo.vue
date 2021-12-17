<template>
  <div class="wrapper">
    <div class="flex">
      <h1>纠纷概况</h1>
    </div>
    <div v-if="getCaseInfo" class="content">
      <div class="txt">{{ getSfCaseInfo ? getSfCaseInfo.briefName : '' }}</div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  components: {
  },
  props: {},
  data() {
    return {
      list: []
    }
  },
  computed: {
    ...mapGetters(['getCaseInfo', 'getSfCaseInfo'])
  },
  watch: {},
  created() {
  },
  mounted() {},
  methods: {
  }
}
</script>
<style scoped lang="less" src="./index.less"></style>
<style scoped lang="less">
ul {
  margin-top: 10px;
  li {
    margin-top: 5px;
    cursor: pointer;
  }
}
</style>
