<template>
  <NavBar_black />
  <div class="ai-create-page">
    <div class="container">
      <h2 class="page-title">AI 旅游动画生成</h2>

      <div class="form-box">
        <!-- 首帧图片 -->
        <div class="form-item">
          <label>上传首帧（开始画面）<span class="red">*</span></label>
          <div class="upload-area" @click="chooseFirstFrame">
            <div v-if="!firstFramePreview">
              <div class="upload-icon">📷</div>
              <div>点击上传首帧图片</div>
            </div>
            <img v-else :src="firstFramePreview" class="preview-img" />
          </div>
          <input
            ref="firstFrameInput"
            type="file"
            accept="image/*"
            style="display: none"
            @change="onFirstFrameChange"
          />
        </div>

        <!-- 尾帧图片 -->
        <div class="form-item">
          <label>上传尾帧（结束画面）<span class="red">*</span></label>
          <div class="upload-area" @click="chooseLastFrame">
            <div v-if="!lastFramePreview">
              <div class="upload-icon">📷</div>
              <div>点击上传尾帧图片</div>
            </div>
            <img v-else :src="lastFramePreview" class="preview-img" />
          </div>
          <input
            ref="lastFrameInput"
            type="file"
            accept="image/*"
            style="display: none"
            @change="onLastFrameChange"
          />
        </div>

        <!-- 文字描述 -->
        <div class="form-item">
          <label>文字描述（地点/运镜/风格）<span class="red">*</span></label>
          <textarea
            v-model="prompt"
            rows="3"
            placeholder="例如：校园风景，缓慢推进，高清旅游动画"
          ></textarea>
        </div>

        <!-- 视频时长 -->
        <div class="form-item">
          <label>视频时长（秒）</label>
          <select v-model="duration">
            <option value="3">3秒</option>
            <option value="5" selected>5秒(推荐)</option>
            <option value="8">8秒</option>
          </select>
        </div>

        <!-- 分辨率 -->
        <div class="form-item">
          <label>分辨率</label>
          <select v-model="resolution">
            <option value="480p">480p</option>
            <option value="720p" selected>720p</option>
          </select>
        </div>

        <!-- 生成按钮 -->
        <button
          class="generate-btn"
          @click="generateVideo"
          :disabled="loading || !firstFrameFile || !lastFrameFile || !prompt"
        >
          {{ loading ? "视频生成中..." : "🚀 生成旅游动画" }}
        </button>
      </div>

      <!-- 生成结果 -->
      <div class="result-box" v-if="videoUrl">
        <h3>✅ 动画生成成功</h3>
        <video :src="videoUrl" controls class="result-video"></video>
        <button class="download-btn" @click="downloadVideo">
           下载视频
        </button>
      </div>
    </div>

    <!-- 下载用的隐藏标签 -->
    <a ref="downloadLink" style="display: none"></a>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import NavBar_black from '@/components/layout/NavBar_black.vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const token = userStore.token

// 图片上传相关
const firstFrameInput = ref(null)
const lastFrameInput = ref(null)
const firstFrameFile = ref(null)
const lastFrameFile = ref(null)
const firstFramePreview = ref('')
const lastFramePreview = ref('')

// 生成参数
const prompt = ref('')
const duration = ref('5')
const resolution = ref('720p')

// 状态
const loading = ref(false)
const videoUrl = ref('')
const downloadLink = ref(null)

// 接口地址
const API = {
  generate: '/api/ai/generate_video',        // 真实后端
  // generate: 'http://localhost:3000/ai',    // 本地
}

// 选择首帧
const chooseFirstFrame = () => {
  firstFrameInput.value.click()
}
const onFirstFrameChange = (e) => {
  const file = e.target.files[0]
  if (!file) return
  firstFrameFile.value = file
  firstFramePreview.value = URL.createObjectURL(file)
}

// 选择尾帧
const chooseLastFrame = () => {
  lastFrameInput.value.click()
}
const onLastFrameChange = (e) => {
  const file = e.target.files[0]
  if (!file) return
  lastFrameFile.value = file
  lastFramePreview.value = URL.createObjectURL(file)
}


const generateVideo = async () => {
  if (!userStore.userInfo) {
    alert('请先登录')
    return
  }

  try {
    loading.value = true
    videoUrl.value = ''

    const formData = new FormData()
    formData.append('first_frame', firstFrameFile.value)
    formData.append('last_frame', lastFrameFile.value)
    formData.append('prompt', prompt.value)
    formData.append('duration', duration.value)
    formData.append('resolution', resolution.value)

    const res = await axios.post(API.generate, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`
      }
    })

  
    const isLocal = API.generate.includes('localhost')
    if (isLocal) {
      videoUrl.value = res.data?.video_url || ''
    } else {
      if (res.data.code === 200) {
        videoUrl.value = res.data.data.video_url
      } else {
        alert(res.data.msg || '生成失败')
      }
    }

  } catch (err) {
    console.error(err)
    alert('视频生成失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

// 下载视频
const downloadVideo = () => {
  if (!videoUrl.value) return
  const a = downloadLink.value
  a.href = videoUrl.value
  a.download = '旅游动画_' + new Date().getTime() + '.mp4'
  a.click()
}
</script>

<style scoped>
.ai-create-page {
  width: 100%;
  min-height: 100vh;
  background: #f7f8fa;
  padding: 40px 20px;
}
.container {
  max-width: 700px;
  margin: 0 auto;
}
.page-title {
  font-size: 24px;
  text-align: center;
  margin-bottom: 24px;
}
.form-box {
  background: #fff;
  padding: 28px;
  border-radius: 16px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}
.form-item {
  margin-bottom: 20px;
}
.form-item label {
  display: block;
  margin-bottom: 8px;
  font-size: 15px;
  color: #333;
}
.red {
  color: red;
}
.upload-area {
  width: 100%;
  height: 160px;
  border: 2px dashed #ccc;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background: #fafafa;
  cursor: pointer;
  overflow: hidden;
}
.upload-icon {
  font-size: 36px;
  margin-bottom: 8px;
}
.preview-img {
  max-height: 100%;
  border-radius: 12px;
  object-fit: cover;
}
textarea,
select {
  width: 100%;
  padding: 12px;
  border: 1px solid #eee;
  border-radius: 8px;
  outline: none;
  box-sizing: border-box;
  font-size: 15px;
}
.generate-btn {
  width: 100%;
  padding: 14px 0;
  background: #722ed1;
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  cursor: pointer;
}
.generate-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}
.result-box {
  background: #fff;
  padding: 24px;
  border-radius: 16px;
  margin-top: 24px;
  text-align: center;
}
.result-video {
  width: 100%;
  border-radius: 12px;
  margin: 12px 0;
}
.download-btn {
  padding: 12px 24px;
  background: #00b42a;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  cursor: pointer;
}
</style>