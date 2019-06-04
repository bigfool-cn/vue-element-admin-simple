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
      <el-button class="filter-item" type="success" icon="el-icon-search" @click="handleFilter">
        查询
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus" @click="handleCreate">
        新增
      </el-button>
      <el-button :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        导出
      </el-button>
    </div>
    <el-table :data="adminUserData" border style="width: 100%">
      <el-table-column align="center" type="index" width="50" />
      <el-table-column align="center" prop="username" label="用户名" width="150" />
      <el-table-column align="center" prop="is_active" label="激活状态" width="100">
        <template slot-scope="{row}">
          <el-tag
            :type="row.is_active | activeFilter"
            style="cursor: pointer"
            @click="changeActive(row.admin_user_id, row.is_active)"
          >
            {{ row.is_active ? '已激活' : '未激活' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="create_time" label="注册时间" />
      <el-table-column align="center" prop="update_time" label="更新时间" />
      <el-table-column align="center" prop="login_time" label="最后登录时间" />
      <el-table-column align="center" label="操作" width="300px">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleClick(scope.row.admin_user_id)">修改密码</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      :page-size="pages.per_page"
      :total="pages.total"
      @handleCurrentChange="handleCurrentChange"
      @handleSizeChange="handleSizeChange"
    />
    <el-dialog title="修改密码" :visible.sync="dialogVisible" width="30%" center :show-close="false">
      <el-form ref="changePasswordForm" :model="changePasswordForm" :rules="rules" label-width="85px">
        <el-form-item label="新密码" prop="password">
          <el-input v-model="changePasswordForm.password" type="password" placeholder="新密码" />
        </el-form-item>
        <el-form-item label="确认新密码" prop="password_confirm">
          <el-input v-model="changePasswordForm.password_confirm" type="password" placeholder="再次输入新密码" />
        </el-form-item>
        <el-form-item>
          <el-button @click="closeDialog('changePasswordForm')">取 消</el-button>
          <el-button type="primary" @click="changePassword('changePasswordForm')">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { Message } from 'element-ui'
import { getAdminUserList, updateAdminUserActive, updateAdminUserPassword } from '@/api/user'
import Pagination from '@/components/Paginations'
export default {
  name: 'AdminUser',
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
    return {
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
      downloadLoading: false,
      dialogVisible: false,
      adminUserId: 0,
      changePasswordForm: {
        password: '',
        password_confirm: ''
      },
      rules: {
        password: [
          { validator: validatePassword, trigger: 'blur' }
        ],
        password_confirm: [
          { validator: validatePasswordConfirm, trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.initData(this.listQuery)
  },
  methods: {
    initData(params) {
      getAdminUserList(params).then(res => {
        this.pages = res.data.pages
        this.listQuery.page = this.pages.current_page
        this.listQuery.row = this.pages.per_page
        this.adminUserData = res.data.admin_users
      })
    },
    // 点击修改密码
    handleClick(id) {
      this.adminUserId = id
      this.dialogVisible = true
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
      this.initData(this.listQuery)
    },
    handleCreate() {
      this.$router.push({ name: 'AdminUserAdd' })
    },
    // 导出数据
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['用户名', '激活状态', '注册时间', '更新时间', '最后登录时间']
        const filterVal = ['username', 'is_active', 'create_time', 'update_time', 'login_time']
        const data = this.formatJson(filterVal, this.adminUserData)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
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
      const data = this.listQuery
      data.admin_user_id = id
      data.is_active = val
      updateAdminUserActive(data).then(res => {
        Message.success(res.msg)
        this.adminUserData = res.data.admin_users
      })
    },
    // 取消修改密码
    closeDialog(formName) {
      this.dialogVisible = false
      this.$refs[formName].resetFields()
    },
    // 修改密码
    changePassword(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.changePasswordForm.admin_user_id = this.adminUserId
          updateAdminUserPassword(this.changePasswordForm).then(res => {
            this.dialogVisible = false
            Message.success(res.msg)
          })
        } else {
          Message.error('数据验证失败！')
          return false
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
