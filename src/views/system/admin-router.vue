<template>
  <div class="content">
    <el-container style="height: 100%; width: 100%; border: 1px solid #eee">
      <el-aside width="30%" style="background-color: white;border-right: 1px solid #eee">
        <el-tree :data="data" :props="defaultProps" node-key="id" :default-expanded-keys="keys" @node-click="handleNodeClick" />
        <div style="padding-top: 30px;">
          <el-button type="primary" size="mini" @click="append()">新增</el-button>
          <el-button type="danger" size="mini" @click="remove()">删除</el-button>
          <el-button v-show="showSave" type="primary" size="mini">保存</el-button>
        </div>
      </el-aside>
      <el-aside width="70%" style="background-color: white">
        <json-editor ref="jsonEditor" v-model="value" />
      </el-aside>
    </el-container>
  </div>
</template>

<script>
import JsonEditor from '@/components/JsonEditor'
const jsonData = '{"path": "/system","component": "Layout","redirect": "noRedirect","name": "System","hihhen": "false","alwaysShow": "true","meta": {"title": "系统管理","icon": "system","roles": ["admin"]},"children": [{"path": "adminu-router","name": "AdminRouter","component": "/system/admin-router","hihhen": "false","meta": {"title": "路由管理","icon": "router","roles": ["admin"]}}]}'
const dataRoutes = [
  {
    id: 1,
    label: 'Permission',
    children: [
      {
        id: 5,
        label: 'PagePermission'
      },
      {
        id: 6,
        label: 'DirectivePermission'
      },
      {
        id: 7,
        label: 'RolePermission'
      }
    ]
  },

  {
    id: 2,
    label: 'Icons'
  },

  {
    id: 3,
    label: 'ComponentDemo',
    children: [
      {
        id: 8,
        label: 'TinymceDemo'
      },
      {
        id: 9,
        label: 'MarkdownDemo'
      },
      {
        id: 10,
        label: 'JsonEditorDemo'
      },
      {
        id: 11,
        label: 'SplitpaneDemo'
      },
      {
        id: 12,
        label: 'AvatarUploadDemo'
      }
    ]
  },
  {
    id: 4,
    label: 'Nested',
    children: [
      {
        id: 13,
        label: 'Menu1',
        children: [
          {
            id: 14,
            label: 'Menu1-1'
          },
          {
            id: 15,
            label: 'Menu1-2',
            children: [
              {
                id: 16,
                label: 'Menu1-2-1'
              },
              {
                id: 17,
                label: 'Menu1-2-2'
              }
            ]
          },
          {
            id: 18,
            label: 'Menu1-3'
          }
        ]
      },
      {
        id: 19,
        label: 'Menu2'
      }
    ]
  }
]
let id = 1000
export default {
  name: 'AdminRouter',
  components: { JsonEditor },
  data() {
    return {
      id: 0,
      nodeData: '',
      keys: [],
      showSave: false,
      value: JSON.parse(jsonData),
      data: dataRoutes,
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  methods: {
    handleNodeClick(nodeData) {
      this.showSave = true
      this.id = nodeData.id
      this.nodeData = nodeData
      console.log(nodeData)
    },
    append() {
      const newChild = { id: id++, label: 'testtest', children: [] }
      this.keys = [this.id]
      if (!this.nodeData.children) {
        this.$set(this.nodeData, 'children', [])
      }
      this.nodeData.children.push(newChild)
    },

    remove(node, data) {
      const parent = node.parent
      const children = parent.data.children || parent.data
      const index = children.findIndex(d => d.id === data.id)
      children.splice(index, 1)
    }
  }
}
</script>

<style scoped>

</style>
