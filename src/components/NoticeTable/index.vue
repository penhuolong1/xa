<template>
  <span>
    <Checkbox @change="changeAll">全选</Checkbox>
    <CheckboxGroup v-model="selectList" class="w-full">
      <Table
        :columns="columns"
        :data-source="tabledata"
        bordered
        :row-key="(record,index)=>{return index}"
        :pagination="false"
      />
    </CheckboxGroup>
  </span>
</template>

<script>
import { Table, Checkbox } from 'ant-design-vue'
import { listLitInfo } from '@/api/addCase/index.js'

export default {
  components: {
    Table,
    CheckboxGroup: Checkbox.Group,
    Checkbox
  },
  props: {
    id: { // 案件id
      type: String,
      default: ''
    }
  },
  data() {
    return {
      tabledata: [],
      columns: [
        {
          colSpan: 0,
          dataIndex: 'litigationStatus',
          key: 'litigationStatus',
          scopedSlots: { customRender: 'litigationStatus' },
          customRender: (value, row, index) => {
            const obj = {
              children: <Checkbox onchange={(e) => this.getCheck(e, row.litigationStatus, 1)} value={row.litigationStatus}>{value}</Checkbox>,
              attrs: {}
            }
            obj.attrs.rowSpan = row.litigationStatusRowSpan
            return obj
          }
        },
        {
          title: '',
          colSpan: 0,
          dataIndex: 'litigantName',
          key: 'litigantName',
          customRender: (value, row, index) => {
            const obj = {
              children: <Checkbox onchange={(e) => this.getCheck(e, row.litigantId, 2)} value={row.litigationStatus + '-' + row.litigantId}>{value}</Checkbox>,
              attrs: {}
            }
            obj.attrs.rowSpan = row.litigantNameRowSpan
            return obj
          }
        },
        {
          colSpan: 0,
          title: '',
          dataIndex: 'litigantPhones',
          key: 'litigantPhones',
          customRender: (value, row, index) => {
            const phoneList = row.litigantPhones && row.litigantPhones.length > 0 ? row.litigantPhones.map(item => {
              return (<div><Checkbox onchange={(e) => this.getCheck(e, row.litigationStatus + '-' + row.litigantId + '-' + item.phone, 3)} value={row.litigationStatus + '-' + row.litigantId + '-' + item.phone}>{item.phone}</Checkbox></div>)
            }) : ''
            const obj = {
              children: phoneList,
              attrs: {}
            }
            obj.attrs.rowSpan = row.litigantPhonesRowSpan
            return obj
          }
        }
      ],
      selectList: [] // 选择的数据
    }
  },
  watch: {
    id: {
      handler(val) {
        if (val != '') {
          this.getPeopleInfo()
        }
      },
      immediate: true
    }
  },
  created() {

  },
  mounted() {
    this.getPeopleInfo()
  },
  methods: {
    // 设置rowSapn
    rowSpan(key, list) {
      const arr = list
        .reduce((result, item) => {
          if (result.indexOf(item[key]) < 0) {
            result.push(item[key])
          }
          return result
        }, [])
        .reduce((result, keys) => {
          const children = list.filter((item) => item[key] === keys)
          result = result.concat(
            children.map((item, index) => ({
              ...item,
              [`${key}RowSpan`]: index === 0 ? children.length : 0
            }))
          )
          return result
        }, [])
      return arr
    },
    async getPeopleInfo() {
      if (!this.id) {
        return
      }
      await listLitInfo({ lawCaseId: this.id }).then(({ code, data }) => {
        if (code === 200) {
          this.tabledata = data
          this.tabledata = this.rowSpan('litigationStatus', this.tabledata)
          this.tabledata = this.rowSpan('litigantName', this.tabledata)
          this.tabledata = this.rowSpan('litigantPhones', this.tabledata)
        }
      })
    },
    changeAll(e) {
      console.log(e)
      if (e.target.checked) {
        this.tabledata.forEach(item => {
          const litLabel = item.litigationStatus + '-' + item.litigantId
          if (this.selectList.indexOf(item.litigationStatus) === -1) {
            this.selectList.push(item.litigationStatus)
          }
          if (this.selectList.indexOf(litLabel) === -1) {
            this.selectList.push(litLabel)
          }
          if (item.litigantPhones && item.litigantPhones.length > 0) {
            item.litigantPhones.forEach(item1 => {
              const litPhone = item.litigationStatus + '-' + item.litigantId + '-' + item1.phone
              if (this.selectList.indexOf(litPhone) === -1) {
                this.selectList.push(litPhone)
              }
            })
          }
        })
      } else {
        this.$nextTick(() => {
          this.selectList = []
        })
      }
      this.$emit('getAll', e.target.checked)
    },
    // 选择多选框触发
    getCheck(e, row, type) {
      console.log(e, row, type)
      this.$emit('chooseLitigant', row)
      if (type === 1) { // 选择原告被告或第三人
        if (e.target.checked) { // 点击选中
          this.tabledata.forEach(item => {
            if (item.litigationStatus === row) {
              const litLabel = item.litigationStatus + '-' + item.litigantId
              if (this.selectList.indexOf(litLabel) === -1) {
                this.selectList.push(litLabel)
              }
              if (item.litigantPhones && item.litigantPhones.length > 0) {
                item.litigantPhones.forEach(item1 => {
                  const litPhone = item.litigationStatus + '-' + item.litigantId + '-' + item1.phone
                  if (this.selectList.indexOf(litPhone) === -1) {
                    this.selectList.push(litPhone)
                  }
                })
              }
            }
          })
        } else { // 点击取消
          this.$nextTick(() => {
            this.selectList = [...this.selectList].filter(item => {
              return item.indexOf(row) === -1
            })
          })
        }
      } else if (type === 2) { // 选择当事人名字
        if (e.target.checked) {
          this.tabledata.forEach(item => {
            if (item.litigantId === row) {
              if (item.litigantPhones && item.litigantPhones.length > 0) {
                item.litigantPhones.forEach(item1 => {
                  const litPhone = item.litigationStatus + '-' + item.litigantId + '-' + item1.phone
                  if (this.selectList.indexOf(litPhone) === -1) {
                    this.selectList.push(litPhone)
                  }
                })
              }
            }
          })
        } else {
          this.$nextTick(() => {
            this.selectList = [...this.selectList].filter(item => {
              return item.indexOf(row) === -1
            })
          })
        }
      }
    },
    // 获取数据的方法
    getData() {
      if (!this.selectList || this.selectList.length === 0) {
        return
      }
      return this.selectList.filter(item => {
        const ary = item.split('-')
        return ary.length === 3
      })
    }
  }
}
</script>

<style scoped lang="scss">

</style>
