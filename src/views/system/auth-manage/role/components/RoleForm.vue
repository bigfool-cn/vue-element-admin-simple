<template>
  <div class="content">
    <el-container style="width: 100%; border: 1px solid #eee" :style="contentStyleObj">
      <el-aside style="background-color: white;border-right: 1px solid #eee;margin-bottom: 0px" width="45%">
        <div>
          <el-form ref="roleForm" :model="roleForm" :rules="rules" label-width="80px">
            <el-form-item label="角色名称" prop="role_name">
              <el-input v-model="roleForm.role_name" />
            </el-form-item>
            <el-form-item label="角色描述" prop="desc">
              <el-input v-model="roleForm.desc" rows="4" type="textarea" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm('roleForm')">保 存</el-button>
              <el-button @click="resetForm('roleForm')">重 置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-aside>
      <el-aside style="background-color: white;border-right: 1px solid #eee;margin-bottom: 0px" width="30%">
        <div class="auth-btn"><el-tag>路由权限</el-tag></div>
        <el-tree
          ref="routerTree"
          :data="routers"
          show-checkbox
          node-key="id"
          :default-expand-all="true"
          :default-checked-keys="roleForm.routers"
          :props="defaultProps"
          @check-change="getCheckRouters"
        />
      </el-aside>
      <el-aside style="background-color: white;border-right: 1px solid #eee;margin-bottom: 0px" width="25%">
        <div class="auth-btn" style="padding-bottom: 5px;"><el-tag>按钮权限</el-tag></div>
        <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">全选</el-checkbox>
        <div style="margin: 15px 0;" />
        <el-checkbox-group v-model="roleForm.buttons" @change="handleCheckedButtonsChange">
          <el-checkbox v-for="button in buttons" :key="button.button_id" :label="button.button_id">{{ button.title }}</el-checkbox>
        </el-checkbox-group>
      </el-aside>
    </el-container>
  </div>
</template>

<script>
import { getSystemButtonAll } from '@/api/button'
import { getAdminRouterTree } from '@/api/admin-router'
import { getRole, createRole, updateRole } from '@/api/role'
import { Message } from 'element-ui'
export default {
  name: 'RoleForm',
  inject: ['reload'],
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      contentStyleObj: {
        height: ''
      },
      roleForm: {
        role_name: '',
        desc: '',
        routers: [],
        buttons: []
      },
      rules: {
        role_name: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        desc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' }
        ]
      },
      routers: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      checkAll: false,
      buttons: [],
      isIndeterminate: true
    }
  },
  watch: {
    buttons(newVal, oldVal) {
      if (newVal.length === this.roleForm.buttons.length && newVal.length !== 0) {
        this.checkAll = true
        this.isIndeterminate = false
      }
    },
    'roleForm.buttons'(newVal, oldVal) {
      if (newVal.length === this.buttons.length) {
        this.checkAll = true
        this.isIndeterminate = false
      }
    }
  },
  created() {
    window.addEventListener('resize', this.getHeight)
    this.getHeight()
    if (this.isEdit) {
      const roleId = this.$route.params.id
      getRole(roleId).then(res => {
        this.roleForm = {
          role_id: res.data.role_id,
          role_name: res.data.role_name,
          desc: res.data.desc,
          routers: res.data.router_ids,
          buttons: res.data.button_ids
        }
      })
    }
    getAdminRouterTree().then(res => {
      this.routers = res.data.routers_tree
    })
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
          if (this.isEdit) {
            // 修改
            updateRole(this.roleForm).then(res => {
              Message.success(res.msg)
              this.reload()
            })
          } else {
            // 新增
            createRole(this.roleForm).then(res => {
              Message.success(res.msg)
              this.reload()
            })
          }
        } else {
          Message.error('数据验证失败！')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    // 选中路由权限
    getCheckRouters() {
      this.roleForm.routers = this.$refs.routerTree.getCheckedKeys()
    },
    handleCheckAllChange(val) {
      if (val) {
        const buttonIds = this.buttons.map(item => {
          return item.button_id
        })
        this.roleForm.buttons = buttonIds
      } else {
        this.roleForm.buttons = []
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
.auth-btn{
    text-align: center;
    padding: 10px;
}
.el-checkbox {
  width: 100%;
}
</style>
