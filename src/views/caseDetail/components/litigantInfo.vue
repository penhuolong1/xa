<template>
  <div>
    <div class="mb-2.5">
      <Button type="blue3" class="mr-2.5" @click="addLitiant">新增当事人</Button>
    </div>
    <LitigantList ref="litigantList" />
  </div>
</template>

<script>
import { Button } from 'ant-design-vue'
import LitigantList from '@/components/LitigantList'
export default {
  components: {
    Button,
    LitigantList
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
    addLitiant() {
      this.$refs.litigantList.addLitiant()
    },
    submit() {
    }
  }
}
</script>

<style scoped lang="less">

</style>
