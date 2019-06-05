<template>
  <el-card style="margin-bottom:20px;">
    <div slot="header" class="clearfix">
      <span>个人信息</span>
    </div>

    <div class="user-profile">
      <div class="box-center">
        <pan-thumb :image="user.avatar" :height="'100px'" :width="'100px'" :hoverable="false">
          <div style="margin-top: 15px;">
            <el-upload
              class="avatar-uploader"
              :action="action"
              :headers="headers"
              :data="data"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :on-error="handleAvatarError"
              :before-upload="beforeAvatarUpload"
            >
              <i class="el-icon-plus avatar-uploader-icon" />
            </el-upload>
          </div>
        </pan-thumb>
      </div>
      <div class="box-center">
        <div class="user-name text-center">{{ user.name }}</div>
        <div class="user-role text-center text-muted">
          <el-tag>{{ user.role }}</el-tag>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script>
import PanThumb from '@/components/PanThumb'
import { Message } from 'element-ui'
export default {
  components: { PanThumb },
  props: {
    token: {
      type: String,
      default: ''
    },
    user: {
      type: Object,
      default: () => {
        return {
          user_id: 0,
          name: '',
          email: '',
          avatar: '',
          roles: ''
        }
      }
    }
  },
  data() {
    return {
      action: 'http://vueadmin-api.bigfool.cn/user/upload-avatar',
      headers: {
        'Access-Token': this.token
      },
      data: {
        user_id: this.user.user_id
      }
    }
  },
  methods: {
    handleAvatarSuccess(res, file) {
      //
    },
    handleAvatarError(res, file) {
      Message.error('上传失败')
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    }
  }
}
</script>

<style lang="scss" scoped>
 .box-center {
   margin: 0 auto;
   display: table;
 }

 .text-muted {
   color: #777;
 }

 .user-profile {
   .user-name {
     font-weight: bold;
   }

   .box-center {
     padding-top: 10px;
   }

   .user-role {
     padding-top: 10px;
     font-weight: 400;
     font-size: 14px;
   }
 }
 .avatar-uploader{
   font-size: 25px;
 }
</style>
