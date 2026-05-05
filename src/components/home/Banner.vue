<template>
  <section class="banner">
    <!-- 背景大图 -->
    <img 
      src="https://picsum.photos/1920/800?random=2" 
      alt="旅游背景" 
      class="banner-bg"
    />

    <!-- 遮罩层 + 搜索框 -->
    <div class="search-overlay">
      <div class="search-wrapper">
        <h2 class="title">探索世界风光</h2>
        <div class="search-box">
          <input 
            type="text" 
            v-model="keyword"
            placeholder="搜目的地/学校/景点"
            @keyup.enter="search"
          />
          <button @click="search">搜索</button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'Banner',
  data() {
    return {
      keyword: ''
    }
  },
  methods: {
    search() {
      if (!this.keyword) return alert('请输入目的地')
      alert('搜索：' + this.keyword)
    }
  }
}
</script>

<style scoped>
.banner {
  margin-top: 80px;
  position: relative;
  height: calc(60vh - 80px);
  min-height: 400px;
  overflow: hidden;
}

/* 背景大图：完全清晰 */
.banner-bg {
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
}


.search-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.35); /* 轻微遮罩 */
  
 
  display: flex;
  align-items: center;
  justify-content: center;
}

/*搜索框外层 */
.search-wrapper {
  text-align: center;
  width: 100%;
  max-width: 800px;
  padding: 0 20px;
}

/* 标题自适应 */
.title {
  font-size: clamp(28px, 5vw, 48px);
  color: white;
  text-shadow: 0 3px 10px rgba(0, 0, 0, 0.5);
  margin-bottom: 25px;
}

/* 搜索框整体 */
.search-box {
  display: flex;
  gap: 12px;
  background: rgba(255, 255, 255, 0.9);
  padding: 12px;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
}

/* 输入框 */
.search-box input {
  flex: 1;
  height: 55px;
  border: none;
  outline: none;
  padding: 0 20px;
  font-size: clamp(16px, 2vw, 18px);
  border-radius: 8px;
}

/* 按钮 */
.search-box button {
  height: 55px;
  padding: 0 30px;
  border: 2px solid #0e61ac;
  background: #0e61ac;
  color: white;
  font-size: clamp(16px, 2vw, 18px);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.search-box button:hover {
  background: white;
  color: #2c7dfa;
}


</style>