<template>
  <section id="home" class="banner">
    <div class="banner-slider">
      <img :src="list[current].img" alt="背景底图" />

      //轮播图
      <div
        class="slider-item"
        v-for="(item, index) in list"
        :key="index"
        :class="{ active: current === index }"
      >
        <img :src="item.img" alt="" />
        <div class="banner-content">
          <h2>{{ item.title }}</h2>
          <p>{{ item.sub }}</p>
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
      current: 0,
      timer: null,
      list: [
        {
          img: '/src/assets/images/马尔代夫.jpg', 
          title: '探索马尔代夫',
          sub: '享受碧海蓝天，体验极致海岛风情'
        },
        {
          img: '/src/assets/images/瑞士雪山.jpg',
          title: '遇见瑞士雪山',
          sub: '纯净湖泊与巍峨雪山，童话般的世界'
        },
        {
          img: '/src/assets/images/日本京都.jpg',
          title: '行走京都古巷',
          sub: '千年古都，日式风情，四季皆景'
        }
      ]
    }
  },
  mounted() {
    // 4秒自动切换
    this.timer = setInterval(() => {
      this.current = (this.current + 1) % this.list.length
    }, 4000)
  },
  beforeDestroy() {
    clearInterval(this.timer)
  }
}
</script>

<style scoped>
.banner {
  margin-top: 40px;
  position: relative;
  height: calc(50vh - 80px);
  min-height: 250px;
}

.banner-slider {
  width: 100%;
  height: 100%;
  position:relative;
}

.banner-slider > img {
  width: 100%;
  height:100%;
  top:0;
  position:absolute;
  filter:blur(30px);
  object-fit: cover; 
}

.slider-item {
  width: 100%;
  height: 100%;
  position: absolute;
  display: none;
}

.slider-item.active {
  display: block;
}


.slider-item img {
  position:absolute;
  width: 45%;
  height: 100%;
  left:20%;
  right:5%;
  filter: blur(0px);
  object-fit: cover; 
}

.banner-content {
  position: absolute;
  top: 50%;
  left: 10%;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.856);
  max-width: 500px;
}

.banner-content h2 {
  font-size: 48px;
  margin-bottom: 20px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.banner-content p {
  font-size: 20px; 
  margin-bottom: 30px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

/* 响应式 */
@media (max-width: 992px) {
  .banner-content h2 { font-size: 36px; }
  .banner-content p { font-size: 18px; }
}
@media (max-width: 768px) {
  .banner { height: 60vh; }
  .banner-content { left: 5%; max-width: 90%; }
  .banner-content h2 { font-size: 28px; }
}
@media (max-width: 576px) {
  .banner { margin-top: 70px; height: 50vh; }
}
</style>