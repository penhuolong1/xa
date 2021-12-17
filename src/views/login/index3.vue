<template>
  <div>
    <div class="wrapper">
      <div class="header">
        <div>
          <img src="@/assets/images/login/badge.png">
          <span>翔安区“好厝边”诉非联动平台</span>
        </div>
        <div class="unitlist">
          <a @click="login(3)">法院登录</a>
          <a @click="login(4)">联动单位登录</a>
          <a @click="login(5)">解纷组织登录</a>
          <a @click="login(6)">解纷员登录</a>
          <!-- <a @click="login(6)">当事人登录</a> -->
        </div>
      </div>
      <div class="loginImg" />
      <div class="navigation-wrapper">
        <div class="navigation">
          <span>云上普法</span>
          <span>调解智库</span>
          <span>普法动态</span>
          <span>司法公开</span>
          <span>服务指南</span>
        </div>
      </div>
      <div class="functionList">
        <div class="left" @click="toPath">
          <span class="title">诉讼风险</span>
          <span class="detail">快速问答 智能评估</span>
          <img src="@/assets/images/login/Pre-scene3 1.png">
        </div>
        <div class="right">
          <div class="top">
            <div class="box" @click="toPath1">
              <div class="title">智能问答</div>
              <div class="detail">7*24小时智能咨询</div>
              <img src="@/assets/images/login/tasklists.png">
            </div>
            <div class="box" @click="toPath2">
              <div class="title">普法实例</div>
              <div class="detail">专题分享</div>
              <img src="@/assets/images/login/document.png">
            </div>
          </div>
          <div class="top">
            <div class="box" @click="toPath3">
              <div class="title">案例查询</div>
              <div class="detail">快速查询案例</div>
              <img src="@/assets/images/login/magnifying Glass.png">
            </div>
            <div class="box" @click="toPath4">
              <div class="title">法律法规</div>
              <div class="detail">快速了解法律</div>
              <img src="@/assets/images/login/books.png">
            </div>
          </div>
        </div>
      </div>
      <div class="foot">
        <span>技术支持：厦门纵横集团科技股份有限公司 咨询电话：0592-2952694</span>
      </div>
    </div>
    <Login ref="login" :role="role" :dept-list="deptList" />
  </div>

</template>
<script>
import Login from './components/login.vue'
import { goLogin, mztBackUrl } from '@/api/user/user.js'
export default {
  components: {
    Login
  },
  props: {
  },
  data() {
    return {
      role: 3,
      deptList: []
    }
  },
  created() {
    localStorage.removeItem('xaTokan')
    this.getToken()
  },
  mounted() {
  },
  methods: {
    // 跳转闽政通扫码登录
    login(type) {
      this.role = type
      localStorage.removeItem('')
      location.href = location.origin + '/api/goLogin?type=' + type
    },
    // 获取返回参数后跳转登录
    getToken() {
      console.log(this.$route.query)
      if (!this.$route.query.type || !this.$route.query.trustticket) {
        return
      }
      const params = {
        ...this.$route.query
      }
      mztBackUrl(params).then(async({ code, msg, token, deptList }) => {
        if (code === 200) {
          if (deptList && deptList.length > 0) {
            this.deptList = deptList
            // this.visible1 = true
            this.$refs.login.show1(token)
          } else {
            localStorage.setItem('xaTokan', token)
            await this.$store.dispatch('GetUserInfo')
            if (params.type == 3) {
              this.$router.push('/collectCase/waitReview')
            } else {
              this.$router.push('/sfCaseManage/addCaseList')
            }
          }
        }
      })
    },

    // 诉讼风险评估
    toPath() {
      window.open('http://wxfxpg.susong51.com:7080/ssfxpg-web/web/index?fybh=1698')
    },
    // 智能问答
    toPath1() {
      window.open('https://web.law.push.aegis-info.com/#/?eventId=521')
    },
    // 普法实例
    toPath2() {
      // window.open('http://wxfxpg.susong51.com:7080/ssfxpg-web/web/index?fybh=1698')
    },
    // 案例查询
    toPath3() {
      window.open('https://www.chinacourt.org/article/subjectdetail/id/MzAwNEiqNIABAA%3D%3D.shtml')
    },
    // 法律法规
    toPath4() {
      window.open('https://www.chinacourt.org/law.shtml')
    }
  }
}
</script>

<style scoped lang="less">
.wrapper{
  position:relative;
  min-width: 1200px;
  height: 100vh;
}
.header{
  height: 80px;
  width:100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  img{
    margin: 20px;
  }
  span{
    font-size: 24px;
    font-weight: 700;
    color: rgba(0,0,0,0.85);
  }
  .unitlist{
    margin-right:80px ;
    a{
      margin:50px;
      font-size: 16px;
      font-weight: 400;
      color: rgba(0,0,0,0.85);
    }
  }
}
.loginImg{
  height: 400px;
  width: 100%;
  background-image: url('../../assets/images/login/login2.png');
  background-repeat: no-repeat;
  background-size: 100% 210%;
  background-repeat: no-repeat;
  background-position: 0 -20px;
}
.navigation-wrapper {
  display: flex;
  justify-content: center;
}
.navigation{
  margin-top: -30px;
  width: 60%;
  padding: 0px 100px;
  height: 60px;
  background: #ffffff;
  border-radius: 40px;
  box-shadow: 0px 2px 4px 0px rgba(0,0,0,0.25);
  display: flex;
  align-items: center;
  justify-content: space-between;
  span{
  font-size: 20px;
  font-weight: 700;
  color: rgba(0,0,0,0.85);
  line-height: 40px;
  }
}
.functionList{
  width: 90%;
  height: 310px;
  margin: 30px auto;
  display: flex;
  flex-direction: row;
.left{
  padding: 40px;
  width:50%;
 height: 300px;
  background: linear-gradient(180deg,#65b7f3, #ffffff 100%);
  border-radius: 4px;
  box-shadow: 0px 4px 4px 0px rgba(0,0,0,0.25);
  display: grid;

}
.right{
  margin-left: 20px;
  width:100%;
  min-height: 300px;
  .top{
    width:100%;
    display: inline-flex;
    .box{
      margin:5px;
      padding: 20px;
      height: 140px;
      width: 100%;
      background: rgba(255,255,255,0.85);
      border-radius: 4px;
      box-shadow: 0px 4px 4px 0px rgba(0,0,0,0.25);
      img{
        margin-left:60%;
        margin-top:-80px ;
      }
    }
  }
}
  .title{
    font-size: 20px;
    font-weight: 700;
    color: rgba(0,0,0,0.85);
  }
  .detail{
    font-size: 20px;
    font-weight: 400;
    color: rgba(0,0,0,0.85);
  }
  img{
    margin-left: 30%;
  }

}
.foot{
  width: 100%;
  bottom: 30px;
  font-size: 12px;
  text-align: center;
  // position: fixed;
  font-size: 12px;
  font-weight: 400;
  color: #abafb3;
}

</style>
