<template>
  <div>
    <Dropdown>
      <div class="user-drop-text">
        <span>{{ getUserInfo.user ? getUserInfo.user.nickName : '' }}</span>
        <Icon type="caret-down" />
      </div>
      <Menu slot="overlay">
        <!-- <MenuItem @click="certification">律师认证</MenuItem> -->
        <MenuItem v-if="getUserRole !== 'court'" @click="changeRole">切换角色</MenuItem>
        <MenuItem @click="logOut">退出</MenuItem>
      </Menu>
    </Dropdown>
    <!-- 律师认证 -->
    <!-- <Certification ref="certification" /> -->
    <!-- 切换角色 -->
    <ChangeRole ref="changeRole" />
  </div>
</template>

<script>
import { Dropdown, Menu, Icon } from 'ant-design-vue'
import { mapGetters } from 'vuex'
import { listOtherRoleOfSf, loginOut } from '@/api/user/user.js'
import Certification from './certification.vue'
import ChangeRole from './changeRole.vue'
import { callerCode, ORIGIN } from '@/utils/constVal.js'
export default {
  components: {
    Dropdown,
    Menu,
    ChangeRole,
    MenuItem: Menu.Item,
    Icon,
    Certification
  },
  props: {
  },
  data() {
    return {

    }
  },
  computed: {
    ...mapGetters(['getUserInfo', 'getUserRole'])
  },
  created() {

  },
  mounted() {
    console.log(this.getUserInfo)
  },
  methods: {
    async logOut() {
      // loginOut()
      // location.href = '/api/logout'
      await loginOut()
      localStorage.removeItem('xaTokan')
      // this.$route.push('/login')
      // this.$route.push('/login')
      location.href = `https://mztapp.fujian.gov.cn:8304/dataset/UnifiedController/goUserCenter.do?uitype=5&callerCode=${callerCode}&returnurl=${location.origin}/login`
    },
    certification() {
      this.$refs.certification.show()
    },
    changeRole() {
      // 查看是否有多角色
      listOtherRoleOfSf().then(({ code, data }) => {
        if (code === 200) {
          if (!data && data.length === 0) {
            this.$message.error('无角色可切换')
            return
          }
          this.$refs.changeRole.show(data)
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
.user-drop-text {
  display: flex;
  align-items: center;
  padding: 0 10px;
  height: 100%;
  cursor: pointer;
  span {
    margin-right: 5px;
  }
}
</style>
