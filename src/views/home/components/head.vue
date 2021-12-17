<template>
  <!-- 导航栏 -->
  <div class="header-navigation">
    <div class="headline-name"> <img src="../../../assets/images/home/sign.png"> 翔安区“好厝边”诉非联动平台</div>
    <div class="navigation-bar">
      <a-menu
        mode="horizontal"
        style="background: rgba(254, 219, 207, 0); font-size: 20px; font-family: Source Han Sans CN, Source Han Sans CN-Bold; font-weight: 500;
              color: #fff; "
        @click="handleClick"
      >
        <a-menu-item key="首页"> 首页 </a-menu-item>
        <a-sub-menu @titleClick="titleClick">
          <span slot="title">云上普法</span>

          <a-menu-item key="普法动态"> 普法动态 </a-menu-item>
          <a-menu-item key="普法实例"> 普法实例 </a-menu-item>
          <a-menu-item key="诉讼风险评估"> 诉讼风险评估 </a-menu-item>
          <a-menu-item key="智能问答"> 智能问答 </a-menu-item>
          <a-menu-item key="案例查询"> 案例查询 </a-menu-item>
          <a-menu-item key="法律法规"> 法律法规 </a-menu-item>
        </a-sub-menu>
        <a-sub-menu @titleClick="titleClick">
          <span slot="title">解纷智库</span>

          <a-menu-item key="联动单位"> 联动单位 </a-menu-item>
          <a-menu-item key="解纷组织"> 解纷组织 </a-menu-item>
          <a-menu-item key="解纷员"> 解纷员 </a-menu-item>
        </a-sub-menu>
        <a-sub-menu @titleClick="titleClick">
          <span slot="title">服务指南</span>

          <a-menu-item key="解纷指南"> 解纷指南 </a-menu-item>
          <a-menu-item key="诉状辅助生成"> 诉状辅助生成 </a-menu-item>
          <a-menu-item key="填表指南"> 填表指南 </a-menu-item>
          <a-menu-item key="费用计算器"> 费用计算器 </a-menu-item>
          <a-menu-item key="单位导航"> 单位导航 </a-menu-item>
        </a-sub-menu>
      </a-menu>
      <div class="login" @click="login(3)">
        登录
      </div>
    </div>

  </div>
</template>

<script>
import { Menu } from 'ant-design-vue'
import { mztBackUrl } from '@/api/user/user.js'
export default {
  name: 'SubMenu',
  components: {
    'a-menu': Menu,
    [Menu.Item.name]: Menu.Item,
    [Menu.SubMenu.name]: Menu.SubMenu
  },
  isSubMenu: true,
  props: {
    ...Menu.SubMenu.props,
    menuInfo: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      popup: false

    }
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
          // if (params.type == 3) {
          //   this.$router.push('/collectCase/waitReview').catch(err => err)
          // } else {
          //   this.$router.push('/sfCaseManage/addCaseList').catch(err => err)
          // }
        }
      })
    },
    // 路由跳转
    handleClick(e) {
      console.log('12', e)
      if (e.key == '首页') { this.$router.push('/home') }

      if (e.key == '普法动态') { this.$router.push('/trends/popularization') }
      if (e.key == '普法实例') { this.$router.push('/examples/popularization') }
      if (e.key === '诉讼风险评估') { window.open('http://wxfxpg.susong51.com:7080/ssfxpg-web/web/index?fybh=1698') }
      if (e.key === '智能问答') { window.open('https://web.law.push.aegis-info.com/#/?eventId=521') }
      if (e.key === '案例查询') { window.open('https://www.chinacourt.org/article/subjectdetail/id/MzAwNEiqNIABAA%3D%3D.shtml') }
      if (e.key === '法律法规') { this.$router.push('/laws/regulations') }

      if (e.key === '联动单位') { this.$router.push('/disputeResolution/linkageUnit') }
      if (e.key === '解纷组织') { this.$router.push('/disputeResolution/organization') }
      if (e.key === '解纷员') { this.$router.push('/disputeResolution/solver') }

      if (e.key === '解纷指南') { this.$router.push('/serviceInformation/disputeResolutionGuide') }
      if (e.key === '诉状辅助生成') { this.$router.push('/home') }
      if (e.key === '填表指南') { this.$router.push('/formFillingGuide') }
      if (e.key === '费用计算器') { window.open('http://www.fjcourt.gov.cn/page/work/litigationguide.aspx?lmid=1607&nrid=fyjs') }
      if (e.key === '单位导航') { this.$router.push('/home') }
    },
    titleClick(e) {
      console.log('key', e)
    }
  }
}
</script>

<style scoped lang="less">
// 导航栏
.header-navigation {
  width: 100%;
  background-image: url("../../../assets/images/home/head.png");
  background-repeat: no-repeat;
  background-size: cover;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10%;
  .headline-name {
    display: flex;
    align-items: center;
    font-size: 24px;
    font-family: Source Han Sans CN, Source Han Sans CN-Bold;
    font-weight: 700;
    color: #ffffff;
    img{
      width: 35px;
      height: 35px;
      margin-right: 10px;
      margin: 9px 5px 10px 0;
    }
  }
  .navigation-bar {
    display: flex;
    font-size: 20px;
    font-family: Source Han Sans CN, Source Han Sans CN-Medium;
    font-weight: 500;
    .login{
      cursor: pointer;
      margin: 8px 0;
      padding: 2px 15px;
      color: #fff;
      border: 1px solid #fff;
      border-radius: 8px;
    }
  }
}
/deep/.ant-menu-submenu-title:hover {
     color: #fff;
}
/deep/.ant-menu-horizontal > .ant-menu-item:hover, .ant-menu-horizontal > .ant-menu-submenu:hover, .ant-menu-horizontal > .ant-menu-item-active, .ant-menu-horizontal > .ant-menu-submenu-active, .ant-menu-horizontal > .ant-menu-item-open, .ant-menu-horizontal > .ant-menu-submenu-open, .ant-menu-horizontal > .ant-menu-item-selected, .ant-menu-horizontal > .ant-menu-submenu-selected {
  color: white;
  font-weight: 700;
  border-bottom: none;
}
/deep/.ant-menu-horizontal > .ant-menu-item, .ant-menu-horizontal > .ant-menu-submenu {
  border-bottom: none;
}
/deep/.ant-menu-horizontal {
  border: none;
}
</style>
