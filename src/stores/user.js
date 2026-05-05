import { defineStore } from 'pinia'
import axios from 'axios'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    userInfo: null
  }),

  getters: {
    isLoggedIn: (state) => !!state.token && !!state.userInfo
  },

  actions: {
    // 登录
    login(user) {
      this.userInfo = user
      this.token = user.id.toString()
      localStorage.setItem('token', this.token)
    },

    // 退出
    logout() {
      this.token = null
      this.userInfo = null
      localStorage.removeItem('token')
    },

    // 刷新页面后重新加载用户信息
    async loadUser() {
      if (!this.token) return

      try {
        const res = await axios.get("http://localhost:3000/users/" + this.token)
        this.userInfo = res.data
      } catch (err) {
        this.logout()
      }
    }
  }
})