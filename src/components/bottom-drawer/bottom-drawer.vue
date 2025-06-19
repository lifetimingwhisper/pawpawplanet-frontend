<template>
  <div
    class="drawer"
    ref="drawer"
    :style="{ height: currentHeight + 'px' }"
    @touchstart="onStart"
    @touchmove="onMove"
    @touchend="onEnd"
    @mousedown="onStart"
    @mousemove="onMove"
    @mouseup="onEnd"
  >
    <div class="drawer-header">
      <div class="drag-handle"></div>
    </div>
    <div class="drawer-content">
      <slot />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const MIN_HEIGHT = 96
const MAX_HEIGHT = 560

const drawer = ref(null)
const currentHeight = ref(MIN_HEIGHT)

let startY = 0
let startHeight = MIN_HEIGHT
let isDragging = false

const onStart = (e) => {
  isDragging = true
  startY = e.touches ? e.touches[0].clientY : e.clientY
  startHeight = currentHeight.value
  if (drawer.value) {
    drawer.value.style.transition = 'none'
  }
}

const onMove = (e) => {
  if (!isDragging) return
  const y = e.touches ? e.touches[0].clientY : e.clientY
  const delta = startY - y
  const newHeight = Math.min(Math.max(startHeight + delta, MIN_HEIGHT), MAX_HEIGHT)
  currentHeight.value = newHeight
}

const onEnd = () => {
  isDragging = false
  if (drawer.value) {
    drawer.value.style.transition = 'height 0.2s ease'
  }
}
</script>

<style scoped>
.drawer {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  background: white;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.15);
  transition: height 0.2s ease;
  touch-action: none;
  overflow: hidden;
  @media (min-width: 992px) {
    display: none;
  }
}
.drawer-header {
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}
.drag-handle {
  width: 40px;
  height: 5px;
  border-radius: 2.5px;
  background-color: #CECECE;
  position: absolute;
  top: 10px;
}
.drawer-content {
  padding: 0 12px;
  overflow: auto;
  height: calc(100% - 40px);
}
</style>
