<template>
  <div
    ref="videoWrapper"
    class="video-wrapper"
  >
    <div class="wrapper-item">
      <!-- <div class="title">调解员</div> -->
      <div class="video-wrapper-box">
        <LocalPlayer id="localPlayer" ref="localPlayer" />
      </div>
    </div>
    <div class="wrapper-item">
      <!-- <div class="title">协助调解员</div> -->
      <div class="video-wrapper-box" />
    </div>
    <div class="wrapper-item">
      <!-- <div class="title">当事人</div> -->
      <div v-if="isShowVideo" class="video-wrapper-box">
        <RemotePlayer v-for="(item, index) in videoUser" :key="index" :rtc="myRTC" :user-id="item.id" :item="item" class="remotePlayer" />
      </div>
    </div>
  </div>
</template>

<script>
import { sendMessage } from '@/utils/socket.js'
import { userInfo, detailCase } from '@/api/case/index.js'
import { userDetail, sfUserDetail } from '@/api/rtc/index.js'
import { formatDate } from '@/utils/format.js'
import { findArrayIndexByKey } from '@/utils/tools.js'
import LocalPlayer from './localPlayer.vue'
import RemotePlayer from './remotePlayer.vue'
import * as QNRTC from 'pili-rtc-web'
import { mapGetters } from 'vuex'
export default {
  components: {
    LocalPlayer,
    RemotePlayer
  },
  props: {
    roomToken: null,
    caseId: null
  },
  data() {
    return {
      videoDomArray: [],
      myRTC: null,
      isShowVideo: true,
      videoUser: [], // 参与的用户
      bigVideoClassId: 1,
      forbiddenWordsUsers: [], // 禁言的用户
      forbiddenWordsTitle: '禁言'
    }
  },
  computed: {
    ...mapGetters(['getUserInfo', 'getTeamData', 'getRtcToken']),
    // 判断用户是否被禁言
    isForbiddenWords() {
      return id => {
        const index = this.forbiddenWordsUsers.findIndex(item => item == id)
        console.log('是否禁言')
        console.log(index)
        return index == -1
      }
    },
    userLength() {
      return this.videoUser.length + 1
    }
  },
  watch: {
  },
  created() {
    // this.initWebSocket()
    // this.myRTC = new QNRTC.StreamModeSession()
    this.rtc()
  },
  mounted() {},
  beforeDestroy() {
    console.log('销毁触发')
    this.myRTC.leaveRoom()
  },
  methods: {
    leaveRoom() {
      this.myRTC.leaveRoom()
    },
    async rtc() {
      const caseId = this.caseId
      this.myRTC = new QNRTC.StreamModeSession()
      console.log(this.myRTC)
      // 采集
      // 使用内置的 deviceManager 对象采集本地媒体数据
      const stream = await QNRTC.deviceManager.getLocalStream({
        video: { enabled: true },
        audio: { enabled: true }
      })
      // 页面上准备用来播放的元素，就是我们刚刚创建的
      const localVideo1 = document.getElementById('localPlayer')
      // 拿到 stream 对象后，调用 play 就可以播放了
      // sdk 会在指定的元素下创建相应的 video/audio 标签完成播放
      // 这里第二个参数代表用 静音模式 来播放，本地预览的时候一般我们会设置成静音
      stream.play(localVideo1, true)
      await this.myRTC.joinRoomWithToken(this.getRtcToken)
      const users = this.myRTC.users
      try {
        await this.myRTC.publish(stream)
        console.log('publish success!')
      } catch (e) {
        console.log('publish error!', e)
      }
      console.log(users)
      for (let i = 0; i < users.length; i += 1) {
        const user = users[i]
        if (user.published && user.userId !== this.myRTC.userId) {
          this.getUserDetail(user.userId)
        }
      }
      this.myRTC.on('user-join', async(e) => {
        // console.log('--有人加入房间---')
        this.getUserDetail(e.userId)
      })
      this.myRTC.on('user-leave', (e) => {
        console.log('--有人离开房间---')
        // this.$message.error('有人离开房间')
        const index = this.videoUser.findIndex(item => item.id === e.userId)
        this.videoUser.splice(index, 1)
        this.myRTC &&
          this.myRTC
            .unsubscribe(e.userId)
            .then(() => {
              console.log(this.videoUser)
              console.log('unsubscribe success!')
            })
            .catch(e => {
              console.log('unsubscribe Error!', e)
            })
        this.$forceUpdate()
        this.isShowVideo = false
        setTimeout(() => {
          this.isShowVideo = true
        }, 200)
      })
      this.myRTC.on('user-publish', e => {
        this.getUserDetail(e.userId)
      })
      this.myRTC.on('user-unpublish', async e => {
        console.log('--有人离开房间---')
        // this.$message.error('有人离开房间1')
      })
    },
    // 查看详情并订阅视频
    async subscribeVideo(userId, name, role) {
      console.log('查看并订阅视频')
      console.log('视频的数据')
      console.log(this.videoUser)
      // this.videoUser.unshift(obj)
      const stream = await this.myRTC.subscribe(userId)
      const obj = {
        id: userId,
        name: name,
        roleName: role,
        stream
      }
      const index = this.videoUser.findIndex(item => item.id === userId)
      if (index === -1) {
        this.videoUser.push(obj)
      } else {
        this.videoUser[index].stream = stream
      }
      this.$nextTick(() => {
        // const dom = document.getElementById(`video${id}`)
        // stream.play(dom)
      })
    },
    // 通过7牛获取的userId获取当前账户的具体信息
    getUserDetail(userId) {
      if (this.$route.query.type == 1) { // 法院在调解室
        userDetail({ userId: userId }).then(res => {
          if (res.code === 200) {
            const name = res.data.userName
            const role = res.data.roleName
            // this.$message.success(`${name}加入了房间`)
            this.subscribeVideo(userId, name, role)
          }
        })
      } else if (this.$route.query.type == 2) { // 诉非调解室
        sfUserDetail({ userId: userId }).then(res => {
          if (res.code === 200) {
            const name = res.data.userName
            const role = res.data.roleName
            // this.$message.success(`${name}加入了房间`)
            this.subscribeVideo(userId, name, role)
          }
        })
      }
    },
    // 全屏
    fullScreen(id) {
      this.bigVideoClassId = id
    },
    // 连接websocket
    initWebSocket() {
      // initWebSocket(this.$store.state.user.loginId, this.caseId, this.getMessage)
    },
    // 接收消息
    getMessage() {},
    // 禁言
    forbiddenWords(id) {
      const index = this.forbiddenWordsUsers.findIndex(item => item == id)
      if (index == -1) {
        this.forbiddenWordsUsers.push(id)
      } else {
        this.forbiddenWordsUsers.splice(index, 1)
      }
      const time = new Date().getTime()
      const params = {
        from: this.$store.state.user.loginId,
        group_id: this.caseId,
        createTime: time,
        content: {
          text: id,
          loginId: this.loginId,
          type: 'words',
          time: time,
          createTime: formatDate(time),
          messageid: `${this.$store.state.user.loginId}${time}`
        }
      }
      sendMessage(params)
    },
    // 踢人
    kickoutUser(userId) {
      this.myRTC.kickoutUser(userId)
      const time = new Date().getTime()
      const params = {
        from: this.$store.state.user.loginId,
        group_id: this.caseId,
        createTime: time,
        content: {
          text: userId,
          loginId: this.loginId,
          type: 'kickoutUser',
          time: time,
          createTime: formatDate(time),
          messageid: `${this.$store.state.user.loginId}${time}`
        }
      }
      sendMessage(params)
    },
    mute(isMute) {
      this.myRTC.mute(isMute)
    }
  }
}
</script>

<style scoped lang="less">
.video-wrapper {
  width: 100%;
  height: 100%;
  padding: 20px;
  .wrapper-item {
    .title {
      color: #000000;
      font-size: 16px;
      font-weight: bold;
    }
  }
}
.local-player {
  height: 200px;
  width: 100%;
  background-color: #000000;
}
</style>
