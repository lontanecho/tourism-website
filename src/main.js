// src/main.js
import { createApp } from 'vue'
import { createPinia } from 'pinia' // 导入 Pinia
import App from './App.vue'

import router from './router'

// 引入全局样式重置和通用样式
import '@/assets/styles/reset.css'
import '@/assets/styles/common.css'

// 创建并挂载应用
const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')