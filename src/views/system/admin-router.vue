<template>
  <div class="content">
    <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick" />
  </div>
</template>

<script>
const dataRoutes = [
  {
    label: 'Permission',
    children: [
      {
        label: 'PagePermission'
      },
      {
        label: 'DirectivePermission'
      },
      {
        label: 'RolePermission'
      }
    ]
  },

  {
    label: 'Icons'
  },

  {
    label: 'ComponentDemo',
    children: [
      {
        label: 'TinymceDemo'
      },
      {
        label: 'MarkdownDemo'
      },
      {
        label: 'JsonEditorDemo'
      },
      {
        label: 'SplitpaneDemo'
      },
      {
        label: 'AvatarUploadDemo'
      }
    ]
  },
  {
    label: 'Nested',
    children: [
      {
        label: 'Menu1',
        children: [
          {
            id: 10,
            label: 'Menu1-1'
          },
          {
            label: 'Menu1-2',
            children: [
              {
                label: 'Menu1-2-1'
              },
              {
                label: 'Menu1-2-2'
              }
            ]
          },
          {
            label: 'Menu1-3'
          }
        ]
      },
      {
        label: 'Menu2'
      }
    ]
  }
]
export default {
  name: 'AdminRouter',
  data() {
    return {
      data: dataRoutes,
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  methods: {
    handleNodeClick(data) {
      console.log(data)
    }
  }
}
</script>

<style scoped>

</style>
