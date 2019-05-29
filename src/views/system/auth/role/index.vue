<template>
  <div class="content">
    <div class="filter-container">
      <el-input v-model="listQuery.role_name" placeholder="角色名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        查询
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus" @click="handleCreate">
        新增
      </el-button>
    </div>
    <el-table :data="rolesData" border style="width: 100%">
      <el-table-column align="center" type="index" width="50" />
      <el-table-column align="center" prop="role_name" label="角色名称" width="180" />
      <el-table-column align="center" prop="role" label="权限" width="120">
        <template slot-scope="{row}">
          <el-button type="success" size="mini" @click="handleAuth(row.role_id)">查看</el-button>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="create_time" label="创建时间" width="180" />
      <el-table-column align="center" prop="update_time" label="更新时间" width="180" />
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="danger" size="mini" @click="deleteRole(scope.row.role_id)">删除</el-button>
          <el-button type="primary" size="mini" @click="updateRole(scope.row.role_id)">修改</el-button>
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
import Pagination from '@/components/Paginations'
export default {
  name: 'Role',
  components: {
    Pagination
  },
  data() {
    return {
      pages: {
        per_page: 20,
        total: 10
      },
      listQuery: {
        page: 1,
        row: 20,
        role_name: ''
      },
      rolesData: []
    }
  },
  methods: {
    dataBlock(res) {
      this.pages = res.data.pages
      this.listQuery.page = this.pages.current_page
      this.listQuery.row = this.pages.per_page
      this.rolesData = res.data.roles
    },
    initData(page, row) {
      // getAdminRouterButtonList(page, row).then(res => {
      //   this.dataBlock(res)
      // })
    },
    handleSizeChange(val) {
      this.initData(this.pages.current_page, val)
    },
    handleCurrentChange(val) {
      this.initData(val, this.pages.per_page)
    },
    handleFilter() {
      //
    },
    handleCreate() {
      this.$router.push({ name: 'RoleAdd' })
    },
    // 修改
    handleUpdate(id) {
      this.$router.push({ name: 'RoleUpdate', params: { id: id }})
    },
    // 删除
    handleDelete(id) {
      this.loading = true
      this.$confirm('确定要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 已保存的删除
        // const data = {
        //   admin_router_id: id,
        //   type: 1,
        //   page: this.listQuery.page,
        //   row: this.listQuery.row
        // }
        // deleteAdminRouter(data).then(res => {
        //   Message.success(res.msg)
        //   this.dataBlock(res)
        // })
      }).catch(() => {})
      this.loading = false
    },
    // 查看路由配置
    handleAuth(id) {
      this.dialogVisible = true
      this.dialogTitle = ''
    }
  }
}
</script>

<style scoped>

</style>
