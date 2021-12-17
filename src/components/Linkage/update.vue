<template>
  <div>
    <Modal
      v-model="visible"
      title="修改"
      :mask-closable="false"
      style="width:600px"
    >
      <Form ref="form" :label-col="6" :wrapper-col="18" :schema="schema" />
      <template slot="footer">
        <Button key="back" @click="visible=false">
          取消
        </Button>
        <Button key="submit" type="primary" :loading="loading" @click="submit">
          确定
        </Button>
      </template>
    </Modal>
  </div>
</template>
<script>
import { Button, Modal } from 'ant-design-vue'
import { teamInfoById, updateTeam } from '@/api/sfAddcase/index.js'

import Form from '@/components/Form'

export default {
  components: {
    Button,
    Modal,
    Form
  },
  props: {
    selectedRows: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      loading: false,
      visible: false,
      info: {},
      form: this.$form.createForm(this, { name: 'form' })
    }
  },
  computed: {
    schema() {
      return [
        {
          label: '发起者',
          type: 'input',
          field: 'initiatorName',
          disabled: true,
          formOption: { initialValue: this.info.initiatorName }
        },
        {
          label: '发起时间',
          type: 'input',
          disabled: true,
          field: 'createTime',
          formOption: { initialValue: this.info.createTime }
        },
        {
          label: '联动类型',
          type: 'select',
          disabled: true,
          field: 'type',
          options: [
            {
              value: 1,
              label: '联动调解'
            },
            {
              value: 2,
              label: '咨询'
            }
          ],
          formOption: { initialValue: this.info.type }
        },
        {
          label: '最迟完成',
          type: 'input',
          suffix: '天内',
          disabled: true,
          field: 'days',
          formOption: { initialValue: this.info.days },
          vIf: () => {
            return this.type == 2
          }
        },
        {
          label: '联动事由',
          type: 'textArea',
          field: 'reason',
          formOption: { initialValue: this.info.reason }
        },
        {
          label: '文件',
          type: 'upload',
          field: 'input3',
          formOption: { initialValue: '' }
        },
        {
          label: '联动单位',
          type: 'input',
          field: 'input4',
          disabled: true,
          formOption: { initialValue: '' }
        },
        {
          label: '联动组织',
          type: 'input',
          field: 'input5',
          disabled: true,
          formOption: { initialValue: '' }
        },
        {
          label: '联动者',
          type: 'input',
          field: 'input6',
          disabled: true,
          formOption: { initialValue: '' }
        }
      ]
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    show(id) {
      this.teamId = id
      this.visible = true
      this.getData()
    },
    submit() {
      this.$refs.form.getFieldsValue().then(res => {
        const params = {
          id: this.teamId
        }
        params.reason = res.reason
        this.loading = true
        updateTeam(params).then(({ code, msg }) => {
          this.loading = false
          if (code === 200) {
            this.$message.success(msg)
            this.visible = false
            this.$emit('done')
          }
        })
      })
    },
    // 获取数据
    getData() {
      teamInfoById({ sfTeamId: this.teamId }).then(({ code, data }) => {
        if (code === 200) {
          this.type = data.type
          this.info = { ...data }
          this.info.createTime = data.createTime ? this.$moment(data.createTime).format('YYYY-MM-DD') : ''
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
</style>
