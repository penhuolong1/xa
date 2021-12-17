<script>
import { Descriptions, Input, Radio, Select, Skeleton, DatePicker, Button, Checkbox, TreeSelect } from 'ant-design-vue'
import Department from '@/components/Common/Department.vue'
import Brief from '@/components/Common/Brief.vue'
import Center from '@/components/Common/Center.vue'
import Judge from '@/components/Common/Judge.vue'
import ChildUnit from '@/components/Common/LoginChildUnit.vue'
import MediationPlace from '@/components/Common/MediationPlace.vue'
import Upload from '@/components/Upload/index.vue'
import { validPhone } from '@/utils/validate.js'
import CaseNo from '@/components/CaseNo/index'
import 'moment/locale/zh-cn'
import moment from 'moment'
export default {
  components: {
    Descriptions,
    DescriptionsItem: Descriptions.Item,
    RadioGroup: Radio.Group,
    Select,
    SelectOption: Select.Option,
    Skeleton,
    DatePicker,
    Button,
    Judge,
    Center,
    Checkbox,
    CaseNo,
    CheckboxGroup: Checkbox.Group,
    TextArea: Input.TextArea,
    Department,
    Upload,
    Brief,
    MediationPlace,
    ChildUnit,
    TreeSelect,
    TreeNode: TreeSelect.TreeNode
  },
  props: {
    schema: { // 整个详情的具体情况
      type: Array,
      default: () => []
    },
    title: {
      type: String,
      default: ''
    },
    column: {
      type: Number,
      default: 3
    },
    isEdit: { // 是否是编辑状态
      type: Boolean,
      default: true
    },
    detailData: { // 具体的数据
      type: Object,
      default: () => {}
    },
    rules: { // 验证规则
      type: Object,
      default: () => {}
    },
    isNeedBtn: { // 是否需要按钮
      type: Boolean,
      default: false
    },
    isSkeleton: {
      type: Boolean,
      defalut: false
    }
  },
  data() {
    return {
      params: {},
      treeData: [
        {
          childes: [
            { deptLevel: '区级',
              id: '111',
              name: '翔安区' },
            { deptLevel: '区级',
              id: '111',
              name: '翔安区' }
          ],
          deptLevel: '区级',
          id: '111',
          name: '翔安区'
        }
      ],
      replaceFields: {
        title: 'name',
        value: 'id',
        key: 'id',
        children: 'childes'
      }
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
          if (this.isEdit && !item.hidden) { // 编辑状态下显示表单数据
            const className = 'span' + item.span
            list.push(<DescriptionsItem class='lalala' span={item.span} label={<span class={item.required ? 'required' : ''}>{item.label}</span>}>{(() => {
              switch (item.type) {
                case 'input':
                  return (<Input class={className} onchange={e => this.change(e, item.field, this.detailData[item.editField || item.field], 'input')} vModel={this.detailData[item.editField || item.field]} class='form-input' type={item.inputType} disabled={item.disabled} {...item.props} placeholder={item.placeholder || '请输入'}/>)
                case 'caseNo':
                  return (<CaseNo ref='caseNo' inputDisabled={item.inputDisabled} vModel={this.detailData[item.editField || item.field]} defaultValue={this.detailData[item.editField || item.field]} typeList={item.typeList} isNeedButton={item.isNeedButton} class='case-no'/>)
                case 'textArea':
                  return (<TextArea disabled={item.disabled} onchange={e => this.change(e, item.field, this.detailData[item.editField || item.field], 'textArea')} vModel={this.detailData[item.editField || item.field]} autoSize={{ minRows: 3, maxRows: 5 }} placeholder={item.placeholder || '请输入'} />)
                case 'radio':
                  return (<RadioGroup disabled={item.disabled} onchange={e => this.change(e, item.field, this.detailData[item.editField || item.field], 'radio')} defaultValue={this.detailData[item.editField || item.field]} options={item.options}></RadioGroup>)
                case 'select':
                  return (<Select
                    vModel={this.detailData[item.editField || item.field]}
                    defaultValue={this.detailData[item.editField || item.field]}
                    disabled={item.disabled} onchange={e => this.change(e, item.field, this.detailData[item.editField || item.field], 'select')}
                    allowClear
                    show-search
                    mode={'tages' | item.mode}
                    filter-option={this.filterOption}
                    placeholder={item.placeholder || '请选择'}>
                    {
                      item.options && item.options.length > 0 ? item.options.map(item1 => {
                        return (<SelectOption value={item1.value}>{item1.label}</SelectOption>)
                      }) : ''
                    }
                  </Select>)
                case 'treeselect':
                  return (<TreeSelect
                    defaultValue={this.detailData[item.editField || item.field]}
                    disabled={item.disabled} onchange={e => this.change(e, item.field, this.detailData[item.editField || item.field], 'treeselect')}
                    allowClear
                    show-search
                    checkable
                    multiple
                    treeData={item.options}
                    replaceFields={this.replaceFields}
                    placeholder={item.placeholder || '请选择'}>

                  </TreeSelect>)
                case 'checkbox':
                  return (<CheckboxGroup disabled={item.disabled} defaultValue={this.detailData[item.editField || item.field]} onchange={e => this.change(e, item.field, this.detailData[item.editField || item.field], 'checkbox')}>
                    {
                      item.options && item.options.length > 0 ? item.options.map(item1 => {
                        return (<Checkbox value={item1.value}>{item1.label}</Checkbox>)
                      }) : ''
                    }
                  </CheckboxGroup>)
                case 'date':
                  return (<DatePicker
                    disabled={item.disabled}
                    vModel={this.detailData[item.editField || item.field]}
                    onchange={e => this.change(e, item.field, this.detailData[item.editField || item.field], 'date')}
                    defaultValue={this.detailData[item.editField || item.field]}
                    valueFormat='YYYY-MM-DD HH:mm:ss'
                    format={item.showTime ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD'}
                    show-time={ item.showTime ? { format: 'HH:mm:ss' } : false}></DatePicker>)
                case 'department': // 部门
                  return (<Department
                    isForm={false}
                    defaultValue={this.detailData[item.editField || item.field] || undefined}
                    onchange={e => this.change(e, item.field, this.detailData[item.editField || item.field], 'department')}
                    disabled={item.disabled}
                  ></Department>)
                case 'brief': // 案由
                  return (<Brief
                    isForm={false}
                    defaultValue={this.detailData[item.editField || item.field] || undefined}
                    briefName={this.detailData.briefName || ''}
                    onchange={e => this.change(e, item.field, this.detailData[item.editField || item.field], 'department')}
                    disabled={item.disabled}
                  ></Brief>)
                case 'judge': // 法院人员
                  return (<Judge
                    isForm={false}
                    type={item.userType}
                    defaultValue={this.detailData[item.editField || item.field] || undefined}
                    onchange={e => this.change(e, item.field, this.detailData[item.editField || item.field], 'department')}
                    disabled={item.disabled}
                  ></Judge>)
                case 'center': // 分流中心
                  return (<Center
                    isForm={false}
                    defaultValue={this.detailData[item.editField || item.field] || undefined}
                    onchange={e => this.change(e, item.field, this.detailData[item.editField || item.field], 'department')}
                    disabled={item.disabled}
                  ></Center>)
                case 'mediationPlace': // 调解地点
                  return (<MediationPlace
                    isForm={false}
                    defaultValue={this.detailData[item.editField || item.field] || undefined}
                    onchange={e => this.change(e, item.field, this.detailData[item.editField || item.field], 'department')}
                    disabled={item.disabled}
                  ></MediationPlace>)
                case 'childUnit': // 诉非登录角色获取下调解单位和组织的接口
                  return (<ChildUnit
                    isForm={false}
                    codes={item.codes}
                    defaultValue={this.detailData[item.editField || item.field] || undefined}
                    onchange={e => this.change(e, item.field, this.detailData[item.editField || item.field], 'department')}
                    disabled={item.disabled}
                  ></ChildUnit>)
                case 'upload':
                  return (<Upload
                    action={item.action}
                    accept={item.accept}
                    ref={item.field}
                    isEdit={item.isEdit}
                    onsuccess={item.success || this.uploadSuccess()}
                    remove={item.remove || undefined}
                    // onchange={e => this.change(e, item.field, this.detailData[item.editField || item.field], 'upload')}
                    defaultFileList={this.detailData[item.editField || item.field]}
                    data={item.data}
                    showType={item.showType}
                  ></Upload>)
                case 'other':
                  return item.content
                default:
                  return (<span>{this.detailData[item.editField || item.field]}</span>)
              }
            })()}
            </DescriptionsItem>)
          } else {
            list.push(<DescriptionsItem label={item.label}>{this.detailData[item.field]}</DescriptionsItem>)
          }
        })
      }
      return list
    },
    selectSearch() {

    },
    change(e, type, value, type1) { // 发生变化时触发事件
      if (type1 !== 'input' && type1 !== 'textArea') {
        if (type1 === 'radio') {
          this.$emit('change', { type, value: e.target.value, data: this.detailData })
          this.detailData[type] = e.target.value
        } else {
          this.$emit('change', { type, value: e, data: this.detailData })
          this.detailData[type] = e
          if (type1 === 'select') { // 处理有时候select选择后试图不改变的问题
            this.$forceUpdate()
          }
          if (type1 === 'date') { // 处理有时候select选择后试图不改变的问题
            this.$forceUpdate()
          }
        }
      } else {
        this.$emit('change', { type, value, data: this.detailData })
      }
    },
    // 获取上传组件的数据
    getUploadData() {
      this.schema.forEach(item => {
        if (item.type === 'upload') {
          if (this.$refs[item.field]) {
            this.detailData[item.field] = this.$refs[item.field].fileList
          }
        }
      })
    },
    submit() {
      this.getUploadData()
      if (JSON.stringify(this.rules) === '{}') { // 如果验证规则为空则不需要验证
        this.$emit('submit', this.detailData)
      } else {
      }
    },
    uploadSuccess() {

    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
    },
    // 获取表单数据
    getDate() {
      this.getCaseNo()
      this.getUploadData()
      if (this.verification()) {
        return {
          data: {},
          flag: false
        }
      }
      return {
        data: this.detailData,
        flag: true
      }
    },
    // 获取案号的流水号
    getCaseNoNum() {
      return this.$refs.caseNo.num
    },
    // 获取案号
    getCaseNo() {
      const index = this.schema.findIndex(item => item.type === 'caseNo')
      const obj = this.schema[index]
      if (index === -1) {
        return
      }
      this.detailData[obj.field] = this.$refs.caseNo.getCaseNo()?.caseNo || ''
    },
    // 正则验证
    verification() {
      let flag = false
      if (JSON.stringify(this.rules) !== '{}') {
        for (const i in this.rules) {
          const array = this.rules[i]
          array.forEach(item => {
            if (flag) {
              return
            }
            switch (item.type) {
              case 'required': // 必填
                console.log(this.detailData[i])
                if ((this.detailData[i] == '' || this.detailData[i] == [] || this.detailData[i] == {} || this.detailData[i] == null || this.detailData[i] == undefined) && (this.detailData[i] !== 0 && this.detailData[i] !== false)) {
                  this.$message.error(item.msg)
                  flag = true
                }
                return
              case 'phone': // 必填
                console.log('require')
                if (!validPhone(this.detailData[i])) {
                  this.$message.error(item.msg)
                  flag = true
                }
                return
              default:
                return
            }
          })
        }
      }
      return flag
    }
  },
  render() {
    const className1 = 'column' + this.column
    return (
      <div class='des-wrapper'>
        {this.isSkeleton ? <Skeleton></Skeleton>
          : <div class='wrapper'>
            {this.title ? <div class='title'>
              <span>{this.title}</span>
            </div> : ''}
            <div class='wrapper-right'>
              {this.isNeedBtn ? <Button onclick={this.submit}>提交</Button> : ''}
              <Descriptions
                column={this.column}
                class={className1}
                size='middle'
                bordered>
                {this.traverseSchema()}
              </Descriptions>
            </div>
          </div>
        }
      </div>
    )
  }
}
</script>

<style scoped lang="less" src="./index.less">
</style>
