<template>
  <div class="page">
    <!-- 联动单位 -->
    <div>
      <!-- 头部 -->
      <Head />
      <!-- 导航菜单 -->
      <div class="menu">
        <!-- //横的导航栏 -->
        <div style="margin:0 0 20px -20px">
          <Menu :current="currentArr" :menu-list="menuList" @choice="choice" />
        </div>
        <Query />
      </div>

      <div class="screen">
        <div>
          展示层级
          <span style="margin-left: 10px">显示全域(X)</span>
          <span>|</span>
          <span>区级(X)</span>
          <span>|</span>
          <span>街道级(X)</span>
          <span>|</span>
          <span>社区级(X)</span>
        </div>

        <div>
          <div>
            按
            <span style="margin-left: 10px">默认排序</span>
            <span>|</span>
            <span>解纷组织</span>
            <span>|</span>
            <span>解纷员</span>
            <span>|</span>
            <span style="margin-right: 10px">化解数</span>
            排序
          </div>
        </div>
      </div>
      <!-- 主体内容 -->
      <div v-for="(item, index) in subArr" :key="index" class="content">
        <img :src="item.picture" alt="tp" height="100px" width="100px">
        <div class="subject">
          <div class="title">
            {{ item.name }}
            <span style="margin-left: 5px;">
              <span class="label-mediate">司法调解</span>
              <span class="label-mediate">人民调解</span>
              <span class="label-mediate">行业调解</span>
              <span class="label-mediate">律师调解</span>
              <span class="label-mediate">行政调解</span>
            </span>
            <span v-for="(items, id) in item.label" :key="id">
              <span v-if="id <= 4" class="label">{{ items.name }}</span>
            </span>
            <span>

              <span
                v-if="item.label.length >= 4"
                class="label"
                style="border: 1px solid #909399; color: #909399;cursor: pointer;"
                v-bind="item"
                @mouseenter="showLog(item)"
                @mouseleave="closeLog(item)"
              >
                查看更多 <a-icon type="right" />
              </span>

            </span>
          </div>
          <div style="position:relative">
            <div v-show="item.more" style="position:absolute;z-index:1">
              <DetailsLog />
            </div>
            <div style="z-index:0">
              <!-- <div class="explain">
                {{ item.explain }}
              </div> -->
              <ExpandStow :explain="item.explain" />
              <div class="data">
                <div v-for="(iteml, key) in item.type" :key="key" class="type">
                  <div class="name">{{ iteml.name }}</div>
                  <div class="value">{{ iteml.value }}</div>
                </div>
              </div>
            </div>
          </div>

        </div>
        <div class="button">
          <div
            style="margin-bottom: 10px"
            type="primary"
            class="UnitDetails"
            @click="UnitDetailsLog"
          >单位详情</div>
          <div class="findDisputes">找TA解纷</div>
        </div>
      </div>
    </div>
    <UnitDetailsLog ref="unitLog" />
  </div>
</template>

<script>
import { Icon } from 'ant-design-vue'
import Head from '../../components/head.vue'
import Menu from '../../components/menuVertically.vue'
import Query from '../components/query.vue'
import DetailsLog from '../components/detailsLog.vue'
import ExpandStow from '../components/expandStow.vue'
import UnitDetailsLog from './components/unitDetailsLog.vue'
export default {
  components: {
    'a-icon': Icon,
    // 'a-button': Button,
    Head,
    Menu,
    Query,
    DetailsLog,
    ExpandStow,
    UnitDetailsLog
  },
  data() {
    return {
      currentArr: [0],
      menuList: [
        {
          name: '联动单位',
          key: '1',
          url: ''

        },
        {
          name: '解纷组织',
          key: '2',
          url: ''
        },
        {
          name: '解纷员',
          key: '3',
          url: ''
        }
      ],
      subArr: [
        {
          more: false,
          id: '1',
          picture: require('@/assets/images/home/Avatar.png'),
          name: '翔安诉非联动中心',
          label: [
            {
              id: '1',
              name: '邻里关系纠纷'
            },
            {
              id: '2',
              name: '婚姻纠纷'
            }
          ],
          explain:
            '研究制订家事纠纷化解政策措施和年度解纷各种职责研究制订家事纠纷制订家事纠纷制订家事纠纷各种职责研究制订家事纠纷制订家事纠纷制订家事纠制订家事纠纷制订家事纠纷各种职责研究制订家事纠纷制订家事纠纷制订家究制订家事纠纷制订家事纠订家事纠纷制订家事纠制订家事纠纷制订家。',
          type: [
            {
              name: '解纷组织',
              value: '20个'
            },
            {
              name: '解纷员',
              value: '290人'
            },
            {
              name: '化解数',
              value: '45%'
            }
          ]
        },
        {
          more: false,
          id: '2',
          picture: require('@/assets/images/home/Avatar.png'),
          name: '翔安诉非联动中心',
          label: [
            {
              id: '1',
              name: '邻里关系纠纷'
            },
            {
              id: '2',
              name: '婚姻纠纷'
            },
            {
              id: '3',
              name: '邻里关系纠纷'
            },
            {
              id: '4',
              name: '婚姻纠纷'
            },
            {
              id: '5',
              name: '邻里关系纠纷'
            },
            {
              id: '6',
              name: '行业调解'
            }
          ],
          explain:
            '研究制订家事纠纷化解政策措施和年度解纷各种职责研究制订家事纠纷制订家事纠纷制订家事纠纷各种职责研究制订家事纠纷制订家事纠纷制订家事纠制订家事纠纷制订家事纠纷各种职责研究制订家事纠纷制订家事纠纷制订家究制订家事纠纷制订家事纠订家事纠纷制订家事纠制订家事纠纷制订家。',
          type: [
            {
              name: '解纷组织',
              value: '20个'
            },
            {
              name: '解纷员',
              value: '290人'
            },
            {
              name: '化解数',
              value: '45%'
            }
          ]
        },
        {
          more: false,
          id: '3',
          picture: require('@/assets/images/home/Avatar.png'),
          name: '翔安诉非联动中心',
          label: [
            {
              id: '1',
              name: '邻里关系纠纷'
            },
            {
              id: '2',
              name: '婚姻纠纷'
            },
            {
              id: '3',
              name: '邻里关系纠纷'
            },
            {
              id: '4',
              name: '婚姻纠纷'
            },
            {
              id: '5',
              name: '邻里关系纠纷'
            },
            {
              id: '6',
              name: '行业调解'
            }
          ],
          explain:
            '研究制订家事纠纷制订家事纠纷制订家究制订家事纠纷制订家事纠订家事纠纷制订家事纠制订家事纠纷制订家。',
          type: [
            {
              name: '解纷组织',
              value: '20个'
            },
            {
              name: '解纷员',
              value: '290人'
            },
            {
              name: '化解数',
              value: '45%'
            }
          ]
        }
      ]
    }
  },
  methods: {
    // 单位详情
    UnitDetailsLog() {
      this.$refs.unitLog.show()
    },
    // 查看更多
    showLog(event) {
      this.subArr.forEach(item => {
        if (item.id == event.id) {
          item.more = true
        }
      })
    },
    closeLog(event) {
      this.subArr.forEach(item => {
        if (item.id == event.id) {
          item.more = false
        }
      })
    },
    // 导航栏跳转
    choice(e) {
      if (e.name === '联动单位') { this.$router.push('/disputeResolution/linkageUnit') }
      if (e.name === '解纷组织') { this.$router.push('/disputeResolution/organization') }
      if (e.name === '解纷员') { this.$router.push('/disputeResolution/solver') }
    }
  }
}
</script>

<style lang="less" scoped>
.page {
  position: relative;
  min-width: 1200px;
  // height: 100vh;
  // background: #f2f5fa;
}
// 导航栏
/deep/.ant-menu-horizontal {
  line-height: 46px;
  white-space: nowrap;
  border: 0;
  -webkit-box-shadow: none;
  box-shadow: none;
}
.menu {
  margin: 20px 160px;
  padding: 30px 20px;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0px 4px 20px 0px rgba(0, 86, 170, 0.05);
}
.screen {
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0px 4px 20px 0px rgba(0, 86, 170, 0.05);
  margin: -10px 160px 20px;
  padding: 10px 20px;
  display: flex;
  justify-content: flex-start;
  div {
    font-size: 14px;
    font-family: Source Han Sans CN, Source Han Sans CN-Regular;
    font-weight: 400;
    color: #606266;
    margin-right: 40px;

    span {
      color: #909399;
      margin: 0 2.5px;
      cursor: pointer;
    }
    span:active {
      color: #409eff;
      cursor: pointer;
    }
  }
}
.content {
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0px 4px 20px 0px rgba(0, 86, 170, 0.05);
  margin: 10px 160px;
  padding: 20px 40px;
  display: flex;
  width: calc(100%-240px);
  justify-content: flex-start;
  .subject {
    margin: 0px 5% 0 2%;
    width: calc(93% - 240px);
    .title {
      font-size: 18px;
      font-family: Source Han Sans CN, Source Han Sans CN-Medium;
      font-weight: 500;
      color: #606266;
      margin-bottom: 10px;
      display: flex;
      flex-wrap:wrap;
      .label-mediate {
        font-size: 12px;
        font-weight: 400;
        color: #409eff;
        border: 1px solid #409eff;
        border-radius: 4px;
        padding: 2px 5px;
        margin: 0 2.5px;
      }
      .label {
        font-size: 12px;
        font-weight: 400;
        color: #4c6bd9;
        border: 1px solid #4c6bd9;
        border-radius: 4px;
        padding: 2px 5px;
        margin: 0 2.5px;
      }
    }
    .explain {
      font-size: 12px;
      font-family: Source Han Sans CN, Source Han Sans CN-Regular;
      font-weight: 400;
      color: #606266;
      text-overflow: -o-ellipsis-lastline;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    .data {
      display: flex;
      flex-direction: row;
      .type {
        display: flex;
        flex-direction: column;
        .name {
          font-size: 14px;
          font-family: Source Han Sans CN, Source Han Sans CN-Regular;
          font-weight: 400;
          color: #606266;
          margin: 10px 25px 10px 0;
        }
        .value {
          font-size: 16px;
          font-family: Source Han Sans CN, Source Han Sans CN-Bold;
          font-weight: 700;
          color: #649aec;
        }
      }
    }
  }
  .button {
    margin-top: 60px;
    display: flex;
    flex-direction: column;
    font-size: 14px;
    font-family: Source Han Sans CN, Source Han Sans CN-Medium;
    font-weight: 500;
    color: #909399;
    .findDisputes{
      cursor: pointer;
      letter-spacing:1px;
      padding: 8px 16px;
      border: 1px solid #dcdfe6;
      border-radius: 35px;
    }
    .UnitDetails{
      cursor: pointer;
      letter-spacing:1px;
      padding: 8px 16px;
      border: 1px solid #dcdfe6;
      border-radius: 35px;
    }
    .findDisputes:hover{
    background: #1c8bf2;
    border-radius: 35px;
    color: #ffffff;
    }
    .UnitDetails:hover{
      background: #1c8bf2;
    border-radius: 35px;
    color: #ffffff;
    }

  }
}
.content:hover {
  box-shadow: 0px 4px 20px 0px rgba(0, 86, 170, 0.2);
  .title {
    color: #409eff;
    font-weight: 500;
  }
  // /deep/.ant-btn-primary {
  //   background-color: #1c8bf2 !important;
  //   color: #fff !important;
  // }

}

/deep/.ant-btn {
  font-size: 14px;
  font-family: Source Han Sans CN, Source Han Sans CN-Medium;
  font-weight: 400;
  padding: 0 26px;
  margin-left: 20px;
  border-radius: 35px;
}
</style>
