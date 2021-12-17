<template>
  <div ref="localPlayer" class="local-player">
    <div class="name">{{ getUserInfo.user.nickName }}</div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  components: {
  },
  props: {

  },
  data() {
    return {

    }
  },

  computed: {
    ...mapGetters(['getUserInfo'])
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
.local-player {
  width: 100%;
  height: 200px;
  position: relative;
  background-color: #000;
  .name {
    position: absolute;
    top: 0;
    left: 10px;
    color: #fff;
  }
}
</style>
