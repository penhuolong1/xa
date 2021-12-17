<template>
  <div class="w-full">
    <h1 class="font-bold text-3xl enter-X mb-6">手机登陆</h1>
    <Form :form="form">
      <FormItem class="enter-X">
        <Input v-model="form.name" size="large" placeholder="手机号码" />
      </FormItem>
      <FormItem class="enter-X">
        <CountdownInput />
      </FormItem>
      <FormItem class="enter-X">
        <Button type="primary" class="w-full">登陆</Button>
      </FormItem>
      <FormItem class="enter-X">
        <Button class="w-full">返回</Button>
      </FormItem>
    </Form>
  </div>
</template>

<script>
import { Form, Input, Button } from 'ant-design-vue'
import CountdownInput from '@/components/CountdownInput'
export default {
  components: {
    Form,
    FormItem: Form.Item,
    Input,
    Button,
    CountdownInput
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
