<template>
  <div class="content">
    <el-container style="width: 100%; border: 1px solid #eee" :style="contentStyleObj">
      <el-aside style="background-color: white;border-right: 1px solid #eee;margin-bottom: 0px" width="45%">
        <div>
          <el-form ref="roleForm" :model="roleForm" :rules="rules" label-width="80px">
            <el-form-item label="角色名称" prop="role_name">
              <el-input v-model="roleForm.username" />
            </el-form-item>
            <el-form-item label="角色描述" prop="desc">
              <el-input v-model="roleForm.desc" rows="4" type="textarea" />
            </el-form-item>
            <el-form-item label="可用状态" prop="is_enable">
              <el-switch v-model="roleForm.is_enable" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm('roleForm')">新增</el-button>
              <el-button @click="resetForm('roleForm')">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-aside>
      <el-aside style="background-color: white;border-right: 1px solid #eee;margin-bottom: 0px" width="30%" />
      <el-aside style="background-color: white;border-right: 1px solid #eee;margin-bottom: 0px" width="25%">
        <div style="text-align: center;"><el-tag>按钮权限</el-tag></div>
        <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">全选</el-checkbox>
        <div style="margin: 15px 0;" />
        <el-checkbox-group v-model="checkedButtons" @change="handleCheckedButtonsChange">
          <el-checkbox v-for="button in buttons" :key="button.button_id" :label="button.button_id">{{ button.title }}</el-checkbox>
        </el-checkbox-group>
      </el-aside>
    </el-container>
  </div>
</template>

<script>
import { createAdminUser } from '@/api/user'
import { getSystemButtonAll } from '@/api/button'
import { Message } from 'element-ui'
export default {
  name: 'RoleAdd',
  inject: ['reload'],
  data() {
    return {
      contentStyleObj: {
        height: ''
      },
      roleForm: {
        role_name: '',
        desc: '',
        is_enable: true
      },
      rules: {
        role_name: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        desc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' }
        ]
      },
      checkAll: false,
      checkedButtons: [],
      buttons: [],
      isIndeterminate: true
    }
  },
  created() {
    window.addEventListener('resize', this.getHeight)
    this.getHeight()
    getSystemButtonAll(1).then(res => {
      this.buttons = res.data
    })
  },
  methods: {
    getHeight() {
      this.contentStyleObj.height = window.innerHeight - 120 + 'px'
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          createAdminUser(this.roleForm).then(res => {
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
    },
    handleCheckAllChange(val) {
      if (val) {
        const buttonIds = this.buttons.map(item => {
          return item.button_id
        })
        this.checkedButtons = buttonIds
      } else {
        this.checkedButtons = []
      }
      this.isIndeterminate = false
    },
    handleCheckedButtonsChange(value) {
      const checkedCount = value.length
      this.checkAll = checkedCount === this.buttons.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.buttons.length
    }
  },
  destroy() {
    window.removeEventListener('resize', this.getHeight)
  }
}
</script>

<style scoped>

</style>
