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
          <li>
            <router-link to="/foodrecommend" active-class="active">美食</router-link>
          </li>
          
        </ul>
      </nav>

      <div class="user-actions">
        <router-link
          v-if="!userStore.isLoggedIn"
          to="/sign_up"
          class="btn btn-primary"
        >
          注册/登录
        </router-link>

        <div v-else class="user-dropdown"@click="showDrop = !showDrop">
          <div class="user-name-wrap">
            <span class="name">{{ userStore.userInfo?.username }}</span>
            <span class="arrow">▼</span>
          </div>

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
const showDrop = ref(false)

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
  background-color: #111;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  z-index: 999;
}

.navbar .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 40px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.logo  {
  color: #fff;
  font-size: 22px;
  margin: 0;
}

.nav-menu ul {
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-menu li {
  margin: 0 15px;
}

.nav-menu a {
  text-decoration: none;
  color: #fff;
  font-size: 15px;
}

.nav-menu a.active {
  color: #0e61ac;
  font-weight: bold;
}

.btn {
  padding: 6px 14px;
  border-radius: 6px;
  text-decoration: none;
  font-size: 14px;
}
.btn-primary {
  background: #0e61ac;
  color: white;
  border: none;
}

.user-dropdown {
  position: relative;
}
.user-name-wrap {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  color: #fff;
  font-size: 15px;
}
/* 箭头白色 */
.arrow {
  font-size: 12px;
  color: #fff;
}

/* 下拉菜单：白底黑字 */
.dropdown-menu {
  position: absolute;
  top: 40px;
  right: 0;
  width: 140px;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  padding: 10px 0;
  z-index: 99;
}
.dropdown-item {
  padding: 10px 15px;
  font-size: 14px;
  color: #333;
  cursor: pointer;
}
.dropdown-item a {
  color: #333;
  text-decoration: none;
  display: block;
}
.dropdown-item:hover {
  background: #f5f5f5;
  color: #0e61ac;
}
</style>