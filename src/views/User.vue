<template>
  <NarBar_black />
  <div class="user-page">
    <!-- 顶部背景图 + 本地上传 -->
    <div class="bg-wrapper">
      <img :src="bgImage" alt="背景" class="bg-img" />
      <div class="bg-overlay">
        <button class="change-bg-btn" @click="$refs.bgInput.click()">
          更换封面
        </button>
      </div>
      <input
        ref="bgInput"
        type="file"
        accept="image/*"
        style="display: none"
        @change="handleBgUpload"
      />
    </div>

    <!-- 用户信息 -->
    <div class="user-info">
      <div class="avatar-wrapper">
        <img :src="userStore.userInfo?.avatar" alt="头像" class="avatar" />
      </div>
      <div class="user-detail">
        <h2 class="username">{{ userStore.userInfo?.username }}</h2>
        <div class="user-meta">
          <span>发表游记：{{ myArticleList.length }}</span>
        </div>
      </div>
    </div>

    <!-- 内容区：只保留我的游记 -->
    <div class="content-box">
      <div class="article-list">
        <div 
          v-for="item in myArticleList" 
          :key="item.id" 
          class="article-card"
          @click="goDetail(item.id)"
        >
          <img :src="item.cover || item.images?.[0] || 'https://picsum.photos/400/220'" class="card-cover" />
          <div class="card-info">
            <h3 class="card-title">{{ item.title }}</h3>
            <p class="card-desc">{{ item.content.replace(/<[^>]+>/g, '').slice(0, 50) }}...</p>
            <div class="card-meta">
              {{ item.createTime || item.lastReplyTime }} · 浏览 {{ item.viewCount || 0 }}
            </div>
          </div>
        </div>

        <div class="empty" v-if="myArticleList.length === 0">
          暂无游记
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import NarBar_black from '@/components/layout/NavBar_black.vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()
const token = userStore.token
// 接口地址
const API = {
  articles: 'http://localhost:3000/articles',   // 本地
  // articles: '/api/articles/my',              // 真实后端
}

// 背景图
// 优先用户自带背景图，没有则用默认随机图
const bgImage = ref(userStore.userInfo?.bgCover || 'https://picsum.photos/1920/480?random=10')
const handleBgUpload = (e) => {
  const file = e.target.files[0]
  if (file) {
    bgImage.value = URL.createObjectURL(file)
  }
}

// 我的游记列表
const myArticleList = ref([])

// 获取我的游记
const getMyArticle = async () => {
  if (!userStore.userInfo?.id) return

  try {
    const res = await axios.get(API.articles, {
      headers: { Authorization: `Bearer ${token}` }
    })

    const isLocal = API.articles.includes('localhost')
    let list = []

    if (isLocal) {
      list = res.data
    } else {
      if (res.data.code === 200) {
        list = res.data.data
      }
    }

    // 筛选自己的文章
    myArticleList.value = list.filter(item => 
      item.userId === userStore.userInfo.id
    )

  } catch (err) {
    console.error('获取我的游记失败', err)
  }
}

// 跳转到游记详情
const goDetail = (id) => {
  router.push(`/article/detail/${id}`)
}

onMounted(() => {
  getMyArticle()
})
</script>

<style scoped>
.user-page {
  position: absolute;
  width: 70%;
  left: 15%;
  background: #fff;
}

.bg-wrapper {
  position: relative;
  width: 100%;
  height: 480px;
}
.bg-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.bg-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.change-bg-btn {
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.3);
  color: #fff;
  border: 1px solid #fff;
  border-radius: 4px;
  cursor: pointer;
}

.user-info {
  display: flex;
  align-items: flex-end;
  padding: 0 40px;
  margin-top: -60px;
  background: #fff;
  padding-bottom: 20px;
  position: relative;
  z-index: 10;
}
.avatar-wrapper {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 4px solid #fff;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
.avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.user-detail {
  margin-left: 16px;
  margin-bottom: 8px;
}
.username {
  font-size: 28px;
  font-weight: 600;
  color: #333;
  margin: 0 0 6px;
}
.user-meta {
  font-size: 14px;
  color: #666;
}

/* 内容区 */
.content-box {
  padding: 30px 40px;
  min-height: 400px;
}
.article-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.article-card {
  display: flex;
  gap: 20px;
  padding: 15px;
  border: 1px solid #eee;
  border-radius: 8px;
  cursor: pointer;
}
.article-card:hover {
  box-shadow: 0 0 10px rgba(0,0,0,0.05);
}
.card-cover {
  width: 160px;
  height: 100px;
  object-fit: cover;
  border-radius: 6px;
}
.card-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.card-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 6px;
}
.card-desc {
  font-size: 14px;
  color: #666;
  margin: 0 0 6px;
}
.card-meta {
  font-size: 12px;
  color: #999;
}
.empty {
  text-align: center;
  padding: 60px 0;
  color: #999;
}
</style>