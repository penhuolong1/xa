<template>
  <div>
    <Result class="mt-32" status="404" title="404" sub-title="您访问的页面不存在">
      <template #extra>
        <Button type="primary">
          返回首页
        </Button>
      </template>
    </Result>
  </div>
</template>

<script>
import { Result, Button } from 'ant-design-vue'

export default {
  components: {
    Result,
    Button
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
