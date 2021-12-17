<template>
  <div class="w-full">
    <h1 class="font-bold text-3xl enter-X mb-6">二维码登录</h1>
    <Form :form="form">
      <FormItem class="enter-X">
        <Button class="w-full">返回</Button>
      </FormItem>
    </Form>
  </div>
</template>

<script>
import { Form, FormItem, Button } from 'ant-design-vue'
export default {
  components: {
    Form,
    FormItem,
    Button
  },
  props: {

  },
  data() {
    return {
      form: {},
      rememberMe: false
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
/deep/ .inner-text{
  font-size: 12px;
  color: rgba(0, 0, 0, 0.45);
}
.icon {
  color: #888;
  flex: 1;
  font-size: 25px;
  cursor: pointer;
  &:hover {
    color: #0960bd;
  }
}
</style>
