<template>
  <div class="content" :style="contentStyleObj">
    <el-container style="width: 100%; border: 1px solid #eee" :style="contentStyleObj">
      <el-aside style="background-color: white;border-right: 1px solid #eee;margin-bottom: 0px" width="30%">
        <el-tree
          :data="treeRouter"
          :props="defaultProps"
          node-key="id"
          @node-click="handleNodeClick"
        />
        <div style="padding-top: 30px;">
          <el-button v-loading="loading" type="primary" size="mini" @click.stop="append">新增</el-button>
          <el-button v-loading="loading" type="danger" size="mini" @click.stop="remove">删除</el-button>
          <el-button v-show="showSave" v-loading="loading" type="primary" size="mini" @click.stop="submitForm">保存</el-button>
        </div>
      </el-aside>
      <el-aside style="background-color: white;margin-bottom: 0px" width="70%">
        <el-input v-model="routerForm.title" placeholder="菜单名称" style="padding: 15px 0px;" />
        <json-editor ref="jsonEditor" v-model="routerForm.param" />
      </el-aside>
    </el-container>
  </div>
</template>

<script>
import JsonEditor from '@/components/JsonEditor'
import { Message } from 'element-ui'
import { getAdminRouterMenuTree, createAdminRouter, updateAdminRouter, getAdminRouter, deleteAdminRouter } from '@/api/admin-router'
const parentRouter = '{"path": "/system","component": "Layout","redirect": "noRedirect","name": "System","hihhen": "false","alwaysShow": "true","meta": {"title": "系统管理","icon": "system"}}'
const childrenRouter = '{"path": "adminu-router","name": "AdminRouter","component": "/system/admin-router","hihhen": "false","meta": {"title": "路由管理","icon": "router"}}'
let id = 10000
export default {
  name: 'MenuRouter',
  components: { JsonEditor },
  data() {
    return {
      loading: false,
      id: 0,
      nodeData: '',
      showSave: false,
      routerForm: {
        parent_id: null,
        title: '',
        param: {},
        type: 0
      },
      treeRouter: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      contentStyleObj: {
        height: ''
      }
    }
  },
  created() {
    window.addEventListener('resize', this.getHeight)
    this.getHeight()
    getAdminRouterMenuTree().then(res => {
      this.treeRouter = res.data
    })
  },
  methods: {
    getHeight() {
      this.contentStyleObj.height = window.innerHeight - 115 + 'px'
    },
    handleNodeClick(nodeData) {
      this.showSave = true
      this.id = nodeData.id
      this.nodeData = nodeData
      if (this.id < id - 1) {
        getAdminRouter(this.id).then(res => {
          this.routerForm = {
            parent_id: res.data.parent_id,
            title: res.data.title,
            param: res.data.param,
            type: res.data.type
          }
        })
      } else if (this.id === id - 1) {
        this.routerForm.title = ''
        this.routerForm.param = JSON.parse(childrenRouter)
      } else {
        this.routerForm.param = JSON.parse(parentRouter)
      }
    },
    append() {
      this.loading = true
      if (this.id !== 0) {
        this.routerForm.parent_id = this.id
        const newChild = { id: id++, label: '新增菜单', children: [] }
        this.keys = [this.id]
        if (!this.nodeData.children) {
          this.$set(this.nodeData, 'children', [])
        }
        this.nodeData.children.push(newChild)
      } else {
        this.routerForm.parent_id = 0
        const newRouter = { id: id++, label: '新增菜单', children: [] }
        this.treeRouter.push(newRouter)
      }
      this.loading = false
    },
    remove() {
      this.loading = true
      if (this.id === id - 1 || this.id === 0) {
        // 新增未保存时删除
        getAdminRouterMenuTree().then(res => {
          this.treeRouter = res.data
        })
      } else {
        this.$confirm('确定要删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 已保存的删除
          const data = {
            admin_router_id: this.id,
            type: this.routerForm.type
          }
          deleteAdminRouter(data).then(res => {
            Message.success(res.msg)
            this.treeRouter = res.data
          })
        }).catch(() => {})
      }
      this.loading = false
    },
    submitForm() {
      this.loading = true
      if (this.id === id - 1) {
        // 新增
        if (this.routerForm.parent_id !== null) {
          createAdminRouter(this.routerForm).then(res => {
            Message.success(res.msg)
            this.treeRouter = res.data
          })
        }
      } else {
        // 修改
        this.routerForm.admin_router_id = this.id
        updateAdminRouter(this.routerForm).then(res => {
          Message.success(res.msg)
          this.treeRouter = res.data
        })
      }
      this.loading = false
    }
  },
  destroy() {
    window.removeEventListener('resize', this.getHeight)
  }
}
</script>

<style scoped>

</style>
