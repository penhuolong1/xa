<template>
  <div class="wrapper">
    <div class="header">文书列表</div>
    <div v-for="(item, index) in list" :key="index" class="item" @click="preview(item.dipPath)">
      <div class="txt">
        {{ item.dipName }}
      </div>
      <div class="icon">
        <Icon type="right" />
      </div>
    </div>
  </div>
</template>

<script>
import { sendInfoById } from '@/api/book/index.js'
import { Icon } from 'ant-design-vue'
import { getPreviewUrl } from '@/api/common/index.js'
import { litReceiveDip } from '@/api/freeze/index.js'
export default {
  components: {
    Icon
  },
  props: {

  },
  data() {
    return {
      list: []
    }
  },
  created() {
    this.getList()
    document.title = '翔安法院诉前案管平台'
  },
  mounted() {

  },
  methods: {
    // 获取文书列表
    getList() {
      litReceiveDip({ sendId: this.$route.query.sendId }).then(({ code, data }) => {
        if (code === 200) {
          this.list = data.dipList
        }
      })
    },
    preview(url) {
      getPreviewUrl(url, 'write').then(res => {
        if (res.code === 200) {
          location.href = res.data.wpsUrl
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
.wrapper {
  background-color: #fafafa;
  height: 100vh;
  width: 100%;
  padding: 20px;
  .header {
    color: rgba(69, 90, 100, 0.6);
    margin-bottom: 10px;
  }
  .item {
    display: flex;
    box-sizing: border-box;
    width: 100%;
    padding: 10px 16px;
    overflow: hidden;
    color: #323233;
    font-size: 14px;
    line-height: 24px;
    justify-content: space-between;
    background-color: #fff;
    border-bottom: 1px solid #ebedf0;
    &:first-child {
      border-bottom: none;
    }
    .txt {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      padding-right: 20px;
    }
  }
}
</style>
