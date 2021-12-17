<template>
  <div>

    <div class="header">
      <div class="btnList">
        <Button type="primary" @click="login(1)">单位登录</Button>
        <Button type="blue4" @click="login(1)">当事人登录/注册</Button>
      </div>
      <Login ref="login" :role="role" />

    </div>
    <div class="flex">
      <div v-for="(item, index) in list" :key="index" class="flex-1 flex items-center justify-center m-2.5">
        <img :src="item">
      </div>
    </div>
    <div class="wrapper">
      <div class="flex">
        <div class="flex-1  mr-10 left flex">
          <img class="imgSize " src="@/assets/images/login/arrow.png">
          <span class="text ">普法动态</span>
        </div>
        <div class="flex-1 right flex">
          <img class="imgSize" src="@/assets/images/login/arrow.png">
          <span class="text">云上普法</span>
        </div>
      </div>
      <div class="flex">
        <div class="flex-1 mr-10 message-left divide-y divide-fuchsia-300 ">

          <div class="flex-1 p-10 ">
            <div class="message">{{ message }}</div>
            <div class="notice mt-5">
              <div class="notice-text">最新公告</div>
            </div>
          </div>
          <div class="flex-1 p-10">
            <div class="message">{{ message }}</div>
            <div class="notice mt-5">
              <div class="notice-text ">最新公告</div>
            </div>
          </div>
          <div class="flex-1 p-10">
            <div class="message">{{ message }}</div>
            <div class="notice mt-5">
              <div class="notice-text">最新公告</div>
            </div>
          </div>
        </div>

        <div class="flex-1 right">
          <div class="flex">
            <div class="content flex-1 ">
              <div class="flex-1  p-10" @click="toPath">
                <div class="title">诉讼风险评估</div>
                <div class="title-detail mt-5">快速问答 智能评估</div>
                <img class="title-pic mt-10 -mr-5" src="@/assets/images/login/pic1.png">
              </div>
            </div>
            <div class="flex-1 ml-2">
              <div class="detail-right p-5" @click="toPath1">
                <div class="title">智能问答</div>
                <div class="title-detail mt-5">7*24小时智能咨询</div>
                <img class="title-img -mt-20 mr-0 " src="@/assets/images/login/pic2.png">
              </div>
              <div class="detail-right mt-5 p-5">
                <div class="title">普法实例</div>
                <div class="title-detail mt-5">专题分享</div>
                <img class="title-img -mt-20 mr-0" src="@/assets/images/login/pic3.png">
              </div>
            </div>
          </div>
          <div class="flex">
            <div class="detail-bottom mt-5 mr-2 p-5">
              <div class="title">案例查询</div>
              <div class="title-detail mt-5">快速查询案例</div>
              <img class="title-img -mt-20 mr-0" src="@/assets/images/login/search.png">
            </div>
            <div class="detail-bottom mt-5 p-5">
              <div class="title">法律法规</div>
              <div class="title-detail mt-5">快速了解法律</div>
              <img class="title-img -mt-20 mr-0" src="@/assets/images/login/pic4.png">
            </div>
          </div>

        </div>
      </div>
      <div class="flex">
        <div class="flex-1 sub-title flex">
          <img class="imgSize" src="@/assets/images/login/arrow.png">
          <span class="text">司法公开</span>
        </div>
        <div class="flex-1 sub-title flex">
          <img class="imgSize" src="@/assets/images/login/arrow.png">
          <span class="text">服务指南</span>
        </div>
      </div>
      <div>
        <div class="flex">
          <div v-for="item in list1" :key="item" class="flex-1 flex items-center justify-center m-2.5">
            <img :src="item">
          </div>
        </div>
        <div class="flex -my-20">
          <div v-for="item in list2" :key="item.value" class="flex-1 flex items-center justify-center m-2.5">
            <div class="detail">{{ item.value }}</div>
          </div>
        </div>
      </div>
    </div>
    <NormalRegister />
    <LegalRegister />

  </div>
</template>
<script>
import { Button } from 'ant-design-vue'
import Login from './components/login.vue'
import NormalRegister from './components/normalRegister.vue'
import LegalRegister from './components/legalRegister.vue'

export default {
  components: {
    Button,
    Login,
    NormalRegister,
    LegalRegister
  },
  props: {
  },
  data() {
    return {
      message: '今天星期三',
      list: [
        require('@/assets/images/login/unit.png'),
        require('@/assets/images/login/organization.png'),
        require('@/assets/images/login/people.png')
      ],
      list1: [
        require('@/assets/images/login/progress.png'),
        require('@/assets/images/login/live.png'),
        require('@/assets/images/login/formGuide.png'),
        require('@/assets/images/login/disputeGuide.png'),
        require('@/assets/images/login/notice.png'),
        require('@/assets/images/login/navigation.png'),
        require('@/assets/images/login/Frame.png'),
        require('@/assets/images/login/Frame.png')
      ],
      list2: [{
        value: '流程公开'
      },
      {
        value: '裁判文书网'
      }, {
        value: '庭审直播网'
      }, {
        value: '法院公告网'
      }, {
        value: '纠纷指南'
      }, {
        value: '填表指南'
      }, {
        value: '诉讼费计算'
      }, {
        value: '法院导航'
      }],
      role: 1 // 1机构 2当事人
    }
  },
  created() {
    localStorage.removeItem('xaTokan')
  },
  mounted() {
  },
  methods: {
    login(type) {
      this.role = type
      this.$refs.login.show()
    },
    toPath() {
      window.open('http://wxfxpg.susong51.com:7080/ssfxpg-web/web/index?fybh=1698')
    }
  }
}
</script>

<style scoped lang="less">
.-mt-20 {
  margin-top: -5rem;
}
.ml-2 {
  margin-left: 0.5rem;
}
.mr-2 {
  margin-right: 0.5rem;
}
.header {
  height: 600px;
  width: 100%;
  background-image: url('../../assets/images/login/header.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
    position: relative;

}
.wrapper{
  padding: 0 100px;
}
.btnList{
    position: absolute;
    left: 50%;
    bottom: 100px;
    margin-left: -130px;
    .ant-btn{
      margin:10px;
    }
  }
.flex,.flex-1 {
  min-height: 100px;
}

.imgSize{
  width: 48px;
  height: 20px;
  margin-top:38px;
  margin-left:20px ;
  }
.text{
  margin-top:25px;
  font-size: 30px;
  font-weight: 700;
  text-align: CENTER;
  color: rgba(0,0,0,0.85);
}
.detail{
font-size: 20px;
font-weight: 400;
text-align: RIGHT;
color: rgba(0,0,0,0.80);
line-height: 30px;
}
.message{
font-size: 20px;
font-weight: 400;
color: rgba(0,0,0,0.80);
line-height: 22px;
}
.notice{
  background: rgba(101,191,115,0.10);
  display: inline-flex;
  .notice-text{
font-size: 20px;
font-weight: 400;
text-align: left;
color: #65bf73;
  }
}
.message-left{
  border: 1px solid #c4c4c4;
  border-radius: 4px;
}
.content{
  width: 50%;
  min-height: 269px;
  background: linear-gradient(180deg,#65b7f3, #ffffff 100%);
  box-shadow: 0px 4px 4px 0px rgba(0,0,0,0.25);
  border-radius: 4px;
}
.title-pic{
  width: 220px;
    height: 127px;
    float: right;
}
.title-img{
    width: 96px;
    height: 96px;
    float: right;
  }
  .title{
    font-size: 20px;
    font-weight: 700;
    color: rgba(0,0,0,0.85);
  }
  .title-detail{
    font-size: 20px;
    font-weight: 400;
    color: rgba(0,0,0,0.85);
  }
.message-right{
  // width:50%;
  height: 70%;
  margin: 10px 0;
  background: rgba(255,255,255,0.85);
  box-shadow: 0px 4px 4px 0px rgba(0,0,0,0.25);
  border-radius: 4px;
}
.detail-right{
  width: 100%;
  height: 126px;
  background: rgba(255,255,255,0.85);
  box-shadow: 0px 4px 4px 0px rgba(0,0,0,0.25);
  border-radius: 4px;
}
.detail-bottom{
  background: rgba(255,255,255,0.85);
  box-shadow: 0px 4px 4px 0px rgba(0,0,0,0.25);
  border-radius: 4px;
  width: 100%;
  height: 126px;
}

</style>
