<template>
  <div class="content">
    <div class="filter-container">
      <el-input v-model="listQuery.role_name" placeholder="角色名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-date-picker v-model="listQuery.date" class="filter-item" type="daterange" value-format="yyyy-MM-dd" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" />
      <el-button class="filter-item" type="success" icon="el-icon-search" @click="handleFilter">
        查询
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus" @click="handleCreate">
        新增
      </el-button>
    </div>
    <el-table :data="rolesData" border style="width: 100%">
      <el-table-column align="center" type="index" width="50" />
      <el-table-column align="center" prop="role_name" label="角色名称" width="200" />
      <el-table-column align="center" prop="desc" label="角色描述" />
      <el-table-column align="center" prop="create_time" label="创建时间" width="200" />
      <el-table-column align="center" prop="update_time" label="更新时间" width="200" />
      <el-table-column align="center" label="操作" width="300px">
        <template slot-scope="scope">
          <el-button v-loading="loading" type="danger" size="mini" @click="handleDelete(scope.row.role_id)">删除</el-button>
          <el-button v-loading="loading" type="primary" size="mini" @click="handleUpdate(scope.row.role_id)">修改</el-button>
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
import { getRoleList, deleteRole } from '@/api/role'
import { Message } from 'element-ui'
import Pagination from '@/components/Paginations'
export default {
  name: 'Role',
  components: {
    Pagination
  },
  filters: {
    enableFilter(isEnable) {
      const enableMap = {
        0: 'info',
        1: 'success'
      }
      return enableMap[isEnable]
    }
  },
  data() {
    return {
      loading: false,
      pages: {
        per_page: 20,
        total: 10
      },
      listQuery: {
        page: 1,
        row: 20,
        role_name: undefined,
        date: undefined
      },
      rolesData: []
    }
  },
  created() {
    this.initData(this.listQuery)
  },
  methods: {
    dataBlock(res) {
      this.pages = res.data.pages
      this.listQuery.page = this.pages.current_page
      this.listQuery.row = this.pages.per_page
      this.rolesData = res.data.roles
    },
    initData(params) {
      getRoleList(params).then(res => {
        this.dataBlock(res)
      })
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
      this.$router.push({ name: 'RoleAdd' })
    },
    // 修改
    handleUpdate(id) {
      this.$router.push({ name: 'RoleEdit', params: { id: id }})
    },
    // 删除
    handleDelete(id) {
      this.loading = true
      this.$confirm('确定要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const data = {
          role_id: id,
          type: 1,
          page: this.listQuery.page,
          row: this.listQuery.row
        }
        deleteRole(data).then(res => {
          Message.success(res.msg)
          this.dataBlock(res)
        })
      }).catch(() => {})
      this.loading = false
    }
  }
}
</script>

<style scoped>

</style>
