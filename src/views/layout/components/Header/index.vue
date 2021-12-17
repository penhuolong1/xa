<template>
  <div>

    <Header class="xa-layout-header ">
      <div class="xa-layout-header-left">
        <AppLogo />
      </div>
      <div class="xa-layout-header-right">
        <Icon type="user" class="header-icon" />
        <Icon type="project" class="header-icon" />
        <Icon type="message" class="header-icon" />
        <Icon type="phone" class="header-icon" @click="phoneShow" />
        <UserDropDown />
      </div>
    </Header>
    <PhoneList ref="phoneListShow" />
  </div>

</template>

<script>
import { Layout, Icon } from 'ant-design-vue'
import UserDropDown from './UserDropDown'
import AppLogo from '@/components/AppLogo'
import PhoneList from './phoneList.vue'
import { mapState } from 'vuex'
export default {
  components: {
    Header: Layout.Header,
    Icon,
    UserDropDown,
    AppLogo,
    PhoneList

  },
  props: {

  },
  data() {
    return {
    }
  },
  computed: {
    ...mapState(['isPhone'])
  },
  created() {

  },
  mounted() {

  },
  methods: {
    phoneShow() {
      this.$refs.phoneListShow.Show()
      // this.$store.commit('SET_ISPHONE', !this.$store.state.layout.isPhone)
    }
  }
}
</script>

<style scoped lang="less">
.xa-layout-header {
  height: @header-height;
  width: 100%;
  color: #fff;
  padding: 0 20px;
  background-color: transparent;
  display: flex;
  justify-content: space-between;
  .xa-layout-header-right {
    display: flex;
    align-items: center;
    .header-icon {
      font-size: 1.5625rem;
      display: flex;
      align-items: center;
      padding: 0 15px;
      height: 100%;
      cursor: pointer;
    }
  }
}
</style>
