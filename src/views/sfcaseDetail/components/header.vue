<template>
  <div class="menu-wrapper">
    <div class="case-bo">
      <div class="back" @click="back">
        <Icon type="arrow-left" />
      </div>
      <div class="txt">
        案号：{{ getSfCaseInfo.caseNo }}
      </div>
    </div>
    <Tabs :active-key="defaultKey" @tabClick="tabClick">
      <TabPane v-for="item in list" :key="item.value" :tab="item.label" />
    </Tabs>
  </div>
</template>

<script>
import { Tabs, Icon } from 'ant-design-vue'
import { mapGetters } from 'vuex'
export default {
  components: {
    Tabs,
    TabPane: Tabs.TabPane,
    Icon
  },
  props: {

  },
  data() {
    return {
      list: [
        {
          value: 1,
          label: '纠纷信息'
        },
        {
          value: 2,
          label: '当事人信息'
        },
        {
          value: 3,
          label: '纠纷办理'
        },
        {
          value: 4,
          label: '卷宗管理'
        },
        {
          value: 5,
          label: '调解管理'
        },
        {
          value: 6,
          label: '送达管理'
        },
        {
          value: 7,
          label: '备注情况'
        },
        {
          value: 8,
          label: '纠纷日志'
        }
      ],
      defaultKey: 1
    }
  },
  computed: {
    ...mapGetters(['getSfCaseInfo', 'getTeamList'])
  },
  watch: {
    // getTeamList: {
    //   handler() {
    //     if (this.list.findIndex(item => item.label === '案件联动') === -1) {
    //       if (this.getTeamList && this.getTeamList.length > 0) {
    //         this.list.splice(3, 0, {
    //           value: 9,
    //           label: '案件联动'
    //         })
    //       }
    //     }
    //   },
    //   deep: true
    // }
  },
  created() {
    this.$store.dispatch('GetListTeamInfo')
  },
  mounted() {

  },
  methods: {
    tabClick(e) {
      console.log(e)
      this.defaultKey = e
      this.$emit('change', e)
    },
    back() {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped lang="less">
.menu-wrapper {
  padding-left: 350px;
  position: relative;
  border-bottom: 1px solid #e8e8e8;
  margin-bottom: 20px;
  .case-bo {
    position: absolute;
    left: 0px;
    display: flex;
    align-items: center;
    line-height: 45px;
    font-size: 16px;
    font-weight: bolder;
    .txt {
      margin-left: 20px;
    }
  }
}
.back {
  cursor: pointer;
}
// 1px solid #e8e8e8
/deep/.ant-tabs-bar {
  border-bottom: none;
  margin: 0;
}
</style>
