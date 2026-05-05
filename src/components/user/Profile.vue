<template>
  <section id="profile" class="profile-section">
    <div class="profile-item">
      <img
        src="https://picsum.photos/1920/800?random=3"
        alt="个人主页背景"
        class="banner-img"
      />
    </div>

    <div class="avatar">
      <img:
        src="userStore.userInfo?.avatar"
        alt="头像"
        class="avatar-img"
      />
      <span class="username">{{ userStore.userInfo?.username }}</span>
    </div>
  </section>
</template>

<script setup>
import { useUserStore } from '@/stores/user'
const userStore = useUserStore()
</script>

<style scoped>
.profile-section {
  background-color: #f5f5f5;
  padding: 20px;
}

.profile-item {
  background-color: #fff;
  padding: 20px;
  margin-bottom: 20px;
}

.banner-img {
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-radius: 10px;
}

.avatar {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  margin-top: -100px;
  position: relative;
  z-index: 10;
}

.avatar-img {
  width: 160px;
  height: 160px;
  border-radius: 50%;
  border: 5px solid white;
  object-fit: cover;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.username {
  font-size: 22px;
  font-weight: bold;
  color: #333;
}
</style>