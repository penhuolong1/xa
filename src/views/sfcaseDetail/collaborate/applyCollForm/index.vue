<template>
  <div class="form-wrapper">
    <div v-if="!getTeamInfo.finish" class="form-left">
      <ul>
        <li v-for="(item, index) in menuList" :key="index" :class="menuIndex === index ? 'active':''" @click="menuIndex = index">{{ item.name }}</li>
      </ul>
    </div>
    <div v-if="!getTeamInfo.finish" class="form-right">
      <div class="form">
        <CloseColl v-if="menuIndex === 0" />  <!-- 办结 -->
        <Withdraw v-if="menuIndex === 1" /> <!-- 撤回 -->
        <UpdateColl v-if="menuIndex === 2" /> <!-- 修改 -->
      </div>
    </div>
    <div v-if="getTeamInfo.finish" class="empty-wrapper">
      <Empty description="已办结" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { Empty } from 'ant-design-vue'
import CloseColl from './closeColl.vue'
import Withdraw from './withdraw1.vue'
import UpdateColl from './updateColl.vue'
export default {
  components: {
    CloseColl,
    Withdraw,
    UpdateColl,
    Empty
  },
  props: {

  },
  data() {
    return {
      menuList: [
        {
          value: 1,
          name: '办结'
        },
        {
          value: 2,
          name: '撤回'
        },
        {
          value: 3,
          name: '修改'
        }
      ],
      accept: true,
      review: undefined,
      menuIndex: 0,
      loading: false
    }
  },
  computed: {
    ...mapGetters(['getSfCaseInfo', 'getTeamInfo'])
  },
  created() {

  },
  mounted() {

  },
  methods: {
  }
}
</script>

<style scoped lang="less">
.empty-wrapper {
  width: 100%;
  height: 100%;
  margin-top: 100px;
}
.form-wrapper {
  width: 100%;
  display: flex;
  min-height: 400px;
  border: 1px solid rgba(0,0,0,0.10);
  margin-top: 20px;
  .form-left {
    width: 150px;
    border-right: 1px solid rgba(0,0,0,0.10);
    li {
      line-height: 40px;
      text-align: center;
      color: rgba(0,0,0,0.20);
      font-size: 16px;
      cursor: pointer;
      &.active {
        background-color: #e0f0ff;
        color: @theme-color;
      }
    }
  }
  .form-right {
    flex: 1;
    padding: 30px 20px;
  }
  .form {
    width: 600px;
    margin: 0 auto;
  }
}
</style>
