export const elesendColumns = [
  {
    title: '送达方式',
    dataIndex: 'type',
    key: 'type',
    width: 100
  },
  {
    title: '发送号码',
    dataIndex: 'goal',
    key: 'goal',
    width: 150
  },
  {
    title: '发送时间',
    dataIndex: 'sendTime',
    key: 'sendTime',
    width: 200
  },
  {
    title: '发送内容',
    dataIndex: 'content',
    key: 'content',
    // scopedSlots: { customRender: 'diplomsList' },
    width: 250
  },
  // {
  //   title: '材料',
  //   dataIndex: 'materialFileList',
  //   key: 'materialFileList',
  // scopedSlots: { customRender: 'diplomsList' },
  // width: 250
  // },
  {
    title: '回执信息',
    dataIndex: 'receipt',
    key: 'receipt',
    // scopedSlots: { customRender: 'sendFileList' },
    width: 100
  },
  {
    title: '回执时间',
    dataIndex: 'receiptTime',
    key: 'receiptTime',
    width: 200
  },
  {
    title: '送达结果',
    dataIndex: 'result',
    key: 'result',
    width: 100
  },
  {
    title: '发送状态',
    dataIndex: 'state',
    key: 'state',
    width: 150
  },
  {
    title: '送达人员',
    dataIndex: 'userName',
    key: 'userName',
    width: 150
  },
  {
    title: '操作',
    scopedSlots: { customRender: 'operation' },
    width: 150
  }
]

export const scenesendColumns = [// 现场领取
  {
    title: '送达方式',
    dataIndex: 'type',
    key: 'type',
    width: 100
  },
  {
    title: '领取时间',
    dataIndex: 'sendTime',
    key: 'sendTime',
    width: 150
  },
  {
    title: '送达回执',
    dataIndex: 'sendFileList',
    key: 'sendFileList',
    scopedSlots: { customRender: 'sendFileList' },
    width: 200
  },
  {
    title: '回执时间',
    dataIndex: 'receiptTime',
    key: 'receiptTime',
    width: 200
  },
  {
    title: '送达结果',
    dataIndex: 'result',
    key: 'result',
    // scopedSlots: { customRender: 'diplomsList' },
    width: 250
  },
  {
    title: '送达人员',
    dataIndex: 'userName',
    key: 'userName',
    // scopedSlots: { customRender: 'diplomsList' },
    width: 250
  },
  {
    title: '操作',
    scopedSlots: { customRender: 'operation' },
    width: 150
  }
]
