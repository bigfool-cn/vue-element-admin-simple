<template>
  <div class="content">
    <div class="filter-container">
      <el-input v-model="listQuery.username" placeholder="用户名" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
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
      <el-table-column prop="username" label="用户名" width="180" />
      <el-table-column prop="is_active" label="激活状态" width="180">
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
      <el-table-column prop="create_time" label="注册时间" />
      <el-table-column prop="update_time" label="更新时间" />
      <el-table-column prop="login_time" label="最后登录时间" />
      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="handleClick(scope.row.admin_user_id)">修改密码</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      :page-size="pages.per_page"
      :total="pages.total"
      @handleCurrentChange="handleCurrentChange"
      @handleSizeChange="handleSizeChange"
    />
  </div>
</template>

<script>
import { Message } from 'element-ui'
import { getAdminUsers, updateAdminUserActive } from '../../api/user'
import Pagination from '@/components/Paginations'
export default {
  name: 'Index',
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
    return {
      pages: {
        per_page: 20,
        total: 10
      },
      adminUserData: [],
      listQuery: {
        page: 1,
        row: 20,
        username: undefined
      },
      downloadLoading: false
    }
  },
  created() {
    const page = 1
    getAdminUsers(page, this.pages.per_page).then(res => {
      this.pages = res.data.pages
      this.listQuery.page = this.pages.current_page
      this.listQuery.row = this.pages.per_page
      this.adminUserData = res.data.admin_users
    })
  },
  methods: {
    handleClick(id) {
      console.log(id)
    },
    handleSizeChange(val) {
      getAdminUsers(this.pages.current_page, val).then(res => {
        this.pages = res.data.pages
        this.listQuery.page = this.pages.current_page
        this.listQuery.row = this.pages.per_page
        this.adminUserData = res.data.admin_users
      })
    },
    handleCurrentChange(val) {
      getAdminUsers(val, this.pages.per_page).then(res => {
        this.pages = res.data.pages
        this.listQuery.page = this.pages.current_page
        this.listQuery.row = this.pages.per_page
        this.adminUserData = res.data.admin_users
      })
    },
    handleFilter() {
      //
    },
    handleCreate() {
      this.$router.push({ name: 'AdminUser-Add' })
    },
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
    changeActive(id, val) {
      const data = this.listQuery
      data.admin_user_id = id
      data.is_active = val
      updateAdminUserActive(data).then(res => {
        Message.success(res.msg)
        this.adminUserData = res.data.admin_users
      })
    }
  }
}
</script>

<style scoped>

</style>
