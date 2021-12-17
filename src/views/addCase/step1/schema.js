
import { areaType, trialFieldType, caseCategory, caseInvolve, caseType, objectAction, caseSource, litigationType, litigationScene } from '@/type/index.js'
export const schema = [ // 案件详情数据
  {
    field: 'preCaseNo',
    label: '预案号',
    type: 'caseNo',
    isNeedButton: false,
    typeList: trialFieldType,
    inputDisabled: true,
    required: true
  },
  {
    field: 'plaintDate',
    label: '收到诉状日期',
    type: 'date',
    required: true
  },
  {
    field: 'preFilingDate',
    label: '预立案日期',
    type: 'date',
    required: true
  },
  {
    field: 'caseType',
    label: '案件类型',
    type: 'select',
    options: caseType
  },
  {
    field: 'caseCategory',
    label: '新案件类别',
    type: 'select',
    required: true,
    options: caseCategory
  },
  {
    field: 'caseSource',
    label: '新案件来源',
    type: 'select',
    options: caseSource
  },
  {
    field: 'brief',
    label: '立案案由',
    type: 'brief',
    required: true
  },
  {
    field: 'subjectAmount',
    label: '起诉标的金额',
    type: 'input'
  },
  {
    field: 'costs',
    label: '诉讼费缴交金额',
    type: 'input'
  },
  {
    field: 'preservation',
    label: '诉讼保全',
    type: 'radio',
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
    field: 'canSendDate',
    label: '可启用送达日期',
    // showTime: true, // 是否需要时分秒
    hidden: true,
    type: 'date'
  },
  {
    field: 'judicialExpertise',
    label: '司法鉴定',
    type: 'radio',
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
    field: 'applicableProcedures',
    label: '适用程序',
    type: 'radio',
    options: [
      {
        value: '小额案件',
        label: '小额案件'
      },
      {
        value: '简易程序',
        label: '简易程序'
      },
      {
        value: '普通程序',
        label: '普通程序'
      }
    ]
  },
  {
    field: 'preMediate',
    label: '诉前调解',
    type: 'radio',
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
    label: ''
  },
  {
    field: 'litigationScene',
    label: '诉讼场景',
    type: 'select',
    options: litigationScene,
    required: true
  },
  {
    field: 'jurisdictionBasis',
    label: '管辖依据',
    type: 'select'
  },
  {
    label: ''
  },
  {
    field: 'claim',
    label: '诉讼请求',
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
export const schema1 = [ // 案件分配
  {
    field: 'receiveDepartmentId',
    label: '收案部门',
    type: 'department'
  },
  {
    field: 'receivePeopleId',
    label: '收案登记人',
    type: 'select',
    // userType: 7
    disabled: true
  },
  {
    field: 'approvedPeopleId',
    label: '预立案审批人',
    type: 'select',
    userType: 6,
    required: false
  },
  {
    field: 'assistantJudgeId',
    label: '法官助理',
    type: 'judge',
    userType: 3,
    required: false
  },
  {
    field: 'recorderId',
    label: '速录员',
    type: 'judge',
    userType: 5
  },
  {
    label: ''
  },
  {
    field: 'courtSend',
    label: '是否本院送达',
    type: 'radio',
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
    field: 'sendDepartmentId',
    label: '案件送达部门',
    type: 'department'
  },
  {
    label: ''
  }
]
export const schema2 = [ // 其他要素
  {
    field: 'publicWelfare',
    label: '公益诉讼',
    type: 'radio',
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
    field: 'bigCase',
    label: '大要案',
    type: 'radio',
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
    field: 'involveFour',
    label: '是否四涉案件',
    type: 'radio',
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
    field: 'involveArmy',
    label: '涉军',
    type: 'radio',
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
    field: 'area',
    label: '涉及地区',
    type: 'select',
    options: areaType
  },
  {
    field: 'caseInvolve',
    label: '案件涉及',
    type: 'select',
    options: caseInvolve
  },
  {
    field: 'objectAction',
    label: '诉讼标的行为',
    type: 'select',
    options: objectAction
  },
  {
    field: 'subjectMatter',
    label: '起诉标的物',
    type: 'select'
  },
  {
    field: 'litigationType',
    label: '诉的种类',
    type: 'select',
    options: litigationType
  }
]
