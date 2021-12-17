<template>
  <div class="page">
    <!-- 解纷员 -->
    <div>
      <!-- 头部 -->
      <Head />
      <!-- 导航菜单 -->
      <div class="menu">
        <!-- 横的导航栏 -->
        <div style="margin:0 0 20px -20px">
          <Menu :current="currentArr" :menu-list="menuList" @choice="choice" />
        </div>
        <Query />
      </div>

      <div class="screen">
        <div>共1456个解纷员</div>
        <div>
          <div>
            按
            <span style="margin-left: 10px">默认排序</span>
            <span>|</span>
            <span>化解数</span>
            <span>|</span>
            <span style="margin-right: 10px">成功率</span>
            排序
          </div>
        </div>
      </div>
      <!-- 主体内容 -->
      <div>
        <div v-for="(item, index) in infoList" :key="index" class="content">
          <div>
            <img :src="item.serial" height="33px" width="24px" alt="序号">
            <div class="serial-number">
              <span v-if="index + 1 < 10">0</span> {{ index + 1 }}
            </div>
          </div>

          <div class="avatar">
            <img
              v-if="item.picture != null"
              :src="item.picture"
              width="100px"
              height="100px"
              alt="头像"
            >
            <img
              v-if="item.picture == null && item.gender == null "
              src="@/assets/images/home/noGender.png"
              width="100px"
              height="100px"
              alt="头像"
            >
            <img
              v-if="item.picture == null && item.gender != null"
              :src="item.gender === '男' ? require('@/assets/images/home/male 100px.png') : require('@/assets/images/home/female 100px.png') "
              width="100px"
              height="100px"
              alt="男女头像"
            >
          </div>
          <div class="subject">
            <div class="title">
              {{ item.name }}
              <span
                v-for="(type, key) in item.resodistype"
                :key="key + '-only'"
                style="margin-left: 5px"
              >
                <span class="label-mediate">{{ type.name }}</span>
              </span>
              <span v-for="(items, id) in item.label" :key="id">
                <span v-if="id <= 5" class="label">{{ items.name }}</span>
              </span>
              <span>
                <span
                  v-if="item.label.length > 5"
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
              <div class="way-communication" style="z-index: 0">
                <div class="gender">
                  性别：<span>{{ item.gender }}</span>
                </div>
                <div
                  style="flex: 1"
                  class="gender affiliation"
                  @mouseenter="showAffiliation(item)"
                  @mouseleave="closeAffiliation(item)"
                >
                  隶属单位：<span>{{ item.affiliation }}</span>
                  <span
                    v-if="item.affiliation.length > 5"
                    style="margin-left: -1px"
                  >...</span>
                </div>
              </div>
              <div style="position: relative">
                <div
                  v-show="item.affiliationLog"
                  style="position: absolute; z-index: 1"
                >
                  <AffiliatedUnit />
                </div>
                <div
                  style="
                    display: inline;
                    float: left;
                    width: 87%;
                    margin-top: 10px;
                  "
                >
                  <Spread :explain="item.explain" />

                  <div class="data">
                    <div class="type">
                      <div class="name">化解率</div>
                      <div class="value">{{ item.resoluRate }}%</div>
                    </div>
                    <div class="type">
                      <div class="name">成功率</div>
                      <div class="value">{{ item.successRate }}%</div>
                    </div>
                  </div>
                </div>
                <div style="display: inline; float: right; margin-top: 10px">
                  <div class="button">
                    <div class="findDisputes">找TA解纷</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div style="margin: 20px 160px;">
        <Pagination :current="current" :total="total" :page-size="pageSize" @onChange="onChange" />
      </div>

    </div>
  </div>
</template>

<script>
import { Icon } from 'ant-design-vue'
import Head from '../../components/head.vue'
import Menu from '../../components/menuVertically.vue'
import Query from '../components/query.vue'
import Spread from '../components/expandStow.vue'
import DetailsLog from '../components/detailsLog.vue'
import AffiliatedUnit from '../components/affiliatedUnit.vue'
import Pagination from '../../components/pagination.vue'
export default {
  components: {
    'a-icon': Icon,
    // 'a-button': Button,
    Head,
    Menu,
    Query,
    DetailsLog,
    AffiliatedUnit,
    Spread,
    Pagination
  },
  data() {
    return {
      currentArr: [2],
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
      current: 1,
      pageSize: 8,
      total: 0,
      viewType: 'self',
      infoList: [
        {
          explain:
            '研究制订家事纠纷化解政策措施和年度解纷各种职责研究制订家事纠纷制订家事纠纷制订家事纠纷各种职责研究制订家事纠纷制订家事纠纷制订家事纠纷...研究制订家事纠纷化解政策措施和年度解纷各种职责研究制订家事纠纷制订家事纠纷制订家事纠纷各种职责研究制订家事纠纷制订家事纠纷制订家事纠纷。',
          id: '1',
          serial: require('@/assets/images/home/01.png'),
          more: false,
          affiliationLog: false,
          name: 'cwt',
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
          gender: '女',
          affiliation: '厦门中级人民法院、翔安公安局、翔安诉非联动中心',
          disResolu: '201',
          resoluRate: '45',
          successRate: '45'
        },
        {
          explain:
            '研究制订家事纠纷化解政策措施和年度解纷各种职责研究制订家事纠纷制订家事纠纷制订家事纠纷各种职责研究制订家事纠纷制订家事纠纷制订家事纠纷...研究制订家事纠纷化解政策措施和年度解纷各种职责研究制订家事纠纷制订家事纠纷制订家事纠纷各种职责研究制订家事纠纷制订家事纠纷制订家事纠纷。',
          id: '2',
          serial: require('@/assets/images/home/02.png'),
          more: false,
          affiliationLog: false,
          picture: null,
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
            }
          ],
          gender: '男',
          affiliation: '厦门',
          disResolu: '201',
          resoluRate: '45',
          successRate: '45'
        },
        {
          explain:
            '研究制订家事纠纷化解政策措施和年度解纷各种职责研究制订家事纠纷制订家事纠纷制订家事纠纷各种职责研究制订家事纠纷制订家事纠纷制订家事纠纷...研究制订家事纠纷化解政策措施和年度解纷各种职责研究制订家事纠纷制订家事纠纷制订家事纠纷各种职责研究制订家事纠纷制订家事纠纷制订家事纠纷。',
          id: '3',
          serial: require('@/assets/images/home/03.png'),
          more: false,
          affiliationLog: false,
          picture: null,
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
          affiliation: '厦门中级人民法院、翔安公安局、翔安诉非联动中心',
          disResolu: '201',
          resoluRate: '45',
          successRate: '45'
        },
        {
          explain:
            '研究制订家事纠纷化解政策措施和年度解纷各种职责研究制订家事纠纷制订家事纠纷制订家事纠纷各种职责研究制订家事纠纷制订家事纠纷制订家事纠纷...研究制订家事纠纷化解政策措施和年度解纷各种职责研究制订家事纠纷制订家事纠纷制订家事纠纷各种职责研究制订家事纠纷制订家事纠纷制订家事纠纷。',
          id: '4',
          serial: require('@/assets/images/home/04.png'),
          more: false,
          affiliationLog: false,
          picture: null,
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
          gender: '男',
          affiliation: '厦门中级人民法院、翔安公安局、翔安诉非联动中心',
          disResolu: '201',
          resoluRate: '45',
          successRate: '45'
        },
        {
          explain:
            '研究制订家事纠纷化解政策措施和年度解纷各种职责研究制订家事纠纷制订家事纠纷制订家事纠纷各种职责研究制订家事纠纷制订家事纠纷制订家事纠纷...研究制订家事纠纷化解政策措施和年度解纷各种职责研究制订家事纠纷制订家事纠纷制订家事纠纷各种职责研究制订家事纠纷制订家事纠纷制订家事纠纷。',
          id: '5',
          serial: require('@/assets/images/home/04.png'),
          more: false,
          affiliationLog: false,
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
          gender: '女',
          affiliation: '厦门中级人民法院、翔安公安局、翔安诉非联动中心',
          disResolu: '201',
          resoluRate: '45',
          successRate: '45'
        },
        {
          explain:
            '研究制订家事纠纷化解政策措施和年度解纷各种职责研究制订家事纠纷制订家事纠纷制订家事纠纷各种职责研究制订家事纠纷制订家事纠纷制订家事纠纷...研究制订家事纠纷化解政策措施和年度解纷各种职责研究制订家事纠纷制订家事纠纷制订家事纠纷各种职责研究制订家事纠纷制订家事纠纷制订家事纠纷。',
          id: '6',
          serial: require('@/assets/images/home/04.png'),
          more: false,
          affiliationLog: false,
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
          gender: '男',
          affiliation: '厦门中级人民法院、翔安公安局、翔安诉非联动中心',
          disResolu: '201',
          resoluRate: '45',
          successRate: '45'
        },
        {
          explain:
            '研究制订家事纠纷化解政策措施和年度解纷各种职责研究制订家事纠纷制订家事纠纷制订家事纠纷各种职责研究制订家事纠纷制订家事纠纷制订家事纠纷...研究制订家事纠纷化解政策措施和年度解纷各种职责研究制订家事纠纷制订家事纠纷制订家事纠纷各种职责研究制订家事纠纷制订家事纠纷制订家事纠纷。',
          id: '7',
          serial: require('@/assets/images/home/04.png'),
          more: false,
          affiliationLog: false,
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
          gender: '男',
          affiliation: '厦门中级人民法院、翔安公安局、翔安诉非联动中心',
          disResolu: '201',
          resoluRate: '45',
          successRate: '45'
        },
        {
          explain:
            '研究制订家事纠纷化解政策措施和年度解纷各种职责研究制订家事纠纷制订家事纠纷制订家事纠纷各种职责研究制订家事纠纷制订家事纠纷制订家事纠纷...研究制订家事纠纷化解政策措施和年度解纷各种职责研究制订家事纠纷制订家事纠纷制订家事纠纷各种职责研究制订家事纠纷制订家事纠纷制订家事纠纷。',
          id: '8',
          serial: require('@/assets/images/home/04.png'),
          more: false,
          affiliationLog: false,
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
          gender: '女',
          affiliation: '厦门中级人民法院、翔安公安局、翔安诉非联动中心',
          disResolu: '201',
          resoluRate: '45',
          successRate: '45'
        },
        {
          explain:
            '研究制订家事纠纷化解政策措施和年度解纷各种职责研究制订家事纠纷制订家事纠纷制订家事纠纷各种职责研究制订家事纠纷制订家事纠纷制订家事纠纷...研究制订家事纠纷化解政策措施和年度解纷各种职责研究制订家事纠纷制订家事纠纷制订家事纠纷各种职责研究制订家事纠纷制订家事纠纷制订家事纠纷。',
          id: '9',
          serial: require('@/assets/images/home/04.png'),
          more: false,
          affiliationLog: false,
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
          gender: '男',
          affiliation: '厦门中级人民法院、翔安公安局、翔安诉非联动中心',
          disResolu: '201',
          resoluRate: '45',
          successRate: '45'
        },
        {
          explain:
            '研究制订家事纠纷化解政策措施和年度解纷各种职责研究制订家事纠纷制订家事纠纷制订家事纠纷各种职责研究制订家事纠纷制订家事纠纷制订家事纠纷...研究制订家事纠纷化解政策措施和年度解纷各种职责研究制订家事纠纷制订家事纠纷制订家事纠纷各种职责研究制订家事纠纷制订家事纠纷制订家事纠纷。',
          id: '10',
          serial: require('@/assets/images/home/04.png'),
          more: false,
          affiliationLog: false,
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
          gender: '女',
          affiliation: '厦门中级人民法院、翔安公安局、翔安诉非联动中心',
          disResolu: '201',
          resoluRate: '45',
          successRate: '45'
        },
        {
          explain:
            '研究制订家事纠纷化解政策措施和年度解纷各种职责研究制订家事纠纷制订家事纠纷制订家事纠纷各种职责研究制订家事纠纷制订家事纠纷制订家事纠纷...研究制订家事纠纷化解政策措施和年度解纷各种职责研究制订家事纠纷制订家事纠纷制订家事纠纷各种职责研究制订家事纠纷制订家事纠纷制订家事纠纷。',
          id: '11',
          serial: require('@/assets/images/home/04.png'),
          more: false,
          affiliationLog: false,
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
          gender: '女',
          affiliation: '厦门中级人民法院、翔安公安局、翔安诉非联动中心',
          disResolu: '201',
          resoluRate: '45',
          successRate: '45'
        }
      ]
    }
  },
  created() {

  },
  mounted() {},
  methods: {
    // 查看更多
    showLog(event) {
      this.infoList.forEach((item) => {
        if (item.id == event.id) {
          item.more = true
        }
      })
    },

    closeLog(event) {
      this.infoList.forEach((item) => {
        if (item.id == event.id) {
          item.more = false
        }
      })
    },

    // 隶属单位
    showAffiliation(event) {
      if (event.affiliation.length < 5) {
        return
      }
      this.infoList.forEach((item) => {
        if (item.id == event.id) {
          item.affiliationLog = true
        }
      })
    },
    closeAffiliation(event) {
      if (event.affiliation.length < 5) {
        return
      }
      this.infoList.forEach((item) => {
        if (item.id == event.id) {
          item.affiliationLog = false
        }
      })
    },
    // 分页
    onChange(current) {
    //   console.log('444', current)
      this.current = current
      this.getList()
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
    margin-right: 20px;

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
  background: #fff;
  border-radius: 0 8px 8px;
  box-shadow: 0px 4px 20px 0px rgba(0, 86, 170, 0.05);
  margin: 10px 160px;
  display: flex;
  justify-content: flex-start;
  .serial-number {
    width: 24px;
    height: 33px;
    margin-top: -36px;
    // background: chartreuse;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    font-size: 10px;
    font-family: Source Han Sans CN, Source Han Sans CN-Medium;
    font-weight: 500;
    color: #ffffff;
  }
  .avatar {
    margin: 30px 20px 30px 40px;
  }
  .subject {
    margin: 20px 40px 20px 0;
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
    .way-communication {
      display: flex;
      flex-direction: row;
      .gender {
        font-size: 14px;
        font-family: Source Han Sans CN, Source Han Sans CN-Regular;
        font-weight: 400;
        color: #909399;
        span {
          margin-left: 5px;
          color: #606266;
        }
      }
      .affiliation {
        margin-left: 80px;
        span {
          // width: ;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
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
    .button {
      display: flex;
      font-size: 12px;
      font-family: Source Han Sans CN, Source Han Sans CN-Medium;
      font-weight: 500;
      color: #909399;
      letter-spacing: 1px;
      cursor: pointer;
      .findDisputes {
        padding: 6px 8px;
        border: 1px solid #dcdfe6;
        border-radius: 35px;
      }
      .findDisputes:hover {
        background: #1c8bf2;
        border-radius: 35px;
        color: #ffffff;
      }
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

