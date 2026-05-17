<template>
  <div class="detail-page">
    <NavBar_black />

    <div class="cover-wrapper" v-if="article.cover">
      <img :src="article.cover" class="cover-img" />
      <div class="cover-overlay">
        <div class="overlay-content">
          <h1 class="cover-title">{{ article.title }}</h1>
          <div class="cover-meta">
            <span>{{ article.createTime }}</span>
            <span>· 👁️‍🗨️浏览量 {{ article.viewCount || 0 }}</span>
            <span>· ⭐ 评分 {{ article.score ? article.score.toFixed(1) : '暂无' }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="author-bar">
        <div class="author-left">
          <img :src="article.userAvatar" class="avatar" />
          <div class="author-info">
            <span class="username">{{ article.username }}</span>
          </div>
        </div>

        <div class="author-right">
          <div class="action-item">
            <span class="icon">👁️‍🗨️</span>
            <span class="num">{{ article.viewCount || 0 }} 浏览</span>
          </div>
          <div class="action-item">
            <span class="icon">⭐</span>
            <span class="num">{{ article.score ? article.score.toFixed(1) : '暂无' }} 分</span>
          </div>
        </div>
      </div>

      <div class="article-content">
        <div class="content" v-html="article.content"></div>
      </div>

      <div class="comment-section">
        <h3 class="comment-title">留言评论</h3>

        <div class="comment-publish">
          <textarea v-model="newComment" rows="3" class="comment-input" placeholder="分享你的看法..."></textarea>
          <div class="comment-toolbar">
            <div class="star-rating">
              <div class="star-label">评分：</div>
              <span v-for="i in 5" :key="i" class="star" :class="{ active: userScore >= i }" @click="userScore = userScore === i ? 0 : i">★</span>
            </div>
            <button class="submit-btn" @click="submitComment">发表评论</button>
          </div>
        </div>

        <div class="comment-list">
          <div v-for="item in commentList" :key="item.id" class="comment-item">
            <img class="avatar" :src="item.avatar" />
            <div class="comment-body">
              <div class="name">{{ item.username }}</div>
              <div class="text">{{ item.content }}</div>
              <div class="comment-score" v-if="item.score > 0">
                <span v-for="i in 5" :key="i" class="star readonly" :class="{ active: item.score >= i }">★</span>
                <span class="score-text">{{ item.score }} 分</span>
              </div>
              <div class="time">{{ item.time }}</div>
            </div>
          </div>
          <div class="empty" v-if="commentList.length === 0">暂无评论</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import NavBar_black from '../components/layout/NavBar_black.vue'
import axios from 'axios'

const route = useRoute()
const userStore = useUserStore()
const token = userStore.token
const article = ref({})
const id = route.params.id

const userScore = ref(0)
const newComment = ref('')
const commentList = ref([])


const API = {
  article: 'http://localhost:3000/articles',
  comment: 'http://localhost:3000/comments',
  userInterest: 'http://localhost:3000/user/interest'
}

onMounted(async () => {
  try {
    // 获取文章
    const res = await axios.get(`${API.article}/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    article.value = res.data

    // 浏览量 +1
    await axios.post(`${API.article}/view`, { articleId: id })

     // 添加用户兴趣
    if (userStore.userInfo && article.value.tags) {
      await axios.post(API.userInterest, {
        userId: userStore.userInfo.id,
        articleTags: article.value.tags  // 只传标签
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
    }

    // 获取评论
    const cRes = await axios.get(`${API.comment}?articleId=${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    commentList.value = cRes.data

  } catch (err) {
    console.error('加载失败', err)
  }
})

// 提交评论
const submitComment = async () => {
  if (!newComment.value.trim()) return
  if (!userStore.userInfo) {
    alert('请先登录')
    return
  }

  try {
    await axios.post(API.comment, {
      articleId: id,
      content: newComment.value,
      score: userScore.value
    }, {
      headers: { Authorization: `Bearer ${token}` }
    })

    newComment.value = ''
    userScore.value = 0
  } catch (err) {
    alert('发表失败')
  }
}
</script>

<style scoped>
.detail-page { margin-top: 20px; background: #fff; min-height: 100vh; }
.cover-wrapper { position: relative; width: 100%; height: 420px; overflow: hidden; margin-top: 40px; }
.cover-img { width: 100%; height: 100%; object-fit: cover; }
.cover-overlay { position: absolute; bottom: 0; left: 0; width: 100%; padding: 40px 12%; background: linear-gradient(transparent, rgba(0,0,0,0.7)); color: #fff; }
.cover-title { font-size: 36px; font-weight: bold; margin: 0 0 12px 0; }
.cover-meta { font-size: 14px; opacity: 0.9; }
.container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
.author-bar { display: flex; justify-content: space-between; align-items: center; padding: 20px 0; border-bottom: 1px solid #eee; margin-bottom: 30px; }
.author-left { display: flex; align-items: center; gap: 12px; }
.avatar { width: 56px; height: 56px; border-radius: 50%; }
.author-info { display: flex; align-items: center; gap: 8px; }
.username { font-size: 18px; font-weight: 500; color: #333; }
.author-right { display: flex; gap: 24px; }
.action-item { display: flex; flex-direction: column; align-items: center; color: #666; }
.action-item .icon { font-size: 22px; }
.article-content { height: auto; font-size: 16px; line-height: 1.8; color: #333; }
.comment-section { margin-top: 60px; padding-top: 30px; border-top: 1px solid #eee; }
.comment-title { font-size: 20px; margin-bottom: 16px; }
.comment-input { width: 100%; padding: 12px; border: 1px solid #eee; border-radius: 8px; resize: none; margin-bottom: 10px; }
.comment-toolbar { display: flex; justify-content: space-between; align-items: center; }
.star-rating { display: flex; gap: 6px; }
.star { font-size: 22px; color: #ddd; cursor: pointer; }
.star.active { color: #ffcc00; }
.submit-btn { background: #0e61ac; color: #fff; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; }
.comment-list { margin-top: 20px; }
.comment-item { display: flex; gap: 12px; padding: 12px 0; border-bottom: 1px solid #f5f5f5; }
.comment-body .name { font-weight: 500; font-size: 14px; }
.comment-body .text { font-size: 14px; color: #444; margin: 4px 0; }
.comment-body .time { font-size: 12px; color: #999; }
.comment-score { display: flex; align-items: center; gap: 8px; margin: 4px 0; }
.star.readonly { font-size: 14px; cursor: default; }
.score-text { font-size: 12px; color: #ff6600; font-weight: 500; }
.empty { padding: 30px 0; text-align: center; color: #999; }
</style>