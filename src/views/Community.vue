<template>
 <div id="community" class="tourism-app">
    <!-- 导航栏 -->
    <NavBar_black />
    <!--轮播图-->
    <Banner />
    <DiaryList />
 </div>    
</template>

<script> 
import NavBar_black from '@/components/layout/NavBar_black.vue'  
import Banner from '@/components/community/Banner.vue' 
import DiaryList from '@/components/community/DiaryList.vue'
export default {
  name: 'Community',
  components: {
    NavBar_black,
    Banner,
    DiaryList
  }
}
</script>
<style scoped>
/* 仅存放首页全局的、无法拆分的样式 */
.tourism-app {
  min-height: 100vh;
}
</style>