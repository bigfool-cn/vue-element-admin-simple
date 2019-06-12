<template>
  <div class="content" :style="contentStyleObj">
    <el-container style="width: 100%; border: 1px solid #eee" :style="contentStyleObj" @click="handleParent">
      <el-aside style="background-color: white;border-right: 1px solid #eee;margin-bottom: 0px" width="30%">
        <el-tree
          node-key="id"
          highlight-current
          draggable
          :data="treeRouter"
          :props="defaultProps"
          :default-expanded-keys="keys"
          :allow-drop="allowDrop"
          @node-drop="sort"
          @node-click="handleNodeClick"
        />
        <div style="padding-top: 30px;">
          <el-button v-permission="button.router_add" v-loading="loading" type="primary" size="mini" @click.stop="append">新增</el-button>
          <el-button v-permission="button.router_delete" v-loading="loading" type="danger" size="mini" @click.stop="remove">删除</el-button>
          <el-button v-show="showSave" v-permission="button.router_save" v-loading="loading" type="primary" size="mini" @click.stop="submitForm">保存</el-button>
        </div>
      </el-aside>
      <el-aside style="background-color: white;margin-bottom: 0px" width="70%">
        <el-input v-model="routerForm.title" placeholder="路由名称" style="padding: 15px 0px;" />
        <json-editor ref="jsonEditor" v-model="routerForm.param" style="height: 80%" />
      </el-aside>
    </el-container>
  </div>
</template>

<script>
import JsonEditor from '@/components/JsonEditor'
import { Message } from 'element-ui'
import { getAdminRouterTree, createAdminRouter, updateAdminRouter, getAdminRouter, deleteAdminRouter, updateAdminRouterSort } from '@/api/admin-router'
import permission from '@/directive/permission'

const parentRouter = '{"path": "/system","component": "Layout","redirect": "noRedirect","name": "System","hihhen": "false","alwaysShow": "true","meta": {"title": "系统管理","icon": "system"}}'
const childrenRouter = '{"path": "adminu-router","name": "AdminRouter","component": "/system/admin-router","hihhen": "false","alwaysShow": "true","meta": {"title": "路由管理","icon": "router"}}'
let id = 10000
export default {
  name: 'Router',
  components: { JsonEditor },
  directives: { permission },
  data() {
    return {
      button: {
        router_add: 'router_add',
        router_delete: 'router_delete',
        router_save: 'router_save'
      },
      loading: false,
      isCreate: false,
      id: 0,
      nodeData: '',
      showSave: false,
      routerForm: {
        parent_id: null,
        title: '',
        param: {}
      },
      keys: [],
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
    getAdminRouterTree().then(res => {
      this.treeRouter = res.data.routers_tree
    })
  },
  methods: {
    getHeight() {
      this.contentStyleObj.height = window.innerHeight - 115 + 'px'
    },
    handleParent() {
      this.id = 0
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
      if (this.isCreate) {
        this.loading = false
        return false
      }
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
      this.isCreate = true
      this.loading = false
      this.showSave = false
    },
    remove() {
      this.loading = true
      this.showSave = false
      if (this.id === id - 1 || this.id === 0) {
        // 新增未保存时删除
        getAdminRouterTree().then(res => {
          this.treeRouter = res.data.routers_tree
          this.isCreate = false
          this.id = 0
        })
      } else {
        const text = '确定要删除[' + this.routerForm.title + ']吗?'
        this.$confirm(text, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 已保存的删除
          const data = {
            admin_router_id: this.id
          }
          deleteAdminRouter(data).then(res => {
            Message.success(res.msg)
            this.treeRouter = res.data.routers_tree
            this.id = 0
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
            this.treeRouter = res.data.routers_tree
            this.keys = [res.data.admin_router_id]
            this.isCreate = false
          })
        }
      } else {
        // 修改
        this.routerForm.admin_router_id = this.id
        updateAdminRouter(this.routerForm).then(res => {
          Message.success(res.msg)
          this.treeRouter = res.data.routers_tree
          this.keys = [this.id]
        })
      }
      this.loading = false
    },
    // 同级拖拽
    allowDrop(draggingNode, dropNode, type) {
      console.log(dropNode)
      if (draggingNode.level === dropNode.level) {
        return type === 'prev' || type === 'next'
      } else {
        // 不同级进行处理
        return false
      }
    },
    // 排序
    sort(draggingNode, dropNode, type, event) {
      const sortTree = []
      for (const item of dropNode.parent.childNodes) {
        sortTree.push(item.data.id)
      }
      updateAdminRouterSort({ sort: sortTree }).then(res => {})
    }
  },
  destroy() {
    window.removeEventListener('resize', this.getHeight)
  }
}
</script>

<style>
 /*高亮*/
el-tree-node__content {
  font-size: 14px;
  height: 40px;
  font-weight: 400;
}
.el-tree-node__label:hover {
  color: #0593D3;
}
.el-tree-node:focus > .el-tree-node__content {
  color: #0593D3 ;
}
 .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content{
  color: red ;
  background-color: transparent;
}
</style>
