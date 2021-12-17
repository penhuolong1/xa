<template>
  <div>
    <div class="inquire">
      <a-input placeholder="请输入关键字" allow-clear @change="onChange" />
      <a-button type="primary" @click="handleQuery">查询</a-button>
    </div>
  </div>
</template>

<script>
import { Input, Button } from 'ant-design-vue'
export default {
  components: {
    'a-input': Input,
    'a-button': Button
  },
  data() {
    return {

    }
  },
  methods: {
    onChange(e) {
      this.$emit('onChange', e)
    },
    handleQuery() {
      this.$emit('handleQuery')
    }
  }
}
</script>

<style lang="less" scoped>
@font-family: Source Han Sans CN, Source Han Sans CN-Regular;
@color: #303133;
@font-weight: 500;
@font-weight-bold: 700;
.inquire {
  display: flex;
  flex-direction: row;
}
/deep/.ant-input:placeholder-shown {
  text-overflow: ellipsis;
  background: #ffffff;
  border: 1px solid #dcdfe6;
  border-radius: 57px;
  width: 240px;
}
/deep/input:not([type="range"]){
  -ms-touch-action: manipulation;
  touch-action: manipulation;
  border: 1px solid #828792;
  border-radius: 57px;
  width: 240px;
}
/deep/.ant-input:focus {
    // border-color: #40a9ff;
    border-right-width: 1px !important;
    outline: 0;
    /* -webkit-box-shadow: 0 0 0 2px rgb(24 144 255 / 20%); */
    /* box-shadow: 0 0 0 2px rgb(24 144 255 / 20%); */
}
/deep/.ant-btn {
  background: #1c8bf2;
  font-size: 14px;
  font-family: @font-family;
  font-weight: 400;
  color: #ffffff;
  padding: 0 26px;
  margin-left: 20px;
  border-radius: 35px;
}
</style>
