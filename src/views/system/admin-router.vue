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
    </div>
    <el-table :data="adminUserData" border style="width: 100%">
      <el-table-column prop="username" label="用户名" width="180" />
      <el-table-column prop="create_time" label="注册时间" />
      <el-table-column prop="update_time" label="更新时间" />
      <el-table-column prop="login_time" label="最后登录时间" />
      <el-table-column fixed="right" label="操作" width="100" />
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
import { getAdminUsers } from '../../api/user'
import Pagination from '@/components/Paginations'
export default {
  name: 'AdminRouter',
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
      }
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
      this.$router.push({ name: 'AdminRouter-Add' })
    }
  }
}
</script>

<style scoped>

</style>
