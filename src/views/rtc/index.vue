<template>
  <div class="wrapper">
    <div class="left">
      <!-- 基本信息 -->
      <Info />
    </div>
    <div class="right">
      <Room class="room" />
      <VideoMediation v-if="getIsVideo" class="video-mediation" @turnLeft="turnLeft" />
    </div>
  </div>
</template>

<script>
import Info from './compenents/info/index.vue'
import Room from './compenents/room/index.vue'
import VideoMediation from './compenents/videoMediation/index.vue'
import { exitGroup } from '@/utils/socket.js'
import { mapGetters } from 'vuex'
export default {
  components: {
    Info,
    Room,
    VideoMediation
  },
  props: {

  },
  data() {
    return {
      isVideo: false
    }
  },
  computed: {
    ...mapGetters(['getLawCaseId', 'getUserInfo', 'getIsVideo'])
  },
  watch: {
  },
  beforeRouteLeave(to, from, next) {
    const params1 = {
      userid: this.getUserInfo.user.userId
    }
    console.log(next)
    exitGroup(params1)
    next()
  },
  created() {
    // this.$store.dispatch('GetCaseInfo')
    if (this.$route.query.type == 1) { // 法院的案件
      this.$store.dispatch('GetCaseInfo')
    } else if (this.$route.query.type == 2) { // 诉非的案件
      this.$store.dispatch('GetSfCaseInfo')
    } else if (this.$route.query.type == 3) { // 法院联动的案件
      this.$store.dispatch('GetCaseInfo')
    } else { // 诉非联动的案件
      this.$store.dispatch('GetSfCaseInfo')
    }
  },
  mounted() {

  },
  methods: {
    turnLeft() {
      this.isVideo = false
    }
  }
}
</script>

<style scoped lang="less">
.wrapper {
  width: 100%;
  height: calc(100vh - 80px);
  background-color: #f9f9fa;
  display: flex;
  padding: 10px;
  padding-right: 20px;
  .left {
    width: 270px;
  }
  .right {
    flex: 1;
    background-color: #fff;
    border-radius: 10px;
    display: flex;
    .room {
      flex: 1;
      height: 100%;
      border-right: 1px solid rgba(0,0,0,0.10);
      padding: 20px;
    }
    .video-mediation {
      width: 500px;
      position: relative;
    }
  }
}
</style>
