<template>
  <div id="app" class="tourism-app">
    <!-- 导航栏 -->
    <NavBar />
    
    <!-- 轮播图 -->
    <Banner />
    
    <!-- 热门景区 -->
    <Destination />
  </div>
</template>

<script>
// 导入子组件
import NavBar from '@/components/layout/NavBar.vue'
import Banner from '@/components/home/Banner.vue'
import Destination from '@/components/home/Destination.vue'
// 导入模拟数据
import homeData from '@/data/homeData.js'

export default {
  name: 'Home',
  components: {
    NavBar,
    Banner,
    Destination,
  },
  
}
</script>

<style scoped>
.tourism-app {
  min-height: 100vh;
}
</style>