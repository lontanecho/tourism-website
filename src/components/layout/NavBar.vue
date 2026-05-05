<template>
  <header class="navbar">
    <div class="container">
      <div class="logo">
        <router-link to="/" active-class="active">趣旅行</router-link>
      </div>
      <nav class="nav-menu">
        <ul>
          <li>
            <router-link to="/" active-class="active">首页</router-link>
          </li>
          <li>
            <router-link to="/community" active-class="active">社区</router-link>
          </li>
          
        </ul>
      </nav>

      <div class="user-actions">
        <!-- 未登录 → 按钮 -->
        <router-link
          v-if="!userStore.isLoggedIn"
          to="/sign_up"
          class="btn btn-primary"
        >
          注册/登录
        </router-link>

        <!-- 已登录 → 头像 + 下拉菜单 -->
        <div v-else class="user-dropdown">
          <div class="avatar-box" @click="showDrop = !showDrop">
            <img :src="userStore.userInfo?.avatar"alt="头像" />
            <span class="name">{{ userStore.userInfo?.username }}</span>
          </div>

          <!-- 下拉菜单 -->
          <div v-show="showDrop" class="dropdown-menu">
            <div class="dropdown-item">
              <router-link to="/user">个人中心</router-link>
            </div>
            <div class="dropdown-item" @click="handleLogout">退出登录</div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()
const showDrop = ref(false) // 控制下拉框显示

// 退出登录
const handleLogout = () => {
  userStore.logout()
  showDrop.value = false
  alert('已退出登录')
  router.push('/')
}
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 999;
}

.navbar .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 80px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.logo  {
  color: #0e61ac;
  font-size: 24px;
}

.nav-menu ul {
  display: flex;
  list-style: none;
}

.nav-menu li {
  margin: 0 15px;
}

.nav-menu a {
  text-decoration: none;
  color: #333;
  font-size: 16px;
}

.nav-menu a.active {
  color: #0e61ac;
  font-weight: bold;
}

/* 按钮 */
.btn {
  padding: 8px 16px;
  border-radius: 6px;
  text-decoration: none;
}
.btn-primary {
  background: #0e61ac;
  color: white;
}

/* 用户头像 + 下拉 */
.user-dropdown {
  position: relative;
}

.avatar-box {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}
.avatar-box img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
.avatar-box .name {
  font-size: 20px;
  color: #333;
}

/* 下拉菜单 */
.dropdown-menu {
  position: absolute;
  top: 50px;
 
  width: 140px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
  padding: 10px 0;
  z-index: 99;
}
.dropdown-item {
  padding: 10px 15px;
  font-size: 14px;
  color: #333;
  cursor: pointer;
}
.dropdown-item:hover {
  background: #f5f7ff;
  color: #0e61ac;
}
</style>