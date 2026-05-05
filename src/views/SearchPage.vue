<template>
  <NavBar_black/>
  <div class="search-page">
    <!-- 顶部标签导航 -->
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

    <!-- 搜索栏：输入框 + 搜索按钮 -->
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

    <div class="search-toolbar" v-if="activeTab === 'note' && searched">
      <div class="result-count">共 {{ noteList.length }} 条结果</div>
      <div class="sort">
        <select v-model="sortBy" @change="doSearch">
          <option value="default">默认排序</option>
          <option value="viewCount">按浏览量 ↓</option>
          <option value="score">按评分 ↓</option>
        </select>
      </div>
    </div>

   
    <div class="result-list" v-if="activeTab === 'destination' && searched">
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

      <div class="empty" v-if="spotList.length === 0">
        未找到含 “{{ keyword }}” 的相关目的地
      </div>
    </div>

    
    <div class="result-list" v-if="activeTab === 'note' && searched">
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
            <span class="reply-time">最后修改于 {{ item.lastReplyTime }}</span>
            <span class="view-count">👁️‍🗨️ 浏览量 {{ item.viewCount }}</span>
            <span class="score">❤️ 评分 {{ item.score }}</span>
          </div>
        </div>

        <div class="card-body">
          <div class="article-info">
            <h3 class="article-title">
              {{ item.title }}
              <span class="tag" v-if="item.isEssence">精华</span>
            </h3>
            <p class="article-desc">{{ item.desc }}</p>
          </div>
          <div class="article-imgs">
            <img v-for="(img, idx) in item.images" :key="idx" :src="img" class="grid-img" />
          </div>
        </div>
      </div>

      <div class="empty" v-if="noteList.length === 0">
        未找到含 “{{ keyword }}” 的相关游记
      </div>
    </div>

    <!-- 初始提示 -->
    <div class="empty-tip" v-if="!searched">
      请输入关键词并点击搜索
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import NavBar_black from '../components/layout/NavBar_black.vue'
import axios from 'axios'

const router = useRouter()
const route = useRoute()

// 标签
const tabs = [
  { key: 'destination', label: '目的地' },
  { key: 'note', label: '游记' }
]
const activeTab = ref('destination')

const keyword = ref('')
const sortBy = ref('default')
const searched = ref(false)
const spotList = ref([])
const noteList = ref([])

// 页面挂载
onMounted(async () => {
  const q = route.query.keyword
  if (q) {
    keyword.value = q
    activeTab.value = 'note'
    await doSearch()
  }
})

// 切换标签
const switchTab = (key) => {
  activeTab.value = key
}

// 搜索逻辑
const doSearch = async () => {
  searched.value = true
  const kw = keyword.value.trim().toLowerCase()

  // 目的地搜索
  if (activeTab.value === 'destination') {
    const res = await axios.get('http://localhost:3000/spots')
    spotList.value = res.data.filter(item =>
      item.name.toLowerCase().includes(kw) ||
      (item.nameEn && item.nameEn.toLowerCase().includes(kw)) ||
      item.intro.toLowerCase().includes(kw)
    )
  }

  // 游记搜索 + 排序
  if (activeTab.value === 'note') {
    const res = await axios.get('http://localhost:3000/notes')
    let list = res.data.filter(item =>
      item.title.toLowerCase().includes(kw) ||
      item.desc.toLowerCase().includes(kw)
    )

    // 排序
    if (sortBy.value === 'viewCount') {
      list.sort((a, b) => b.viewCount - a.viewCount)
    } else if (sortBy.value === 'score') {
      list.sort((a, b) => b.score - a.score)
    }

    noteList.value = list
  }
}

// 跳转
const goSpotDetail = (id) => {
  router.push(`/spot-detail/${id}`)
}
const goNoteDetail = (id) => {
  router.push(`/article/detail/${id}`)
}
</script>

<style scoped>
.search-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 80px 20px 40px;
}

/* 标签导航 */
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

/* 搜索栏 */
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

/* 排序工具栏 */
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
  display: flex;
  align-items: center;
  gap: 8px;
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
  display: -webkit-box;
  display: box; 
  -webkit-box-orient: vertical; 
  -webkit-line-clamp: 2;
  line-clamp: 2; 
  overflow: hidden; 
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