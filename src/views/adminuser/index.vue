<template>
  <div class="content">
    <el-table
      :data="adminUserData"
      border
      style="width: 100%"
    >
      <el-table-column
        prop="username"
        label="用户名"
        width="180"
      />
      <el-table-column
        prop="create_time"
        label="注册时间"
        width="180"
      />
      <el-table-column
        prop="login_time"
        label="最后登录时间"
      />
      <el-table-column
        fixed="right"
        label="操作"
        width="100"
      >
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="handleClick(scope.row)">查看</el-button>
          <el-button type="text" size="small">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :page-size="pages.per_page" :total="pages.total" @handleCurrentChange="handleCurrentChange" @handleSizeChange="handleSizeChange" />
  </div>
</template>

<script>
import { getAdminUsers } from '../../api/user'
import Pagination from '@/components/Paginations'
export default {
  name: 'Index',
  components: {
    Pagination
  },
  data() {
    return {
      pages: {
        per_page: 20,
        total: 10
      },
      adminUserData: []
    }
  },
  created() {
    const page = 1
    getAdminUsers(page, this.pages.per_page).then(res => {
      this.pages = res.data.pages
      this.adminUserData = res.data.admin_users
    })
  },
  methods: {
    handleClick(row) {
      console.log(row)
    },
    handleSizeChange(val) {
      getAdminUsers(this.pages.current_page, val).then(res => {
        this.pages = res.data.pages
        this.adminUserData = res.data.admin_users
      })
    },
    handleCurrentChange(val) {
      getAdminUsers(val, this.pages.per_page).then(res => {
        this.pages = res.data.pages
        this.adminUserData = res.data.admin_users
      })
    }
  }
}
</script>

<style scoped>

</style>
