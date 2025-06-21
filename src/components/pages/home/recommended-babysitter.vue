<script setup>
import Swiper from '@/components/pages/home/recommend-swiper.vue'
import { getRecommendation } from '@/plugins/api/recommendations/recommendations.js'
import { onMounted, ref } from 'vue'
import { useDeviceStore } from '@/stores/device.js'
import { storeToRefs } from 'pinia'

const deviceStore = useDeviceStore()

const { is_mobile } = storeToRefs(deviceStore)


const recommendations = ref([])

const loading = ref(false)

const getRecommendationList = async () => {
  loading.value = true
  const { services } = await getRecommendation()
  recommendations.value = services
  loading.value = false
}
onMounted(async () => {
  await getRecommendationList()
})

</script>
<template>
  <div class="w-100 bg-secondary-tint py-6 home-recommend">
    <div class="container">
      <div class="d-flex flex-column align-items-center">
        <div class="mb-4">
          <div class="d-flex align-items-center">
            <SvgIcon name="stroke" :size="is_mobile ? 20 : 28" color="#A87D57" />
            <div class="px-2">
              <h5 class="home-title">評選最受歡迎寵物保母推薦</h5>
            </div>
            <SvgIcon name="stroke" :size="is_mobile ? 20 : 28" color="#A87D57" style="transform: scaleX(-1)" />
          </div>
          <div class="py-1">
            <p class="home-recommend-description text-center">立即將您的寵物與接案服務者配對</p>
          </div>
        </div>
        <Swiper :carousels="recommendations" :loading="loading" />
      </div>
    </div>
  </div>
</template>
