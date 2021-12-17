<template>
  <div>
    <Modal
      v-model="ishome"
      title="上门送达"
      :mask-closable="false"
      width="500px"
    >
      <Form :schema="schema" @change="change" />
    </Modal>
  </div>
</template>

<script>
import Form from '@/components/Form/index'
import { Modal } from 'ant-design-vue'

const schema = [
  {
    label: '当事人',
    type: 'input',
    field: 'nickName',
    formOption: { rules: [{ required: true, message: '请输入当事人姓名' }] }
  },
  {
    label: '使用关联关系',
    type: 'radio',
    field: 'relationship',
    options: [
      {
        value: true,
        label: '是'
      },
      {
        value: false,
        label: '否'
      }
    ]
  },
  {
    label: '上门地址',
    type: 'select',
    field: 'address'
  },
  {
    label: '指派送达员',
    type: 'radio',
    field: 'service',
    formOption: { rules: [{ required: true, message: '请选择是否指派上门送达员' }] },
    options: [
      {
        value: true,
        label: '是'
      },
      {
        value: false,
        label: '否'
      }
    ]
  },
  {
    label: '上门时间',
    type: 'date',
    field: ['homeStartDate', 'homeEndDate'],
    showTime: true,
    formOption: { rules: [{ required: true, message: '请选择上门时间' }] }
  },
  {
    label: '上门情况',
    type: 'select',
    field: 'status',
    formOption: { rules: [{ required: true, message: '请选择上门情况' }] }
  },
  {
    label: '送达回执',
    type: 'upload',
    field: 'filds'
  },
  {
    label: '回执时间',
    type: 'date',
    field: ['ReceiptStartDate', 'ReceiptEndDate']
  },
  {
    label: '备注',
    type: 'textArea',
    field: 'remark'
  },
  {
    label: '送达结果',
    type: 'select',
    field: 'result'
  }
]
const schema1 = [
  {
    label: '当事人',
    type: 'input',
    field: 'nickName',
    formOption: { rules: [{ required: true, message: '请输入当事人姓名' }] }
  },
  {
    label: '使用关联关系',
    type: 'radio',
    field: 'relationship',
    options: [
      {
        value: true,
        label: '是'
      },
      {
        value: false,
        label: '否'
      }
    ]
  },
  {
    label: '上门地址',
    type: 'select',
    field: 'address'
  },
  {
    label: '指派送达员',
    type: 'radio',
    field: 'service',
    formOption: { rules: [{ required: true, message: '请选择是否指派上门送达员' }] },
    options: [
      {
        value: true,
        label: '是'
      },
      {
        value: false,
        label: '否'
      }
    ]
  },
  {
    label: '集中指派',
    type: 'radio',
    field: 'focus',
    formOption: { rules: [{ required: true, message: '请选择是否集中指派' }] },
    options: [
      {
        value: true,
        label: '是'
      },
      {
        value: false,
        label: '否'
      }
    ]
  },
  {
    label: '备注',
    type: 'textArea',
    field: 'remark'
  }
]
const schema2 = [
  {
    label: '当事人',
    type: 'input',
    field: 'nickName',
    formOption: { rules: [{ required: true, message: '请输入当事人姓名' }] }
  },
  {
    label: '使用关联关系',
    type: 'radio',
    field: 'relationship',
    options: [
      {
        value: true,
        label: '是'
      },
      {
        value: false,
        label: '否'
      }
    ]
  },
  {
    label: '上门地址',
    type: 'select',
    field: 'address'
  },
  {
    label: '指派送达员',
    type: 'radio',
    field: 'service',
    formOption: { rules: [{ required: true, message: '请选择是否指派上门送达员' }] },
    options: [
      {
        value: true,
        label: '是'
      },
      {
        value: false,
        label: '否'
      }
    ]
  },
  {
    label: '集中指派',
    type: 'radio',
    field: 'focus',
    formOption: { rules: [{ required: true, message: '请选择是否集中指派' }] },
    options: [
      {
        value: true,
        label: '是'
      },
      {
        value: false,
        label: '否'
      }
    ]
  },
  {
    label: '上门送达员',
    type: 'select',
    field: 'serviceman',
    formOption: { rules: [{ required: true, message: '请选择上门送达员' }] }
  },
  {
    label: '最迟完成天数',
    type: 'input',
    field: 'finish',
    formOption: { rules: [{ required: true, message: '请输入最迟完成天数' }] }
  },
  {
    label: '备注',
    type: 'textArea',
    field: 'remark'
  }
]

export default {
  components: {
    Form,
    Modal
  },
  props: {
  },

  data() {
    return {
      schema,
      schema1,
      schema2,
      ishome: false
    }
  },
  created() {
    console.log(this.schema)
  },
  mounted() {
  },
  methods: {
    show() {
      this.ishome = true
    },
    change({ field, type, value }) {
      console.log(field, type, value)
      if (field === 'service') {
        if (!value.service) {
          this.schema = schema
        } else {
          this.schema = schema1
        }
      }
      if (field === 'focus') {
        if (value.focus) {
          this.schema = schema1
        } else {
          this.schema = schema2
        }
      }
    }
  }
}
</script>

<style scoped lang="less">
</style>
