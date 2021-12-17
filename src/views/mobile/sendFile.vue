<template>
  <div class="wrapper">
    <div class="header">文书列表</div>
    <div v-for="(item, index) in list" :key="index" class="item" @click="preview(item.path)">
      <div class="txt">
        {{ item.name }}
      </div>
      <div class="icon">
        <Icon type="right" />
      </div>
    </div>
    <Button class="btn" type="primary" block @click="sign">
      签字
    </Button>
  </div>
</template>

<script>
import { sendInfoById } from '@/api/book/index.js'
import { Icon, Button } from 'ant-design-vue'
import { getPreviewUrl } from '@/api/common/index.js'
import { needSign } from '@/api/book/index.js'

export default {
  components: {
    Icon,
    Button
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
    document.title = '翔安区“好厝边”诉非联动平台'
  },
  mounted() {

  },
  methods: {
    // 获取文书列表
    getList() {
      sendInfoById({ sfSendId: this.$route.query.sfSendId }).then(({ code, data }) => {
        if (code === 200) {
          this.list = data
        }
      })
    },
    preview(url) {
      getPreviewUrl(url, 'write').then(res => {
        if (res.code === 200) {
          location.href = res.data.wpsUrl
        }
      })
    },
    // 是否需要签字
    sign() {
      needSign({ sfSendId: this.$route.query.sfSendId }).then(({ code, msg, needSign }) => {
        if (code === 200) {
          if (!needSign) {
            this.$message.error('该份文书不需要签字')
            return
          } else {
            this.$router.push('/mobile/handWrite?sfSendId=' + this.$route.query.sfSendId)
          }
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
.btn {
  position: fixed;
  bottom: 20px;
  width: calc(100% - 40px);
}
</style>
