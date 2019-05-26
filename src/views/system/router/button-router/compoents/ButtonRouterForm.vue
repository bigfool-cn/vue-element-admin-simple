<template>
  <div class="content">
    <div class="content-form">
      <el-form ref="buttonRouterForm" :model="buttonRouterForm" :rules="rules" label-width="100px">
        <el-form-item label="按钮名称" prop="title">
          <el-input v-model="buttonRouterForm.title" />
        </el-form-item>
        <el-form-item label="路由配置" prop="param">
          <json-editor ref="jsonEditor" v-model="buttonRouterForm.param" />
        </el-form-item>
        <el-form-item>
          <el-button v-loading="loading" type="primary" @click="submitForm('buttonRouterForm')">保 存</el-button>
          <el-button @click="resetForm('buttonRouterForm')">重 置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import JsonEditor from '@/components/JsonEditor'
import { Message } from 'element-ui'
import { getAdminRouter, createAdminRouter, updateAdminRouter } from '@/api/admin-router'

const buttonRouter = {
  path: '/adminu-router',
  name: 'ButtonRouterAdd',
  component: '/system/admin-router',
  hihhen: true,
  meta: {
    title: '按钮路由--新增'
  }
}
export default {
  name: 'ButtonRouterForm',
  components: { JsonEditor },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  inject: ['reload'],
  data() {
    var validateTitle = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入用户名'))
      } else {
        callback()
      }
    }
    var validateParam = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入路由配置'))
      } else if (value === buttonRouter) {
        callback(new Error('路由配置不能和示例相同'))
      } else {
        callback()
      }
    }
    return {
      loading: false,
      buttonRouterForm: {
        title: '',
        param: buttonRouter,
        type: 1,
        parent_id: 0
      },
      rules: {
        title: [
          { validator: validateTitle, trigger: 'blur' }
        ],
        param: [
          { validator: validateParam, trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id
      getAdminRouter(id).then(res => {
        this.buttonRouterForm = {
          title: res.data.title,
          param: res.data.param,
          type: 1,
          parent_id: 0,
          admin_router_id: res.data.admin_router_id
        }
      })
    }
  },
  methods: {
    submitForm(formName) {
      console.log(this.buttonRouterForm)
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.isEdit) {
            updateAdminRouter(this.buttonRouterForm).then(res => {
              Message.success(res.msg)
              this.reload()
            })
          } else {
            createAdminRouter(this.buttonRouterForm).then(res => {
              Message.success(res.msg)
              this.reload()
            })
          }
        } else {
          Message.error('数据验证失败！')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style scoped>

</style>
