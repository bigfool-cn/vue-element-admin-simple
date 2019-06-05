<template>
  <div class="app-container">
    <div v-if="user">
      <user-card :user="user" :token="token" :style="contentStyleObj" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import UserCard from './components/UserCard'

export default {
  name: 'Profile',
  components: { UserCard },
  data() {
    return {
      user: {},
      contentStyleObj: {
        height: ''
      }
    }
  },
  computed: {
    ...mapGetters([
      'token',
      'user_id',
      'name',
      'avatar',
      'roles'
    ])
  },
  created() {
    window.addEventListener('resize', this.getHeight)
    this.getHeight()
    this.getUser()
  },
  methods: {
    getHeight() {
      this.contentStyleObj.height = window.innerHeight - 144 + 'px'
    },
    getUser() {
      this.user = {
        user_id: this.user_id,
        name: this.name,
        role: this.roles.join(' | '),
        email: 'admin@test.com',
        avatar: this.avatar
      }
    }
  },
  destroy() {
    window.removeEventListener('resize', this.getHeight)
  }
}
</script>
