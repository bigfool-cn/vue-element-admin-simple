<template>
  <div class="content">
    <div class="filter-container">
      <el-input v-model="listQuery.username" placeholder="用户名" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.is_active" placeholder="激活状态" style="width: 200px;" class="filter-item">
        <el-option label="全部" value="" />
        <el-option label="已激活" value="1" />
        <el-option label="未激活" value="0" />
      </el-select>
      <el-date-picker v-model="listQuery.date" class="filter-item" type="daterange" value-format="yyyy-MM-dd" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" />
      <el-button v-loading="isLoading" class="filter-item" type="success" icon="el-icon-search" @click="handleFilter">
        查询
      </el-button>
      <el-button v-permission="button.adminuser_add" v-loading="isLoading" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus" @click="handleCreate">
        新增
      </el-button>
      <el-button
        v-permission="button.adminuser_export"
        :loading="isLoading"
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        @click="handleDownload"
      >
        导出
      </el-button>
    </div>
    <el-table :data="adminUserData" border style="width: 100%">
      <el-table-column align="center" type="index" width="50" />
      <el-table-column align="center" prop="username" label="用户名" width="150" />
      <el-table-column align="center" prop="avatar" label="用户头像" width="150">
        <template slot-scope="{row}">
          <img width="50px" height="50px" :src="row.avatar">
        </template>
      </el-table-column>
      <el-table-column align="center" prop="is_active" label="激活状态" width="100">
        <template slot-scope="{row}">
          <el-tag
            :type="row.is_active | activeFilter"
            style="cursor: pointer"
          >
            {{ row.is_active ? '已激活' : '未激活' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="is_active" label="用户角色">
        <template slot-scope="{row}">
          <el-tag v-for="(role,index) in row.roles" :key="index" type="primary" style="margin-left: 5px;">
            {{ role.role_name }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="create_time" label="注册时间" width="180" />
      <el-table-column align="center" prop="update_time" label="更新时间" width="180" />
      <el-table-column align="center" prop="login_time" label="最后登录时间" width="180" />
      <el-table-column align="center" label="操作" width="300px">
        <template slot-scope="scope">
          <el-button v-loading="isLoading" :type="scope.row.is_active ? 'info' : 'warning'" size="mini" @click="changeActive(scope.row.admin_user_id, scope.row.is_active)">
            {{ scope.row.is_active ? '禁用' : '激活' }}
          </el-button>
          <el-button v-permission="button.adminuser_role" v-loading="isLoading" type="success" size="mini" @click="handleRole(scope.row.admin_user_id, scope.row.roles)">分配角色</el-button>
          <el-button v-permission="button.adminuser_edit_pwd" v-loading="isLoading" type="primary" size="mini" @click="handleClick(scope.row.admin_user_id)">修改密码</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :page-size="pages.per_page" :total="pages.total" @handleCurrentChange="handleCurrentChange" @handleSizeChange="handleSizeChange" />
    <el-dialog v-el-drag-dialog title="修改密码" :visible.sync="dialogVisiblePassword" width="30%" center :show-close="false">
      <el-form ref="changePasswordForm" :model="changePasswordForm" :rules="rules">
        <el-form-item label="新密码" prop="password" label-width="85px">
          <el-input v-model="changePasswordForm.password" type="password" placeholder="新密码" />
        </el-form-item>
        <el-form-item label="确认新密码" prop="password_confirm" label-width="85px">
          <el-input v-model="changePasswordForm.password_confirm" type="password" placeholder="再次输入新密码" />
        </el-form-item>
        <el-form-item label-width="px" style="text-align: center">
          <el-button @click="closeDialog('changePasswordForm')">取 消</el-button>
          <el-button v-loading="isLoading" type="primary" @click="changePassword('changePasswordForm')">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog v-el-drag-dialog title="分配角色" :visible.sync="dialogVisibleRole" width="30%" height="50%" center :show-close="false">
      <el-form ref="changeRoleForm" :model="changeRoleForm" :rules="rulesRole">
        <el-form-item label="分配角色" prop="roles">
          <el-select v-model="changeRoleForm.roles" v-el-select-loadmore="loadMoreRoles" multiple :multiple-limit="3" placeholder="请选择角色">
            <el-option
              v-for="item in roleList"
              :key="item.role_id"
              :label="item.role_name"
              :value="item.role_id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label-width="px" style="text-align: center">
          <el-button @click="closeDialog('changeRoleForm')">取 消</el-button>
          <el-button v-loading="isLoading" type="primary" @click="changeRole('changeRoleForm')">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { Message } from 'element-ui'
import { getAdminUserList, updateAdminUserActive, updateAdminUserPassword, updateAdminUserRole } from '@/api/user'
import { getRoleList } from '@/api/role'
import Pagination from '@/components/Paginations'
import elDragDialog from '@/directive/el-drag-dialog'
import permission from '@/directive/permission'
import elSelectLoadmore from '@/directive/el-select-loadmore'

export default {
  name: 'AdminUser',
  inject: ['reload'],
  directives: { elDragDialog, permission, elSelectLoadmore },
  components: {
    Pagination
  },
  filters: {
    activeFilter(isActive) {
      const activeMap = {
        0: 'info',
        1: 'success'
      }
      return activeMap[isActive]
    }
  },
  data() {
    var validatePassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else if (value.length < 6) {
        callback(new Error('密码长度不能小于6'))
      } else {
        if (this.changePasswordForm.password_confirm !== '') {
          this.$refs.changePasswordForm.validateField('password_confirm')
        }
        callback()
      }
    }
    var validatePasswordConfirm = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.changePasswordForm.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    var validateRoles = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请选择角色'))
      } else if (value.length > 3) {
        callback(new Error('选择角色数目不能超过3个'))
      } else {
        callback()
      }
    }
    return {
      button: {
        adminuser_add: 'adminuser_add',
        adminuser_edit_pwd: 'adminuser_edit_pwd',
        adminuser_role: 'adminuser_role',
        adminuser_export: 'adminuser_export',
        adminuser_delete: 'adminuser_delete'
      },
      roleList: [], // 角色列表
      isMore: false, // 是否有更多
      pages: {
        per_page: 20,
        total: 10
      },
      adminUserData: [],
      listQuery: {
        page: 1,
        row: 20,
        username: undefined,
        is_active: undefined,
        date: undefined
      },
      rolesQuery: {
        page: 1,
        row: 100
      },
      isLoading: false,
      dialogVisiblePassword: false,
      dialogVisibleRole: false,
      adminUserId: 0,
      changePasswordForm: {
        password: '',
        password_confirm: ''
      },
      changeRoleForm: {
        roles: []
      },
      rules: {
        password: [
          { validator: validatePassword, trigger: 'blur' }
        ],
        password_confirm: [
          { validator: validatePasswordConfirm, trigger: 'blur' }
        ]
      },
      rulesRole: {
        roles: [
          { validator: validateRoles, trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.initData(this.listQuery)
    this.initRoleList(this.rolesQuery)
  },
  methods: {
    initData(params) {
      getAdminUserList(params).then(res => {
        this.pages = res.data.pages
        this.listQuery.page = this.pages.current_page + 1
        this.listQuery.row = this.pages.per_page
        this.adminUserData = res.data.admin_users
      })
    },
    dataBlock(res, isInit) {
      this.rolesQuery.page = res.data.pages.current_page + 1
      this.rolesQuery.row = res.data.pages.per_page
      this.roleList = isInit ? res.data.roles : this.roleList.concat(res.data.roles)
      this.isMore = (res.data.pages.current_page < res.data.pages.last_page)
    },
    initRoleList(params) {
      getRoleList(params).then(res => {
        this.dataBlock(res, true)
      })
    },
    // 加载更多角色列表
    loadMoreRoles() {
      if (this.isMore) {
        getRoleList(this.rolesQuery).then(res => {
          this.dataBlock(res, false)
        })
      }
    },
    // 点击修改密码
    handleClick(id) {
      this.isLoading = true
      this.adminUserId = id
      this.dialogVisiblePassword = true
      this.isLoading = false
    },
    // 点击分配角色
    handleRole(id, roles) {
      this.isLoading = true
      this.adminUserId = id
      this.changeRoleForm.roles = []
      roles.forEach(item => {
        this.changeRoleForm.roles.push(item.role_id)
      })
      this.dialogVisibleRole = true
      this.isLoading = false
    },
    handleSizeChange(val) {
      this.listQuery.row = val
      this.initData(this.listQuery)
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.initData(this.listQuery)
    },
    handleFilter() {
      this.isLoading = true
      this.initData(this.listQuery)
      this.isLoading = false
    },
    handleCreate() {
      this.isLoading = true
      this.$router.push({ name: 'AdminUserAdd' })
      this.isLoading = false
    },
    // 导出数据
    handleDownload() {
      this.isLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['用户名', '激活状态', '注册时间', '更新时间', '最后登录时间']
        const filterVal = ['username', 'is_active', 'create_time', 'update_time', 'login_time']
        const data = this.formatJson(filterVal, this.adminUserData)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.isLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'is_active') {
          return v[j] ? '已激活' : '未激活'
        } else {
          return v[j]
        }
      }))
    },
    // 更改激活状态
    changeActive(id, val) {
      this.isLoading = true
      const data = this.listQuery
      data.admin_user_id = id
      data.is_active = val
      updateAdminUserActive(data).then(res => {
        Message.success(res.msg)
        this.adminUserData = res.data.admin_users
      })
      this.isLoading = false
    },
    // 取消弹框
    closeDialog(formName) {
      this.dialogVisiblePassword = false
      this.dialogVisibleRole = false
      this.$refs[formName].resetFields()
    },
    // 修改密码
    changePassword(formName) {
      this.isLoading = true
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.changePasswordForm.admin_user_id = this.adminUserId
          updateAdminUserPassword(this.changePasswordForm).then(res => {
            this.dialogVisiblePassword = false
            Message.success(res.msg)
          })
        } else {
          Message.error('数据验证失败！')
          return false
        }
      })
      this.isLoading = false
    },
    // 分配角色
    changeRole(formName) {
      this.isLoading = true
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.changeRoleForm.admin_user_id = this.adminUserId
          updateAdminUserRole(this.changeRoleForm).then(res => {
            this.dialogVisibleRole = false
            Message.success(res.msg)
            this.reload()
          })
        } else {
          Message.error('数据验证失败！')
          return false
        }
      })
      this.isLoading = false
    }
  }
}
</script>

<style scoped>

</style>
