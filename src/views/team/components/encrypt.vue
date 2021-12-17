<template>
  <!-- 手机加密 -->
  <div class="encrypt-wrapper">
    <Input v-if="(id && isEdit && isEncrypt) || (!id && isEdit)" v-model="value" placeholder="请输入" />
    <span v-if="!isEdit || (id && isEdit && !isEncrypt)" class="label">{{ value }}</span>
    <Icon v-if="id" type="eye" class="icon" @click="getPhone" />
  </div>
</template>

<script>
import { Input, Icon } from 'ant-design-vue'
import { lookPhone } from '@/api/team/index.js'
export default {
  components: {
    Input,
    Icon
  },
  props: {
    value: {
      type: String,
      default: ''
    },
    isEdit: {
      type: Boolean,
      default: true
    },
    id: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      value1: '',
      isEncrypt: false
    }
  },
  watch: {
    value() {
      this.value1 = this.value
    },
    value1() {
      this.$emit('input', this.value1)
    }
  },
  created() {
    this.value1 = this.value
  },
  mounted() {

  },
  methods: {
    // 查看解密后的联系方式
    getPhone(e) {
      this.isEncrypt = false
      lookPhone(this.id).then(({ code, msg }) => {
        if (code === 200) {
          this.isEncrypt = true
          this.value1 = msg
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
.encrypt-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  width: 100%;
  .icon {
    display: block;
    width: 50px;
    text-align: right;
    cursor: pointer;
  }
  .label {
    flex: 1;
  }
}
</style>
