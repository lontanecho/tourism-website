<template>
  <router-view />
</template>

<script setup>
import { useUserStore } from '@/stores/user'
const userStore = useUserStore()

//加载用户信息
userStore.loadUser()
</script>

<style scoped>
/* 可添加全局页面背景等样式 */
html, body {
  min-height: 100vh;
  background-color: #fff;
}
</style>