<template>
  <div class="content">
    <div class="filter-container">
      <el-input v-model="listQuery.title" placeholder="权限名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.type" placeholder="权限类型" style="width: 200px;" class="filter-item">
        <el-option label="全部" value="" />
        <el-option label="路由" value="路由" />
        <el-option label="按钮" value="按钮" />
      </el-select>
      <el-date-picker v-model="listQuery.date" class="filter-item" type="daterange" value-format="yyyy-MM-dd" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" />
      <el-button v-loading="loading" class="filter-item" type="success" icon="el-icon-search" @click="handleFilter">
        查询
      </el-button>
    </div>
    <el-table :data="authsData" border style="width: 100%">
      <el-table-column align="center" type="index" width="50" />
      <el-table-column align="center" prop="title" label="权限名称" />
      <el-table-column align="center" prop="type" label="权限类型">
        <template slot-scope="{row}">
          <el-tag :type="row.type | typeFilter">
            {{ row.type }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="create_time" label="创建时间" />
      <el-table-column align="center" prop="update_time" label="更新时间" />
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
import { getAuthList } from '@/api/auth'

export default {
  name: 'Auth',
  components: {
    Pagination
  },
  filters: {
    typeFilter(type) {
      const typeMap = {
        按钮: 'primary',
        路由: 'success'
      }
      return typeMap[type]
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
        title: undefined,
        type: undefined,
        date: undefined
      },
      authsData: []
    }
  },
  created() {
    this.initData(this.listQuery)
  },
  methods: {
    dataBlock(res) {
      this.pages = res.data.pages
      this.listQuery.page = this.pages.current_page + 1
      this.listQuery.row = this.pages.per_page
      this.authsData = res.data.auths
    },
    initData(params) {
      getAuthList(params).then(res => {
        this.dataBlock(res)
      })
    },
    handleSizeChange(val) {
      this.listQuery.page = 1
      this.listQuery.row = val
      this.initData(this.listQuery)
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.initData(this.listQuery)
    },
    handleFilter() {
      this.loading = true
      this.listQuery.page = 1
      this.initData(this.listQuery)
      this.loading = false
    }
  }
}
</script>

<style scoped>

</style>
