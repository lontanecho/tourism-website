<template>
  <NavBar_black/>
  <div class="search-page">
    <div class="tab-nav">
      <span
        v-for="tab in tabs"
        :key="tab.key"
        class="tab-item"
        :class="{ active: activeTab === tab.key }"
        @click="switchTab(tab.key)"
      >
        {{ tab.label }}
      </span>
    </div>

    <div class="search-bar">
      <input
        v-model="keyword"
        type="text"
        class="search-input"
        placeholder="请输入游记标题、目的地或内容关键词"
        @keyup.enter="doSearch"
      />
      <button class="search-btn" @click="doSearch">
        <span class="icon">🔍</span>搜索
      </button>
    </div>

    <div class="search-toolbar" v-if="activeTab === 'note' && hasResult">
      <div class="result-count">共 {{ noteList.length }} 条结果</div>
      <div class="sort">
        <select v-model="sortBy" @change="doSearch">
          <option value="default">默认排序</option>
          <option value="viewCount">按浏览量 ↓</option>
          <option value="score">按评分 ↓</option>
        </select>
      </div>
    </div>

    <!-- 景点 -->
    <div class="result-list" v-if="activeTab === 'destination'">
      <div
        v-for="item in spotList"
        :key="item.id"
        class="article-card"
        @click="goSpotDetail(item.id)"
        style="cursor: pointer"
      >
        <div class="card-header">
          <div class="user-info">
            <img :src="item.image" class="avatar" />
            <span class="username">{{ item.name }}</span>
            <span class="reply-time">{{ item.nameEn }}</span>
            <span class="view-count">👁️‍🗨️ {{ item.visited }}人去过</span>
            <span class="score">📍 {{ item.location }}</span>
          </div>
        </div>
        <div class="card-body">
          <div class="article-info">
            <h3 class="article-title">
              {{ item.name }}
              <span class="tag">景点</span>
            </h3>
            <p class="article-desc">{{ item.intro }}</p>
          </div>
          <div class="article-imgs">
            <img :src="item.image" class="grid-img" />
          </div>
        </div>
      </div>
      <div class="empty" v-if="spotList.length === 0 && hasResult">
        未找到含 “{{ keyword }}” 的相关目的地
      </div>
    </div>

    <!-- 游记 -->
    <div class="result-list" v-if="activeTab === 'note'">
      <div
        v-for="item in noteList"
        :key="item.id"
        class="article-card"
        @click="goNoteDetail(item.id)"
        style="cursor: pointer"
      >
        <div class="card-header">
          <div class="user-info">
            <img :src="item.userAvatar" class="avatar" />
            <span class="username">{{ item.username }}</span>
            <span class="view-count">👁️‍🗨️ 浏览量 {{ item.viewCount }}</span>
            <span class="score">❤️ 评分 {{ item.score }}</span>
          </div>
        </div>
        <div class="card-body">
          <div class="article-info">
            <h3 class="article-title">{{ item.title }}</h3>
            <p class="article-desc">{{ item.desc || item.content.replace(/<[^>]+>/g, '') }}</p>
          </div>
          <div class="article-imgs">
            <img :src="item.cover" class="grid-img" />
          </div>
        </div>
      </div>
      <div class="empty" v-if="noteList.length === 0 && hasResult">
        未找到含 “{{ keyword }}” 的相关游记
      </div>
    </div>

    <div class="empty-tip" v-if="!hasResult">
      请输入关键词并点击搜索
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import NavBar_black from '../components/layout/NavBar_black.vue'
import axios from 'axios'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const token = userStore.token

const API = {
  spots: 'http://localhost:3000/spots',
  articles: 'http://localhost:3000/articles',
  //spots: 'https://api.example.com/spots',
  //articles: 'https://api.example.com/articles',
}

const tabs = [
  { key: 'destination', label: '目的地' },
  { key: 'note', label: '游记' }
]

const activeTab = ref('destination')
const keyword = ref('')
const sortBy = ref('default')
const hasResult = ref(false)
const spotList = ref([])
const noteList = ref([])

onMounted(async () => {
  const q = route.query.keyword
  const t = route.query.tab

  if (q) {
    keyword.value = q
    activeTab.value = t || 'note'
    await doSearch()
  }
})

const switchTab = (key) => {
  activeTab.value = key
}

//搜索
const doSearch = async () => {
  const kw = keyword.value.trim().toLowerCase()
  if (!kw) return

  hasResult.value = true
  spotList.value = []
  noteList.value = []

  try {
    // 同时请求两个接口
    const [spotRes, articleRes] = await Promise.all([
      axios.get(API.spots, { headers: { Authorization: `Bearer ${token}` } }),
      axios.get(API.articles, { headers: { Authorization: `Bearer ${token}` } })
    ])

    // 处理景点
    const isLocalSpot = API.spots.includes('localhost')
    const spotData = isLocalSpot ? spotRes.data : (spotRes.data.code === 200 ? spotRes.data.data : [])
    spotList.value = spotData.filter(item =>
      item.name?.toLowerCase().includes(kw) ||
      item.nameEn?.toLowerCase().includes(kw) ||
      item.intro?.toLowerCase().includes(kw)
    )

    // 处理游记
    const isLocalArt = API.articles.includes('localhost')
    const artData = isLocalArt ? articleRes.data : (articleRes.data.code === 200 ? articleRes.data.data : [])
    let list = artData.filter(item =>
      item.title?.toLowerCase().includes(kw) ||
      item.content?.toLowerCase().includes(kw)
    )

    if (sortBy.value === 'viewCount') {
      list.sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
    } else if (sortBy.value === 'score') {
      list.sort((a, b) => (b.score || 0) - (a.score || 0))
    }

    noteList.value = list

  } catch (err) {
    console.error(err)
    alert('搜索异常')
  }
}

const goSpotDetail = (id) => router.push(`/spot-detail/${id}`)
const goNoteDetail = (id) => router.push(`/article/detail/${id}`)
</script>

<style scoped>
/* 样式完全不变，我就不占篇幅了 */
.search-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 80px 20px 40px;
}
.tab-nav {
  display: flex;
  border-bottom: 1px solid #eee;
  margin-bottom: 20px;
}
.tab-item {
  padding: 12px 20px;
  font-size: 16px;
  color: #666;
  cursor: pointer;
}
.tab-item.active {
  color: #0e61ac;
  border-bottom: 2px solid #0e61ac;
}
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
.search-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  color: #666;
  font-size: 14px;
}
.sort select {
  padding: 6px 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  outline: none;
  cursor: pointer;
}
.result-list {
  width: 100%;
}
.article-card {
  border-bottom: 1px solid #f0f0f0;
  padding: 15px 0;
}
.card-header {
  display: flex;
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
  margin: 0 0 8px;
  color: #333;
}
.tag {
  background: #ff6b6b;
  color: #fff;
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 4px;
}
.article-desc {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2; 
}
.article-imgs {
  width: 240px;
  flex-shrink: 0;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 3px;
}
.grid-img {
  width: 100%;
  aspect-ratio: 1/1;
  object-fit: cover;
  border-radius: 2px;
}
.empty, .empty-tip {
  padding: 40px 0;
  text-align: center;
  color: #999;
  font-size: 15px;
}
</style>