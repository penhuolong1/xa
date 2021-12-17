<template>
  <!-- 悬浮侧边栏 -->
  <div>
    <div class="figureInner-sidebar">
      <img
        class="avatarImg"
        src="@/assets/images/login-home/AvatarLogin.png"
        alt="头像"
      >
      <div class="lower-sidebar">
        <img
          class="iconImg iconImg1"
          src="@/assets/images/login-home/UnSmartQA.png"
          alt="智能问答"
          @click="toPath1"
          @mouseenter="showLog"
          @mouseleave="closeLog"
        >
        <img
          class="iconImg iconImg2"
          src="@/assets/images/login-home/UnQRCode.png"
          alt="二维码"
          @mouseenter="showCodeLog"
          @mouseleave="closeCodeLog"
        >
      </div>
    </div>
    <div v-show="popup" class="location">
      <div class="pop-ups">
        <div class="top-title">智能问答</div>
        <div class="bottom-title">快速智能问答，解决困惑</div>
      </div>
    </div>
    <div v-show="code" class="code">
      <div class="pop-ups">
        <img src="" alt="" height="140px" width="140px">
        <div class="top-title">翔安诉非小程序</div>
        <div class="bottom-title">快速智能问答，解决困惑</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      popup: false,
      code: false
    }
  },
  methods: {
    showLog() {
      this.popup = true
    },
    closeLog() {
      this.popup = false
    },
    // 智能问答
    toPath1() {
      window.open('https://web.law.push.aegis-info.com/#/?eventId=521')
    },
    // 二维码
    showCodeLog() {
      this.code = true
    },
    closeCodeLog() {
      this.code = false
    }
  }
}
</script>

<style lang="less" scoped>
// 图内侧边栏
.figureInner-sidebar {
  right: 40px;
  position: fixed;
  bottom: 250px;
  top: 482px;
  z-index: 8888;
  .avatarImg {
    position: relative;
    width: 64px;
    height: 64px;
    border-radius: 50%;
    //   background: #409eff;
    background: #ffffff;
    border: 5px solid #ffffff;
    box-shadow: 0px 4px 20px 0px rgba(29,49,117,0.10);
  }
  .lower-sidebar {
    position: relative;
    margin-top: 20px;
    width: 64px;
    height: 130px;
    background: #ffffff;
    border-radius: 75px;
    box-shadow: 0px 4px 20px 0px rgba(29,49,117,0.10);
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: space-around;
    .iconImg {
      border-radius:50%;
      width: 48px;
      height: 48px;
      box-shadow: 0px 0px 20px 0px rgba(29, 49, 117, 0.1);
      cursor: pointer;
    }
    .iconImg1:hover {
      content: url(../../../assets/images/login-home/SmartQA.png);
    }
    .iconImg2:hover {
      content: url(../../../assets/images/login-home/QRCode.png);
    }
  }
}
//弹窗
.location {
  right: 125px;
  position: fixed;
  bottom: 260px;
  top: 565px;
  z-index: 8888;
  .pop-ups {
    position: relative;
    background: #ffffff;
    border-radius: 8px;
    box-shadow: 0px 4px 20px 0px rgba(29, 49, 117, 0.1);
    padding: 20px 10px;
    width: 100%;
    .top-title {
      font-size: 14px;
      font-family: Source Han Sans CN, Source Han Sans CN-Medium;
      font-weight: 500;
      color: #409eff;
    }
    .bottom-title {
      width: 160px;
      margin-top: 4px;
      font-size: 12px;
      font-family: Source Han Sans CN, Source Han Sans CN-Regular;
      font-weight: 400;
      color: #909399;
    }
  }
}
//弹窗
.code {
  right: 125px;
  position: fixed;
  top: 630px;
  z-index: 8888;
  .pop-ups {
    position: relative;
    background: #ffffff;
    border-radius: 8px;
    box-shadow: 0px 4px 20px 0px rgba(29, 49, 117, 0.1);
    padding: 15px 20px;
    width: 100%;
    .top-title {
      font-size: 14px;
      font-family: Source Han Sans CN, Source Han Sans CN-Medium;
      font-weight: 500;
      color: #409eff;
    }
    .bottom-title {
      margin-top: 4px;
      font-size: 12px;
      font-family: Source Han Sans CN, Source Han Sans CN-Regular;
      font-weight: 400;
      color: #909399;
    }
  }
}
</style>

