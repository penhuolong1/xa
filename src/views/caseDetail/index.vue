<template>
  <div class="wrapper">
    <Header ref="header" />
    <div class="menu-wrapper">
      <Tabs :active-key="defaultKey" @tabClick="tabClick">
        <TabPane v-for="item in list" :key="item.index" :tab="item.name" />
      </Tabs>
      <div v-if="defaultKey == 0" class="btn-wrapper">
        <Button type="primary" @click="save">保存</Button>
      </div>
    </div>
    <div class="case-detail-content">
      <!-- 案件办理 -->
      <CaseHandle v-if="defaultKey === 99" />
      <!-- 基本信息 -->
      <BaseCaseInfo v-if="defaultKey === 0" ref="baseInfo" @saveSuccess="saveSuccess" />
      <!-- 当事人信息 -->
      <LitigantInfo v-if="defaultKey === 1" />
      <!-- 当事人关联关系 -->
      <Associate v-if="defaultKey === 2" />
      <!-- 卷宗管理 -->
      <Book v-if="defaultKey === 3" />
      <!-- 送达记录 -->
      <DeliverRecord v-if="defaultKey === 4" />
      <!-- 诉前程序 -->
      <Prosecution v-if="defaultKey === 5" />
      <!-- 鉴定记录 -->
      <IdentificateRecord v-if="defaultKey===6" />
      <!-- 保全记录 -->
      <FreezeRecord v-if="defaultKey===7" />
      <!-- 案件整体流程 -->
      <PrecessLog v-if="defaultKey===8" />
      <!-- 备注情况 -->
      <Remark v-if="defaultKey===9" />

    </div>
  </div>
</template>

<script>
import Header from './components/header.vue'
import { Tabs, Button } from 'ant-design-vue'
import BaseCaseInfo from './components/baseCaseInfo.vue'
import LitigantInfo from './components/litigantInfo.vue'
import CaseHandle from '@/components/CaseHandle/courtIndex.vue'
import Book from '@/components/Book'
import Associate from './components/associate/index.vue'
import Prosecution from './components/prosecution/index.vue'
import IdentificateRecord from './components/IdentificateRecord.vue'
import FreezeRecord from './components/freezeRrcord.vue'
import Remark from './components/remark.vue'
import PrecessLog from './components/precessLog.vue'
import DeliverRecord from './components/deliverecord/index.vue'
// import HomeDelivery from './components/HomeDelivery.vue'
export default {
  components: {
    Header,
    Tabs,
    TabPane: Tabs.TabPane,
    BaseCaseInfo,
    Button,
    LitigantInfo,
    CaseHandle,
    // HomeDelivery,
    Book,
    Associate,
    Prosecution,
    IdentificateRecord,
    FreezeRecord,
    Remark,
    PrecessLog,
    DeliverRecord
  },
  props: {

  },
  data() {
    return {
      list: [
        {
          name: '案件信息',
          index: 0
        },
        {
          name: '当事人基本信息',
          index: 1
        },
        {
          name: '案件关联',
          index: 2
        },
        {
          name: '卷宗管理',
          index: 3
        },
        {
          name: '送达记录',
          index: 4
        },
        {
          name: '诉前记录',
          index: 5
        },
        {
          name: '鉴定记录',
          index: 6
        },
        {
          name: '保全记录',
          index: 7
        },
        {
          name: '备注情况',
          index: 9
        },
        {
          name: '案件日志',
          index: 8
        }
      ],
      defaultKey: 0
    }
  },
  created() {

  },
  mounted() {
    if (this.$route.query.type == 2) { // 诉非处理法院的案件
      const obj = [
        {
          name: '案件办理',
          index: 99
        }
      ]
      this.list = [...obj, ...this.list]
      this.defaultKey = 99
    } else {
      this.defaultKey = 0
    }
    if (this.$route.query.menu) { // 从外部直接跳转到第几个菜单
      this.defaultKey = Number(this.$route.query.menu)
    }
  },
  methods: {
    tabClick(e) {
      this.defaultKey = e
    },
    saveSuccess() {
      this.$refs.header.getData()
    },
    // 保存
    save() {
      if (this.defaultKey === 0) {
        this.$refs.baseInfo.submit()
      }
    }
  }
}
</script>

<style scoped lang="less">
/deep/.ant-tabs-bar{
  border-bottom: none;
  margin: 0px;
}
/deep/.ant-tabs-tab-prev-icon, .ant-tabs-tab-next-icon{
  top: 44%;
}
.menu-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.btn-wrapper {
  width: 100px;
}
.menu-wrapper {
  margin-bottom: 20px;
  border-bottom: 1px solid #e8e8e8;
}
</style>
