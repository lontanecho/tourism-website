<template>
  <div class="food-page">
    <div class="container">
      <h2 class="page-title">
        {{ spotName }} · 美食推荐
      </h2>

      <div class="search-box">
        <input
          v-model="searchKey"
          type="text"
          placeholder="搜索美食、菜系、店铺/窗口"
          @input="refreshList"
        />
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
        <div class="food-card" v-for="food in top10List" :key="food.id">
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
import { useRoute } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const spotId = computed(() => route.query.spotId || '')
const spotName = ref('加载中...')

const searchKey = ref('')
const filter = ref({ category: '全部', sortBy: 'hot' })
const top10List = ref([])
const categoryList = ref([])
const allFood = ref([])

// 获取当前景点名称
const getSpotName = async () => {
  const res = await axios.get(`http://localhost:3000/spots/${spotId.value}`)
  spotName.value = res.data.name
}

// 获取该景点所有美食
const getFoodList = async () => {
  const res = await axios.get('http://localhost:3000/foods', {
    params: { spotId: spotId.value }
  })
  allFood.value = res.data
  // 提取该景点拥有的菜系（去重）
  const cats = [...new Set(res.data.map(item => item.category))]
  categoryList.value = cats
}

// 模糊匹配
const fuzzyMatch = (food, key) => {
  if (!key) return true
  const k = key.toLowerCase()
  return (
    food.name.toLowerCase().includes(k) ||
    food.category.toLowerCase().includes(k) ||
    food.shopName.toLowerCase().includes(k)
  )
}

// 筛选 + 排序
const refreshList = () => {
  let list = [...allFood.value]

  if (filter.value.category !== '全部') {
    list = list.filter(i => i.category === filter.value.category)
  }

  list = list.filter(i => fuzzyMatch(i, searchKey.value))

  if (filter.value.sortBy === 'hot') {
    list.sort((a, b) => b.hot - a.hot)
  } else if (filter.value.sortBy === 'score') {
    list.sort((a, b) => b.score - a.score)
  } else if (filter.value.sortBy === 'distance') {
    list.sort((a, b) => a.distance - b.distance)
  }

  top10List.value = list.slice(0, 10)
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
.search-box {
  margin-bottom: 16px;
}
.search-box input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #eee;
  border-radius: 10px;
  outline: none;
  font-size: 15px;
  box-sizing: border-box;
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