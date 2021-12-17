<template>
  <div class="participant-wrapper">
    <div class="case-no">
      <Icon class="icon" type="arrow-left" @click="back" />
      <div v-if="$route.query.type == 1 || $route.query.type == 3" class="txt">{{ getCaseInfo.lawCase ? getCaseInfo.lawCase.caseNo || getCaseInfo.lawCase.preCaseNo:"" }}</div>
      <div v-if="$route.query.type == 2 || $route.query.type == 4" class="txt">{{ getSfCaseInfo ? getSfCaseInfo.caseNo : "" }}</div>
      <span class="name">参与人:</span>
      <span
        v-if="participantData && participantData.length >0"
        class="content"
      >
        <div
          v-for="(item, index) in participantData"
          :key="index"
          style="display: inline-block;"
        >
          <div
            class="circle-text role1"
          >
            <span>{{ item[0] }}</span>
          </div>
        </div>
      </span>
    </div>
    <div class="flex center">
      <div class="right-icon-wrapper" @click="setVideo">
        <Icon v-if="!isVideo" type="play-circle" class="icon" />
        <img v-if="isVideo" src="@/assets/icons/endVideo.png" alt="">
      </div>
      <div class="time">{{ time }}</div>
    </div>
  </div>
</template>

<script>
import { Icon } from 'ant-design-vue'
import { formatDate } from '@/utils/format'
import { quitTeamRoom } from '@/api/rtc/index.js'

import { mapGetters } from 'vuex'
export default {
  components: {
    Icon
  },
  props: {
  },
  data() {
    return {
      participantData: [],
      isVideo: false,
      time: formatDate(new Date().getTime(), 'YYYY-MM-DD H:m')
    }
  },
  computed: {
    ...mapGetters(['getLawCaseId', 'getCaseInfo', 'getPiliRTC', 'getSfCaseInfo', 'getSfLawCaseId', 'getUserInfo'])
  },
  watch: {
  },
  created() {
    this.isVideo = false
  },
  mounted() {},
  methods: {
    back() {
      quitTeamRoom({ sfTeamId: this.$route.query.chatRoomId }).then(({ code, msg }) => {
        if (code === 200) {
          this.$message.success(msg)
          localStorage.removeItem('xaRtcToken')
          this.$router.go(-1)
        }
      })
    },
    getUser(data) {
      this.groupUserData = []
      if (data && data.length > 0) {
        this.participantData = data.map(item => {
          return item.nick
        })
      }
    },
    setVideo() {
      this.isVideo = !this.isVideo
      this.$store.commit('SET_ISVIDEO', this.isVideo)
    }
  }
}
</script>

<style scoped lang="less">
.center {
  #center();
  .right-icon-wrapper {
    #center();
  }
  .icon {
    font-size: 25px;
    margin-right: 10px;
    cursor: pointer;
    color: @theme-color;
  }
  img {
    width: 30px;
    cursor: pointer;
    margin-right: 10px;
  }
}
.participant-wrapper {
  line-height: 36px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 0px;
  border-bottom: 1px solid rgba(0,0,0,0.10);
  .case-no {
    display: flex;
    color: #000;
    align-items: center;
    .icon {
      cursor: pointer;
      position: relative;
      top: 1px;
    }
    .txt {
      font-size: 16px;
      font-weight: bold;
      margin-left: 10px;
      margin-right: 10px;
    }
  }
  .name {
    line-height: 36px;
    font-size: 14px;
    color: rgba(0,0,0,0.85);
    margin-right: 10px;
    vertical-align: top;
  }
  .content {
    p,
    span {
      display: block;
      font-size: 10px;
      // transform: scale(0.8);
    }
    .circle-text {
      width: 36px;
      height: 36px;
      display: inline-block;
      vertical-align: bottom;
      margin-right: 5px;
      border-radius: 50%;
      color: #Fff;
      box-shadow: -8px 12px 18px rgba(25, 42, 70, 0.13);
      text-align: center;
      &.role1 {
        background-color:  @theme-color;
      }
      &.role2 {
        background-color:  @theme-color;
      }
      &.role3 {
        background-color: #ffdd00;
      }
      &.role4 {
        background-color: #73d500;
      }
      p {
        line-height: 12px;
        &:first-child {
          padding-top: 6px;
        }
      }
    }
  }
  .add {
    display: inline-flex;
    color: #192a46;
    width: 36px;
    height: 36px;
    align-items: center;
    justify-content: center;
    box-shadow: -8px 12px 18px rgba(25, 42, 70, 0.13);
    margin-left: 50px;
    i {
      font-weight: bold;
    }
  }
  .time {
    font-size: 12px;
    font-weight: bold;
    width: 80px;
    line-height: 15px;
    color: #000;
  }
}
</style>
