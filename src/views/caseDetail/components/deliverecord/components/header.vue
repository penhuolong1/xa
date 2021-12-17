<template>
  <div class="send-item-header">
    <div class="send-item-header-left">
      <div class="label">当事人:</div>
      <div class="txt">{{ item.litigant.litigantName }}</div>
      <div class="label">诉讼地位:</div>
      <div class="txt">{{ item.litigant.litigationStatus }}</div>
      <!-- <div class="label">送达情况:</div>
      <div class="txt" /> -->
    </div>
    <div class="send-item-header-right">
      <!-- <div class="sign-status no-sign">未签到</div>
      <img class="qr-code" src="@/assets/images/qrcode.png"> -->
      <div class="flex">
        <div class="label">送达结果:</div>
        <div class="txt">{{ result[item.litigant.result] }}</div>
      </div>
      <a @click="edit">编辑</a>
    </div>
    <AddResult ref="addResult" :send-process="sendProcess" @done="done" />
  </div>
</template>

<script>
import AddResult from './addResult.vue'
export default {
  components: {
    AddResult
  },
  props: {
    item: {
      type: Object,
      default: () => {}
    },
    sendProcess: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      result: {
        0: '送达中',
        1: '送达成功',
        2: '送达失败',
        3: '未送达'
      }
    }
  },
  created() {

  },
  mounted() {

  },
  methods: {
    edit() {
      this.$refs.addResult.show(this.item)
    },
    done() {
      this.$emit('done')
    }
  }
}
</script>

<style scoped lang="less">
.send-item-header {
  height: 60px;
  width: 100%;
  background-color: #e8f4ff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
}
.send-item-header-left {
  display: flex;
}
.send-item-header-right {
  display: flex;
  align-items: center;
  .sign-status {
    background-color: rgba(101,183,243,0.2);
    padding: 5px 10px;
    color: rgba(101,183,243,1);
    border-radius: 30px;
    margin-right: 10px;
    &.no-sign {
      background-color: rgba(119,136,153,0.2);
      color: rgba(119,136,153);
    }
  }
  .qr-code {
    width: 30px;
    height: 30px;
    background-color: #c4c4c4;
    margin-right: 10px;
  }
}
.label {
  font-weight: bolder;
  font-size: 14px;
  margin-right: 5px;
}
.txt {
  margin-right: 20px;
}
</style>
