<template>
  <div class="form-wrapper">
    <div class="form-left">
      <ul>
        <li v-for="(item, index) in menuList" :key="index" :class="menuIndex === index ? 'active':''" @click="menuIndex = index">{{ item.name }}</li>
      </ul>
    </div>
    <div class="form-right">
      <div class="form">
        <span>
          <MoveCourt v-if="menuIndex === 0" /> <!-- 法院赋强 -->
          <CloseCase v-if="menuIndex === 1" /> <!-- 办结案件 -->
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import CloseCase from '../components/closeCase.vue'
import MoveCourt from '../components/moveCourt.vue'
import { roleTypeMap } from '@/type/index.js'
import { mapGetters } from 'vuex'
export default {
  components: {
    MoveCourt,
    CloseCase
  },
  props: {

  },
  data() {
    return {
      menuIndex: 0,
      menuList: [
        {
          value: 1,
          name: '法院赋强'
        },
        {
          value: 2,
          name: '办结案件'
        }
      ],
      roleTypeMap,
      loading: false
    }
  },
  computed: {
    ...mapGetters(['getSfCaseInfo', 'getIsDeal', 'getUserInfo'])
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
