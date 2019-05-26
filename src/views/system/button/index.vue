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
    <el-table :data="buttonData" border style="width: 100%">
      <el-table-column type="index" width="50" />
      <el-table-column prop="title" label="按钮名称" width="200" />
      <el-table-column prop="key" label="唯一标识" width="200" />
      <el-table-column prop="is_enable" label="是否可用" width="80">
        <template slot-scope="{row}">
          <el-tag :type="row.is_enable | enableFilter">
            {{ row.is_enable ? '可用' : '不可用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="create_time" label="创建时间" width="180" />
      <el-table-column prop="update_time" label="更新时间" width="180" />
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button type="danger" size="mini" @click="deleteButton(scope.row.button_id)">删除</el-button>
          <el-button type="primary" size="mini" @click="updateButton(scope.row)">修改</el-button>
          <el-button type="primary" size="mini" @click="changeEnable(scope.row.button_id, scope.row.is_enable)">{{ scope.row.is_enable ? '更改为不可用' : '更改为可用' }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      :page-size="pages.per_page"
      :total="pages.total"
      @handleCurrentChange="handleCurrentChange"
      @handleSizeChange="handleSizeChange"
    />
    <el-dialog :title="formTitle" :visible.sync="dialogVisible" width="30%" center :show-close="false">
      <el-form ref="buttonForm" :model="buttonForm" :rules="rules" label-width="85px">
        <el-form-item label="按钮名称" prop="title">
          <el-input v-model="buttonForm.title" type="text" placeholder="按钮名称" />
        </el-form-item>
        <el-form-item label="唯一标识" prop="key">
          <el-input v-model="buttonForm.key" type="text" placeholder="唯一标识" />
        </el-form-item>
        <el-form-item label="是否可用" prop="is_enable">
          <el-switch v-model="buttonForm.is_enable" />
        </el-form-item>
        <el-form-item>
          <el-button @click="closeDialog('buttonForm')">取 消</el-button>
          <el-button type="primary" @click="submitForm('buttonForm')">保 存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { Message } from 'element-ui'
import { getSystemButtonList, createSystemButton, updateSystemButton, deleteSystemButton, updateSystemButtonEnable } from '@/api/button'
import Pagination from '@/components/Paginations'
export default {
  name: 'Button',
  components: {
    Pagination
  },
  filters: {
    enableFilter(isEnable) {
      const aenableMap = {
        0: 'info',
        1: 'success'
      }
      return aenableMap[isEnable]
    }
  },
  data() {
    return {
      pages: {
        per_page: 20,
        total: 10
      },
      buttonData: [],
      listQuery: {
        page: 1,
        row: 20,
        title: ''
      },
      dialogVisible: false,
      buttonId: 0,
      formTitle: '新增按钮',
      buttonForm: {
        title: '',
        key: '',
        is_enable: true
      },
      rules: {
        title: [
          { required: true, message: '请输入按钮名称', trigger: 'blur' }
        ],
        key: [
          { required: true, message: '请输入唯一标识', trigger: 'blur' }
        ]
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
      this.buttonData = res.data.system_buttons
    },
    initData(page, row) {
      getSystemButtonList(page, row).then(res => {
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
      this.dialogVisible = true
      this.formTitle = '新增按钮'
      this.buttonForm = {
        title: '',
        key: '',
        is_enable: true
      }
    },
    // 更改激活状态
    changeEnable(id, val) {
      const data = this.listQuery
      data.button_id = id
      data.is_enable = val
      const text = val ? '不可用' : '可用'
      this.$confirm('确定更改为' + text + '吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        updateSystemButtonEnable(data).then(res => {
          Message.success(res.msg)
          this.dataBlock(res)
        })
      }).catch(() => {})
    },
    // 取消
    closeDialog(formName) {
      this.dialogVisible = false
      this.formTitle = '新增按钮'
      this.$refs[formName].resetFields()
    },
    // 新增/修改
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.formTitle === '新增按钮') {
            createSystemButton(this.buttonForm).then(res => {
              this.dialogVisible = false
              Message.success(res.msg)
              this.dataBlock(res)
            })
          } else {
            this.buttonForm.button_id = this.buttonId
            updateSystemButton(this.buttonForm).then(res => {
              this.dialogVisible = false
              Message.success(res.msg)
              this.dataBlock(res)
            })
          }
        } else {
          Message.error('数据验证失败！')
          return false
        }
      })
    },
    updateButton(row) {
      this.dialogVisible = true
      this.formTitle = '修改按钮'
      this.buttonId = row.button_id
      this.buttonForm = {
        is_enable: Boolean(row.is_enable),
        title: row.title,
        key: row.key
      }
    },
    deleteButton(buttonId) {
      this.$confirm('确定删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteSystemButton({ button_id: buttonId }).then(res => {
          Message.success(res.msg)
          this.dataBlock(res)
        })
      }).catch(() => {})
    }
  }
}
</script>
