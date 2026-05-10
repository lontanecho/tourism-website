<template>
  <div class="food-page">
    <div class="container">
      <h2 class="page-title">
        {{ spotName }} · 美食推荐
      </h2>

      
      <div class="search-bar">
        <input
          v-model="searchKey"
          type="text"
          class="search-input"
          placeholder="搜索美食、菜系、店铺/窗口"
          @input="refreshList"
          @keyup.enter="refreshList"
        />
        <button class="search-btn" @click="refreshList">
          <span class="icon">🔍</span>搜索
        </button>
      </div>

      <div class="filter-bar">
        <div class="filter-item">
          <label>菜系：</label>
          <select v-model="filter.category" @change="refreshList">
            <option value="全部">全部菜系</option>
            <option v-for="c in categoryList" :key="c" :value="c">
              {{ c }}
            </option>
          </select>
        </div>

        <div class="filter-item">
          <label>排序：</label>
          <select v-model="filter.sortBy" @change="refreshList">
            <option value="hot">热度优先</option>
            <option value="score">评价优先</option>
            <option value="distance">距离最近</option>
          </select>
        </div>
      </div>

      <div class="food-list">
        <div class="food-card" v-for="food in top10List" :key="food.id" @click="goFoodDetail(food.id)" style="cursor:pointer">
          <div class="food-img">
            <img :src="food.image" alt="" />
          </div>
          <div class="food-info">
            <h3 class="food-name">{{ food.name }}</h3>
            <div class="food-tag">{{ food.category }}</div>
            <div class="food-shop">{{ food.shopName }}</div>
            <div class="food-stats">
              <span>⭐{{ food.score }}</span>
              <span>🔥{{ food.hot }}</span>
              <span>📏{{ food.distance }}km</span>
            </div>
            <p class="food-desc">{{ food.intro }}</p>
          </div>
        </div>

        <div class="empty" v-if="top10List.length === 0">
          暂无相关美食
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'  // 👈 加了 useRouter
import axios from 'axios'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const router = useRouter() // 👈 加了 router
const userStore = useUserStore()
const token = userStore.token


// 统一接口配置

const API = {
  spots: 'http://localhost:3000/spots',
  foods: 'http://localhost:3000/foods',
  //spots: 'https://api/spots',
  //foods: 'https://api/foods',
}
  

const spotId = computed(() => route.query.spotId || '')
const spotName = ref('加载中...')

const searchKey = ref('')
const filter = ref({ category: '全部', sortBy: 'hot' })
const top10List = ref([])
const categoryList = ref([])
const allFood = ref([])

// 获取景点名称
const getSpotName = async () => {
  if (!spotId.value) return
  try {
    const res = await axios.get(`${API.spots}/${spotId.value}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    const isLocal = API.spots.includes('localhost')
    if (isLocal) {
      spotName.value = res.data.name || '未知景点'
    } else {
      if (res.data.code === 200) {
        spotName.value = res.data.data.name || '未知景点'
      }
    }
  } catch (err) {
    spotName.value = '获取失败'
  }
}

// 获取美食列表
const getFoodList = async () => {
  if (!spotId.value) return
  try {
    const res = await axios.get(API.foods, {
      params: { spotId: spotId.value },
      headers: { Authorization: `Bearer ${token}` }
    })
    const isLocal = API.foods.includes('localhost')
    let data = isLocal ? res.data : (res.data.code === 200 ? res.data.data : [])
    allFood.value = data
    const cats = [...new Set(data.map(item => item.category))]
    categoryList.value = cats
  } catch (err) {
    allFood.value = []
    categoryList.value = []
  }
}

// 模糊搜索
const fuzzyMatch = (food, key) => {
  if (!key) return true
  const k = key.toLowerCase()
  return (
    food.name?.toLowerCase().includes(k) ||
    food.category?.toLowerCase().includes(k) ||
    food.shopName?.toLowerCase().includes(k)
  )
}

// 筛选排序
const refreshList = () => {
  let list = [...allFood.value]
  if (filter.value.category !== '全部') {
    list = list.filter(i => i.category === filter.value.category)
  }
  list = list.filter(i => fuzzyMatch(i, searchKey.value))

  if (filter.value.sortBy === 'hot') {
    list.sort((a, b) => (b.hot || 0) - (a.hot || 0))
  } else if (filter.value.sortBy === 'score') {
    list.sort((a, b) => (b.score || 0) - (a.score || 0))
  } else if (filter.value.sortBy === 'distance') {
    list.sort((a, b) => (a.distance || 0) - (b.distance || 0))
  }

  top10List.value = list.slice(0, 10)
}

// 跳转美食详情 ✅ 现在正常了
const goFoodDetail = (id) => {
  router.push(`/food-detail/${id}`)
}

onMounted(async () => {
  await getSpotName()
  await getFoodList()
  refreshList()
})
</script>

<style scoped>
.food-page {
  padding: 25px 20px;
  background: #f7f8fa;
  min-height: 100vh;
}
.container {
  max-width: 900px;
  margin: 0 auto;
}
.page-title {
  text-align: center;
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
}

/* =============================================
🔍 统一搜索框样式（和景点/游记页面完全一样）
============================================= */
.search-bar {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}
.search-input {
  flex: 1;
  padding: 12px 16px;
  font-size: 15px;
  border: 1px solid #eee;
  border-radius: 10px;
  outline: none;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}
.search-input:focus {
  border-color: #0e61ac;
}
.search-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0 18px;
  background: #0e61ac;
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  cursor: pointer;
  white-space: nowrap;
}
.search-btn:hover {
  background: #0b508c;
}
.search-btn .icon {
  font-size: 16px;
}

.filter-bar {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}
.filter-item {
  display: flex;
  align-items: center;
  gap: 6px;
}
.filter-item select {
  padding: 8px 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  outline: none;
}
.food-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.food-card {
  background: #fff;
  border-radius: 14px;
  overflow: hidden;
  display: flex;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}
.food-img {
  width: 130px;
  height: 130px;
}
.food-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.food-info {
  flex: 1;
  padding: 14px;
}
.food-name {
  margin: 0 0 6px 0;
  font-size: 17px;
  font-weight: bold;
}
.food-tag {
  display: inline-block;
  background: #fff0e6;
  color: #ff6e26;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
  margin-bottom: 6px;
}
.food-shop {
  font-size: 13px;
  color: #666;
  margin-bottom: 8px;
}
.food-stats {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: #555;
  margin-bottom: 8px;
}
.food-desc {
  font-size: 13px;
  color: #777;
  margin: 0;
}
.empty {
  text-align: center;
  padding: 40px 0;
  color: #999;
}
</style>