
import { areaType, trialFieldType, caseCategory, caseInvolve, caseType, objectAction, caseSource, litigationType, litigationScene } from '@/type/index.js'
export const schema = [ // 案件详情数据
  {
    field: 'serialNumber',
    label: '申请流水号',
    type: 'input',
    disabled: true,
    required: true
  },
  {
    field: 'caseSourceStr',
    label: '纠纷来源',
    type: 'input',
    disabled: true,
    required: true
  },
  {
    field: 'caseType',
    label: '纠纷类型',
    type: 'select',
    required: true,
    options: caseType
  },
  {
    field: 'brief',
    label: '申请事由',
    type: 'brief',
    required: true
  },
  {
    field: 'applyDate',
    label: '申请日期',
    type: 'date',
    // showTime: true,
    required: true
  },
  {
    field: 'subjectAmount',
    label: '纠纷金额',
    inputType: 'number',
    type: 'input',
    required: true
  },
  // {
  //   field: 'preservation',
  //   label: '诉讼保全',
  //   type: 'radio',
  //   options: [
  //     {
  //       value: true,
  //       label: '是'
  //     },
  //     {
  //       value: false,
  //       label: '否'
  //     }
  //   ]
  // },
  // {
  //   field: 'judicialExpertise',
  //   label: '司法鉴定',
  //   type: 'radio',
  //   options: [
  //     {
  //       value: true,
  //       label: '是'
  //     },
  //     {
  //       value: false,
  //       label: '否'
  //     }
  //   ]
  // },
  // {
  //   label: ''
  // },
  {
    field: 'claim',
    label: '请求事项',
    span: 3,
    type: 'textArea'
  },
  {
    field: 'factReason',
    label: ' 事实与理由',
    span: 3,
    type: 'textArea'
  }
]
