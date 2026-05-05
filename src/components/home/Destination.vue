<template>
  <section id="destination" class="destination-section">
    <div class="container">
      <div class="section-title">
        <h2>热门旅游目的地</h2>
        <p>精选优质旅游目的地，总有一处适合你</p>
      </div>
      <div class="destination-list">
        <!-- 点击卡片跳转到详情 -->
        <div 
          class="destination-card" 
          v-for="item in destinations" 
          :key="item.id"
          @click="goToDetail(item.id)"  
        >
          <img :src="item.image" :alt="item.name" class="card-img" />
          <div class="card-content">
            <h3>{{ item.name }}</h3>
            <p>{{ item.desc }}</p>
            <button class="btn btn-sm">查看详情</button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'  // 加路由

export default {
  name: 'Destination',
  setup() {
    const destinations = ref([])
    const router = useRouter()

    const getDestinations = async () => {
      try {
        const res = await axios.get('http://localhost:3000/spots')
        destinations.value = res.data
      } catch (err) {
        console.error('获取景点失败', err)
      }
    }

    // 跳转到景点详情
    const goToDetail = (spotId) => {
      router.push(`/spot-detail/${spotId}`)
    }

    onMounted(() => {
      getDestinations()
    })

    return {
      destinations,
      goToDetail   // 暴露方法
    }
  }
}
</script>

<style scoped>

.destination-section {
  padding: 80px 0;
  background-color: #f9f9f9;
}

.destination-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 30px;
}

.destination-card {
  background-color: #faf2e0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  cursor: pointer;
}

.destination-card:hover {
  transform: translateY(-5px);
}

.card-img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.card-content {
  padding: 20px;
}

.card-content h3 {
  font-size: 20px;
  margin-bottom: 10px;
  color: #333;
}

.card-content p {
  color: #666;
  margin-bottom: 15px;
  font-size: 14px;
}

.btn {
  padding: 8px 16px;
  background: #ff6d27;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}


</style>