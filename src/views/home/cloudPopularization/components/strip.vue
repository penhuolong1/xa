<template>
  <div>
    <div v-if="type==1" class="bottom-line">
      <div class="layout">
        <div class="left-line"><span>{{ title }}</span></div>
        <div class="content">{{ content }}</div>
        <div>{{ date }}</div>
      </div>
    </div>
    <div v-if="type==2" class="bottom-line">
      <div class="layout" style="grid-template-columns: 90% 10%;">
        <div style="display: flex;align-items: center; ">
          <img src="@/assets/images/home/examplesPpopularization.png" height="48px" width="48px">
          <div style="margin-left:24px">
            <div style="margin-bottom: 10px" class="content">{{ title }}</div>
            <div style="font-size: 12px; margin-top: 10px">发布单位：{{ content }}</div>
          </div>
        </div>
        <div style="display: flex;align-items: center;margin-top: 10px">{{ date }}</div>
      </div>
    </div>
    <div v-if="type==3" class="bottom-line">
      <div class="layout" style="grid-template-columns: 83% 17%;">
        <div>
          <div style="margin-bottom: 10px" class="content">{{ title }}</div>
          <div style="font-size: 12px; margin-top: 10px">{{ content }}</div>
        </div>
        <div style="display: flex;align-items: center;margin-top: 10px">{{ date }} <span>公布</span> / <span>失败</span> </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    type: {
      type: Number,
      default: 1
    },
    title: {
      type: String,
      default: ''
    },
    content: {
      type: String,
      default: ''
    },
    date: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
    }
  }
}
</script>

<style lang="less" scoped>
.bottom-line {
  width: 100%;
  border-bottom: 1px solid #dcdfe6;
  .layout:hover {
    cursor: pointer;
    .content {
      font-size: 14px;
      font-family: Source Han Sans CN, Source Han Sans CN-Medium;
      font-weight: 500;
      color: #409eff;
      font-size: 14px;
    }
    span:hover {
      color: #303133;
    }
  }
  .layout {
    width: 100%;
    display: grid;
    grid-template-columns: 12% 78% 10%;
    margin: 20px auto;
    word-wrap: break-word;
    word-break: break-all;
    overflow: hidden;
    font-size: 14px;
    font-family: Source Han Sans CN, Source Han Sans CN-Regular;
    font-weight: 400;
    color: #606266;
    .left-line {
      border-left: 2px solid #1c8bf2;
      span {
        margin-left: 5px;
      }
    }
  }
}
</style>
