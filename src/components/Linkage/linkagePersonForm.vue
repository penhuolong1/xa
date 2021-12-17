<template>
  <Form :form="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 14 }">
    <Row v-if="linkAgetype === 1">
      <Col :span="6" />
      <Col :span="18"><Button type="danger" size="small" @click="del">删除该组</Button></Col>
    </Row>
    <SfDepCount
      field="unitId"
      :form-option="{ initialValue: '' }"
      codes="11,12,13"
      label="联动单位"
      @change="getUnitId"
    />
    <FormItem v-if="ancestorId == 116" label="流转至">
      <RadioGroup
        v-decorator="[
          'orCadre',
          { rules: [{ required: true, message: '请选择' }], initialValue: false},
        ]"
        @change="getOrCadre"
      >
        <Radio :value="true">法院诉前案管</Radio>
        <Radio :value="false">法院诉非平台</Radio>
      </RadioGroup>
    </FormItem>
    <Judge
      v-if="ancestorId == 116 && orCadre"
      label="联络人员"
      field="judgeId"
      :form-option="{ rules: [{ required: true,message:'请选择联络人员'}] }"
    />
    <SfDepCount
      v-if="!(ancestorId == 116 && orCadre)"
      field="orgId"
      :form-option="{ initialValue: '' }"
      :form="form"
      :ancestor-id="ancestorId"
      codes="14"
      label="联动组织"
      @change="getOrgId"
    />
    <SfMediator
      v-if="!(ancestorId == 116 && orCadre)"
      field="mediatorId"
      :form-option="{ initialValue: '' }"
      :form="form"
      :dept-id="depId"
      label="联动员"
      @change="getPeople"
    />
  </Form>
</template>

<script>
import { Button, Row, Col, Form, Radio } from 'ant-design-vue'
import { pointCase, addTeam, updateTeam } from '@/api/sfAddcase/index.js'
import SfDepCount from '@/components/Common/SfDepCount.vue'
import Judge from '@/components/Common/Judge.vue'
import SfMediator from '@/components/Common/SfMediator.vue'
import { mapGetters } from 'vuex'
export default {
  components: {
    Form,
    FormItem: Form.Item,
    Button,
    Judge,
    Radio,
    RadioGroup: Radio.Group,
    Col,
    Row,
    SfMediator,
    SfDepCount
  },
  props: {
    linkAgetype: {
      type: Number,
      default: null // 1协助调解 2咨询
    }
  },
  data() {
    return {
      resultState: undefined,
      orCadre: false,
      isLinkPeople: false,
      num: 1,
      nowIndex: 0,
      form: this.$form.createForm(this, { name: 'form' }),
      ancestorId: '',
      accept: true,
      menuIndex: 0,
      type: undefined,
      depId: ''
    }
  },
  computed: {
  },
  created() {

  },
  mounted() {

  },
  methods: {
    getOrCadre(e) {
      this.orCadre = e.target.value
    },
    getType(e) {
      this.type = e
    },
    getUnitId(e) {
      this.ancestorId = e
      this.depId = e
      this.$emit('isLinkPeople', false)
    },
    getOrgId(e) {
      this.depId = e
      this.$emit('isLinkPeople', false)
    },
    getPeople(e) {
      if (e) {
        this.$emit('isLinkPeople', true)
      } else {
        this.$emit('isLinkPeople', false)
      }
    },
    // 删除
    del() {
      this.$emit('del')
    },
    getData() {
      return this.form.getFieldsValue()
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
