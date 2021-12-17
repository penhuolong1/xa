import { relation, addResstype, lawerRelation, idCardType } from '@/type/index.js'

// 基本信息
export const schema = [
  {
    field: 'name',
    label: '代理人姓名',
    type: 'input',
    required: true
  },
  {
    field: 'company',
    label: '所在单位',
    type: 'input'
  },
  {
    field: 'idCardType',
    label: '证件类型',
    type: 'select',
    required: true,
    options: idCardType
  },
  {
    field: 'idCard',
    label: '证件号码',
    type: 'input',
    required: true
  },
  {
    field: 'idCardPath',
    label: '代理人证件',
    span: 2,
    type: 'upload',
    showType: 'path',
    action: '/api/court/file/uploadQtwEvidenceFile'
  },
  {
    field: 'lawFirmLetter',
    label: '律师事务所函',
    span: 2,
    type: 'upload',
    showType: 'path',
    action: '/api/court/file/uploadQtwEvidenceFile'
  }
]
// 联系方式
export const schema1 = [
  {
    field: 'relation',
    label: '与当事人关系',
    type: 'select',
    options: relation
  },
  {
    field: 'phone',
    label: '联系电话',
    type: 'input'
  },
  {
    field: 'remark',
    label: '标记',
    type: 'checkbox',
    options: [
      {
        value: '打印到邮单',
        label: '打印到邮单'
      },
      {
        value: '明确送达联系方式',
        label: '明确送达联系方式'
      }
    ]
  }
]
// 地址
export const schema2 = [
  {
    field: 'type',
    label: '地址类型',
    type: 'select',
    options: addResstype
  },
  {
    field: 'validityDate',
    label: '有效期',
    type: 'date',
    showTime: true
  },
  {
    field: 'address',
    label: '详细地址',
    type: 'input',
    span: 2
  },
  {
    field: 'remark',
    label: '标记',
    type: 'checkbox',
    span: 2,
    options: [
      {
        value: '打印到邮单',
        label: '打印到邮单'
      },
      {
        value: '明确送达地址',
        label: '明确送达地址'
      }
    ]
  }
]
// 其他信息
export const schema3 = [
  {
    field: 'email',
    label: '电子邮箱',
    type: 'input'
  },
  {
    field: 'otherLink',
    label: '其他联系方式',
    type: 'input'
  }
]
