<template>
  <div class="wrapper">
    <div class="flex">
      <h1>调解组</h1>
      <div class="btn-wrapper">
        <img src="@/assets/icons/invite.png" alt="">
        <span>邀请</span>
      </div>
    </div>
    <ul class="content">
      <li class="txt">
        法官
      </li>
      <li class="txt">
        原告
      </li>
      <li class="txt">
        被告
      </li>
    </ul>
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
    ...mapGetters(['getCaseInfo'])
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

</style>

