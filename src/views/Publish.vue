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
        @input="saveSelection"
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

          <!-- 表情按钮 相对定位 右侧弹出 -->
          <div class="tool-item emoji-wrap" @click.stop="showEmojiPanel = !showEmojiPanel">
            <span class="tool-icon">😊</span>
            <span>插入表情</span>
            
            <!-- 表情面板 右侧 -->
            <div v-if="showEmojiPanel" class="emoji-panel" @click.stop>
              <span
                v-for="em in emojis"
                :key="em"
                class="emoji-item"
                @click="insertEmoji(em)"
              >
                {{ em }}
              </span>
            </div>
          </div>
        </div>

        <button class="ai-create-btn" @click="goToAICreate">AI 创作</button>
        
        <button class="publish-btn" @click="handlePublish" :disabled="loading">
          {{ loading ? '发布中...' : '发布游记' }}
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
const token = userStore.token

// 接口地址
const API = {
  //uploadImage: 'http://localhost:3000/upload/image',
  //uploadVideo: 'http://localhost:3000/upload/video',
  //publish: 'http://localhost:3000/publish',

  uploadImage: '/api/upload/image',    
  uploadVideo: '/api/upload/video',    
  publish: '/api/travel/publish',       
}

// 页面数据
const title = ref('')
const loading = ref(false)
const showModal = ref(false)
const paragraphTitle = ref('')
const editorRef = ref(null)

// 表情
const showEmojiPanel = ref(false)
const emojis = ref([
  '😀','😃','😄','😁','😆','😅','🤣','😂','🙂','🙃',
  '😉','😊','😇','🥰','😍','🤩','😘','😗','😚','😙',
  '😋','😛','😜','😝','🤑','🤗','🤭','🤫','🤔','🤐',
  '🤨','😐','😑','😶','😏','🙄','😮','😯','😲','😳',
  '🥺','😦','😧','😨','😰','😥','😢','😭','😱','😖',
  '😣','😞','😓','😩','😫','🥱','😴','😌','🤤','😷',
  '👍','👎','👌','❤️','💔','🎉','🎊','🏆','🎁','⭐'
])

// 封面
const coverInput = ref(null)
const coverPreview = ref('')
let coverFile = null

// 本地图片、视频临时存储
const imageInput = ref(null)
const videoInput = ref(null)
const localImages = ref([])
const localVideos = ref([])

// 光标记录
let lastRange = null
const saveSelection = () => {
  const sel = window.getSelection()
  if (sel.rangeCount > 0) {
    lastRange = sel.getRangeAt(0).cloneRange()
  }
}


const restoreCursorAfterImage = (elem) => {
  const ed = editorRef.value
  if (!ed) return
  const sel = window.getSelection()
  sel.removeAllRanges()
  const range = document.createRange()

  const space = document.createTextNode('\u200B')
  ed.appendChild(space)
  range.setStartAfter(space)
  range.collapse(true)
  sel.addRange(range)
  ed.focus()
}

// 封面选择
const chooseCover = () => coverInput.value.click()
const onCoverChange = (e) => {
  const file = e.target.files[0]
  if (file) {
    coverFile = file
    coverPreview.value = URL.createObjectURL(file)
  }
}

// 插入图片
const insertImage = () => {
  saveSelection()
  imageInput.value.click()
}
const onImagesChange = (e) => {
  const files = Array.from(e.target.files)
  if (!files.length) return
  const ed = editorRef.value

  files.forEach(file => {
    const localUrl = URL.createObjectURL(file)
    localImages.value.push({ file, localUrl })

    const img = document.createElement('img')
    img.src = localUrl
    img.dataset.localUrl = localUrl
    img.style.maxWidth = '100%'
    img.style.margin = '8px 0'
    img.style.borderRadius = '6px'
    img.contentEditable = 'false'
    ed.appendChild(img)
  })

 
  restoreCursorAfterImage()
  imageInput.value.value = ''
}

// 插入视频
const insertVideo = () => {
  saveSelection()
  videoInput.value.click()
}
const onVideosChange = (e) => {
  const file = e.target.files[0]
  if (!file) return
  const localUrl = URL.createObjectURL(file)
  localVideos.value.push({ file, localUrl })

  const ed = editorRef.value
  const video = document.createElement('video')
  video.src = localUrl
  video.dataset.localUrl = localUrl
  video.controls = true
  video.style.maxWidth = '100%'
  video.style.margin = '10px 0'
  video.style.borderRadius = '8px'
  video.contentEditable = 'false'
  ed.appendChild(video)


  restoreCursorAfterImage()
  videoInput.value.value = ''
}

// 插入表情

const insertEmoji = (em) => {
  showEmojiPanel.value = false
  const ed = editorRef.value
  if (!ed) return

  // 恢复上次保存的光标
  const sel = window.getSelection()
  if (lastRange) {
    sel.removeAllRanges()
    sel.addRange(lastRange)
  }

  // 插入表情到光标位置
  const range = sel.getRangeAt(0)
  const textNode = document.createTextNode(em)
  range.insertNode(textNode)

  // 移动光标到表情后面（关键！）
  range.setStartAfter(textNode)
  range.collapse(true)
  sel.removeAllRanges()
  sel.addRange(range)

  // 保存最新光标
  lastRange = range.cloneRange()
}

// 段落标题
const insertTitle = async () => {
  const t = paragraphTitle.value.trim()
  if (!t) return
  showModal.value = false
  await nextTick()
  const h2 = document.createElement('h2')
  h2.innerText = t
  h2.style.fontSize = '22px'
  h2.style.fontWeight = 'bold'
  h2.style.color = '#1a1a1'
  h2.style.margin = '20px 0 10px'
  h2.style.paddingLeft = '12px'
  h2.style.borderLeft = '4px solid #1677ff'
  editorRef.value.appendChild(h2)
  paragraphTitle.value = ''
}

const goToAICreate = () => {
  router.push('/aicreate')
}


// 上传工具方法
const uploadImage = async (file, type = 'content') => {
  const fd = new FormData()
  fd.append('file', file)
  fd.append('type', type)

  try {
    const res = await axios.post(API.uploadImage, fd, {
      headers: { Authorization: `Bearer ${token}` }
    })

    const isLocal = API.uploadImage.includes('localhost')
    if (isLocal) {
      return res.data?.url || 'http://localhost:3000/test.jpg'
    } else {
      if (res.data.code === 200) {
        return res.data.data.imgUrl
      } else {
        alert(res.data.msg || '图片上传失败')
        return null
      }
    }
  } catch (err) {
    alert('图片上传失败')
    return null
  }
}

const uploadVideo = async (file) => {
  const fd = new FormData()
  fd.append('file', file)

  try {
    const res = await axios.post(API.uploadVideo, fd, {
      headers: { Authorization: `Bearer ${token}` }
    })

    const isLocal = API.uploadVideo.includes('localhost')
    if (isLocal) {
      return res.data?.url || 'http://localhost:3000/test.mp4'
    } else {
      if (res.data.code === 200) {
        return res.data.data.videoUrl
      } else {
        alert(res.data.msg || '视频上传失败')
        return null
      }
    }
  } catch {
    alert('视频上传失败')
    return null
  }
}



// 发布游记，统一上传资源
const handlePublish = async () => {
  const ed = editorRef.value
  if (!title.value) return alert('请填写标题')
  if (!coverFile) return alert('请上传封面')
  if (!ed?.innerText.trim()) return alert('内容不能为空')

  try {
    loading.value = true
    alert('正在发布，请稍候...')

    // 上传封面
    const coverUrl = await uploadImage(coverFile, 'cover')
    if (!coverUrl) return

    // 上传所有图片
    const imgs = ed.querySelectorAll('img[data-localUrl]')
    for (let img of imgs) {
      const localUrl = img.dataset.localUrl
      const item = localImages.value.find(i => i.localUrl === localUrl)
      if (item) {
        const net = await uploadImage(item.file)
        if (net) img.src = net
      }
    }

    // 上传所有视频
    const videos = ed.querySelectorAll('video[data-localUrl]')
    for (let video of videos) {
      const localUrl = video.dataset.localUrl
      const item = localVideos.value.find(i => i.localUrl === localUrl)
      if (item) {
        const net = await uploadVideo(item.file)
        if (net) video.src = net
      }
    }

    //  发布
    const params = {
      title: title.value,
      coverUrl: coverUrl,
      content: ed.innerHTML,
      user_id: userStore.userInfo.id
    }

    const res = await axios.post(API.publish, params, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })

    const isLocal = API.publish.includes('localhost')
    if (isLocal) {
      alert('发布成功（本地模拟）！')
      router.push('/community')
    } else {
      if (res.data.code === 200) {
        alert('发布成功！')
        router.push('/community')
      } else {
        alert(res.data.msg || '发布失败')
      }
    }

  } catch (err) {
    alert('发布异常，请重试')
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
  min-height: 300px;
  background: #f7f8fa;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  padding: 20px 0;
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
  max-width: 100%;
  height: auto;
  display: block;
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
  box-shadow: 0 2px 8 rgba(0,0,0,0.05);
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
.editor-area {
  flex: 1;
  min-height: 400px;
  padding: 10px 0;
  font-size: 16px;
  line-height: 1.8;
  outline: none;
}
.editor-area:empty::before {
  content: attr(placeholder);
  color: #ccc;
}
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
.tool-group { margin-bottom: 20px; }
.tool-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 0;
  font-size: 16px;
  color: #333;
  cursor: pointer;
  position: relative;
}
.emoji-wrap {
  position: relative;
}
.tool-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #fff;
  border: 1px solid #1677ff;
  color: #1677ff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}
/* 表情面板 右侧弹出 */
.emoji-panel {
  position: absolute;
  left: 50%;
  top: -175px;
  margin-left: 12px;
  width: 260px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 14px rgba(0,0,0,0.15);
  padding: 12px;
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  z-index: 99;
  max-height: 220px;
  overflow-y: auto;
}
.emoji-item {
  font-size: 22px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 6px;
}
.emoji-item:hover {
  background: #f5f5f5;
}
.ai-create-btn {
  width: 100%;
  padding: 10px 0;
  background: #722ed1;
  border: none;
  border-radius: 20px;
  font-size: 14px;
  color: #fff;
  cursor: pointer;
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
}
</style>