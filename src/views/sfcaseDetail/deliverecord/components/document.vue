<template>
  <div>
    <Modal
      v-model="visible"
      title="选择案件文书"
      style="width:600px"
      :mask-closable="false"
      class="modal"
    >
      <template slot="footer">
        <Button @click="visible=false">
          取消
        </Button>
        <Button type="primary" :loading="loading" @click="onConfirm">
          确认
        </Button>
      </template>
      <CheckboxGroup v-if="filelist" @change="changebox">
        <Checkbox v-for="item in filelist" :key="item.value" :value="item">{{ item.name }}</Checkbox>
      </CheckboxGroup>
      <div v-if="filelist.length===0" class="filelist">
        暂无可选文书
      </div>
    </Modal>
  </div>
</template>
<script>
import { listOfCatalog } from '@/api/sfBook/index.js'
import { Modal, Button, Checkbox } from 'ant-design-vue'

export default {
  components: {
    Modal,
    Button,
    CheckboxGroup: Checkbox.Group,
    Checkbox
  },
  props: {
  },
  data() {
    return {
      visible: false,
      loading: false,
      getSfLawCaseId: '',
      filelist: [],
      selecedBox: []
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    show(getSfLawCaseId) {
      this.visible = true
      this.getSfLawCaseId = getSfLawCaseId
      this.getList()
    },
    getList() {
      const params = {
        sfLawCaseId: this.getSfLawCaseId
      }
      listOfCatalog(params).then(({ code, data }) => {
        if (code === 200) {
          // this.filelist = data.files.filter((item, index) => {
          //   item.index = index + 1
          //   return item.name.split('.').splice(-1).toString().toLowerCase() === 'pdf'
          // })
          this.filelist = data.files
        }
      })
    },
    changebox(e) {
      this.selecedBox = e
    },

    onConfirm() {
      this.$emit('selectedBox', this.selecedBox)
      this.visible = false
    }
  }
}
</script>

<style scoped lang="less">
/deep/.ant-checkbox-wrapper + .ant-checkbox-wrapper{
  margin-left: 0px;
}
.filelist{
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 15px;
}
/deep/ .ant-checkbox-group{
  display:grid ;
}

</style>
