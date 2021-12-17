<template>
  <!-- 送达回证 -->
  <Form v-if="index === nowIndex" :form="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
    <FormItem label="送达地点" />
    <FormItem label="送达文件" />
  </Form>
</template>

<script>
import { Form } from 'ant-design-vue'
export default {
  components: {
    Form,
    FormItem: Form.Item
  },
  props: {

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

<style scoped lang="scss">

</style>
