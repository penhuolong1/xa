<template>
  <div>
    <Form ref="form" :label-col="6" :wrapper-col="14" :schema="schema" @change="change" />
    <span v-for="item in group" :key="item.key">
      <LinkagePersonForm :ref="'linkagePersonForm'+item.key" :link-agetype="type" @del="del(item.key)" />
    </span>
    <Row>
      <Col :span="6" />
      <Col :span="18">注意: 单位/组织必选一项填写</Col>
    </Row>
    <Col :span="6" />
    <Col>
      <Button class="mr-2.5" @click="visible=false">
        取消
      </Button>
      <Button v-if="type === 1" class="mr-2.5" type="primary" @click="addGroup">
        新增一组
      </Button>
      <Button type="primary" :loading="loading" @click="submit">
        确定
      </Button>
    </Col>
  </div>
</template>

<script>
import { Button, Row, Col } from 'ant-design-vue'
import Form from '@/components/Form'
import { addTeam } from '@/api/sfAddcase/index.js'
import LinkagePersonForm from '@/components/Linkage/linkagePersonForm.vue'

import { mapGetters } from 'vuex'
export default {
  components: {
    Button,
    Row,
    Col,
    LinkagePersonForm,
    Form
  },
  props: {
  },
  data() {
    return {
      loading: false,
      visible: false,
      form: this.$form.createForm(this, { name: 'form' }),
      type: null, // 1协助调解 2咨询
      caseId: '',
      group: [
        {
          key: (new Date()).getTime()
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['getSfCaseInfo']),
    schema() {
      return [
        {
          label: '联动类型',
          type: 'select',
          field: 'type',
          formOption: { rules: [{ required: true, message: '请选择联动类型' }], initialValue: undefined },
          options: [
            {
              value: 1,
              label: '协助调解'
            },
            {
              value: 2,
              label: '咨询'
            }
          ]
        },
        {
          label: '最迟完成',
          type: 'input',
          field: 'days',
          suffix: '天内',
          formOption: { rules: [{ required: true, message: '最迟完成天数' }], initialValue: '' },
          vIf: () => {
            return this.type === 2
          }
        },
        {
          label: '联动事由',
          type: 'textArea',
          field: 'reason',
          formOption: { rules: [{ required: true, message: '联动事由' }], initialValue: '' }
        },
        {
          label: '文件',
          type: 'upload',
          field: 'fileIds',
          showType: 'filePath',
          action: '/api/sf/file/uploadSfFile',
          formOption: { rules: [{ required: true, message: '联动事由' }], initialValue: '' }
        }
      ]
    }
  },
  created() {

  },
  mounted() {

  },
  methods: {
    submit() {
      this.$refs.form.getFieldsValue().then(res => {
        const params = {
          ...res
        }
        params.fileIds = params.fileIds && params.fileIds.length ? params.fileIds.map(item => item.id) : []
        params.bos = []
        if (!this.group || this.group.length === 0) {
          this.$message.error('至少填写一组的数据')
          return
        }
        this.group.forEach(item => {
          const refsName = 'linkagePersonForm' + item.key
          const obj = this.$refs[refsName][0].getData()
          if (!obj.unitId && !obj.orgId) {
            this.$message.error('单位和组织至少选一个')
            return
          }
          params.bos.push(obj)
        })
        params.caseId = this.getSfCaseInfo.id
        this.loading = true
        addTeam(params).then(({ code, msg }) => {
          this.loading = false
          if (code === 200) {
            this.$message.success(msg)
            this.visible = false
            this.$emit('done')
            this.$refs.form.resetFields()
            this.type = null
            this.group = [
              {
                key: (new Date()).getTime()
              }
            ]
          }
        })
      })
    },
    // 新增一组
    addGroup() {
      this.group.push(
        {
          key: (new Date()).getTime()
        }
      )
    },
    // 表单选择触发
    change(e) {
      if (e.field === 'type') {
        this.type = e.value.type
      }
    },
    // 删除
    del(key) {
      this.group = this.group.filter((item, index) => {
        return item.key !== key
      })
    }
  }
}
</script>

<style scoped lang="less">
.form-wrapper {
  width: 100%;
  display: flex;
  min-height: 400px;
  border: 1px solid rgba(0,0,0,0.10);
  margin-top: 20px;
  .form-left {
    width: 150px;
    border-right: 1px solid rgba(0,0,0,0.10);
    li {
      line-height: 40px;
      text-align: center;
      color: rgba(0,0,0,0.20);
      font-size: 16px;
      cursor: pointer;
      &.active {
        background-color: #e0f0ff;
        color: @theme-color;
      }
    }
  }
  .form-right {
    flex: 1;
    padding: 30px 20px;
  }
  .form {
    width: 600px;
    margin: 0 auto;
  }
}
ul {
  display: flex;
  li {
    margin-right: 10px;
    &.active {
      border-bottom: 1px solid @theme-color;
    }
  }
}
</style>
