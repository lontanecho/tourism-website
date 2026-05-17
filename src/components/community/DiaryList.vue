<template>
  <div class="community-page">
    <div class="content-wrap">
      <!-- 左侧：个人信息栏 -->
      <div class="sidebar">
        <div class="user-card">
          <div class="user-header">
            <img :src="userStore.userInfo?.avatar" class="user-avatar" />
            <div class="user-info">
              <div class="username">{{ userStore.userInfo?.username}}</div>
              <div class="user-stats">
                
              </div>
            </div>
          </div>

          <div class="sidebar-tabs">
            <div class="sidebar-tab active">我的社区</div>
            
          </div>

          <div class="sidebar-menu">
          
            <div class="menu-item">
              <router-link to="/user" active-class="active">我的游记</router-link>
            </div>
            
          </div>
        </div>
      </div>

      <!-- 右侧：游记列表 -->
      <div class="article-list">
        <div class="top-bar">
          <div class="tab-bar">
            <div class="tab-item active">游记推荐</div>
            <div class="sort-dropdown">
              <select v-model="sortType" @change="getArticleData">
                <option value="default">默认排序</option>
                <option value="interest">兴趣推荐</option>
                <option value="viewCount">按浏览量</option>
                <option value="score">按评分</option>
              </select>
            </div>
          </div>

          <div class="action-buttons">
            <router-link to="/searchpage" class="write-btn">
              <span class="icon">🔍</span>
              找游记
            </router-link>
            <router-link to="/publish" class="write-btn">
              <span class="icon">🪶</span>
              写游记
            </router-link>
          </div>
        </div>

        <div 
          v-for="item in articleList" 
          :key="item.id" 
          class="article-card"
          @click="goDetail(item.id)"
          style="cursor: pointer;"
        >
          <div class="card-header">
            <div class="user-info">
              <img :src="item.userAvatar" class="avatar" />
              <span class="username">{{ item.username }}</span>
              <span class="view-count">👁️‍🗨️ 浏览量 {{ item.viewCount || 0 }}</span>
              <span class="score">⭐ 评分 {{ item.score ? item.score.toFixed(1) : '暂无' }}</span>
            </div>
          </div>

          <div class="card-body">
            <div class="article-info">
              <h3 class="article-title">{{ item.title }}</h3>
              <p class="article-desc">{{ item.content.replace(/<[^>]+>/g, '').slice(0, 60) }}...</p>
            </div>
            <div class="article-imgs">
              <img v-if="item.cover" :src="item.cover" class="grid-img" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()
const token = userStore.token

// 排序类型：default 默认 / interest 兴趣 / viewCount 浏览量 / score 评分
const sortType = ref('default')
const articleList = ref([])

const API = {
  recommend: 'http://localhost:3000/api/travel/recommend'
}

// 发起请求获取后端排好序的数据
const getArticleData = async () => {
  if (!userStore.userInfo?.id) return
  try {
    const res = await axios.get(API.recommend, {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        userId: userStore.userInfo.id,
        sort: sortType.value
      }
    })
    articleList.value = res.data
  } catch (err) {
    console.error('获取列表失败', err)
  }
}

onMounted(() => {
  getArticleData()
})

// 跳转详情
const goDetail = (id) => {
  router.push(`/article/detail/${id}`)
}
</script>

<style scoped>
.community-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  margin-top: 30px;
}

.content-wrap {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.sidebar {
  width: 280px;
  flex-shrink: 0;
}
.user-card {
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
}
.user-header {
  padding: 15px;
  display: flex;
  gap: 12px;
  align-items: center;
  border-bottom: 1px solid #eee;
}
.user-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
}
.username {
  font-size: 20px;
  font-weight: 500;
  color: #333;
  margin-bottom: 6px;
}
.user-stats {
  display: flex;
  gap: 8px;
  margin-bottom: 6px;
}
.stat-item {
  background: #0e61ac;
  color: #fff;
  padding: 3px 8px;
  border-radius: 10px;
  font-size: 12px;
}

.sidebar-tabs {
  display: flex;
  border-bottom: 1px solid #eee;
}
.sidebar-tab {
  flex: 1;
  text-align: center;
  padding: 12px;
  font-size: 16px;
  color: #999;
  cursor: pointer;
  position: relative;
}
.sidebar-tab.active {
  color: #0e61ac;
}
.sidebar-tab.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 100%;
  height: 2px;
  background: #0e61ac;
}

.sidebar-menu {
  padding: 10px 15px;
}
.menu-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  font-size: 16px;
  color: #666;
  border-bottom: 1px solid #f5f5f5;
}
.menu-item:last-child {
  border-bottom: none;
}
.badge {
  background: #f5f5f5;
  color: #666;
  padding: 3px 8px;
  border-radius: 10px;
  font-size: 12px;
}

.article-list {
  flex: 1;
  min-width: 0;
}
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  position: relative;
}

.tab-bar {
  display: flex;
  align-items: center;
  gap: 15px;
}
.tab-item {
  font-size: 24px;
  font-weight: 500;
  padding: 12px 0;
  color: #0e61ac;
  position: relative;
}

.sort-dropdown select {
  padding: 6px 10px;
  border: 1px solid #ddd;
  border-radius: 9px;
  font-size: 12px;
  color: #333;
  outline: none;
  cursor: pointer;
}
.sort-dropdown select:focus {
  border-color: #0e61ac;
}

.action-buttons {
  display: flex;
  gap: 10px; 
}

.write-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #0e61ac;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  text-decoration: none;
  transition: background 0.2s;
}
.write-btn:hover {
  background: #0b508c;
}
.write-btn .icon {
  font-size: 18px;
}

.article-card {
  border-bottom: 1px solid #f0f0f0;
  padding: 15px 0;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}
.user-info {
  display: flex;
  align-items: center;
  gap: 16px;
  color: #999;
  font-size: 14px;
  flex-wrap: wrap;
}
.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
}
.username {
  font-weight: 500;
  color: #333;
}
.view-count, .score {
  color: #999;
}

.card-body {
  display: flex;
  gap: 15px;
  align-items: flex-start;
}
.article-info {
  flex: 1;
  min-width: 0;
}
.article-title {
  font-size: 20px;
  font-weight: 500;
  margin: 0 0 8px 0;
  color: #333;
}
.article-desc {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
  margin: 0;
}

.article-imgs {
  width: 100px;
  flex-shrink: 0;
}
.grid-img {
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  border-radius: 2px;
}
</style>