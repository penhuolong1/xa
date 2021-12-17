import { addResstype } from '@/type/index.js'
import { Modal, Button, Form, Checkbox, Select } from 'ant-design-vue'
import { formatDate } from '@/utils/format.js'

const nowTime = formatDate(new Date(), 'YYYY-MM-DD H:m:s')
const expressSituation = [ // 快递邮寄情况
  {
    value: '本人签收',
    label: '本人签收'
  },
  {
    value: '他人签收',
    label: '他人签收'
  },
  {
    value: '退回',
    label: '退回'
  }
]
export default {
  components: {
    Modal,
    Select,
    SelectOption: Select.Option,
    FormItem: Form.Item,
    Checkbox,
    CheckboxGroup: Checkbox.Group,
    Button
  },
  data() {
  },
  mounted() {
  },
  computed: {
    schema() {
      return [
        {
          label: '受送达人',
          type: 'litigant',
          placeholder: '请选择受送达人',
          field: 'litigantId',
          disabled: this.isEdit,
          formOption: { rules: [{ required: true, message: '请选择受送达人' }], initialValue: this.detail?.litigantId || undefined }
        },
        // 电子送达
        {
          label: '送达方式',
          type: 'select',
          field: 'sendType',
          disabled: this.isEdit,
          formOption: { rules: [{ required: true, message: '请选择送达类型' }], initialValue: this.detail?.subSendType || undefined },
          options: [
            {
              value: '短信送达',
              label: '短信送达'
            },
            // {
            //   value: '微信送达',
            //   label: '微信送达'
            // },
            {
              value: '邮件送达',
              label: '邮件送达'
            }
          ],
          vIf: () => {
            return this.title === '电子送达'
          }
        },
        {
          type: 'other',
          content: (
            <FormItem label='送达材料'>
              <CheckboxGroup vModel={this.sendFile}>
                {
                  this.sendFileList && this.sendFileList.length > 0 ? this.sendFileList.map(item => {
                    return (<div><Checkbox value={item.id}>
                      <a onclick={(e) => { this.preview(item, e) }}>{item.name}</a>
                    </Checkbox></div>)
                  }) : ''
                }
              </CheckboxGroup>
            </FormItem>
          ),
          vIf: () => {
            return !this.isEdit && this.title !== '公告送达'
          }
        },
        {
          type: 'other',
          content: (
            <FormItem label='送达材料'>
              <div class='send-file-wrapper'>{
                this.detail.diplomsList && this.detail.diplomsList.length > 0 ? this.detail.diplomsList.map(item => {
                  return (<div style='line-height:1.5;'>
                    <a onclick={(e) => { this.preview(item, e) }}>{item.dipName}</a>
                  </div>)
                }) : ''
              }</div>
            </FormItem>
          ),
          vIf: () => {
            return this.isEdit && this.title !== '公告送达'
          }
        },
        {
          type: 'other',
          content: (
            <FormItem label='送达材料'>

            </FormItem>
          ),
          vIf: () => {
            return this.title === '公告送达'
          }
        },
        {
          label: '发送号码',
          type: 'phoneList',
          field: 'phone',
          disabled: this.isEdit,
          isNoReset: this.isEdit,
          formOption: { rules: [{ required: true, message: '请选择发送号码' }], initialValue: this.detail?.phone || undefined },
          vIf: () => {
            return this.sendType === '短信送达'
          }
        },
        {
          label: '电子邮箱',
          type: 'input',
          field: 'email',
          disabled: this.isEdit,
          formOption: { rules: [{ required: true, message: '请输入电子邮箱' }], initialValue: this.detail?.email || this.email },
          vIf: () => {
            return this.sendType === '邮件送达'
          }
        },
        {
          label: '发送时间',
          type: 'date',
          field: 'sendDate',
          showTime: true,
          disabled: this.isEdit,
          formOption: { rules: [{ required: true, message: '请选择邮寄时间' }], initialValue: this.detail?.sendDate || nowTime },
          vIf: () => {
            return this.title === '电子送达'
          }
        },
        // 现场领取
        {
          label: '预约时间',
          type: 'date',
          field: 'orderDate',
          showTime: true,
          formOption: { rules: [{ required: true, message: '请选择预约时间' }], initialValue: this.detail?.orderDate || undefined },
          vIf: () => {
            return this.title === '现场领取'
          }
        },
        {
          label: '送达回执',
          type: 'upload',
          field: 'receiptFileIds',
          showType: 'filePath',
          fileList: this.detail?.receiptFile || [],
          showTypeId: 'fileId',
          action: '/api/court/receipt/uploadReceiptFile',
          vIf: () => {
            return this.title === '现场领取'
          }
        },
        // 邮寄送达
        {
          label: '邮寄地址',
          type: 'address',
          field: 'address',
          disabled: this.isEdit,
          isNoReset: this.isEdit,
          formOption: { rules: [{ required: true, message: '请选择邮寄地址' }], initialValue: this.detail?.address || undefined },
          vIf: () => {
            return this.title === '邮寄送达'
          }
        },
        {
          label: '地址类型',
          type: 'select',
          field: 'addressType',
          formOption: { rules: [{ required: true, message: '请选择地址类型' }], initialValue: this.detail?.addressType || undefined },
          options: addResstype,
          vIf: () => {
            return this.title === '邮寄送达'
          }
        },
        {
          label: '联系电话',
          type: 'phoneList',
          field: 'phone',
          disabled: this.isEdit,
          isNoReset: this.isEdit,
          formOption: { rules: [{ required: true, message: '请选择联系电话' }], initialValue: this.detail?.phone || undefined },
          vIf: () => {
            return this.title === '邮寄送达'
          }
        },
        {
          label: '邮寄时间',
          type: 'date',
          field: 'sendDate',
          showTime: true,
          formOption: { rules: [{ required: true, message: '请选择邮寄时间' }], initialValue: this.detail?.sendDate || undefined },
          vIf: () => {
            return this.title === '邮寄送达'
          }
        },
        {
          label: '邮寄单号',
          type: 'input',
          field: 'expressNumber',
          formOption: { rules: [{ required: true, message: '请输入快递单号' }], initialValue: this.detail?.expressNumber || undefined },
          vIf: () => {
            return this.title === '邮寄送达'
          }
        },
        {
          label: '邮寄情况',
          type: 'select',
          field: 'situation',
          options: expressSituation,
          formOption: { initialValue: this.detail?.situation || undefined },
          vIf: () => {
            return this.title === '邮寄送达'
          }
        },
        // 上门送达
        {
          label: '上门地址',
          type: 'address',
          field: 'address',
          disabled: this.isEdit,
          isNoReset: this.isEdit,
          formOption: { rules: [{ required: true, message: '请选择上门地址' }], initialValue: this.detail?.address || undefined },
          vIf: () => {
            return this.title === '上门送达'
          }
        },
        {
          label: '上门时间',
          type: 'date',
          field: 'sendDate',
          showTime: true,
          formOption: { rules: [{ required: true, message: '请选择上门时间' }], initialValue: this.detail?.sendDate || undefined },
          vIf: () => {
            return this.title === '上门送达'
          }
        },
        {
          label: '上门情况',
          type: 'select',
          field: 'situation',
          options: [
            {
              value: '本人收',
              label: '本人收'
            },
            {
              value: '上门无人',
              label: '上门无人'
            }
          ],
          formOption: { initialValue: this.detail?.situation || undefined },
          vIf: () => {
            return this.title === '上门送达'
          }
        },
        {
          label: '送达回执',
          type: 'upload',
          field: 'receiptFileIds',
          showType: 'filePath',
          showTypeId: 'fileId',
          fileList: this.detail?.receiptFile || [],
          action: '/api/court/receipt/uploadReceiptFile',
          vIf: () => {
            return this.title === '上门送达'
          }
        },
        {
          label: '送达人员',
          type: 'judge',
          field: 'sender',
          disabled: this.isEdit,
          formOption: { rules: [{ required: true, message: '请选择送达人员' }], initialValue: this.detail?.senderId || undefined },
          vIf: () => {
            return this.title === '上门送达'
          }
        },
        // 委托送达
        {
          label: '委托送达地址',
          type: 'address',
          field: 'address',
          disabled: false,
          formOption: { rules: [{ required: true, message: '请选择委托送达地址' }], initialValue: this.detail?.address || undefined },
          vIf: () => {
            return this.title === '委托送达' && !this.isEdit
          }
        },
        {
          label: '委托送达地址',
          type: 'input',
          field: 'address',
          disabled: true,
          formOption: { rules: [{ required: true, message: '请选择委托送达地址' }], initialValue: this.detail?.address || undefined },
          vIf: () => {
            return this.title === '委托送达' && this.isEdit
          }
        },
        {
          label: '委托方类型',
          type: 'radio',
          field: 'entrustType',
          disabled: this.isEdit,
          formOption: { rules: [{ required: true, message: '请选择委托方类型' }], initialValue: this.detail?.entrustType || 1 },
          vIf: () => {
            return this.title === '委托送达'
          },
          options: [
            {
              value: 1,
              label: '法院'
            },
            {
              value: 2,
              label: '其他机构'
            }
          ]
        },
        // {
        //   label: '委托方',
        //   type: 'select',
        //   field: 'courtName',
        //   disabled: this.isEdit,
        //   options: this.courtList,
        //   formOption: { rules: [{ required: true, message: '请输入委托方' }], initialValue: this.detail?.court || undefined },
        //   vIf: () => {
        //     return this.title === '委托送达'
        //   }
        // },
        {
          type: 'other',
          content: (
            <FormItem label='委托方'>
              <Select
                v-decorator={['courtName', { rules: [{ required: true, message: '请输入委托方' }] }]}
                show-search
                filter-option={false}
                show-arrow={false}
                placeholder='请输入搜索委托方'
                not-found-content={null}
                onchange={this.changeCourt}
                onsearch={this.handleSearch}>
                {
                  this.courtList && this.courtList.length > 0 ? this.courtList.map(item => {
                    return (<SelectOption value={item.name}>
                      {item.name}
                    </SelectOption>)
                  }) : ''
                }
              </Select>
            </FormItem>
          ),
          vIf: () => {
            return !this.isEdit && this.entrustType === 1 && this.title === '委托送达'
          }
        },
        {
          label: '委托方',
          type: 'input',
          field: 'courtName',
          disabled: this.isEdit,
          formOption: { rules: [{ required: true, message: '请输入委托方' }], initialValue: this.detail?.courtName || undefined },
          vIf: () => {
            return this.title === '委托送达' && this.entrustType === 2
          }
        },
        {
          label: '委托方收件人',
          type: 'input',
          field: 'entrustAddressee',
          disabled: this.isEdit,
          formOption: { rules: [{ required: true, message: '请输入委托方收件人' }], initialValue: this.entrustInfo.entrustAddressee || this.detail?.entrustAddressee || undefined },
          vIf: () => {
            return this.title === '委托送达'
          }
        },
        {
          label: '委托方地址',
          type: 'input',
          field: 'courtAddress',
          disabled: this.isEdit,
          formOption: { rules: [{ required: true, message: '请输入委托方地址' }], initialValue: this.entrustInfo.address || this.detail?.courtAddress || undefined },
          vIf: () => {
            return this.title === '委托送达'
          }
        },
        {
          label: '委托方电话',
          type: 'input',
          field: 'courtPhone',
          disabled: this.isEdit,
          formOption: { rules: [{ required: true, message: '请输入委托方电话' }], initialValue: this.entrustInfo.telphone || this.detail?.courtPhone || undefined },
          vIf: () => {
            return this.title === '委托送达'
          }
        },
        {
          label: '邮寄时间',
          type: 'date',
          field: 'sendDate',
          showTime: true,
          formOption: { initialValue: this.detail?.sendDate || undefined },
          vIf: () => {
            return this.title === '委托送达'
          }
        },
        {
          label: '邮寄单号',
          type: 'input',
          field: 'expressNumber',
          formOption: { initialValue: this.detail?.expressNumber || undefined },
          vIf: () => {
            return this.title === '委托送达'
          }
        },
        {
          label: '邮寄情况',
          type: 'select',
          field: 'situation',
          options: expressSituation,
          formOption: { initialValue: this.detail?.situation || undefined },
          vIf: () => {
            return this.title === '委托送达'
          }
        },
        {
          label: '送达回执',
          type: 'upload',
          field: 'receiptFileIds',
          showType: 'filePath',
          fileList: this.detail?.receiptFile || [],
          showTypeId: 'fileId',
          action: '/api/court/receipt/uploadReceiptFile',
          vIf: () => {
            return this.title === '委托送达'
          }
        },
        // 委托送达 ---end
        // 公告送达
        {
          label: '发布媒体',
          type: 'select',
          field: 'media',
          options: [
            {
              value: '登报',
              label: '登报'
            },
            {
              value: '法院官网',
              label: '法院官网'
            },
            {
              value: '新浪',
              label: '新浪'
            }
          ],
          formOption: { initialValue: this.detail?.media || undefined },
          vIf: () => {
            return this.title === '公告送达'
          }
        },
        {
          label: '当事人是否缴费',
          type: 'radio',
          field: 'payed',
          formOption: { initialValue: this.detail?.payed || false },
          options: [
            {
              value: true,
              label: '是'
            },
            {
              value: false,
              label: '否'
            }
          ],

          vIf: () => {
            return this.title === '公告送达'
          }
        },
        {
          label: '发布时间',
          type: 'date',
          field: 'sendDate',
          showTime: true,
          formOption: { initialValue: this.detail?.sendDate || nowTime },
          vIf: () => {
            return this.title === '公告送达'
          }
        },
        {
          label: '发布状态',
          type: 'select',
          field: 'situation',
          formOption: { initialValue: this.detail?.situation },
          options: [
            {
              value: '待审核',
              label: '待审核'
            },
            {
              value: '已发布',
              label: '已发布'
            },
            {
              value: '已撤销',
              label: '已撤销'
            },
            {
              value: '未生效',
              label: '未生效'
            }
          ],
          vIf: () => {
            return this.title === '公告送达'
          }
        },

        {
          label: '发送时间',
          type: 'date',
          field: 'sendDate',
          showTime: true,
          formOption: { rules: [{ required: true, message: '请选择发送时间' }], initialValue: nowTime },
          vIf: () => {
            const list = ['现场领取', '邮寄送达', '上门送达', '委托送达', '公告送达']
            return list.find(item => item === this.title) === -1
          }
        },
        {
          label: '送达材料',
          type: 'checkbox',
          field: 'dipNames',
          formOption: { rules: [{ required: true, message: '请选择送达材料' }] },
          vIf: () => {
            const list = ['现场领取', '邮寄送达', '上门送达', '委托送达', '公告送达']
            return list.find(item => item === this.title) === -1
          }
        },
        {
          label: this.title === '推送内网' ? '推送结果' : '送达结果',
          type: 'select',
          field: 'sendState',
          disabled: !!(this.title === '推送内网' && this.isEdit),
          options: [
            {
              value: 0,
              label: this.title === '推送内网' ? '推送中' : '送达中'
            },
            {
              value: 1,
              label: this.title === '推送内网' ? '推送成功' : '送达成功'
            },
            {
              value: 2,
              label: this.title === '推送内网' ? '推送失败' : '送达失败'
            },
            {
              value: 3,
              label: this.title === '推送内网' ? '未推送' : '未送达'
            }
          ],
          formOption: { initialValue: this.detail?.state },
          vIf: () => {
            return this.title !== '公告送达'
          }
        },
        {
          label: '备注',
          type: 'textArea',
          field: 'remark',
          formOption: { initialValue: this.detail?.remark || undefined }
        }
      ]
    }
  },
  methods: {
  }
}
