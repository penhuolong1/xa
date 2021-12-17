<template>
  <div class="box">
    <div class="title">
      中国司法大数据研究院到翔安开展“数助决策”专项调研{{ popularizationTitle }}
    </div>
    <div v-if="type===1" class="subtitle">
      <div>发布单位：{{ popularizationSendDeptName }}</div>
      <div>发布时间：{{ popularizationSendTime }}</div>
      <div>附件：{{ popularizationFiles }} <span class="download">下载</span> </div>
      <div>字号：<span :style="fontSize == '大' ? 'color: #2e94ff' : 'color: #303133'" class="font-size" @click="selectFontSize('大')">大</span> | <span :style="fontSize == '中' ? 'color: #2e94ff' : 'color: #303133'" class="font-size" @click="selectFontSize('中')">中</span> | <span :style="fontSize == '小' ? 'color: #2e94ff' : 'color: #303133'" class="font-size" @click="selectFontSize('小')">小</span></div>
    </div>
    <div v-if="type===2" class="subtitle">
      <div>发布单位：{{ popularizationSendDeptName }}</div>
      <div>发布时间：{{ popularizationSendTime }}</div>
      <div>字号：<span :style="fontSize == '大' ? 'color: #2e94ff' : 'color: #303133'" class="font-size" @click="selectFontSize('大')">大</span> | <span :style="fontSize == '中' ? 'color: #2e94ff' : 'color: #303133'" class="font-size" @click="selectFontSize('中')">中</span> | <span :style="fontSize == '小' ? 'color: #2e94ff' : 'color: #303133'" class="font-size" @click="selectFontSize('小')">小</span></div>
    </div>
    <div v-if="type===3" class="subtitle" style="justify-content: center;">
      <div>2021-05-27 {{ popularizationSendTime }} <span>公布</span>/<span>失败</span></div>
    </div>
    <div :style="fontSize == '大' ? 'font-size: 20px;' : fontSize == '中' ? 'font-size: 14px;' : fontSize == '小' ? 'font-size: 12px' :'font-size: 14px'">
      {{ popularizationContent }}
    </div>
  </div>

</template>

<script>
import { months } from 'moment'
export default {
  props: {
    type: {
      type: Number,
      default: 1
    },
    popularizationTitle: { // 标题
      type: String,
      default: ''
    },
    popularizationSendDeptName: { // 发布单位
      type: String,
      default: ''
    },
    popularizationSendTime: { // 时间
      type: String,
      default: ''
    },
    popularizationFiles: { // 文件
      type: String,
      default: ''
    },
    popularizationContent: { // 正文
      type: String,
      default: ''
    }
  },
  data() {
    return {
      fontSize: ''
    }
  },
  methods: {
    selectFontSize(e) {
      console.log('dazx', e)
      this.fontSize = e
      console.log('e', this.fontSize)
    }

  }

}
</script>

<style lang="less" scoped>
.box{
    margin: 40px 160px;
    padding: 40px;
    background: #ffffff;
    border-radius: 8px;
    box-shadow: 0px 4px 20px 0px rgba(0,86,170,0.05);
    .title{
        font-size: 24px;
        font-family: Source Han Sans CN, Source Han Sans CN-Bold;
        font-weight: 700;
        text-align: center;
        color: #303133;
    }
    .subtitle{
        border-bottom: 1px solid #b5cad9;
        border-top: 1px solid #b5cad9;
        box-shadow: 0px 4px 20px 0px rgba(0,86,170,0.05);
        display: flex;
        justify-content: space-between;
        padding: 7px 40px;
        margin: 40px 0;
        font-size: 14px;
        font-family: Source Han Sans CN, Source Han Sans CN-Regular;
        font-weight: 400;
        color: #606266;
        .download{
            color: #2e94ff;
            margin-left: 10px;
            cursor: pointer;
        }
        .font-size{
            cursor: pointer;
        }
        .font-size:hover{
            cursor: pointer;
            color: #2e94ff;
        }
    }
    .content{
        font-size: 14px;
        font-family: Source Han Sans CN, Source Han Sans CN-Regular;
        font-weight: 400;
        color: #606266;
    }
}

</style>
