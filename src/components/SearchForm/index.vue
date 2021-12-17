
<script>
import { Button, Input, Select, DatePicker, ConfigProvider, Skeleton, Radio } from 'ant-design-vue'
import { trialFieldType, trialFieldType2 } from '@/type/index.js'
import YearPicker from '@/components/Time/YearPicker'
import MonthPicker from '@/components/Time/MonthPicker'
import Brief from '@/components/Common/Brief'
import Judge from '@/components/Common/Judge'
import Department from '@/components/Common/Department'
import Mediates from '@/components/Common/Mediates'
import LoginChildUnit from '@/components/Common/LoginChildUnit'
import { appraisalCase } from '@/api/common/index'
import OtherRadio from '@/components/OtherRadio'
import zh_CN from 'ant-design-vue/lib/locale-provider/zh_CN'
import 'moment/locale/zh-cn'
import moment from 'moment'
export default {
  components: {
    Button,
    Input,
    Select,
    Skeleton,
    RadioGroup: Radio.Group,
    RadioButton: Radio.Button,
    InputGroup: Input.Group,
    SelectOption: Select.Option,
    DatePicker,
    RangePicker: DatePicker.RangePicker,
    ConfigProvider,
    YearPicker,
    Brief,
    Mediates,
    Judge,
    MonthPicker
  },
  props: {
    schema: { // 整个搜索部分的具体字段
      type: Array,
      default: () => []
    },
    defaultValue: { //
      type: Object,
      default: () => {}
    },
    isSkeleton: { // 是否显示骨架屏
      type: Boolean,
      default: false
    },
    isNeedExport: { // 是否需要导出
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      searchForm: {},
      defaultValueOld: {},
      otherDate: {},
      yearTypeList: []
    }
  },
  created() {
    this.init()
    this.defaultValueOld = { ...this.defaultValue } || {}
    this.searchForm = { ...this.defaultValueOld }
  },
  mounted() {
  },
  methods: {
    moment,
    // 初始化数据
    init() {
      this.getYearTypeList()
    },
    // 获取案号的年份
    getYearTypeList() {
      const nowYear = new Date().getFullYear()
      const list = [
        {
          value: '',
          label: '请选择'
        },
        {
          value: nowYear,
          label: nowYear
        }
      ]
      for (let i = nowYear - 5; i < nowYear; i++) {
        list.push({
          value: i,
          label: i
        })
      }
      this.yearTypeList = list
    },
    // 通过传入条件翻译出搜索条件
    traverseSchema() {
      const list = []
      this.schema.forEach(item => {
        if (item.vIf && !item.vIf()) { // 123
          this.searchForm[item.field] = undefined
          return
        }
        switch (item.type) {
          case 'radio':
            list.push(
              <OtherRadio vModel={ this.searchForm[item.field] } className={item.className} defaultValue={this.searchForm[item.field]} label={ item.label } list={item.options} onchange={(e) => { this.changeRadio(e, item.field) }}></OtherRadio>)
            return
          case 'radioButton':
            list.push((<RadioGroup style={item.style} class='form-radio-group-buton {item.className}' vModel={ this.searchForm[item.field] } button-style='solid' onchange={this.change}>
              {
                item.options && item.options.length > 0 ? item.options.map(item1 => {
                  return (<RadioButton value={item1.value}>{item1.label}</RadioButton>)
                }) : ''
              }
            </RadioGroup>))
            return
          case 'input':
            list.push(<div class='form-item' style={item.style}>
              <span class='label'>{item.label}</span>
              <Input vModel={ this.searchForm[item.field] } onpressEnter={this.submit} placeholder='请输入'/>
            </div>)
            return
          case 'time':
            list.push(<div class='form-item form-item-2' style={item.style}>
              <span class='label'>{item.label}</span>
              <ConfigProvider locale={zh_CN}>
                <RangePicker vModel={this.otherDate[item.field[0]]} onchange={value => this.changeDate(value, item.field, item.showTime)} valueFormat={item.showTime ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD'} format={item.showTime ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD'} show-time={ item.showTime ? { defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')] } : false}></RangePicker>
              </ConfigProvider>
            </div>)
            return
          case 'year':
            list.push(<div class='form-item' style={item.style}>
              <span class='label'>{item.label}</span>
              <YearPicker
                vModel={this.otherDate[item.field[0]]}
                valueFormat='YYYY'
                format='YYYY'
                onchange={value => this.changeDate(value, item.field, item.showTime, item.type)} ></YearPicker>
            </div>)
            return
          case 'month':
            list.push(<div class='form-item' style={item.style}>
              <span class='label'>{item.label}</span>
              <MonthPicker
                vModel={this.otherDate[item.field[0]]}
                valueFormat='YYYY-MM'
                format='YYYY-MM'
                onchange={value => this.changeDate(value, item.field, item.showTime, item.type)} ></MonthPicker>
            </div>)
            return
          case 'select':
            list.push(<div class='form-item' style={item.style}>
              <span class='label'>{item.label}</span>
              <Select allowClear vModel={ this.searchForm[item.field] }
                onchange={value => this.changeSelect(value, item.field)}
              >
                {
                  item.options && item.options.length > 0 ? item.options.map(item1 => {
                    return (<SelectOption value={item1.value}>{item1.label}</SelectOption>)
                  }) : ''
                }
              </Select>
            </div>)
            return
          case 'brief':
            list.push(<div class='form-item' style={item.style}>
              <span class='label'>{item.label}</span>
              <Brief
                isForm={false}
                ref='brief'
                vModel={ this.searchForm[item.field] }
                disabled={item.disabled}
                onchange={this.change}
              ></Brief>
            </div>)
            return
          case 'judge':
            list.push(<div class='form-item' style={item.style}>
              <span class='label'>{item.label}</span>
              <Judge
                isForm={false}
                type={item.userType}
                defaultValue={this.searchForm[item.field]}
                vModel={ this.searchForm[item.field] }
                disabled={item.disabled}
                onchange={this.change}
              ></Judge>
            </div>)
            return
          case 'department': // 承办部门
            list.push(<div class='form-item' style={item.style}>
              <span class='label'>{item.label}</span>
              <Department
                isForm={false}
                defaultValue={this.searchForm[item.field]}
                vModel={ this.searchForm[item.field] }
                disabled={item.disabled}
                onchange={this.change}
              ></Department>
            </div>)
            return
          case 'mediates': // 法院端调解相关 组织 单位 人员
            list.push(<div class='form-item' style={item.style}>
              <span class='label'>{item.label}</span>
              <Mediates
                isForm={false}
                medType={item.medType}
                vModel={ this.searchForm[item.field] }
                disabled={item.disabled}
                onchange={this.change}
              ></Mediates>
            </div>)
            return
          case 'loginChildUnit': // 获取登录角色下得调解单位和组织
            list.push(<div class='form-item' style={item.style}>
              <span class='label'>{item.label}</span>
              <LoginChildUnit
                isForm={false}
                codes={item.codes}
                place={item.place}
                vModel={ this.searchForm[item.field] }
                disabled={item.disabled}
                onchange={this.change}
              ></LoginChildUnit>
            </div>)
            return
          case 'caseNo':
            list.push(<div class='form-item form-item-2' style={item.style}>
              <span class='label'>{item.label}</span>
              <InputGroup>
                <Select allowClear vModel={ this.searchForm[item.field1] } onchange={this.change} placeholder='请选择' class='case-no-year'>
                  {item.yearTypeList && item.yearTypeList.length > 0 ? item.yearTypeList.map(item1 => {
                    return (<SelectOption value={item1.value}>
                      {item1.label}
                    </SelectOption>)
                  }) : this.yearTypeList.map(item1 => {
                    return (<SelectOption value={item1.value}>
                      {item1.label}
                    </SelectOption>)
                  })}
                </Select>
                <Select allowClear vModel={ this.searchForm[item.field2] } onchange={this.change} placeholder='请选择' class='case-no-prefix' >
                  {item.trialFieldType && item.trialFieldType.length > 0 ? item.trialFieldType.map(item1 => {
                    return (<SelectOption value={item1.value}>
                      {item1.label}
                    </SelectOption>)
                  }) : trialFieldType2.map(item1 => {
                    return (<SelectOption value={item1.value}>
                      {item1.label}
                    </SelectOption>)
                  })}
                </Select>
                <Input vModel={ this.searchForm[item.field3] } onpressEnter={this.change} style='width: 60px' placeholder='起始流水号' />
                <Input
                  style='width: 30px; border-left: 0; pointer-events: none; backgroundColor: #fff'
                  placeholder='~'
                  disabled
                />
                <Input vModel={ this.searchForm[item.field4] } onpressEnter={this.change} style='width: 60px' placeholder='结束流水号' />
              </InputGroup>
            </div>)
            return
        }
      })
      return list
    },
    submit() {
      const params = { ...this.searchForm }
      for (const key in params) {
        if (!params[key] && params[key] !== 0) {
          delete params[key]
        }
      }
      this.$emit('search', params)
    },
    // 修改时间
    changeDate(e, value, showTime, type) {
      if (Array.isArray(value)) {
        value.forEach((item, index) => {
          this.searchForm[item] = e ? e[index] : ''
          if (!showTime) {
            if (type !== 'year' && type !== 'month') {
              index === 0 ? this.searchForm[item] = e[index] + ' 00:00:00' : this.searchForm[item] = e[index] + ' 23:59:59'
            }
          }
          if (!e || e.length === 0) { // 清空
            this.searchForm[item] = ''
          }
        })
      } else {
        this.searchForm[value] = e
      }
      this.submit()
    },
    // 选择radio 触发
    changeRadio(e, field) {
      this.$emit('change', e, field)
      this.submit()
    },
    // 选择触发
    change(e) {
      setTimeout(() => {
        this.submit()
      }, 200)
    },
    // 选择下拉款触发
    changeSelect(e, field) {
      this.$emit('change', e, field)
      this.submit()
    },
    export() {
      this.$emit('export', this.searchForm)
    },
    reset() {
      this.$refs.brief && this.$refs.brief.close()
      this.searchForm = { ...this.defaultValueOld }
      this.otherDate = {}
      this.$emit('search', this.defaultValueOld)
    }
  },
  render() {
    return (
      <div class='wrapper'>
        <div class='wrapper-btn'>
          <Button type='primary' onclick={this.submit}>查询</Button>
          {/** <Button onclick={this.export}>导出案件</Button>*/}
          <Button onclick={this.reset}>重置</Button>
        </div>
        {this.$slots.header}
        <div class='wrapper-content'>
          { this.isSkeleton ? (<Skeleton></Skeleton>) : this.traverseSchema() }
        </div>
      </div>
    )
  }
}
</script>

<style scoped lang="less" src="./index.less"></style>
