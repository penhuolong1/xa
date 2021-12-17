<template>
  <div
    v-show="content"
    class="chat-item-wrapper"
    :class="direction"
  >
    <div
      :id="'chat-item'+content.messageid"
      class="chat-item"
    >
      <div class="avator">
        <div
          class="circle-text role1"
        >
          <!-- {{ content.userName[0] }} -->
        </div>
      </div>
      <div class="content el-dropdown-link">
        <div class="info">
          <div class="name">{{ content.userName }}</div>
          <div
            v-if="content.createTime"
            class="del"
          >{{ content.createTime.substr(11,5) }}</div>
        </div>
        <div class="text">
          <span v-if="content.msgType===0">{{ content.text }}</span>
          <!-- <div
            v-if="content.msgType=='img'"
            class="img-wrapper"
            @click="lookFile(content.text)"
          >
            <img
              :key="index"
              :preview="preview"
              :src="content.text"
            >
          </div> -->
          <div v-if="content.msgType===1">
            <a @click="lookFile(content.text)">{{ getFileName(content.text) }}</a>
          </div>
          <div
            v-if="content.type=='voice'"
            class="voice-wrapper"
          >
            <audio
              :src="serviceUrl+content.src"
              controls
            />
            <div
              v-if="voiceText"
              class="voice-text"
            >{{ voiceText }}</div>
          </div>
        </div>
      </div>
    </div>
    <Preview ref="preview" />
  </div>
</template>

<script>
import {
  BASEIMGURL,
  SERVICEURL,
  OFFICE365RUL,
  OFFICE365ID
} from '@/utils/constVal.js'
import { deleteMessage, userInfo } from '@/api/case/index.js'
import { mapGetters } from 'vuex'
import Preview from '@/components/Preview/index'
export default {
  components: {
    Preview
  },
  props: {
    content: null, // 聊天记录内容
    num: null,
    caseId: null,
    isHistory: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      direction: null, // 聊天记录靠左边还是靠右边
      baseImgUrl: BASEIMGURL,
      preview: new Date().getTime(),
      serviceUrl: SERVICEURL,
      withdrawName: '您',
      voiceText: ''
    }
  },
  computed: {
    ...mapGetters(['getUserInfo']),
    getFileName() {
      return url => {
        return url.split('/').pop()
      }
    }
  },
  watch: {
    content: {
      handler() {
        this.getdirection()
        if (this.$store.state.user.loginId == this.content.loginId) {
          this.withdrawName = '您'
        } else {
          userInfo({ adminId: this.content.loginId, caseId: this.caseId }).then(
            res => {
              this.withdrawName = res.result.name
            }
          )
        }
      },
      deep: true
    }
  },
  created() {
    this.getdirection()
  },
  mounted() {},
  methods: {
    getdirection() {
      if (!this.content) {
        return
      }
      if (this.getUserInfo.user.userId === this.content.loginId) {
        this.direction = 'directionLeft'
      }
    },
    // 删除聊天记录
    delMessage(messageid) {
      document.getElementById(`chat-item${messageid}`).remove()
      setTimeout(() => {
        deleteMessage({ messageid }).then(res => {
          console.log(res)
        })
      }, 30000)
    },
    // 撤回
    withdraw(messageid) {
      const nowTime = new Date().getTime()
      const sendTime = new Date(this.content.createTime).getTime()
      if (nowTime - sendTime > 12000) {
        this.$message({
          showClose: true,
          message: '超过2分钟不能撤回',
          type: 'error'
        })
        return
      }
      setTimeout(() => {
        deleteMessage({ messageid }).then(res => {
          console.log(res)
        })
      }, 30000)
      this.$emit('withdraw', messageid)
    },
    // 转文本
    translateText() {
      if (!this.content.text) {
        this.$message({
          showClose: true,
          message: '转文本失败',
          type: 'error'
        })
      } else {
        this.voiceText = this.content.text
      }
    },
    // 查看文件
    lookFile(file) {
      this.$refs.preview.show(file, [])
    }
  }
}
</script>

<style scoped lang="less">
.chat-item-wrapper {
  margin-bottom: 20px;
  &.directionLeft {
    .chat-item {
      flex-direction: row-reverse;
      .content {
        padding-right: 15px;
      }
      .info {
        flex-direction: row-reverse;
      }
    }
  }
  .chat-item {
    display: flex;
    .avator {
      width: 50px;
      & > div {
        width: 50px;
        height: 50px;
        line-height: 50px;
        font-size: 14px;
        text-align: center;
        background-color: #73d500;
      }
      .circle-text {
        border-radius: 50%;
        background: #dddfe1;
        p {
          line-height: 15px;
          &:first-child {
            padding-top: 10px;
          }
        }
      }
    }
    .content {
      padding-left: 15px;
      .info {
        display: flex;
        margin-bottom: 5px;
        justify-content: space-between;
        .name {
          font-size: 15px;
          color: #192a46;
        }
        .del {
          color: #828d99;
          font-size: 13px;
          cursor: pointer;
        }
      }
      .text {
        line-height: 20px;
        padding: 15px;
        min-width: 200px;
        font-size: 14px;
        color: rgba(0,0,0,0.85);
        background: #f5f6f7;
        max-width: 400px;
        word-break: break-word;
        white-space: pre-wrap;
      }
      .img-wrapper {
        img {
          display: block;
          max-width: 300px;
          margin-top: 10px;
        }
      }
      .file-wrapper {
        width: 200px;
        height: 300px;
        position: relative;
      }
    }
  }
}
.withdraw-wrapper {
  text-align: center;
  margin-bottom: 5px;
  .text {
    display: inline-block;
    color: white;
    font-size: 12px;
    background: #dadada;
    padding: 2px 5px;
    border-radius: 3px;
  }
}
</style>
