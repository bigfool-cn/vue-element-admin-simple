<template>
  <div class="content">
    <div class="filter-container">
      <el-input v-model="listQuery.title" placeholder="按钮名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        查询
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus" @click="handleCreate">
        新增
      </el-button>
    </div>
    <el-table :data="adminRouterButtonData" border style="width: 100%">
      <el-table-column align="center" type="index" width="50" />
      <el-table-column align="center" prop="title" label="按钮名称" width="200" />
      <el-table-column align="center" prop="param" label="路由配置" width="120">
        <template slot-scope="{row}">
          <el-button type="success" size="mini" @click="handleParam(row.param, row.title)">查看</el-button>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="create_time" label="注册时间" width="200" />
      <el-table-column align="center" prop="update_time" label="更新时间" width="200" />
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button v-loading="loading" type="danger" size="mini" @click="handleDelete(scope.row.admin_router_id)">删除</el-button>
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row.admin_router_id)">修改</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="40%"
      center
    >
      <json-editor ref="jsonEditor" v-model="param" style="font-size: 16px;" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
    <pagination
      :page-size="pages.per_page"
      :total="pages.total"
      @handleCurrentChange="handleCurrentChange"
      @handleSizeChange="handleSizeChange"
    />
  </div>
</template>

<script>
import { getAdminRouterButtonList, deleteAdminRouter } from '@/api/admin-router'
import Pagination from '@/components/Paginations'
import JsonEditor from '@/components/JsonEditor'
import { Message } from 'element-ui'
export default {
  name: 'ButtonRouter',
  components: {
    Pagination,
    JsonEditor
  },
  data() {
    return {
      loading: false,
      dialogVisible: false,
      dialogTitle: '',
      adminRouterId: 0,
      param: {},
      adminRouterButtonData: [],
      pages: {
        per_page: 20,
        total: 10
      },
      listQuery: {
        page: 1,
        row: 20,
        title: ''
      }
    }
  },
  created() {
    const page = 1
    this.initData(page, this.pages.per_page)
  },
  methods: {
    dataBlock(res) {
      this.pages = res.data.pages
      this.listQuery.page = this.pages.current_page
      this.listQuery.row = this.pages.per_page
      this.adminRouterButtonData = res.data.admin_routers
    },
    initData(page, row) {
      getAdminRouterButtonList(page, row).then(res => {
        this.dataBlock(res)
      })
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
      this.$router.push({ name: 'ButtonRouterAdd' })
    },
    // 修改
    handleUpdate(id) {
      this.$router.push({ name: 'ButtonRouterUpdate', params: { id: id }})
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
        const data = {
          admin_router_id: id,
          type: 1,
          page: this.listQuery.page,
          row: this.listQuery.row
        }
        deleteAdminRouter(data).then(res => {
          Message.success(res.msg)
          this.dataBlock(res)
        })
      }).catch(() => {})
      this.loading = false
    },
    // 查看路由配置
    handleParam(param, title) {
      this.dialogVisible = true
      this.dialogTitle = title + ' / 路由配置'
      this.param = JSON.parse(param)
    }
  }
}
</script>

<style scoped>

</style>
