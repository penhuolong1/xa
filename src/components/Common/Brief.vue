<template>
  <!-- 案由 -->
  <span class="w-full">
    <FormItem v-if="isForm" :label="label">
      <div v-decorator="[field, formOption]" class="brief-wrapper form-brief-wrapper">
        <div class="wrapper-inner">
          <div class="content" @click="open">
            <div v-if="!txt" class="placeholder">请选择</div>
            <div v-if="txt" class="txt">{{ txt }}</div>
          </div>
          <div>
            <Icon class="down icon" type="down" />
            <Icon class="close icon" type="close-circle" theme="filled" @click="close" />
          </div>
        </div>
      </div>
    </FormItem>
    <div v-if="!isForm" class="brief-wrapper">
      <div class="content" @click="open">
        <div v-if="!txt" class="placeholder">请选择</div>
        <div v-if="txt" class="txt">{{ txt }}</div>
      </div>
      <div>
        <Icon class="down icon" type="down" />
        <Icon class="close icon" type="close-circle" theme="filled" @click="close" />
      </div>
    </div>
    <Modal
      title="案由"
      :visible="visible"
      :mask-closable="false"
      width="500px"
      @cancel="visible = false"
    >
      <div>
        <label class="mr-2.5">案由类型:</label>
        <RadioGroup v-model="type" @change="changeType">
          <Radio value="civil">民事</Radio>
          <Radio value="criminal">刑事</Radio>
        </RadioGroup>
      </div>
      <InputSearch v-model="searchVal" class="mt-2.5 mb-2.5" placeholder="输入名字搜索" @search="search" />
      <Tree :tree-data="treeData" :replace-fields="replaceFields" @select="selectTreeFun" />
      <Empty v-if="!treeData || treeData.length === 0" />
      <template slot="footer">
        <Button @click="visible = false">
          取消
        </Button>
        <Button type="primary" @click="submit">
          确认
        </Button>
      </template>
    </Modal>
  </span>
</template>

<script>
import { Modal, Icon, Tree, Button, Radio, Input, Empty, Form } from 'ant-design-vue'
import { getBrief, briefTree } from '@/api/addCase/index'
import { mapGetters } from 'vuex'
export default {
  components: {
    Icon,
    Modal,
    FormItem: Form.Item,
    InputSearch: Input.Search,
    Tree,
    Radio,
    Empty,
    RadioGroup: Radio.Group,
    Button
  },
  props: {
    isForm: {
      type: Boolean,
      default: true
    },
    briefName: {
      type: String,
      default: ''
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
    value: {
      type: String,
      default: undefined
    }
  },
  data() {
    return {
      visible: false,
      type: 'civil', // 案由类型
      treeData: [],
      selectId: '', // 选择的id
      searchVal: '',
      txt: '', // 选择的名字
      replaceFields: {
        title: 'lawName',
        key: 'lawId',
        children: 'childes'
      }
    }
  },
  computed: {
    ...mapGetters(['getLitigantId'])
  },
  watch: {
    briefName() {
      this.txt = this.briefName
    }
  },
  created() {
    this.txt = this.briefName
  },
  mounted() {

  },
  methods: {
    open() {
      this.type = 'civil'
      this.searchVal = ''
      this.getData()
    },
    // 改变类型
    changeType() {
      this.searchVal = ''
      this.getData()
    },
    // 清空
    close() {
      this.selectId = ''
      this.txt = ''
      this.$emit('change', '')
      this.$emit('input', '')
    },
    getData() {
      // 获取案由
      briefTree(this.type).then(({ code, data }) => {
        // this.fetching = false
        if (code === 200) {
          if (!data || data.length === 0) {
            this.treeData = []
            return
          }
          this.treeData = data
          this.visible = true
        }
      })
    },
    // 搜索
    search(e) {
      if (!e) {
        this.getData()
        return
      }
      getBrief({ name: e }).then(({ code, data }) => {
        if (code === 200) {
          if (!data.records || data.records.length === 0) {
            this.treeData = []
            return
          }
          this.treeData = data.records.map(item => {
            return {
              lawId: item.id,
              lawName: item.name
            }
          })
        }
      })
    },
    fetchUser(value) {
      this.data = []
      this.getData(value)
    },
    selectTreeFun(e, row) {
      this.selectId = e[0]
      this.txt = row.selectedNodes[0].data.props.title
    },
    submit(e) {
      if (!this.selectId) {
        this.$message.error('请选择案由')
        return
      }
      if (this.isForm) {
        this.form.setFieldsValue({
          [this.field]: this.selectId
        })
      }
      this.$emit('change', this.selectId)
      this.$emit('input', this.selectId)
      this.visible = false
    },
    change(e) {
      this.$emit('change', e)
      this.$emit('input', e)
    }
  }
}
</script>

<style scoped lang="less">
.brief-wrapper {
  display: flex;
  max-width: 250px;
  padding: 5px 12px;
  justify-content: space-between;
  cursor: pointer;
  &.form-brief-wrapper {
    width: 100%;
    max-width: 100%;
    height: 40px;
    line-height: 40px;
    padding: 3px 0;
  }
  .wrapper-inner {
    border: 1px solid #d9d9d9;
    width: 100%;
    padding: 0 12px;
    display: flex;
    align-items: center;
    border-radius: 3px;
  }
  &:hover {
    .down {
      display: none;
    }
    .close {
      display: block;
    }
  }
  .content {
    flex: 1;
    width: calc(100% - 50px);
    .txt {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .placeholder {
      color: #bfbfbf;
    }
  }
}
.close {
  display: none;
}
.icon {
  color: #bfbfbf;
}
</style>
