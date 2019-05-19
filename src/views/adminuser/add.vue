<template>
  <div class="content">
    <div class="form-content">
      <el-form ref="adminUserForm" :model="adminUserForm" :rules="rules" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="adminUserForm.username" placeholder="用户名由数字或字母组成" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="adminUserForm.password" type="password" placeholder="密码" />
        </el-form-item>
        <el-form-item label="确认密码" prop="password_confirm">
          <el-input v-model="adminUserForm.password_confirm" type="password" placeholder="再次输入密码" />
        </el-form-item>
        <el-form-item label="激活状态" prop="is_active">
          <el-switch v-model="adminUserForm.is_active" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('adminUserForm')">新增</el-button>
          <el-button @click="resetForm('adminUserForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { createAdminUser } from '@/api/user'
import { Message } from 'element-ui'
export default {
  name: 'AdminUserAdd',
  inject: ['reload'],
  data() {
    var validateUserName = (rule, value, callback) => {
      var reg = /^[0-9a-zA-Z]{1,}$/
      if (value === '') {
        callback(new Error('请输入用户名'))
      } else if (value.length < 3) {
        callback(new Error('用户名长度不能小于3'))
      } else if (!reg.test(value)) {
        callback(new Error('用户名由数字或字母组成'))
      } else {
        callback()
      }
    }
    var validatePassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else if (value.length < 6) {
        callback(new Error('密码长度不能小于6'))
      } else {
        if (this.adminUserForm.password_confirm !== '') {
          this.$refs.adminUserForm.validateField('password_confirm')
        }
        callback()
      }
    }
    var validatePasswordConfirm = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.adminUserForm.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      adminUserForm: {
        username: '',
        password: '',
        password_confirm: '',
        is_active: false
      },
      rules: {
        username: [
          { validator: validateUserName, trigger: 'blur' }
        ],
        password: [
          { validator: validatePassword, trigger: 'blur' }
        ],
        password_confirm: [
          { validator: validatePasswordConfirm, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          createAdminUser(this.adminUserForm).then(res => {
            Message.success(res.msg)
            this.reload()
          })
        } else {
          Message.error('数据验证失败！')
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
