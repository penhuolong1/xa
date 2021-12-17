<template>
  <Layout class="xa-layout">
    <iframe id="callFrame" src="/dist/testconnect.htm" frameborder="0" width="700" height="300" style="display: none;" />
    <Header />
    <div class="flex-1 flex flex-row-reverse">
      <Menu />
      <Content />
    </div>
    <CallAssociate ref="callAssociate" />
  </Layout>
</template>

<script>
import { Layout } from 'ant-design-vue'
import Header from './components/Header/index'
import Menu from './components/Menu/index'
import Content from './components/Content/index.vue'
import { saveCallLog } from '@/api/phone/index.js'
import CallAssociate from '@/views/workBench/components/associate.vue'
import { initWebSocket } from '@/utils/socketsf.js'
export default {
  components: {
    Layout,
    Header,
    Menu,
    Content,
    CallAssociate
  },
  props: {

  },
  data() {
    return {

    }
  },
  created() {
    // document.onkeydown = (e) => {
    //   if (e.keyCode === '36') {
    //     debugger
    //     console.log('home')
    //   }
    // }
    // initWebSocket()
  },
  mounted() {
    window.addEventListener('message', this.handleGetMessage)
  },
  destroyed() {
    window.removeEventListener('message', this.handleGetMessage)
  },
  methods: {
    handleGetMessage(e) {
      const data = e.data
      if (data.type === 'callPhone') { // 上传完电话记录后触发
        const params = {
          ...data,
          code: localStorage.getItem('xaCallPhoneCodes')
        }
        saveCallLog(params).then(({ code, msg }) => {
        })
      } else if (data.type === 'call') {
        this.$refs.callAssociate.Show(data)
      }
    }
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
