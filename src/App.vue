<script setup>
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { useDeviceStore } from '@/stores/device.js'

const deviceStore = useDeviceStore()

const updateDevice = () => {
  const width = document.documentElement.clientWidth;
  if (width < 992) {
    deviceStore.changeMobileScreen(true)
  } else {
    deviceStore.changeMobileScreen(false)
  }
}
onMounted(() => {
  updateDevice()
  window.onresize = () => (() => {
    const width = document.documentElement.clientWidth;
    if (width < 992) {
      deviceStore.changeMobileScreen(true)
    } else {
      deviceStore.changeMobileScreen(false)
    }
  })();
})
</script>

<template>
  <RouterView />
</template>
