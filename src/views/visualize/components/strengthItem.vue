<template>
  <div class="strength-item">
    <div class="info-box">
      <div class="name">{{ item.name || '' }}</div>
      <div class="data">受理：{{ item.msl || '' }}件 / 化解：{{ item.mhj || '' }}件 / 调解成功率：{{ item.msuccess || '' }}%</div>
    </div>
    <div class="proportion-box">
      <div class="proportion">
        <div v-for="item1 in list" :key="item1" class="proportion-item" :class="type === 2 ? 'even':''" />
        <div v-if="isOther" class="proportion-item" :class="type === 2 ? 'even':''" :style="{'width':width+'%'}" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {
  },
  props: {
    type: {
      type: Number,
      default: 1
    },
    num: {
      type: Number,
      default: 70.87
    },
    item: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      list: 10,
      isOther: false,
      width: 10
    }
  },
  watch: {
    item() {
      this.init()
    }
  },
  created() {

  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      if (!this.item?.msuccess) {
        return
      }
      this.list = parseInt(this.item.msuccess / 10)
      const num = (this.item.msuccess % 10).toFixed(2)
      if (num === 0) {
        this.isOther = false
      } else {
        this.isOther = true
        this.width = num
      }
    }
  }
}
</script>

<style scoped lang="less">
.strength-item {
  width: 100%;
  padding-left: 20px;
  .info-box {
    display: flex;
    color: white;
    justify-content: space-between;
    font-size: 12px;
    &>div {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  .proportion-box {
    width: 100%;
    height: 25px;
    position: relative;
    background-image: url('../../../assets/visualize/proportionBox.png');
    background-position: 0 0;
    background-size: 100% 100%;
    margin-top: 5px;
    .proportion {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0px;
      right: 0px;
      align-items: center;
    }
    .proportion-item {
      display: inline-block;
      width: calc((100% - 50px)/10);
      height: 6px;
      margin-right: 5px;
      background-color: rgba(0,169,255,0.4);
      &:nth-child(even) {
        background-color: #00a9ff;
      }
      &.even {
        background-color: rgba(253,161,1,0.4);
        &:nth-child(even) {
          background-color: rgba(253,161,1,1);
        }
      }
    }
  }
}
</style>
