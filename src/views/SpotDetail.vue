<template>
  <NavBar_black />
  <div class="page-wrap">
    <!-- 灰色全屏标题栏（动态英文+中文） -->
    <div class="poi-title-block">
      <div class="title-inner">
        <h1>
          {{ spot.nameEn }}
          <small>{{ spot.name }}</small>
        </h1>
        <div class="action-buttons">
          <button class="write-btn" @click="goToTravelNotes">
            相关游记
          </button>
          <button class="write-btn" @click="goToFood">
            附近美食
          </button>
        </div>
      </div>
    </div>

    <!-- 内容区：全部动态渲染 -->
    <div class="content-container">
      <div class="poi-gallery">
        <div class="poi-img">
          <img :src="spot.image" alt="景点图片" />
          
        </div>

        <div class="poi-rating">
          <div class="score">{{ spot.score }}分</div>
          
          <div class="stars">★★★★★</div>
          
          
        </div>
      </div>

      <div class="poi-summary">
        <div class="summary-item">
          <label>景点介绍</label>
          <div class="content">{{ spot.intro }}</div>
        </div>
        <div class="summary-item">
          <label>景点地址</label>
          <div class="content">{{ spot.address }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import NavBar_black from '../components/layout/NavBar_black.vue'


export default {
  name: "SpotDetail",
  components: {
    NavBar_black
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const spotId = route.params.id
    const spot = ref({
      name: '',
      nameEn: '',
      image: '',
      score: '',
      intro: '',
      address: ''
    })

    // 根据ID加载当前景点数据
    const getSpotDetail = async () => {
      const res = await axios.get(`http://localhost:3000/spots/${spotId}`)
      spot.value = res.data
    }

    const goToTravelNotes = () => {
      router.push({
        path: '/searchpage',
        query: {
          keyword: spot.value.name  // 自动把景点名称传过去
        }
      })
    }

    // 跳转附近美食
    const goToFood = () => {
      router.push({
        path: '/foodrecommend',
        query: { spotId: spotId }
      })
    }

    onMounted(() => {
      getSpotDetail()
    })

    return {
      spot,
      goToTravelNotes,
      goToFood
    }
  }
};
</script>

<style scoped>
.page-wrap {
  width: 100%;
}

/* 灰色全屏标题 */
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
  font-size: 30px;
  color: #147850;
  margin-top: 4px;
}

/* 按钮 */
.action-buttons {
  display: flex;
  gap: 12px;
}
.write-btn {
  background: #0e61ac;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
}
.write-btn:hover {
  background: #0b508c;
}

/* 内容区 */
.content-container {
  width: 1000px;
  margin: 0 auto;
  padding: 25px 0;
}

/* 图片 */
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
}
.photo-count {
  position: absolute;
  left: 10px;
  bottom: 10px;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  padding: 3px 8px;
  font-size: 14px;
}

/* 评分 */
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
.stars {
  color: #ffc107;
  font-size: 18px;
}
.review-count {
  font-size: 14px;
  color: #666;
}
.btn-review {
  background: #26b957;
  color: #fff;
  padding: 6px 10px;
  font-size: 14px;
  border-radius: 3px;
  width: fit-content;
  text-decoration: none;
}

/* 介绍 */
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