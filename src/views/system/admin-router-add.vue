<template>
  <div class="content">
    <div class="content-form">
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px" class="demo-ruleForm">
        <el-form-item label="活动区域" prop="region" style="width: 100%">
          <el-select v-model="ruleForm.region" placeholder="请选择活动区域">
            <el-option label="区域一" value="shanghai" />
            <el-option label="区域二" value="beijing" />
          </el-select>
        </el-form-item>
        <el-form-item label="路由名称" prop="title">
          <el-input v-model="ruleForm.title" />
        </el-form-item>
        <el-form-item label="即时配送" prop="delivery">
          <el-switch v-model="ruleForm.delivery" />
        </el-form-item>
        <el-form-item label="配置">
          <json-editor ref="jsonEditor" v-model="value" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import JsonEditor from '@/components/JsonEditor'
const jsonData = '{"path": "/system","component": "Layout","redirect": "noRedirect","name": "System","hihhen": "false","alwaysShow": "true","meta": {"title": "系统管理","icon": "system","roles": ["admin"]},"children": [{"path": "adminu-router","name": "AdminRouter","component": "/system/admin-router","hihhen": "false","meta": {"title": "路由管理","icon": "router","roles": ["admin"]}}]}'
export default {
  name: 'AdminRouterAdd',
  components: { JsonEditor },
  data() {
    return {
      value: JSON.parse(jsonData),
      ruleForm: {
        title: '',
        region: '',
        delivery: false
      },
      rules: {
        title: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        region: [
          { required: true, message: '请选择活动区域', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style scoped>

</style>
