<template>
  <NavBar_black />
  <div class="write-note-page">
    <!-- 顶部头图区域 -->
    <div class="header-banner" @click="chooseCover">
      <div v-if="!coverPreview" class="cover-upload">
        <div class="cover-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#999" stroke-width="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <circle cx="8.5" cy="8.5" r="1.5"></circle>
            <polyline points="21 15 16 10 5 21"></polyline>
          </svg>
          <div class="add-badge">+</div>
        </div>
        <div class="cover-text">
          <h3>设置游记头图</h3>
          <p>图片建议选择尺寸大于1680px的高清大图</p>
        </div>
      </div>

      <img v-else :src="coverPreview" class="cover-preview-img" />

      <input ref="coverInput" type="file" accept="image/*" style="display: none" @change="onCoverChange" />
    </div>

    <div class="title-wrap">
      <input v-model="title" class="title-input" placeholder="填写游记标题" />
    </div>

    <div class="content-wrap">
      <!-- 富文本编辑器 -->
      <div
        ref="editorRef"
        class="editor-area"
        contenteditable="true"
        placeholder="开始写你的游记吧..."
      ></div>

      <!-- 插入段落弹窗 -->
      <div class="modal-mask" v-if="showModal" @click="showModal = false">
        <div class="modal-content" @click.stop>
          <div class="input-group">
            <input
              v-model="paragraphTitle"
              type="text"
              placeholder="请输入段落名称"
              maxlength="20"
              class="paragraph-input"
            />
            <span class="tip">可输入<span class="red">20</span>字</span>
          </div>
          <button class="confirm-btn" @click="insertTitle">确定</button>
        </div>
      </div>

      <div class="sidebar-tool">
        <div class="tool-group">
          <div class="tool-item" @click="insertImage">
            <span class="tool-icon">🖼️</span>
            <span>插入图片</span>
          </div>
          <div class="tool-item" @click="insertVideo">
            <span class="tool-icon">🎥</span>
            <span>插入视频</span>
          </div>
          <div class="tool-item" @click="showModal = true">
            <span class="tool-icon">➕</span>
            <span>插入段落</span>
          </div>
          <div class="tool-item">
            <span class="tool-icon">😊</span>
            <span>插入表情</span>
          </div>
        </div>

        <!-- ✅ 跳转到 AI 创作页面（独立页面） -->
        <button class="ai-create-btn" @click="goToAICreate">
          <span></span>AI 创作
        </button>

        <button class="save-draft-btn">
          <span></span>保存草稿
        </button>

        <button class="publish-btn" @click="handlePublish" :disabled="loading">
          <span></span>{{ loading ? '发布中...' : '发布游记' }}
        </button>
      </div>
    </div>

    <input ref="imageInput" type="file" accept="image/*" multiple style="display:none" @change="onImagesChange" />
    <input ref="videoInput" type="file" accept="video/*" style="display:none" @change="onVideosChange" />
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import axios from 'axios'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'
import NavBar_black from '@/components/layout/NavBar_black.vue'

const userStore = useUserStore()
const router = useRouter()

const title = ref('')
const loading = ref(false)
const showModal = ref(false)
const paragraphTitle = ref('')
const editorRef = ref(null)

const coverInput = ref(null)
const coverPreview = ref('')
const coverFile = ref(null)

const imageInput = ref(null)
const videoInput = ref(null)

// 选择封面
const chooseCover = () => coverInput.value.click()
const onCoverChange = (e) => {
  const file = e.target.files[0]
  if (file) {
    coverFile.value = file
    coverPreview.value = URL.createObjectURL(file)
  }
}

// 插入图片
const insertImage = () => imageInput.value.click()
const onImagesChange = async (e) => {
  const files = Array.from(e.target.files)
  if (!files.length) return

  await nextTick()
  const ed = editorRef.value
  files.forEach(file => {
    const url = URL.createObjectURL(file)
    const img = document.createElement('img')
    img.src = url
    img.style.maxWidth = '100%'
    img.style.margin = '8px 0'
    img.style.borderRadius = '6px'
    const p = document.createElement('p')
    p.appendChild(img)
    ed.appendChild(p)
  })
}

// 插入视频
const insertVideo = () => videoInput.value.click()
const onVideosChange = (e) => {
  const file = e.target.files[0]
  if (!file) return
}

// 跳转到 AI 创作页面
const goToAICreate = () => {
  router.push('/aicreate')
}

// 插入段落标题
const insertTitle = async () => {
  const titleText = paragraphTitle.value.trim()
  if (!titleText) {
    alert('请输入段落名称')
    return
  }

  showModal.value = false
  await nextTick()
  const editor = editorRef.value
  if (!editor) return

  const titleNode = document.createElement('h2')
  titleNode.style.margin = '16px 0'
  titleNode.style.fontSize = '22px'
  titleNode.style.fontWeight = 'bold'
  titleNode.textContent = titleText

  editor.appendChild(titleNode)
  paragraphTitle.value = ''
}

// 发布文章
const handlePublish = async () => {
  const editor = editorRef.value
  if (!title.value || !editor?.innerText.trim()) {
    alert('标题和内容不能为空')
    return
  }

  try {
    loading.value = true
    const content = editor.innerHTML

    const article = {
      userId: userStore.userInfo?.id || '1',
      username: userStore.userInfo?.username || '匿名用户',
      userAvatar: userStore.userInfo?.avatar || 'https://picsum.photos/200/200?random=1',
      title: title.value,
      cover: coverPreview.value || 'https://picsum.photos/400/220',
      content: content,
      viewCount: 0,
      score: 0,
      lastReplyTime: new Date().toLocaleString()
    }

    await axios.post('http://localhost:3000/articles', article)
    alert('发布成功！')
    router.push('/community')
  } catch (err) {
    console.error(err)
    alert('发布失败')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.write-note-page {
  width: 100%;
  min-height: 100vh;
  background: #fff;
}
.header-banner {
  width: 100%;
  height: 260px;
  background: #f7f8fa;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
}
.cover-upload {
  display: flex;
  align-items: center;
  gap: 20px;
  z-index: 1;
}
.cover-icon {
  position: relative;
  width: 64px; height: 64px;
  border: 2px solid #999;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
}
.add-badge {
  position: absolute;
  bottom: -4px;
  right: -4px;
  width: 24px; height: 24px;
  border-radius: 50%;
  background: #1677ff;
  color: #fff;
  font-size: 16px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
}
.cover-text h3 {
  font-size: 22px;
  color: #333;
  margin: 0 0 6px 0;
}
.cover-text p {
  font-size: 14px;
  color: #999;
  margin: 0;
}
.cover-preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.title-wrap {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 20px;
  transform: translateY(-25px);
}
.title-input {
  width: 100%;
  height: 50px;
  border: none;
  outline: none;
  background: #fff;
  font-size: 18px;
  padding: 0 15px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}
.content-wrap {
  display: flex;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px 60px;
  gap: 60px;
  align-items: flex-start;
  position: relative;
}

/* 编辑器 */
.editor-area {
  flex: 1;
  min-height: 400px;
  padding: 10px 0;
  font-size: 16px;
  line-height: 1.8;
  outline: none;
  white-space: pre-wrap;
  word-wrap: break-word;
}
.editor-area:empty::before {
  content: attr(placeholder);
  color: #ccc;
}

/* 弹窗 */
.modal-mask {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}
.modal-content {
  background: #fff;
  padding: 24px;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
}
.input-group {
  position: relative;
  margin-bottom: 16px;
}
.paragraph-input {
  width: 100%;
  height: 48px;
  border: 1px solid #eee;
  border-radius: 24px;
  padding: 0 20px;
  font-size: 16px;
  outline: none;
  box-sizing: border-box;
}
.tip {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 12px;
  color: #999;
}
.red {
  color: #1677ff;
}
.confirm-btn {
  width: 100%;
  height: 44px;
  background: #1677ff;
  color: #fff;
  border: none;
  border-radius: 22px;
  font-size: 16px;
  cursor: pointer;
}

.sidebar-tool {
  width: 260px;
  flex-shrink: 0;
  position: sticky;
  top: 100px;
}
.tool-group {
  margin-bottom: 20px;
}
.tool-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 0;
  font-size: 16px;
  color: #333;
  cursor: pointer;
}
.tool-icon {
  width: 32px; height: 32px;
  border-radius: 50%;
  background: #fff;
  border: 1px solid #1677ff;
  color: #1677ff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}

/* AI 创作按钮 */
.ai-create-btn {
  width: 100%;
  padding: 10px 0;
  background: #722ed1;
  border: none;
  border-radius: 20px;
  font-size: 14px;
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-bottom: 12px;
}

.save-draft-btn {
  width: 100%;
  padding: 10px 0;
  background: #969494;
  border: 1px solid #ada5a5;
  border-radius: 20px;
  font-size: 14px;
  color: #1d1a1a;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-bottom: 12px;
}
.publish-btn {
  width: 100%;
  padding: 12px 0;
  background: #1677ff;
  border: none;
  border-radius: 20px;
  font-size: 16px;
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}
</style>