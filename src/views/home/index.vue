<template>
  <div>
    <div id="login-wrapper" class="wrapper">
      <!-- 头部 -->
      <div>
        <Head />
      </div>
      <Carousel />
      <!-- 中间数据 -->
      <div class="content-data">
        <div class="inside">
          <div
            v-for="(item, index) in list"
            :key="index"
            :class="item.type === 'line' ? 'right-line' : 'inside-item'"
          >
            <div v-if="item.type !== 'line'" class="flex-column">
              <div class="number">
                {{ item.number }} <span>{{ item.unit }}</span>
              </div>
              <div class="name"><img :src="item.photo">{{ item.name }}</div>
              <button v-bind="item" @click="handleButton(item)">
                {{ item.button }}
              </button>
            </div>
          </div>
        </div>
      </div>
      <!-- 普法动态 -->
      <Headline title="普法动态" />
      <div class="content-dynamic-inf">
        <div class="left">
          <div class="upper" />
          <div class="lower">
            翔安区法院召开会议工作调研座谈会，翔安区法院召开会议工作调研座谈会，翔安区法院召开会议工作调研座谈会翔安区法院召开会议工作调研座谈会...
          </div>
        </div>
        <div class="right">
          <div class="top-line" />
          <div class="center">
            <div class="center-left">最近动态</div>
            <div class="center-right" @click="handleSeeMore">
              查看更多<a-icon type="right" />
            </div>
          </div>

          <div
            v-for="(item, index) in searchResult"
            :key="index"
            v-bind="item"
            class="bottom"
            @click="handleDetails(item)"
          >
            <div class="bottom-left">
              <div class="day">{{ item.day }}</div>
              <div class="years">{{ item.years }}</div>
            </div>
            <div class="bottom-right">
              <div class="right-top">{{ item.popularizationTitle }}</div>
              <div v-if="item.popularizationSendDept" class="right-bottom">
                发布单位：{{ item.popularizationSendDept }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 常用工具 -->
      <Headline title="常用工具" />
      <Tools />
      <!-- 解纷流程 -->
      <div class="content-dispute-step">
        <Headline title="解纷流程" />
        <img
          src="../../assets/images/login-home/DisputeResolutionProcess.png"
          alt="解纷流程"
        >
      </div>
      <!-- 解纷单位导航 -->
      <div style="margin-top: 20px" />
      <Headline title="解纷单位导航" />
      <Navigation />
      <!-- 中间底部 -->
      <div class="picture">
        <div class="pictureImg">
          <div class="center-below">
            <a
              href="https://splcgk.court.gov.cn/gzfwww/"
              target="_blank"
            >中国审判流程信息公开网</a>
            <div class="left-line" />
            <a
              href="http://tingshen.court.gov.cn/"
              target="_blank"
            >中国庭审公开网</a>
            <div class="left-line" />
            <a
              href="https://wenshu.court.gov.cn/"
              target="_blank"
            >中国裁判文书网</a>
            <div class="left-line" />
            <a
              href="http://zxgk.court.gov.cn/"
              target="_blank"
            >中国执行信息公开网</a>
            <div class="left-line" />
            <a
              href="http://www.xiangan.gov.cn/"
              target="_blank"
            >厦门市翔安区人民政府</a>
          </div>
        </div>
      </div>
      <!-- 底部 -->
      <Footer />
    </div>
    <!-- 悬浮 -->
    <Service />
  </div>
</template>

<script>
import { Icon } from 'ant-design-vue'
import Navigation from './components/navigation.vue'
import Footer from './components/footer.vue'
import Headline from './components/headline.vue'
import Service from './components/customerService.vue'
import Tools from './components/commonTools.vue'
import Head from './components/head1.vue'
import Carousel from './components/carousel.vue'
import { info, popularization } from '@/api/home/index.js'
export default {
  name: 'SubMenu',
  components: {
    'a-icon': Icon,
    Navigation,
    Footer,
    Head,
    Headline,
    Service,
    Tools,
    Carousel
  },
  isSubMenu: true,
  props: {
    menuInfo: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      list: [
        {
          number: '768',
          unit: '件',
          photo: require('@/assets/icons/guarantee.png'),
          name: '纠纷受理',
          button: '提交纠纷'
        },
        {
          type: 'line'
        },
        {
          number: '678',
          unit: '家',
          photo: require('../../assets/icons/Thecourt.png'),
          name: '联动单位',
          button: '查看单位'
        },
        {
          type: 'line'
        },
        {
          number: '322',
          unit: '个',
          photo: require('../../assets/icons/organization.png'),
          name: '解纷组织',
          button: '查看组织'
        },
        {
          type: 'line'
        },
        {
          number: '678',
          unit: '名',
          photo: require('../../assets/icons/member.png'),
          name: '解纷员',
          button: '查看解纷员'
        }
      ],
      searchResult: []
    }
  },
  mounted() {
    this.getList()
    this.popularizaList()
  },
  methods: {
    closepopup() {
      this.popup = false
    },
    showpopup() {
      this.popup = true
    },
    handleButton(e) {
      console.log('11', e)
      if (e.button === '查看单位') {
        this.$router.push('/disputeResolution')
      }
      if (e.button === '查看组织') {
        this.$router.push('/disputeResolutionOrganization')
      }
      if (e.button === '查看单位') {
        this.$router.push('/disputeBreaker')
      }
    },
    // 中间数据
    async getList() {
      const params = {}
      info(params).then(({ code, data }) => {
        if (code === 200) {
          this.list.map((item) => {
            if (item.name === '纠纷受理') {
              item.number = data.resolveCaseCount
            }
            if (item.name === '联动单位') {
              item.number = data.unitCount
            }
            if (item.name === '解纷组织') {
              item.number = data.orgCount
            }
            if (item.name === '解纷员') {
              item.number = data.mediatorCount
            }
          })
        }
      })
    },
    // 查看更多
    handleSeeMore() {
      this.$router.push('/home')
    },
    // 普法动态
    async popularizaList() {
      const params = {
        keyword: '',
        pageNumber: '',
        pageSize: 4
      }
      popularization(params).then(({ code, data }) => {
        if (code === 200) {
          this.searchResult = data.searchResult.map((item) => {
            item.popularizationSendTime = item.popularizationSendTime
              ? this.$moment(item.popularizationSendTime).format('YYYY-MM-DD')
              : ''
            item.day = item.popularizationSendTime.substr(8, 10)
            item.years = item.popularizationSendTime.substr(0, 7)
            return item
          })
          console.log('infoArr', this.infoArr)
        }
      })
    },
    // 普法动态详情
    handleDetails(item) {
      this.$router.push(
        `/popularizationLawDetails?id=${item.popularizationId}`
      )
    }
  }
}
</script>

<style scoped lang="less">
.wrapper {
  position: relative;
  min-width: 1200px;
  height: 100vh;
}
// 中间数据

.content-data {
  width: 80%;
  margin: 40px auto;
  .inside {
    .inside-item {
      display: flex;
    }
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .right-line {
      height: 88px;
      border-right: 1px solid rgba(51, 51, 51, 0.2);
      margin: 40px auto;
    }
    .flex-column {
      display: flex;
      flex-direction: column;
      align-items: center;
      .number {
        font-size: 40px;
        font-family: Source Han Sans CN, Source Han Sans CN-Bold;
        font-weight: 700;
        color: #606266;
        span {
          font-size: 20px;
          font-family: Source Han Sans CN, Source Han Sans CN-Bold;
          font-weight: 700;
          color: #606266;
        }
      }
      .name {
        font-size: 24px;
        font-family: Source Han Sans CN, Source Han Sans CN-Medium;
        font-weight: 500;
        color: #909399;
        margin-bottom: 20px;
        img {
          margin-right: 5px;
          width: 24px;
          height: 24px;
          margin-bottom: 8px;
        }
      }
      button {
        width: 144px;
        height: 48px;
        background: #fff;
        border: 1px solid #dcdfe6;
        border-radius: 8px;
        font-size: 18px;
        font-family: Source Han Sans CN, Source Han Sans CN-Medium;
        font-weight: 500;
        color: #c0c4cc;
      }
      button:hover {
        cursor: pointer;

        background: #409eff;
        border: 1px solid #409eff;
        border-radius: 8px;
        font-family: Source Han Sans CN, Source Han Sans CN-Medium;
        font-weight: 500;
        color: #fff;
      }
    }
  }
}
// 普法动态
.content-dynamic-inf {
  width: 80%;
  margin: 0 auto 80px;
  display: flex;
  flex-direction: row;
  .left {
    width: 50%;
    display: grid;
    .upper {
      height: 360px;
      background-size: cover;
      background: linear-gradient(71deg, #187ed2 0%, #68c0ff 100%);
    }
    .lower {
      margin-top: 40px;
      font-size: 14px;
      font-family: Source Han Sans CN, Source Han Sans CN-Regular;
      font-weight: 400;
      color: #909399;
    }
  }
  .right {
    margin-left: 20px;
    width: 50%;
    min-height: 300px;
    .top-line {
      border-top: 8px solid #409eff;
    }
    .center {
      margin: 10px auto;
      display: flex;
      justify-content: space-between;
      .center-left {
        margin-top: 10px;
        font-size: 20px;
        font-family: Source Han Sans CN, Source Han Sans CN-Bold;
        font-weight: 700;
        color: #606266;
      }
      .center-right {
        margin-top: 15px;
        font-size: 14px;
        font-family: Source Han Sans CN, Source Han Sans CN-Medium;
        font-weight: 500;
        color: #c0c4cc;
        cursor: pointer;
      }
    }
    .bottom:hover {
      margin-top: 10px;
      width: 100%;
      height: 104px;
      background: #fbfbfb;
      display: flex;
      flex-direction: row;
    }
    .bottom {
      margin-top: 10px;
      width: 100%;
      height: 88px;
      display: flex;
      flex-direction: row;
      cursor: pointer;
      .bottom-left {
        width: 20%;
        border-right: 1px solid #dcdfe6;
        text-align: right;
        .day {
          font-size: 24px;
          font-family: Source Han Sans CN, Source Han Sans CN-Medium;
          font-weight: 500;
          color: #606266;
          padding: 25% 37px 0 0;
        }
        .years {
          font-size: 14px;
          font-family: Source Han Sans CN, Source Han Sans CN-Medium;
          font-weight: 500;
          color: #606266;
          padding-right: 37px;
        }
      }
      .bottom-right {
        width: 80%;
        .right-top {
          padding: 20px 0 0 20px;
          font-size: 18px;
          font-family: Source Han Sans CN, Source Han Sans CN-Medium;
          font-weight: 500;
          text-align: LEFT;
          color: #909399;
          cursor: pointer;
        }
        .right-top:hover {
          padding: 20px 0 0 20px;
          font-size: 18px;
          font-family: Source Han Sans CN, Source Han Sans CN-Bold;
          font-weight: 700;
          color: #409eff;
        }
        .right-bottom {
          padding-left: 20px;
          margin-top: 14px;
          font-size: 14px;
          font-family: Source Han Sans CN, Source Han Sans CN-Regular;
          font-weight: 400;
          color: #606266;
        }
      }
    }
  }
}
// 解纷流程
.content-dispute-step {
  width: 100%;
  padding: 20px 0 60px;
  background: #f7f8fd;
  img {
    padding: 0 10%;
    width: 100%;
  }
}
// 中间底部
.picture {
  margin-top: 80px;
  background: linear-gradient(71deg, #68c0ff 0%, #187ed2 100%);
  .pictureImg {
    width: 100%;
    background-image: url("../../assets/images/login-home/center-below.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    z-index: 1;
  }
}
.center-below {
  padding: 10px 15% 10px 5%;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  a {
    margin-left: 10px;
    font-size: 20px;
    font-family: Source Han Sans CN, Source Han Sans CN-Bold;
    font-weight: 700;
    color: #ffffff;
  }
  .left-line {
    border-left: 2px solid #e8e8e8;
    height: 37px;
    margin: 0 auto;
  }
}

//标题
.title-box {
  width: 100%;
  padding: 40px 10%;
}
.title-name {
  font-size: 24px;
  font-family: Source Han Sans CN, Source Han Sans CN-Bold;
  font-weight: 700;
  color: #303133;
  margin-bottom: 5px;
}
.title-line {
  width: 64px;
  height: 4px;
  background: #1c8bf2;
  border-radius: 39px;
}
</style>
