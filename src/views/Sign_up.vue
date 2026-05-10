<template>
  <div class="register-page">
    <!-- 背景 -->
    <div class="bg-wrapper">
      <img src="https://picsum.photos/id/1036/1920/1080" alt="背景" class="bg-img" />
      <div class="bg-overlay"></div>
    </div>

    <!-- 注册卡片 -->
    <div class="register-card">
      <h2 class="title">用户注册</h2>

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

      <div class="form-item">
        <input
          v-model="confirmPwd"
          type="password"
          placeholder="请确认密码"
          class="input"
        />
      </div>

      <button @click="doRegister" class="register-btn">
        注册并登录
      </button>

      <div class="login-link-row">
        已有账号？
        <span @click="$router.push('/sign_in')" class="link">
          去登录
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()
const username = ref('')
const password = ref('')
const confirmPwd = ref('')

// 接口地址
const API = {
  users: 'http://localhost:3000/users',    // 本地
  // users: '/api/users/register',          // 真实后端
}


async function doRegister() {
  if (!username.value || !password.value) {
    alert('请输入用户名和密码')
    return
  }
  if (password.value !== confirmPwd.value) {
    alert('两次密码不一致')
    return
  }

  try {
    const isLocal = API.users.includes('localhost')


    if (isLocal) {
      // 检查用户名是否存在
      const checkRes = await axios.get(API.users, {
        params: { username: username.value }
      })
      if (checkRes.data.length > 0) {
        alert('用户名已存在')
        return
      }

      // 注册
      const res = await axios.post(API.users, {
        username: username.value,
        password: password.value,
        avatar: 'https://picsum.photos/200/200?random=1'
      })
      userStore.login(res.data)
      router.push('/')
    }

    else {
      const res = await axios.post(API.users, {
        username: username.value,
        password: password.value
      })

      if (res.data.code === 200) {
        userStore.login(res.data.data)
        router.push('/')
      } else {
        alert(res.data.msg || '注册失败')
      }
    }

  } catch (err) {
    console.error(err)
    alert('注册异常：' + err.message)
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

/* 注册卡片 */
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

.login-link-row {
  text-align: center;
  margin-top: 20px;
  font-size: 14px;
  color: #666;
}
.link {
  color: #ff9d00;
  cursor: pointer;
  margin-left: 4px;
}
</style>