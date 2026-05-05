<template>
  <div class="stars" :style="{ '--rating': rating }">
    <!-- 空星 + 实星 实现评分效果 -->
  </div>
</template>

<script>
export default {
  name: 'StarRating',
  props: {
    rating: {
      type: Number,
      required: true,
      validator: (value) => {
        // 验证评分范围 0-5
        return value >= 0 && value <= 5;
      }
    }
  }
}
</script>

<style scoped>
.stars {
  --rating: 0;
  display: inline-block;
  font-size: 20px;
  color: #ffc107;
  margin-bottom: 10px;
  position: relative;
}

.stars::before {
  content: '★★★★★';
  color: #e9ecef;
}

.stars::after {
  content: '★★★★★';
  position: absolute;
  top: 0;
  left: 0;
  width: calc(var(--rating) * 20%);
  overflow: hidden;
  color: #ffc107;
}
</style>