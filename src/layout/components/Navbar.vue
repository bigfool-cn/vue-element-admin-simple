<template>
  <div class="navbar">
    <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />

    <div class="right-menu">
      <template v-if="device!=='mobile'">
        <search id="header-search" class="right-menu-item" />

        <error-log class="errLog-container right-menu-item hover-effect" />

        <screenfull id="screenfull" class="right-menu-item hover-effect" />

      </template>

      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
          <div style="text-align: center">
            <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar">
            <span style="display: block;font-size: 12px;line-height: 12px;margin-top: -25px;">{{ name }}</span>
          </div>
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/profile/index">
            <el-dropdown-item>个人信息</el-dropdown-item>
          </router-link>
          <el-dropdown-item>
            <span style="display:block;" @click="handlePassword">修改密码</span>
          </el-dropdown-item>
          <el-dropdown-item divided>
            <span style="display:block;" @click="logout">退出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-dialog v-el-drag-dialog title="修改密码" :visible.sync="dialogVisible" width="30%" center :show-close="false">
      <el-form ref="changePasswordForm" :model="changePasswordForm" :rules="rules">
        <el-form-item label="旧密码" prop="old_password" label-width="85px">
          <el-input v-model="changePasswordForm.old_password" type="password" placeholder="新密码" />
        </el-form-item>
        <el-form-item label="新密码" prop="password" label-width="85px">
          <el-input v-model="changePasswordForm.password" type="password" placeholder="新密码" />
        </el-form-item>
        <el-form-item label="确认新密码" prop="password_confirm" label-width="85px">
          <el-input v-model="changePasswordForm.password_confirm" type="password" placeholder="再次输入新密码" />
        </el-form-item>
        <el-form-item label-width="0px" style="text-align: center">
          <el-button @click="closeDialog('changePasswordForm')">取 消</el-button>
          <el-button type="primary" @click="changePassword('changePasswordForm')">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import ErrorLog from '@/components/ErrorLog'
import Screenfull from '@/components/Screenfull'
import Search from '@/components/HeaderSearch'
import elDragDialog from '@/directive/el-drag-dialog'
import { Message } from 'element-ui'
import { updateUserPassword } from '@/api/user'
export default {
  directives: { elDragDialog },
  components: {
    Breadcrumb,
    Hamburger,
    ErrorLog,
    Screenfull,
    Search
  },
  data() {
    var validateOldPassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else if (value.length < 6) {
        callback(new Error('密码长度不能小于6'))
      } else {
        callback()
      }
    }
    var validatePassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else if (value.length < 6) {
        callback(new Error('密码长度不能小于6'))
      } else {
        if (this.changePasswordForm.password_confirm !== '') {
          this.$refs.changePasswordForm.validateField('password_confirm')
        }
        callback()
      }
    }
    var validatePasswordConfirm = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.changePasswordForm.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      dialogVisible: false,
      changePasswordForm: {
        old_password: '',
        password: '',
        password_confirm: ''
      },
      rules: {
        old_password: [
          { validator: validateOldPassword, trigger: 'blur' }
        ],
        password: [
          { validator: validatePassword, trigger: 'blur' }
        ],
        password_confirm: [
          { validator: validatePasswordConfirm, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'name',
      'user_id',
      'device'
    ])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    handlePassword() {
      this.dialogVisible = true
    },
    // 取消修改密码
    closeDialog(formName) {
      this.dialogVisible = false
      this.$refs[formName].resetFields()
    },
    changePassword(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.changePasswordForm.admin_user_id = this.user_id
          updateUserPassword(this.changePasswordForm).then(res => {
            this.dialogVisible = false
            this.$store.dispatch('user/logout')
            const text = res.msg + '，请重新登录。'
            this.$confirm(text, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.$router.push(`/login?redirect=${this.$route.fullPath}`)
            }).catch(() => {
              this.$router.push(`/login?redirect=${this.$route.fullPath}`)
            })
          })
        } else {
          Message.error('数据验证失败！')
          return false
        }
      })
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
