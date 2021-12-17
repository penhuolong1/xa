<template>
  <div id="app">
    <ConfigProvider :locale="zhCN">
      <router-view />
    </ConfigProvider>
  </div>
</template>
<script>
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
import { ConfigProvider } from 'ant-design-vue'

export default {
  components: {
    ConfigProvider
  },
  props: {
  },
  data() {
    return {
      zhCN: zhCN
    }
  },
  created() {
    this.initpage()
  },
  mounted() {

  },
  methods: {
    initpage() {
      var view_width = 16 * document.body.clientWidth / 1920
      var _html = document.getElementsByTagName('html')[0]
      _html.style.fontSize = view_width + 'px'
    }
  }
}
</script>
<style lang="less">
// #app {
//   min-width: 1400px;
//   overflow: auto;
// }
</style>
