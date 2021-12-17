<template>

  <!-- 底部 -->
  <div class="footer">
    <Divider class="footer-top">页面版权所有：厦门市翔安区人民法院 <span>备案xxxxxxx</span></Divider>
    <div class="footer-bottom">技术支持：厦门纵横集团科技股份有限公司</div>
  </div>
</template>
<script>
import { Divider } from 'ant-design-vue'
export default {
  components: {
    Divider
  }

}
</script>

<style scoped lang="less">
//底部
.footer {
  min-height: 135px;
  width: 100%;
  background: #232a3d;
  .footer-top {
    width: 100%;
      text-align: center;
      padding : 40px 0 10px;
      color: rgba(255,255,255,0.60);
      margin: 0 auto;

  }
  .footer-bottom {
    width: 100%;
    margin: 10px auto 60px;
    text-align: center;
    color: rgba(255,255,255,0.60);
  }
}
</style>
