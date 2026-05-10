<template>
  <NavBar_black />
  <div class="page-wrap">
    
    <div class="poi-title-block">
      <div class="title-inner">
        <h1>
          {{ food.name }}
          <small>{{ food.category }}</small>
        </h1>
      </div>
    </div>

    <!-- 内容区 -->
    <div class="content-container">
      <div class="poi-gallery">
        <div class="poi-img">
          <img :src="food.image" alt="美食图片" />
        </div>

        <div class="poi-rating">
          <div class="score">⭐{{ food.score }} 分    🔥热度 {{ food.hot }}</div>
        </div>
      </div>

      <div class="poi-summary">
        <div class="summary-item">
          <label>美食介绍</label>
          <div class="content">{{ food.intro }}</div>
        </div>
        <div class="summary-item">
          <label>店铺名称</label>
          <div class="content">{{ food.shopName }}</div>
        </div>
        <div class="summary-item">
          <label>距离此处</label>
          <div class="content">{{ food.distance }} km</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import NavBar_black from '../components/layout/NavBar_black.vue'
import { useUserStore } from '@/stores/user'

export default {
  name: "FoodDetail",
  components: {
    NavBar_black
  },
  setup() {
    const route = useRoute()
    const userStore = useUserStore()
    const token = userStore.token

    // 接口地址
    const API = {
      foodDetail: 'http://localhost:3000/foods',   // 本地
      // foodDetail: '/api/foods',                 // 真实后端
    }

    const foodId = route.params.id
    const food = ref({
      name: '',
      shopName: '',
      image: '',
      score: '',
      hot: '',
      category: '',
      intro: '',
      distance: ''
    })


    const getFoodDetail = async () => {
      try {
        const res = await axios.get(`${API.foodDetail}/${foodId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })

        const isLocal = API.foodDetail.includes('localhost')
        if (isLocal) {
          food.value = res.data
        } else {
          if (res.data.code === 200) {
            food.value = res.data.data
          } else {
            alert(res.data.msg || '获取美食详情失败')
          }
        }
      } catch (err) {
        console.error(err)
        alert('获取美食详情异常')
      }
    }

    onMounted(() => {
      getFoodDetail()
    })

    return {
      food
    }
  }
}
</script>

<style scoped>
.page-wrap {
  width: 100%;
}

.poi-title-block {
  margin-top: 40px;
  width: 100%;
  background: #f5f5f5;
  padding: 30px 0;
}
.title-inner {
  width: 1000px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.poi-title-block h1 {
  font-size: 36px;
  color: #147850;
  font-weight: normal;
  margin: 0;
}
.poi-title-block small {
  display: block;
  font-size: 24px;
  color: #666;
  margin-top: 4px;
}

.content-container {
  width: 1000px;
  margin: 0 auto;
  padding: 25px 0;
}

.poi-gallery {
  display: flex;
  gap: 30px;
  margin-bottom: 20px;
}
.poi-img {
  position: relative;
}
.poi-img img {
  width: 360px;
  height: auto;
  object-fit: cover;
}

.poi-rating {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.score {
  font-size: 28px;
  color: #147850;
  font-weight: bold;
}

.poi-summary {
  margin-top: 20px;
}
.summary-item {
  display: flex;
  margin-bottom: 12px;
}
.summary-item label {
  width: 90px;
  font-weight: bold;
}
.summary-item .content {
  flex: 1;
  line-height: 1.7;
}
</style>