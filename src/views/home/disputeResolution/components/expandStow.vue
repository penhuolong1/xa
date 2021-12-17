<template>
  <div class="wrapper">
    <input id="exp1" class="exp" type="checkbox">
    <div class="text">
      <label class="btn" for="exp1" />
      {{ explain }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    explain: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="less" scoped>
.wrapper {
  display: flex;
}
.text {
  /* display: flex; */
  position: relative;
  font-size: 12px;
  font-family: Source Han Sans CN, Source Han Sans CN-Regular;
  font-weight: 400;
  color: #606266;
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.text::before {
  content: "";
  height: calc(100% - 16px);
  float: right;
}
.text::after {
  content: "";
  width: 999vw;
  height: 999vw;
  position: absolute;
  margin-left: -100px;
  box-shadow: inset calc(100px - 999vw) calc(30px - 999vw) 0 0 #fff;
}
.btn {
  float: right;
  clear: both;
  // margin-left: 10px;
  font-size: 12px;
  padding-left: 8px;
  color: #409eff;
  cursor: pointer;
  /* margin-top: -30px; */
}
.btn::before {
  content: "展开";
}
.exp {
  display: none;
}
.exp:checked + .text {
  -webkit-line-clamp: 999;
}
.exp:checked + .text::after {
  visibility: hidden;
}
.exp:checked + .text .btn::before {
  content: "收起";
}
</style>
