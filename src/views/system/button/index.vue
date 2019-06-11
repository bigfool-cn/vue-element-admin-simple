<template>
  <div class="content">
    <div class="filter-container">
      <el-input v-model="listQuery.title" placeholder="按钮名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.is_enable" placeholder="是否可用" style="width: 200px;" class="filter-item">
        <el-option label="全部" value="" />
        <el-option label="可用" value="1" />
        <el-option label="不可用" value="0" />
      </el-select>
      <el-date-picker v-model="listQuery.date" class="filter-item" type="daterange" value-format="yyyy-MM-dd" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" />
      <el-button class="filter-item" type="success" icon="el-icon-search" @click="handleFilter">
        查询
      </el-button>
      <el-button v-permission="button.button_add" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus" @click="handleCreate">
        新增
      </el-button>
    </div>
    <el-table :data="buttonData" border style="width: 100%">
      <el-table-column align="center" type="index" width="50" />
      <el-table-column align="center" prop="title" label="按钮名称" />
      <el-table-column align="center" prop="key" label="唯一标识" />
      <el-table-column align="center" prop="is_enable" label="是否可用" width="100">
        <template slot-scope="{row}">
          <el-tag :type="row.is_enable | enableFilter">
            {{ row.is_enable ? '可用' : '不可用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="create_time" label="创建时间" width="180" />
      <el-table-column align="center" prop="update_time" label="更新时间" width="180" />
      <el-table-column align="center" label="操作" width="300px">
        <template slot-scope="scope">
          <el-button v-permission="button.button_delete" type="danger" size="mini" @click="deleteButton(scope.row.button_id)">删除</el-button>
          <el-button v-permission="button.button_edit" type="primary" size="mini" @click="updateButton(scope.row)">修改</el-button>
          <el-button
            v-permission="button.button_enable"
            type="warning"
            size="mini"
            @click="changeEnable(scope.row.button_id, scope.row.is_enable)"
          >{{ scope.row.is_enable ? '不可用' : '可用' }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      :page-size="pages.per_page"
      :total="pages.total"
      @handleCurrentChange="handleCurrentChange"
      @handleSizeChange="handleSizeChange"
    />
    <el-dialog v-el-drag-dialog :title="formTitle" :visible.sync="dialogVisible" width="30%" center :show-close="false">
      <el-form ref="buttonForm" :model="buttonForm" :rules="rules">
        <el-form-item label="按钮名称" prop="title" label-width="85px">
          <el-input v-model="buttonForm.title" type="text" placeholder="按钮名称" />
        </el-form-item>
        <el-form-item label="唯一标识" prop="key" label-width="85px">
          <el-input v-model="buttonForm.key" type="text" placeholder="唯一标识" />
        </el-form-item>
        <el-form-item label="是否可用" prop="is_enable" label-width="85px">
          <el-switch v-model="buttonForm.is_enable" />
        </el-form-item>
        <el-form-item label-width="0px" style="text-align: center;">
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
import elDragDialog from '@/directive/el-drag-dialog'
import permission from '@/directive/permission'

export default {
  name: 'Button',
  directives: { elDragDialog, permission },
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
      button: {
        button_add: 'button_add',
        button_edit: 'button_edit',
        button_delete: 'button_delete',
        button_enable: 'button_enable'
      },
      pages: {
        per_page: 20,
        total: 10
      },
      buttonData: [],
      listQuery: {
        page: 1,
        row: 20,
        title: undefined,
        is_enable: undefined,
        date: undefined
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
    this.initData(this.listQuery)
  },
  methods: {
    dataBlock(res) {
      this.pages = res.data.pages
      this.listQuery.page = this.pages.current_page
      this.listQuery.row = this.pages.per_page
      this.buttonData = res.data.system_buttons
    },
    initData(params) {
      getSystemButtonList(params).then(res => {
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
<style scoped>

</style>
