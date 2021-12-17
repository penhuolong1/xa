<template>
  <!-- autoplay -->
  <Carousel>
    <div class="first">

      <div style="height:62px; background: rgb(32, 34, 31,0);z-index=99999" />

    </div>
    <div class="second"><h3>2</h3></div>
    <div class="third"><h3>3</h3></div>
  </Carousel>
</template>
<script>
import { Carousel } from 'ant-design-vue'
import Head from './head1.vue'

export default {
  components: {
    Carousel,
    Head
  }

}
</script>
<style scoped>
/* For demo */
.ant-carousel >>> .slick-slide {

}
.first{
  width: 1920px;
  height: 746px;
  background-image: url("../../../assets/images/login-home/HomeBackground.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  z-index: 1;
}
.second{
  width: 1920px;
  height: 746px;
  background-image: url("../../../assets/images/login-home/HomeBackground.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  z-index: 1;
}
.third{
  width: 1920px;
  height: 746px;
  background-image: url("../../../assets/images/login-home/HomeBackground.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  z-index: 1;
}

.ant-carousel >>> .slick-slide h3 {
  color: rgb(206, 93, 93);
}
</style>
