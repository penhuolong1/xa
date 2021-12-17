<template>
  <Modal
    v-model="visible"
    title="切换角色"
    class="modal"
    width="500px"
    :mask-closable="false"
    @cancel="visible=false"
  >
    <Form ref="form" :label-col="8" :schema="schema" @change="change" />
    <template slot="footer">
      <Button @click="visible = false">
        取消
      </Button>
      <Button type="primary" :loading="loading" @click="handleOk">
        确认
      </Button>
    </template>
  </Modal>
</template>
<script>
import { Modal, Button, Col, Row } from 'ant-design-vue'
import { changeRole } from '@/api/user/user.js'
import Form from '@/components/Form/index'
import { mapGetters } from 'vuex'
export default {
  components: {
    Modal,
    Col,
    Row,
    Form,
    Button
  },
  props: {
  },
  data() {
    return {
      visible: false,
      loading: false,
      depList: [],
      list: [],
      deptId: '',
      roleList: [],
      role: '',
      type: 1, // 1 账号密码登陆 2短信验证码登陆
      form: this.$form.createForm(this, { name: 'form' })
    }
  },
  computed: {
    ...mapGetters(['getUserInfo']),
    schema() {
      return [
        {
          type: 'select',
          label: '单位',
          field: 'deptId',
          formOption: { rules: [{ required: true, message: '请选择单位' }] },
          options: this.depList
        },
        {
          type: 'radio',
          label: '角色',
          field: 'type',
          formOption: { rules: [{ required: true, message: '请选择角色' }], initialValue: this.role || undefined },
          options: this.roleList,
          vIf: () => {
            return this.deptId
          }
        }
      ]
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    show(data) {
      this.list = data
      this.init(data)
      this.visible = true
    },
    // 初始化数据
    init(data) {
      this.depList = data.map(item => {
        return {
          value: item.deptId,
          label: item.deptName
        }
      })
    },
    change(e) {
      if (e.field === 'deptId') {
        this.getRoleList(e.value.deptId)
        this.deptId = e.value.deptId
      }
    },
    // 获取角色信息
    getRoleList(id) {
      if (!id) {
        return
      }
      const list = this.list.find(item => item.deptId === id)
      this.roleList = list.typeList.map(item => {
        return {
          value: item.type,
          label: item.type === 'mediate_mediator' ? '调解员' : '联络员'
        }
      })
      this.role = this.roleList.length === 1 ? this.roleList[0].value : ''
    },
    handleOk() {
      this.$refs.form.getFieldsValue().then(res => {
        const params = {
          ...res
        }
        this.loading = true
        changeRole(params).then(({ code, msg }) => {
          this.loading = false
          if (code === 200) {
            this.$message.success(msg)
            setTimeout(() => {
              location.reload()
            }, 300)
          }
        })
      })
    }
  }
}
</script>

<style scoped lang="less">
.no-margin {
  margin: 0;
}
.btn {
  width: 90%;
}
/deep/.mystyle {
  display: flex;
  .ant-form-item-label {
    line-height: 1.5;
  }
}
</style>
