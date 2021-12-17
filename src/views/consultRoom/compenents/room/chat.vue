<template>
  <div class="chat-wrapper">
    <div class="chat-record-wrapper">
      <chatItem
        v-for="(item, index) in historyList"
        :id="'chatItem'+item.content.time"
        :key="'a'+index"
        :direction="direction"
        :content="item.content"
        :num="index"
        :is-history="true"
      />
      <div id="newMsg" class="tip">
        <div class="label">新消息</div>
        <div class="line" />
      </div>
      <chatItem
        v-for="(item, index) in chatRecordList"
        :id="'chatItem'+item.time"
        :key="index"
        :direction="direction"
        :content="item"
        :num="index"
        :case-id="caseId"
      />
    </div>
    <div class="time-division">
      <!-- <div class="time">{{ time }}</div> -->
      <div class="line" />
    </div>
    <div class="chat-send-wrapper">
      <TextArea
        v-model="chatContent"
        class="textarea"
        :rows="4"
        placeholder="请输入消息内容,回车键快捷发送,换行使用shift+enter"
        @keyup.enter.native="enterSend"
      />
      <div class="button-wrapper">
        <div class="img-wrapper" @click="upload">
          <img src="@/assets/icons/file1.png" alt="">
        </div>
        <input ref="file" type="file" accept=".jpg, .jpeg, .png, .doc, .docx, .xls, .xlsx,.pdf" style="display:none;" @change="getFile($event)">
        <div class="button" @click="send">发送</div>
      </div>
    </div>
  </div>
</template>

<script>
import { Input, Button } from 'ant-design-vue'
import { initWebSocket, sendMessage, groupUser, exitGroup } from '@/utils/socket.js'
import { formatDate } from '@/utils/format.js'
// import { getChatGroup } from '@/api/rtcRoom/rtcRoom.js'
import chatItem from './chatItem'
import { mapGetters } from 'vuex'
import { validNull } from '@/utils/validate.js'
import { chatUploadFile, listChatMessage } from '@/api/addCase/index.js'
export default {
  components: {
    chatItem,
    TextArea: Input.TextArea,
    Button
  },
  props: {
    caseId: null,
    imgArray: null, // 父组件传来的聊天图片地址
    uploadFileUrl: null // 父组件传来的附件地址
  },
  data() {
    return {
      chatContent: '',
      direction: 'directionLeft',
      loginId: null, // 登陆ID
      chatRecordList: [
      ], // 聊天记录
      websock: null,
      chatRecordListUserId: [], // 聊天记录人的ID
      imgArrayData: null, // 接收组件传来的聊天的图片
      loginUserInfo: null, // 登陆人信息
      uploadFileUrlData: null,
      time: formatDate(new Date().getTime()),
      historyList: [], // 聊天记录
      isMute: false, // 是否被禁言
      chatRoomId: '' // 聊天室id
    }
  },
  computed: {
    ...mapGetters(['getTeamData', 'getLawCaseId', 'getUserInfo', 'getSfLawCaseId', 'getTeamId'])
  },
  watch: {
    getUserInfo() {
      this.initSocket()
    },
    imgArray: {
      handler() {
        this.imgArrayData = []
        this.imgArrayData = this.imgArray
        this.imgArrayData.forEach(item => {
          const time = new Date().getTime()
          const params = {
            from: this.loginId,
            group_id: this.caseId,
            createTime: time,
            content: {
              userName: this.loginUserInfo.result.name,
              role: this.loginUserInfo.roleType,
              text: item,
              loginId: this.loginId,
              type: 'img',
              createTime: formatDate(time),
              time,
              messageid: `${this.loginId}${time}`
            }
          }
          sendMessage(params)
        })
      },
      deep: true
    },
    uploadFileUrl() {
      // 附件地址
      this.uploadFileUrlData = []
      this.uploadFileUrlData = this.uploadFileUrl
      this.uploadFileUrlData.forEach(item => {
        const time = new Date().getTime()
        const params = {
          from: this.loginId,
          group_id: this.caseId,
          createTime: time,
          content: {
            userName: this.loginUserInfo.result.name,
            role: this.loginUserInfo.roleType,
            fileName: item.split('/').pop(),
            text: item,
            loginId: this.loginId,
            type: 'file',
            time,
            createTime: formatDate(time),
            messageid: `${this.loginId}${time}`
          }
        }
        sendMessage(params)
      })
    }
  },
  created() {
    // if (this.$route.query.type == 2) {
    //   this.chatRoomId = this.getSfLawCaseId
    // } else if (this.$route.query.type == 3) {
    //   this.chatRoomId = this.getTeamId
    // } else {
    //   this.chatRoomId = this.getLawCaseId
    // }
    this.websock = null
    this.chatRoomId = this.$route.query.chatRoomId
    this.initSocket()
    this.getLoginId()
    this.loginUserInfo = this.$store.state.user.userInfo
    this._getHistory()
  },
  mounted() {
  },
  methods: {
    // 接收聊天记录
    getMessage(e) {
      const data = JSON.parse(e.data)
      console.log('-socket的信息--')
      console.log(data)
      if (data.command == 18) {
        // 获取在线人数
        const users = data.data.groups.find(item => item.groupId === this.chatRoomId).users
        console.log('----获取在线人数----')
        console.log(users)
        this.$emit('groupUser', users)
      }
      if (data.command === 9) {
        // 有人加入群聊
        this.getGroupUser()
      }
      if (data.command === 10) {
        // 有人退出群聊
        this.getGroupUser()
      }
      if (data.command === 11) {
        console.log(data.data)
        const content = {
          text: data.data.content,
          msgType: data.data.msgType,
          ...data.data.extras
        }
        const time = new Date().getTime()
        content.time = time
        this.chatRecordList.push(content)
        this.$nextTick(() => {
          document.getElementById(`chatItem${time}`).scrollIntoView()
        })
      }
    },
    // 回车发送消息
    enterSend(event) {
      if (event.shiftKey && event.keyCode == 13) {
        // 不需要执行任何代码。会自动换行
      } else if (event.keyCode == 13) {
        this.send() // 提交的发送消息函数
      }
    },
    send() {
      if (validNull(this.chatContent)) {
        this.$message.error('请先输入发送内容')
        this.chatContent = ''
        return
      }
      const time = new Date().getTime()
      const params = {
        from: this.getUserInfo.user.userId,
        group_id: this.chatRoomId,
        msgType: 0,
        createTime: time,
        content: this.chatContent,
        extras: {
          userName: this.getUserInfo.user.nickName,
          loginId: this.getUserInfo.user.userId,
          time,
          msgType: 0,
          createTime: formatDate(time),
          messageid: `${this.getUserInfo.user.userId}${time}`
        }
      }
      sendMessage(params)
      this.chatContent = ''
      this.$forceUpdate()
    },
    // 获取群组在线人数
    getGroupUser() {
      const params = {
        userId: this.getUserInfo.user.userId
      }
      groupUser(params)
    },
    initSocket() {
      if (!this.getUserInfo.user || !this.getUserInfo.user.userId) {
        return
      }
      if (this.websock) {
        return
      }
      this.websock = initWebSocket(this.getUserInfo.user.userId, this.chatRoomId, this.getMessage)
    },
    getLoginId() {
      this.loginId = this.$store.state.user.loginId
    },
    uploadImg() {
      this.$emit('uploadImg')
    },
    // 显示在线视频
    showVideo() {
      const time = new Date().getTime()
      const params = {
        from: this.loginId,
        group_id: this.caseId,
        createTime: time,
        content: {
          userName: this.loginUserInfo.result.name,
          role: this.loginUserInfo.roleType,
          text: '调解员已开启视频调解，点击下方视频按钮进入视频调解',
          loginId: this.loginId,
          type: 'text',
          time: time,
          createTime: formatDate(time),
          messageid: `${this.loginId}${time}`
        }
      }
      if (this.$store.state.user.userInfo.roleType != 3 && this.getTeamData != 2) { // 当事人打开视频不要发通知
        sendMessage(params)
      }
      this.$emit('showVideo')
    },
    // 显示附件上传
    showFile() {
      this.$emit('showFile')
    },
    // 上传文书
    upload() {
      const event2 = document.createEvent('MouseEvents')
      event2.initEvent('click', false, true)
      this.$refs.file.dispatchEvent(event2)
    },
    // 上传文件
    getFile(e) {
      const file = e.target.files[0]
      if (!file) return
      console.log(file)
      const param = new FormData() // 创建form对象
      param.append('file', file) // 通过append向form对象添加数据
      const hide = this.$message.loading('正在上传')
      chatUploadFile(param).then(({ code, msg, data }) => {
        hide()
        if (code === 200) {
          this.$refs.file.value = ''
          this.$message.success(msg)
          const time = new Date().getTime()
          const path = data.path
          const fileName = data.path.split('/').pop()
          const params = {
            from: this.getUserInfo.user.userId,
            group_id: this.chatRoomId,
            msgType: 1, // 文件
            createTime: time,
            content: path,
            extras: {
              userName: this.getUserInfo.user.nickName,
              loginId: this.getUserInfo.user.userId,
              time,
              fileName,
              msgType: 1, // 文件
              createTime: formatDate(time),
              messageid: `${this.getUserInfo.user.userId}${time}`
            }
          }
          sendMessage(params)
        }
      })
    },
    // 获取聊天记录
    _getHistory() {
      const params = {
        lawCaseId: this.chatRoomId
      }
      listChatMessage(params).then(res => {
        if (res.code === 200) {
          this.historyList = res.data.map(item => {
            item.extras = JSON.parse(item.extras)
            item.content = {
              text: item.content,
              msgType: item.msgType,
              ...item.extras
            }
            return item
          })
          console.log(this.historyList)
          setTimeout(() => {
            document.getElementById('newMsg').scrollIntoView()
          }, 200)
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
.chat-wrapper {
  .chat-record-wrapper {
    width: 100%;
    height: calc(100vh - 400px);
    overflow-y: auto;
    overflow-x: hidden;
    padding: 20px 30px;
  }
  .time-division {
    position: relative;
    height: 16px;
    .time {
      position: absolute;
      z-index: 2;
      background-color: #fff;
      left: 20px;
      color: #414d55;
      padding: 0 5px;
      font-size: 12px;
    }
    .line {
      position: relative;
      top: 10px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    }
  }
  .chat-send-wrapper {
    width: 100%;
    padding: 20px;
    .img-group {
      & > img {
        cursor: pointer;
        height: 20px;
        margin-right: 15px;
      }
    }
    .el-textarea {
      margin-top: 10px;
      margin-bottom: 10px;
      .el-textarea__inner {
        border: none;
        padding: 0px;
        resize: none;
      }
    }
    .button-wrapper {
      overflow: hidden;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 10px;
      .img-wrapper {
        cursor: pointer;
        img {
          width: 24px;
        }
      }
      .button {
        float: right;
        background-color: @theme-color;
        cursor: pointer;
        color: #fff;
        width: 78px;
        text-align: center;
        font-weight: bold;
        font-size: 12px;
        line-height: 38px;
        border-radius: 16px;
      }
    }
  }
}
.tip {
  width: 100%;
  text-align: center;
  margin-bottom: 10px;
  color: rgba(0,122,255,1);
  font-size: 14px;
  .label {
    position: relative;
    z-index: 2;
    background-color: white;
    display: inline-block;
    padding: 0px 20px;
  }
  .line {
    position: relative;
    top: -8px;
    border-bottom: 1px dashed #dddfe1;
    z-index: 1;
  }
}
.textarea {
  height: 100px;
  border: none;
  resize: none;
  background: rgba(143,146,161, 0.05);
  &:focus {
    box-shadow: none;
  }
}
</style>
