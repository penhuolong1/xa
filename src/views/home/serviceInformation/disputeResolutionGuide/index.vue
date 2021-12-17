<template>
  <div class="page">
    <div>
      <!-- 头部 -->
      <Head />
      <div class="bread-crumb-inquire">
        <!-- 面包屑 -->
        <BreadCrumb :bread-list="breadList" />
        <!-- 搜索 -->
        <Inquire />
      </div>
      <div class="subject">
        <div class="left-box">
          <div class="title">类别</div>
          <Menu />
        </div>

        <!-- 右边内容 -->
        <div class="right-box">
          <div>
            <div
              v-for="(item, index) in like"
              :key="index"
              class="border-bottom"
            >
              <div class="file">
                <div class="left">
                  <img :src="item.icon">
                  <span>{{ item.name }}</span>
                </div>
                <div class="right" style="margin-right: 40px">
                  <img src="@/assets/images/home/visible.png" alt="">
                  <img src="@/assets/images/home/download.png" alt="">
                </div>
              </div>
            </div>
          </div>
          <Pagination />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Head from '../../components/head.vue'
import BreadCrumb from '../../components/breadCrumbs.vue'
import Inquire from '../../components/Inquire.vue'
import Pagination from '../../components/pagination.vue'
import Menu from '../../components/menuHorizontally.vue'
export default {
  components: {
    Menu,
    Head,
    BreadCrumb,
    Inquire,
    Pagination
  },
  data() {
    return {
      like: [
        {
          icon: require('@/assets/images/home/UnDocument.png'),
          name: '诉前调解通知书状模板'
        },
        {
          icon: require('@/assets/images/home/UnDocument.png'),
          name: '诉前调解通知书状模板'
        },
        {
          icon: require('@/assets/images/home/UnDocument.png'),
          name: '诉前调解通知书状模板'
        }
      ],
      breadList: [
        {
          path: '',
          name: '服务指南'
        },
        {
          path: '',
          name: '填表指南'
        }
      ] // 路由集合
    }
  }
}
</script>

<style lang="less" scoped>
@font-family: Source Han Sans CN, Source Han Sans CN-Regular;
.page {
  position: relative;
  min-width: 1200px;
  height: 100vh;
  background: #f2f5fa;
}
// 面包屑、搜索
.bread-crumb-inquire {
  margin: 40px 160px 20px;
  display: flex;
  justify-content: space-between;
}
.subject {
  display: grid;
  grid-template-columns: 20% 80%;
  margin: 40px 160px;
  .left-box {
    background: #ffffff;
    border-radius: 8px;
    box-shadow: 0px 4px 20px 0px rgba(0, 86, 170, 0.05);
    .title {
      margin: 20px 0 0 25px;
      font-size: 18px;
      font-family: @font-family;
      font-weight: 500;
      color: #606266;
    }
  }

  // 右边内容
  .right-box:hover {
    .border-bottom:hover {
      .file:hover {
        .left:hover {
          font-weight: 500;
          color: #409eff;
          img {
            content: url(../../../../assets/images/home/document.png);
          }
        }
      }
    }

    font-weight: 500;
    color: #409eff;
  }
  .right-box {
    margin-left: 20px;
    padding: 40px;
    background: #ffffff;
    border-radius: 8px;
    box-shadow: 0px 4px 20px 0px rgba(0, 86, 170, 0.05);
    height: 628px;
    display: grid;
    grid-template-rows: 95% 5%;
    .border-bottom {
      border-bottom: 1px solid #dedfe6;
      width: 100%;
      .file {
        width: 100%;
        margin: 15px auto;
        display: flex;
        justify-content: space-between;
        .left {
          cursor: pointer;
          font-size: 14px;
          font-family: @font-family;
          font-weight: 400;
          color: #606266;
          margin-left: 40px;
          span {
            margin-left: 10px;
          }
          img {
            height: 48px;
            width: 48px;
          }
        }
        .right {
          margin-right: 40px;
          margin-top: 30px;
          img {
            cursor: pointer;
            margin: 0 10px;
          }
        }
      }
    }
  }
}
</style>
