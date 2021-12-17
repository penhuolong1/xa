<template>
  <div class="tag" :class="'tag'+type">
    {{ text }}
  </div>
</template>

<script>
export default {
  components: {

  },
  props: {
    text: {
      type: String,
      default: ''
    },
    type: { // 1绿色 2 橙色 3 红色 4蓝色
      type: Number,
      default: 4
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

  }
}
</script>

<style scoped lang="less">
.tag {
  display: inline-block;
  padding: 5px;
  border-radius: 5px;
  font-size: 12px;
  &.tag1 {
    color: #65BF73;
    background: rgba(101.2,191.25,115.19,0.2);
  }
  &.tag2 {
    color: #FF6C2D;
    background: rgba(255,108,45,0.2);
  }
  &.tag3 {
    color: #FF4D4F;
    background: rgba(255,77,79,0.2);
  }
  &.tag4 {
    color: #65B7F3;
    background:  rgba(101,183,243,0.2);
  }
}
</style>
