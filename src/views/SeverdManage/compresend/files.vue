<template>
  <div>
    <div class="title">
      <Checkbox v-model="checkAll" :value="litId + type" @change="onCheckAllChange"><h3>{{ type === 1 ? '法律文书':'诉讼材料' }}</h3></Checkbox>
      <Button v-if="type === 2" class="send-button" type="primary" shape="round" @click="openDossier">引用卷宗</Button>
    </div>
    <div class="content">
      <CheckboxGroup v-model="checkList1" class="w-full" @change="onChange">
        <div v-for="item1 in list" :key="item1.id">
          <Checkbox :value="item1">
            <span @click="e => preview(e, item1)">{{ item1.name }}</span>
          </Checkbox>
        </div>
      </CheckboxGroup>
    </div>
    <DossierModal ref="dossierModal" @done="getDossierFile" />
    <Preview ref="preview" :file-list="fileList" />
  </div>
</template>

<script>
import { Checkbox, Button } from 'ant-design-vue'
import { listLitDip, getSendFile } from '@/api/send/index.js'
import Preview from '@/components/Preview/index'

import DossierModal from './dossierModal.vue'
export default {
  components: {
    CheckboxGroup: Checkbox.Group,
    Checkbox,
    Preview,
    DossierModal,
    Button
  },
  props: {
    checkList: { // 选中的数据
      type: Array,
      default: () => []
    },
    litId: { // 当事人id
      type: String,
      default: ''
    },
    caseId: { // 案件id
      type: String,
      default: ''
    },
    type: { // 1法律文书 2 诉讼材料
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      list: [],
      checkList1: [],
      showCheckAll: true,
      checkAll: null,
      fileList: [],
      indeterminate: false
    }
  },
  watch: {
    checkList1() {
      this.$emit('update:checkList', this.checkList1)
    },
    checkList() {
      this.checkList1 = this.checkList
      // this.checkAll = this.checkList1.length === this.list.length
    }
  },
  created() {

  },
  mounted() {
    if (this.type === 1) {
      this.getList()
    } else {
      this.getList1()
    }
  },
  methods: {
    // 获取发送材料
    getList() {
      if (!this.litId) {
        return
      }
      const params = {
        litigantId: this.litId
      }
      listLitDip(params).then(({ code, data }) => {
        if (code === 200) {
          this.list = data
        }
      })
    },
    getList1() {
      getSendFile({ lawCaseId: this.caseId }).then(({ code, data }) => {
        if (code === 200) {
          this.list = []
          if (data.evidence) {
            this.list.push({
              name: data.evidence.split('/').pop(),
              path: data.evidence
            })
          }
          if (data.indictment) {
            this.list.push({
              name: data.indictment.split('/').pop(),
              path: data.indictment
            })
          }
          console.log('当事人id')
          console.log(this.litId + this.type)
          Object.assign(this, {
            checkList1: [...this.list],
            checkAll: this.litId + this.type
          })
        }
      })
    },
    // 全选
    onCheckAllChange(e) {
      Object.assign(this, {
        checkList1: e.target.checked ? this.list : []
      })
    },
    onChange(checkedList) {
      this.indeterminate = !!checkedList.length && checkedList.length < this.list.length
      // this.checkAll = checkedList.length === this.list.length
    },
    // 引用卷宗
    openDossier() {
      this.$store.commit('SET_LAWCASE', this.caseId)
      this.$refs.dossierModal.show()
    },
    // 获取文书
    getDossierFile(obj) {
      this.list = [...this.list, ...obj.selectFiles]
      this.checkList1 = this.list
      // this.checkAll = true
    },
    // 预览
    preview(e, item) {
      if (e.preventDefault) {
        e.preventDefault()
      } else {
        window.event.returnValue == false
      }
      this.fileList = []
      this.$refs.preview.show(item.path, [])
    }
  }
}
</script>

<style scoped lang="less">
.title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  h3 {
    display: inline-block;
    font-weight: bolder;
  }
}
.content {
  margin-left: 20px;
  margin-top: 10px;
  font-size: 14px;
  /deep/.ant-checkbox-wrapper {
    font-size: 14px;
  }
}
</style>
