<template>
  <div class="send-steps">
    <div class="send-steps-content">
      <div class="send-step-item">
        <div class="icon other-status" />
        <div class="text">接收时间</div>
        <div class="time">{{ item.startTime }}</div>
      </div>
      <div v-for="(item1, index) in item.sendList" :key="index" class="send-step-item" @click="edit(item1, item)">
        <div :class="'icon status'+item1.sendResult" />
        <div class="text">{{ item1.sendType }}</div>
        <div class="time">{{ item1.sendDate }}</div>
      </div>
      <div class="send-step-item">
        <div class="icon other-status" />
        <div class="text">结束时间</div>
        <div class="time">{{ item.dueTime }}</div>
      </div>
    </div>
    <div class="line" />
  </div>
</template>

<script>
export default {
  components: {
  },
  props: {
    item: {
      type: Object,
      default: () => {}
    }
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
    edit(item, item1) {
      this.$emit('editSendRecord', {
        sendId: item.sendId,
        litigantId: item1.litigant.litigantId
      })
    }
  }
}
</script>

<style scoped lang="less">
.send-steps {
  border: 1px solid #f0f0f0;
  margin-bottom: 20px;
  .send-steps-content {
    display: flex;
    justify-content: space-between;
    position: relative;
    z-index: 2;
  }
  padding: 10px 20px;
  position: relative;
  .line {
    position: absolute;
    top: 19px;
    left: 50px;
    right: 50px;
    height: 4px;
    opacity: 1;
    background: #b7e3fa;
    z-index: 1;
  }
  .send-step-item {
    display: flex;
    align-items: center;
    flex-direction: column;
    text-align: center;
    max-width: 100px;
    .icon {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      margin-bottom: 20px;
      &.other-status {
        background: radial-gradient(rgba(255,255,255,1), #177ddc);
        border-radius: 2px;
      }
      &.status0 {
         border: 3px solid red;
        background-color: #fff;
        border-color: #4a99e3;
      }
      &.status1 {
         border: 3px solid red;
        background-color: #fff;
        border-color: #3bcccc
      }
      &.status2 {
         border: 3px solid red;
        background-color: #fff;
        border-color: red
      }
      &.status3 {
         border: 3px solid red;
        background-color: #fff;
        border-color: #ff6c2d
      }
    }
  }
}
</style>
