<script>
import { Form, Input, Radio, Select, Skeleton, DatePicker, Button, Checkbox, Col } from 'ant-design-vue'
import Upload from '@/components/Upload/index.vue'
import Tribunal from '@/components/Common/Tribunal.vue'
import Litigant from '@/components/Common/Litigant.vue'
import Address from '@/components/Common/Address.vue'
import Phone from '@/components/Common/Phone.vue'
import Brief from '@/components/Common/Brief.vue'
import Audio from '@/components/Audio/index.vue'
import Judge from '@/components/Common/Judge.vue'
import PhoneCode from '@/components/PhoneCode/index.vue'
import Mediates from '@/components/Common/Mediates'
import UploadFile from '@/components/UploadFile/index.vue'
import ChildUnit from '@/components/Common/LoginChildUnit.vue'
import SfDepCount from '@/components/Common/SfDepCount.vue'
import SfMediator from '@/components/Common/SfMediator.vue'
import { validPhone } from '@/utils/validate.js'
import CaseNo from '@/components/CaseNo/index'
import 'moment/locale/zh-cn'
import moment from 'moment'
export default {
  components: {
    Form,
    Mediates,
    FormItem: Form.Item,
    Radio,
    RadioGroup: Radio.Group,
    Select,
    SelectOption: Select.Option,
    Skeleton,
    DatePicker,
    Button,
    UploadFile,
    Checkbox,
    CaseNo,
    CheckboxGroup: Checkbox.Group,
    TextArea: Input.TextArea,
    Upload,
    PhoneCode,
    Tribunal,
    SfDepCount,
    Audio,
    Address,
    Judge,
    Brief,
    SfMediator,
    Phone,
    Col,
    ChildUnit
  },
  props: {
    schema: { // 整个详情的具体情况
      type: Array,
      default: () => []
    },
    labelCol: {
      type: Number,
      default: 6
    },
    wrapperCol: {
      type: Number,
      default: 12
    }
  },
  data() {
    return {
      form: this.$form.createForm(this, { name: 'form' })
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    moment,
    traverseSchema() {
      const list = []
      if (this.schema && this.schema.length > 0) {
        this.schema.forEach(item => {
          if (item.vIf && !item.vIf()) {
            return
          }
          list.push(
            (() => {
              switch (item.type) {
                case 'input':
                  return (
                    <FormItem class={item.styleClass} label={item.label}>
                      <Input v-decorator={[item.field, item.formOption]} onchange={e => this.change(e, item.field, 'input')} disabled={item.disabled} suffix={item.suffix} prefix={item.prefix} type={item.inputType} placeholder={item.placeholder || '请输入'}/>
                    </FormItem>)
                case 'textArea':
                  return (
                    <FormItem class={item.styleClass} label={item.label}>
                      <TextArea v-decorator={[item.field, item.formOption]} disabled={item.disabled} placeholder={item.placeholder || '请输入'} /></FormItem>)
                case 'radio':
                  return (
                    <FormItem class={item.styleClass} label={item.label}>
                      <RadioGroup onchange={e => this.change(e, item.field, 'radio')} v-decorator={[item.field, item.formOption]} disabled={item.disabled}>
                        {
                          item.options && item.options.length > 0 ? item.options.map(item1 => {
                            return (<Radio value={item1.value}>{item1.label}</Radio>)
                          }) : ''
                        }
                      </RadioGroup>
                    </FormItem>)
                case 'select':
                  return (
                    <FormItem class={item.styleClass} label={item.label}>
                      <Select onchange={e => this.change(e, item.field, 'select')} v-decorator={[item.field, item.formOption]} disabled={item.disabled} allowClear show-search placeholder={item.placeholder || '请选择'}>
                        {
                          item.options && item.options.length > 0 ? item.options.map(item1 => {
                            return (<SelectOption value={item1.value}>{item1.label}</SelectOption>)
                          }) : ''
                        }
                      </Select>
                    </FormItem>)
                case 'checkbox':
                  return (
                    <FormItem class={item.styleClass} label={item.label}>
                      {item.needCheckAll ? (<Checkbox class='check-all' checked={item.checkAll} indeterminate={item.indeterminate} onchange={e => this.changeAll(e, item.field, item.options)}>全选{item.indeterminate}{item.checkAll}</Checkbox>) : ''}
                      <CheckboxGroup onchange={e => this.change(e, item.field, 'checkbox', item.options)} v-decorator={[item.field, item.formOption]} disabled={item.disabled}>
                        {
                          item.options && item.options.length > 0 ? item.options.map(item1 => {
                            return (<Checkbox value={item1.value}>{item1.label}</Checkbox>)
                          }) : ''
                        }
                      </CheckboxGroup>
                    </FormItem>)
                case 'date':
                  return (
                    <FormItem class={item.styleClass} label={item.label}>
                      <DatePicker
                        onchange={e => this.change(e, item.field, 'datePicker')}
                        disabled={item.disabled}
                        v-decorator={[item.field, item.formOption]}
                        disabled={item.disabled}
                        valueFormat={item.showTime ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD '}
                        format={item.showTime ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD'}
                        show-time={ item.showTime ? { defaultValue: moment('00:00:00', 'HH:mm:ss') } : false}
                      ></DatePicker>
                    </FormItem>)
                case 'upload':
                  return (
                    <FormItem class={item.styleClass} label={item.label}>
                      <Upload
                        ref={item.field}
                        action={item.action}
                        accept={item.accept}
                        isEdit={item.isEdit}
                        showType={item.showType}
                        showTypeId={item.showTypeId}
                        defaultFileList={item.fileList}
                        data={item.data}
                      ></Upload>
                    </FormItem>)
                case 'tribunal': // 调解地点
                  return (
                    <Tribunal form={this.form} type={item.userType} label={item.label} field={item.field} formOption={item.formOption} disabled={item.disabled} placeholder={item.placeholder || '请输入'}></Tribunal>)
                case 'litigant': // 当事人
                  return (
                    <Litigant form={this.form} onchange={e => this.change(e, item.field, 'litigant')} label={item.label} field={item.field} formOption={item.formOption} disabled={item.disabled} placeholder={item.placeholder || '请输入'}></Litigant>)
                case 'address': // 当事人地址
                  return (
                    <Address form={this.form} label={item.label} field={item.field} formOption={item.formOption} disabled={item.disabled} isNoReset={item.isNoReset} placeholder={item.placeholder || '请输入'}></Address>)
                case 'brief': // 案由
                  return (
                    <Brief form={this.form} label={item.label} field={item.field} formOption={item.formOption} briefName={item.briefName} disabled={item.disabled} isNoReset={item.isNoReset} placeholder={item.placeholder || '请输入'}></Brief>)
                case 'uploadFile': // 获取文书（调解协议和司法确认申请书）
                  return (
                    <UploadFile form={this.form} label={item.label} type={item.fileType} field={item.field} formOption={item.formOption} disabled={item.disabled} placeholder={item.placeholder || '请输入'} ondone={this.done}></UploadFile>)
                case 'childUnit': // 登录角色下级单位
                  return (
                    <ChildUnit
                      form={this.form} onchange={e => this.change(e, item.field, 'childUnit')} codes={item.codes} label={item.label} field={item.field} formOption={item.formOption} disabled={item.disabled} isNoReset={item.isNoReset} placeholder={item.placeholder || '请输入'}></ChildUnit>)
                case 'mediates': // 获取所有单位组织不挂钩登录角色
                  return (
                    <Mediates
                      medType={item.medType}
                      ancestorId={item.ancestorId}
                      form={this.form} onchange={e => this.change(e, item.field, 'Mediates')} codes={item.codes} label={item.label} field={item.field} formOption={item.formOption} disabled={item.disabled} isNoReset={item.isNoReset} placeholder={item.placeholder || '请输入'}></Mediates>)
                case 'sfDepCount': // 根据参数查看下级单位 不传查所有
                  return (
                    <sfDepCount
                      ancestorId={item.ancestorId || ''}
                      isNeedParentId={item.isNeedParentId}
                      form={this.form} onchange={e => this.change(e, item.field, 'childUnit')} codes={item.codes} label={item.label} field={item.field} formOption={item.formOption} disabled={item.disabled} isNoReset={item.isNoReset} placeholder={item.placeholder || '请输入'}></sfDepCount>)
                case 'sfMediator': // 诉非调解员
                  return (
                    <SfMediator form={this.form} onchange={e => this.change(e, item.field, 'sfMediator')} deptId={item.deptId} label={item.label} field={item.field} formOption={item.formOption} disabled={item.disabled} isNoReset={item.isNoReset} placeholder={item.placeholder || '请输入'}></SfMediator>)
                case 'phoneList': // 当事人电话
                  return (
                    <Phone
                      form={this.form}
                      label={item.label}
                      isNeedCall={item.isNeedCall}
                      isNoReset={item.isNoReset}
                      onchange={e => this.change(e, item.field, 'phone')}
                      field={item.field} formOption={item.formOption} disabled={item.disabled} disabled={item.disabled} placeholder={item.placeholder || '请输入'}></Phone>)
                case 'judge': // 工作人员信息(法官)
                  return (
                    <Judge form={this.form} label={item.label} field={item.field} type={item.userType} formOption={item.formOption} disabled={item.disabled} disabled={item.disabled} placeholder={item.placeholder || '请输入'}></Judge>)
                case 'phone': // 当事人
                  return (
                    <PhoneCode
                      ref='phoneCode'
                      label={item.label}
                      form={this.form}
                      phoneField={item.phoneField}
                      field={item.field}
                      type={item.phoneCodeType}
                      data={item.data}
                      formOptions={item.formOption}
                      placeholder={item.placeholder}/>)
                case 'audio':
                  return (
                    <span>
                      <FormItem class={item.styleClass} label={item.label}>
                        <Audio></Audio>
                      </FormItem>
                    </span>
                  )
                case 'other':
                  return item.content
                default:
                  return (<span>{this.detailData[item.editField || item.field]}</span>)
              }
            })())
        })
      }
      return list
    },
    change(e, field, type, list) {
      if (type === 'checkbox') {
        const schemaList = this.schema
        schemaList.forEach(item => {
          if (item.field === field) {
            item.indeterminate = !!e.length && e.length < list.length
            item.checkAll = e.length === list.length
          }
        })
        this.$emit('update:schema', schemaList)
      }
      setTimeout(() => {
        this.$emit('change', {
          field,
          type,
          value: this.form.getFieldsValue()
        })
      }, 200)
    },
    // 重置手机验证码
    resetPhoneCode() {
      this.$refs.phoneCode.reset()
    },
    // checkbox 全选
    changeAll(e, field, list) {
      const schemaList = this.schema
      schemaList.forEach(item => {
        if (item.field === field) {
          this.form.setFieldsValue({
            [field]: e.target.checked ? list.map(item => item.value) : []
          })
          item.indeterminate = false
          item.checkAll = e.target.checked
        }
      })
      this.$emit('update:schema', schemaList)
      setTimeout(() => {
        this.$emit('change', {
          field,
          type: 'checkbox',
          value: this.form.getFieldsValue()
        })
      }, 200)
    },
    resetFields() {
      this.form.resetFields()
    },
    done() {
      this.$emit('done')
    },
    getFieldsValue() {
      return new Promise((res, rej) => {
        this.form.validateFields(err => {
          if (err) {
            rej()
            return
          } else {
            const params = {
              ...this.form.getFieldsValue()
            }
            this.schema.forEach(item => {
              if (item.type === 'upload') {
                params[item.field] = this.$refs[item.field]?.fileList
              }
            })
            res(params)
          }
        })
      })
    }
  },
  render() {
    return (
      <Form form={this.form} label-col={{ 'span': this.labelCol }} wrapper-col={{ 'span': this.wrapperCol }}>
        {this.traverseSchema()}
      </Form>
    )
  }
}
</script>

<style scoped lang="less">
.check-all {
  margin-bottom: 0px!important;
  line-height: 30px;
  position: relative;
  bottom: -3px;
}
</style>
