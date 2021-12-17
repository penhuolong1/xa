<template>
  <Layout class="xa-layout">
    <Header />
    <router-view />
  </Layout>
</template>

<script>
import { Layout } from 'ant-design-vue'
import Header from './components/Header/index'
export default {
  components: {
    Layout,
    Header
  },
  props: {

  },
  data() {
    return {

    }
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
.xa-layout {
  display: flex;
  width: 100%;
  min-height: 100%;
  flex-direction: column;
  background: url('../../assets/images/layout-bg.png'),linear-gradient(180deg,#177ddc 0%, rgba(23,125,220,0.80) 100%, #65b7f3 100%);
  background-position: 0 0;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  .xa-layout-content {
    flex: 1;
  }
}
</style>
