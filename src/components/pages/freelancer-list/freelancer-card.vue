<script setup>
import { useTemplateRef, onMounted } from 'vue'
import { useDeviceStore } from '@/stores/device.js'
import { storeToRefs } from 'pinia'

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
})

const deviceStore = useDeviceStore()

const { is_mobile } = storeToRefs(deviceStore)

const imgRef = useTemplateRef(`img-${props.item.id}`)


const calcRating = (rating, index) => {
  // 計算評分
  if (rating !== 0) {
    if (rating > index - 1) return '#FFCF75'
  }
  return '#CECECE'
}
onMounted(() => {
  // 如果是手機裝置，則設定圖片高度
  console.log(`img-${props.item.id}`, imgRef.value.getBoundingClientRect().width)
  if (is_mobile.value) {
    imgRef.value.style.height = imgRef.value.getBoundingClientRect().width * 0.75 + 'px'
  } else {
    imgRef.value.style.height = '100%'
  }
})
</script>
<template>
  <RouterLink :to="`/service/${props.item.id}`" class="d-block text-decoration-none w-100 border border-primary freelancer-list-card">
    <div class="row g-2">
      <div class="col-lg-4">
        <div :ref="`img-${props.item.id}`" class="freelancer-list-card-pic w-100 overflow-hidden d-flex align-items-center justify-content-center">
          <img v-if="props.item.image?.length > 0" class="w-100 h-100 object-fit-cover" :src="props.item.image" alt="">
          <div v-else class="d-flex align-items-center justify-content-center">
            <SvgIcon name="user" color="#452B14" :size="40" />
          </div>
        </div>
      </div>
      <div class="col-lg-8">
        <div class="w-100">
          <div class="rounded-pill bg-primary d-flex align-items-center freelancer-list-card-badge p-1">
            <SvgIcon name="map" color="#452B14" :size="is_mobile ? 20 : 24"/>
            <p class="fw-bold text-primary-dark-second">
              {{ `${props.item.freelancer_info.city} ${props.item.freelancer_info.area}` }}
            </p>
          </div>
          <div class="w-100 py-2">
            <div class="w-100">
              <p class="fw-bold text-primary-dark-second freelancer-list-card-name">
                {{ props.item.title }}
              </p>
              <p class="freelancer-list-card-description text-black">{{ props.item.description }}</p>
            </div>
            <div class="w-100 py-2">
              <div class="row gx-1 align-items-center">
                <div v-for="(index) in 5" class="px-1" :style="{ 'width': is_mobile ? '28px' : '32px' }" :key="index">
                  <SvgIcon name="star" :size="is_mobile ? 20 : 24" :color="calcRating(props.item.rating, index)" />
                </div>
                <div class="col">
                  <div class="px-2">
                    <p class="freelancer-list-card-comment text-black-700">
                      {{ `(${props.item.review_count}則評論)` }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div class="w-100 d-flex justify-content-end">
              <p class="freelancer-list-card-price fw-bold text-primary-dark-second">
                {{ `NT$ ${props.item.price}/${props.item.price_unit}` }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </RouterLink>
</template>
