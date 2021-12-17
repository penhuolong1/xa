
import { areaType, trialFieldType, caseCategory, caseInvolve, caseType, objectAction, caseSource, litigationType, litigationScene } from '@/type/index.js'
import { getBrief } from '@/api/addCase/index.js'

export const schema1 = [ // 案件分配
  {
    field: 'receiveDepartmentId',
    label: '收案部门',
    type: 'department'
  },
  {
    field: 'receivePeopleId',
    label: '收案登记人',
    type: 'judge',
    userType: 7
  },
  {
    field: 'approvedPeopleId',
    label: '预立案审批人',
    type: 'judge',
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
