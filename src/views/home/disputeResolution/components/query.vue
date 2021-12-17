<template>
  <div>
    <div>
      <a-form layout="inline" :form="form">
        <a-form-item label="单位名称">
          <a-input v-model="form.pass" placeholder="请输入名称…" />
        </a-form-item>
        <a-form-item label="主要职责" prop="checkPass">
          <a-input
            v-model="form.checkPass"
            placeholder="请输入关键字…"
          />
        </a-form-item>
        <a-form-item label="解纷类型">
          <a-select
            style="width: 182px"
            show-arrow
            mode="multiple"
            :max-tag-count="0"
            placeholder="多选框"
          >
            <a-select-option v-for="(item,id) in type" :key="id">
              {{ item.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="专业领域">
          <a-select
            style="width: 182px"
            show-arrow
            mode="multiple"
            :max-tag-count="0"
            placeholder="多选框"
          >
            <a-select-option v-for="(item,id) in professionalField" :key="id">
              {{ item.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="submitForm('ruleForm')">
            查询
          </a-button>
          <a-button style="margin-left: 10px" @click="resetForm">
            重置
          </a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script>
import { Input, Button, Form, Select } from 'ant-design-vue'
export default {
  components: {
    // 'a-form-model': FormModel,
    // 'a-form-model-item': FormModel.Item,
    'a-form': Form,
    'a-form-item': Form.Item,
    'a-input': Input,
    'a-button': Button,
    'a-select': Select,
    'a-select-option': Select.Option
  },

  data() {
    return {
      form: {
        pass: '',
        checkPass: ''
      },
      type: [
        {
          id: '司法解纷',
          name: '司法解纷'
        },
        {
          id: '人民解纷',
          name: '人民解纷'
        },
        {
          id: '行业解纷',
          name: '行业解纷'
        },
        {
          id: '律师解纷',
          name: '律师解纷'
        },
        {
          id: '行政解纷',
          name: '行政解纷'
        }
      ],
      professionalField: [
        {
          id: '1',
          name: '邻里关系纠纷'
        },
        {
          id: '2',
          name: '婚姻纠纷'
        },
        {
          id: '3',
          name: '邻里关系纠纷'
        },
        {
          id: '4',
          name: '婚姻纠纷'
        },
        {
          id: '5',
          name: '邻里关系纠纷'
        },
        {
          id: '6',
          name: '行业调解'
        },
        {
          id: '7',
          name: '邻里关系纠纷'
        },
        {
          id: '8',
          name: '婚姻纠纷'
        },
        {
          id: '9',
          name: '邻里关系纠纷'
        },
        {
          id: '10',
          name: '行业调解'
        }
      ]
    }
  },
  methods: {
    resetForm() {
      this.data.form.pass = ''
      this.data.form.checkPass = ''
    }
  }
}
</script>

<style lang="less" scoped>
/deep/.ant-form {
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    color: rgba(0, 0, 0, 0.65);
    font-size: 14px;
    font-variant: tabular-nums;
    line-height: 1.5;
    list-style: none;
    -webkit-font-feature-settings: 'tnum';
    font-feature-settings: 'tnum';
    display: inline-block;
    justify-content: space-between;
}
</style>
