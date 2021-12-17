<template>
  <!-- 单位详情 -->
  <div>
    <div class="screen">
      展示层级
      <span style="margin-left: 10px">显示全域(X)</span>
      <span>|</span>
      <span>区级(X)</span>
      <span>|</span>
      <span>街道级(X)</span>
      <span>|</span>
      <span>社区级(X)</span>
    </div>
    <!-- 主体内容 -->
    <div v-for="(item, ind) in subArr" :key="ind" class="content">
      <img :src="item.picture" alt="tp" height="60px" width="60px">
      <div class="subject">
        <div class="title">
          {{ item.name }}
          <span
            v-for="(type, key) in item.resodistype"
            :key="key + '-only'"
            style="margin-left: 5px"
          >
            <span class="label-mediate">{{ type.name }}</span>
            <!-- <span class="label-mediate">人民调解</span>
              <span class="label-mediate">行业调解</span>
              <span class="label-mediate">律师调解</span>
              <span class="label-mediate">行政调解</span> -->
          </span>
          <span v-for="(label, id) in item.label" :key="id">
            <span v-if="id < 2" class="label">{{ label.name }}</span>
            <!-- <span class="label">婚姻纠纷</span>
              <span class="label">婚姻纠纷</span> -->
          </span>
          <span>
            <span
              v-if="item.label.length > 2"
              class="label"
              style="
                  border: 1px solid #909399;
                  color: #909399;
                  cursor: pointer;
                "
              v-bind="item"
              @mouseenter="showLog(item)"
              @mouseleave="closeLog(item)"
            >
              查看更多 <a-icon type="right" />
            </span>
          </span>
        </div>
        <div style="position: relative">
          <div v-show="item.more" style="position: absolute; z-index: 1">
            <DetailsLog />
          </div>
          <div style="z-index: 0">
            <div class="data">
              <div class="name">
                解纷组织<span
                  class="value"
                >{{ item.disResoluOrganiza }}个</span>
              </div>
              <div class="name">
                解纷员<span class="value">{{ item.disDrea }}人</span>
              </div>
              <div class="name">
                化解数<span class="value">{{ item.resoluNumber }}%</span>
              </div>
            </div>
            <div>
              <div class="way-communication">
                <div class="flex-row">
                  <div style="margin-right: 80px">
                    联系方式：<span>{{ item.telephone }}</span>
                  </div>
                  <div>
                    地址：<span>{{ item.address }}</span>
                  </div>
                </div>
              </div>

              <div style="display: inline">
                <div
                  class="button"
                >
                  <div class="findDisputes">找TA解纷</div>
                </div>
              </div>
            </div>
            <div class="main-duty">
              <div class="name">主要职责：</div>
              <!-- <div style="flex:1">
                  {{ item.duties }}
                </div> -->
              <div style="flex: 1">
                <expandStow :explain="item.duties" />
              </div>
            </div>
            <div class="belong">
              <span> 旗下解纷组织{{ item.subDisResoluOrganiza }}个 </span>
              <span style="margin: 0 10px"> | </span>
              <span>旗下解纷员{{ item.subDisResoluOrganiza }}名</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="yema">
      <div style="cursor: pointer">上一页</div>
      <div style="margin-left: 15px; cursor: pointer">下一页</div>
    </div>
  </div>
</template>

<script>
import { Icon } from 'ant-design-vue'
import DetailsLog from '../../components/detailsLog.vue'
import ExpandStow from '../../components/expandStow.vue'
export default {
  components: {
    'a-icon': Icon,
    // 'a-button': Button,
    DetailsLog,
    ExpandStow
  },
  data() {
    return {
      subArr: [
        {
          more: false,
          id: '1',
          picture: require('@/assets/images/home/Partner.png'),
          name: '厦门市翔安区新店街道分中心',
          resodistype: [
            {
              name: '司法调解'
            },
            {
              name: '人民调解'
            },
            {
              name: '行业调解'
            },
            {
              name: '律师调解'
            }
          ],
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
          disResoluOrganiza: '20',
          disDrea: '20',
          resoluNumber: '45',
          telephone: '0592-6778868',
          address: '翔安区翔吴一路3号',
          duties: '研究制订家事纠纷化解政策措施和年度解纷各种职责研究制订家事纠纷制订家事纠纷制订家事纠纷各种职责研究制订家事纠纷制。研究制订家事纠纷化解政策措施和年度解纷各种职责研究制订家事纠纷制订家事纠纷制订家事纠纷各种职责研究制订家事纠纷制。',
          subDisResoluOrganiza: '23',
          subDisDrea: '23'

        },
        {
          more: false,
          id: '2',
          picture: require('@/assets/images/home/Partner.png'),
          name: '厦门市翔安区新店街道分中心',
          resodistype: [
            {
              name: '司法调解'
            },
            {
              name: '人民调解'
            },
            {
              name: '行业调解'
            },
            {
              name: '律师调解'
            },
            {
              name: '行政调解'
            }
          ],
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
          disResoluOrganiza: '20',
          disDrea: '20',
          resoluNumber: '45',
          telephone: '0592-6778868',
          address: '翔安区翔吴一路3号',
          duties: '研究制订家事纠纷化解政策措施和年度解纷各种职责研究制订家事纠纷制订家事纠纷制订家事纠纷各种职责研究制订家事纠纷制。研究制订家事纠纷化解政策措施和年度解纷各种职责研究制订家事纠纷制订家事纠纷制订家事纠纷各种职责研究制订家事纠纷制。',
          subDisResoluOrganiza: '23',
          subDisDrea: '23'

        },
        {
          more: false,
          id: '3',
          picture: require('@/assets/images/home/Partner.png'),
          name: '厦门市翔安区新店街道分中心',
          resodistype: [
            {
              name: '司法调解'
            },
            {
              name: '人民调解'
            },
            {
              name: '行业调解'
            },
            {
              name: '律师调解'
            },
            {
              name: '行政调解'
            }
          ],
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
          disResoluOrganiza: 20,
          disDrea: 20,
          resoluNumber: 45,
          telephone: '0592-6778868',
          address: '翔安区翔吴一路3号',
          duties: '研究制订家事纠纷化解政策措施和年度解纷各种职责研究制订家事纠纷制订家事纠纷制订家事纠纷各种职责研究制订家事纠纷制。研究制订家事纠纷化解政策措施和年度解纷各种职责研究制订家事纠纷制订家事纠纷制订家事纠纷各种职责研究制订家事纠纷制。',
          subDisResoluOrganiza: 23,
          subDisDrea: 23

        }
      ]
    }
  },
  methods: {
    // 查看更多
    showLog(event) {
      this.subArr.forEach((item) => {
        if (item.id == event.id) {
          item.more = true
        }
      })
    },
    closeLog(event) {
      this.subArr.forEach((item) => {
        if (item.id == event.id) {
          item.more = false
        }
      })
    }
    // 上一页
    // prevDateapp() {
    //   var curren = this.appCurrenPage// 当前
    //   var total = Math.ceil(this.total / 10)// 页数
    //   if (curren == 1) {
    //     this.openIsDisabled = true
    //     this.$message.error('当前是第一页')
    //   } else {
    //     this.closeIsDisabled = false
    //     if (curren > 1) {
    //       curren = curren - 1
    //       var sdate = this.sdateapp
    //       var edate = this.edateapp
    //       this.$message.error('网络异常，请检查您的网络')
    //     }
    //     this.appCurrenPage = curren
    //   }
    // }

    // 下一页
  }
}
</script>

<style lang="less" scoped>
/deep/.ant-modal-body{
  padding: 20px 0;
  font-size: 14px;
  line-height: 1.5;
  word-wrap: break-word;
}
.page {
  position: relative;
  min-width: 1200px;
  height: 100vh;
}
.screen {
  background: #f2f5fa;
  box-shadow: 0px 4px 20px 0px rgba(0, 86, 170, 0.05);
  padding: 10px 20px;
  font-size: 14px;
  width: 100%;
  font-family: Source Han Sans CN, Source Han Sans CN-Regular;
  font-weight: 400;
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
// 主体内容
.content:hover{
    .subject{
        .title{
        font-weight: 500;
        color: #409eff;
    }
    }

}
.content {
  background: #ffffff;
  margin: 10px 20px;
  padding: 20px 0;
  display: flex;
  border-bottom: 1px solid #dcdfe6;
  flex-direction: row;
  .subject {
    margin-left: 20px;
    width: 100%;
    .title {
      font-size: 18px;
      font-family: Source Han Sans CN, Source Han Sans CN-Medium;
      font-weight: 500;
      color: #606266;
      margin-bottom: 10px;
      display: flex;
      flex-wrap: wrap;
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
    .data {
      display: flex;
      margin-left: -20px;
      .name {
        font-size: 12px;
        font-family: Source Han Sans CN, Source Han Sans CN-Regular;
        font-weight: 400;
        color: #606266;
        margin: 5px 20px 15px;
      }
      .value {
        font-size: 16px;
        font-family: Source Han Sans CN, Source Han Sans CN-Bold;
        font-weight: 700;
        color: #649aec;
        margin-left: 10px;
      }
    }
    .way-communication {
      display: inline;
      float: left;
      .flex-row {
        display: flex;
        flex-direction: row;
        font-size: 12px;
        font-family: Source Han Sans CN, Source Han Sans CN-Regular;
        font-weight: 400;
        color: #909399;
        span {
          margin-left: 5px;
        }
      }
    }
    .button {
      display: flex;
      justify-content: flex-end;
      font-size: 12px;
      font-family: Source Han Sans CN, Source Han Sans CN-Medium;
      font-weight: 500;
      color: #909399;
      letter-spacing:1px;
      cursor: pointer;
      .findDisputes{
        display: flex;
          padding: 6px 8px;
          border: 1px solid #dcdfe6;
          border-radius: 35px;
      }
      .findDisputes:hover{
          background: #1c8bf2;
          border-radius: 35px;
          color: #ffffff;
      }
    }
    .main-duty {
      display: flex;
      flex-direction: row;
      width: 80%;
      margin: 5px 0;
      .name {
        font-size: 12px;
        font-family: Source Han Sans CN, Source Han Sans CN-Regular;
        font-weight: 400;
        color: #909399;
      }
    }
    .belong {
      margin-top: 5px;
      font-size: 12px;
      font-family: Source Han Sans CN, Source Han Sans CN-Regular;
      font-weight: 400;
      color: #909399;
    }
  }
}
//   分页
.yema {
  padding: 0 20px;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-self: flex-end;
}
</style>
