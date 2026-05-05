<template>
  <div class="register-page">
    <!-- 背景 -->
    <div class="bg-wrapper">
      <img src="https://picsum.photos/id/1036/1920/1080" alt="背景" class="bg-img" />
      <div class="bg-overlay"></div>
    </div>

    <!-- 登录卡片 -->
    <div class="register-card">
      <h2 class="title">用户登录</h2>

      <div class="form-item">
        <input
          v-model="username"
          type="text"
          placeholder="请输入用户名"
          class="input"
        />
      </div>

      <div class="form-item">
        <input
          v-model="password"
          type="password"
          placeholder="请输入密码"
          class="input"
        />
      </div>

      <button @click="handleLogin" class="register-btn">
        登录
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user' // 修复：导入用户状态

const router = useRouter()
const userStore = useUserStore() 


const username = ref('')
const password = ref('')

async function handleLogin() {
  try {
    // 抓取所有用户
    const res = await axios.get('http://localhost:3000/users')
    const userList = res.data

    // 匹配用户
    const findUser = userList.find(item => 
      item.username === username.value && 
      item.password === password.value
    )

    if (findUser) {
      userStore.login(findUser)
      router.push('/')
    } else {
      alert('账号或密码错误')
    }
  } catch (err) {
    alert('登录失败：' + err.message)
  }
}
</script>

<style scoped>
.register-page {
  width: 100vw;
  height: 100vh;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: sans-serif;
}

.bg-wrapper {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 0;
}
.bg-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(0.8);
}
.bg-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.25);
}

.register-card {
  position: relative;
  z-index: 10;
  background: white;
  width: 420px;
  padding: 40px 30px;
  border-radius: 10px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.title {
  text-align: center;
  font-size: 24px;
  margin-bottom: 30px;
  color: #333;
}

.form-item {
  margin-bottom: 18px;
}

.input {
  width: 100%;
  height: 46px;
  padding: 0 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 15px;
  box-sizing: border-box;
  outline: none;
}
.input:focus {
  border-color: #ff9d00;
}

.register-btn {
  width: 100%;
  height: 48px;
  background: #ff9d00;
  color: white;
  font-size: 16px;
  border: none;
  border-radius: 6px;
  margin-top: 10px;
  cursor: pointer;
}
.register-btn:hover {
  background: #ff8c00;
}
</style>