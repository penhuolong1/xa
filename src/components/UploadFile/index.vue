<template>
  <span>
    <FormItem ref="formItem" :label="label" class="wrapper">
      <Select v-decorator="[field, formOption]" mode="multiple" :show-arrow="false" :placeholder="placeholder" :disabled="disabled" allow-clear show-search>
        <SelectOption v-for="item in list" :key="item.id" :value="item.name">{{ item.name }}</SelectOption>
      </Select>
      <div class="icon" @click="upload">
        <Icon type="plus" />
      </div>
      <input ref="file" type="file" accept=".doc, .docx, .xls, .xlsx, .pdf" style="display:none;" @change="getFile($event)">
    </FormItem>
  </span>
</template>

<script>
import { Select, Form, Icon } from 'ant-design-vue'
import { queryForMoveCourt, updateForMoveCourt } from '@/api/sfAddcase/index.js'
import { mapGetters } from 'vuex'
export default {
  components: {
    FormItem: Form.Item,
    Select,
    Icon,
    SelectOption: Select.Option
  },
  props: {
    isForm: {
      type: Boolean,
      default: true
    },
    form: {
      type: Object,
      default: () => {}
    },
    label: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    field: {
      type: String,
      default: ''
    },
    formOption: {
      type: Object,
      default: () => {}
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    isNoReset: { // 切换当事人的时候不需要情况以有的选择
      type: Boolean,
      default: false
    },
    defaultValue: {
      type: String,
      default: undefined
    },
    type: {
      type: Number,
      default: 1 // 1 解协议书 2司法确认申请书 3调解笔录、4移送函、5权利义务告知书 6起诉状  7保全材料   8鉴定材料 9 送达地址确认书 10申请人身份材料 11 被申请身份材料 99 其他材料
    }
  },
  data() {
    return {
      list: [],
      isUpload: true
    }
  },
  computed: {
    ...mapGetters(['getSfLawCaseId'])
  },
  watch: {
    getLitigantId() {
      this.getData()
    }
  },
  created() {
    this.isUpload = false
    this.getData()
  },
  mounted() {

  },
  methods: {
    getData() {
      const params = {
        sfLawCaseId: this.getSfLawCaseId,
        type: this.type
      }

      queryForMoveCourt(params).then(({ code, data }) => {
        if (code === 200) {
          this.list = data
          if (this.isUpload) {
            this.form.setFieldsValue({ [this.field]: [data[data.length - 1].name] })
          }
          // this.form.setFieldsValue({[this.field]: })
        }
      })
    },
    // 上传文书
    upload() {
      const event2 = document.createEvent('MouseEvents')
      event2.initEvent('click', false, true)
      this.$refs.file.dispatchEvent(event2)
    },
    // 上传文件
    getFile(e) {
      const file = e.target.files[0]
      if (!file) return
      console.log(file)
      const param = new FormData() // 创建form对象
      param.append('file', file) // 通过append向form对象添加数据
      param.append('type', this.type)
      param.append('sfLawCaseId', this.getSfLawCaseId)
      const hide = this.$message.loading('正在上传')
      updateForMoveCourt(param).then(({ code, msg }) => {
        hide()
        if (code === 200) {
          this.$refs.file.value = ''
          this.$message.success(msg)
          this.isUpload = true
          this.getData()
          this.$emit('done')
        }
      })
    },
    change(e) {
      this.$emit('change', e)
    }
  }
}
</script>

<style scoped lang="less">
.wrapper {
  position: relative;
  .icon {
    position: absolute;
    right: 0px;
    top: -5px;
    width: 30px;
    height: 30px;
    #center();
    cursor: pointer;
    color: @theme-color;
  }
}
</style>
