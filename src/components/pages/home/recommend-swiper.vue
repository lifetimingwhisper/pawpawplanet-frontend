<script setup>
import Loading from '@/components/loading/loading-component.vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/scrollbar'
import calculRating from '@/utils/calculRating.js'
import { nextTick, ref, useTemplateRef } from 'vue'
import { useDeviceStore } from '@/stores/device.js'
import { storeToRefs } from 'pinia'

defineProps({
  carousels: {
    type: Array,
    required: true,
  },
  loading: {
    type: Boolean,
    required: true,
  },
})

const serviceTypeId = ['寵物寄宿', '寵物散步', '寵物美容', '到府服務']

const picRef = useTemplateRef('recommend-pic-1')

const deviceStore = useDeviceStore()

const { is_mobile } = storeToRefs(deviceStore)

let picHeight = ref(0)

const modules = [Navigation]

const onImageLoad = () => {
  nextTick(() => {
    if (picRef.value) {
      const width = picRef.value[0].getBoundingClientRect().width
      picHeight.value = Math.round(width * 0.56)
    }
  })
}
</script>
<style lang="scss" scoped>
.swiper-content {
  width: 100%;
  @media (min-width: 992px) {
    width: calc(100% - 88px);
  }
}
.swiper-prev-btn {
  width: 24px;
  height: 24px;
  transform: translateY(-50%);
  border: none;
  z-index: 2;
  @media (min-width: 992px) {
    width: 44px;
    height: 44px;
  }
}
.swiper-next-btn {
  width: 24px;
  height: 24px;
  transform: translateY(-50%);
  border: none;
  z-index: 2;
  @media (min-width: 992px) {
    width: 44px;
    height: 44px;
  }
}
</style>
<template>
  <div class="position-relative w-100 d-flex align-items-center">
    <button type="button" class="btn swiper-prev-btn p-0 d-none d-lg-block" id="prev" @click="prevEl">
      <SvgIcon name="chevron_left" :size="44" color="#452B14" />
    </button>
    <div class="swiper-content">
      <swiper
        :modules="modules"
        class="w-100"
        :slides-per-view="carousels.length > 0 ? is_mobile ? 1 : 3 : 1"
        :space-between="16"
        :navigation="{ nextEl: '#next', prevEl: '#prev' }"
      >
        <template v-if="!loading">
          <template v-if="carousels.length > 0">
            <swiper-slide v-for="(item, key) in carousels" :key="key">
              <RouterLink :to="`service/${item.id}`" class="w-100 home-recommend-card">
                <div class="w-100 pb-1 pb-lg-3 home-recommend-card-top">
                  <div class="home-recommend-card-img mb-2 mb-lg-3" :style="{ 'height': `${picHeight}px` }">
                    <img :ref="`recommend-pic-${key + 1}`" :src="item.image" alt="" @load="onImageLoad">
                  </div>
                  <h5 class="home-recommend-card-name text-center">{{ item.freelancer_name }}</h5>
                </div>
                <div class="w-100 pt-3 home-recommend-card-bottom">
                  <div class="row gy-3">
                    <div class="col-12">
                      <div class="w-100 d-flex align-items-center">
                        <div class="home-recommend-card-left">
                          <p>評價</p>
                        </div>
                        <div class="home-recommend-card-right ps-4">
                          <div class="w-100">
                            <div class="home-recommend-card-row">
                              <div v-for="(index) in 5" class="home-recommend-card-icon" :key="index">
                                <SvgIcon name="star" :size="is_mobile ? 24 : 28" :color="calculRating(item.rating, index)" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="col-12">
                      <div class="w-100 d-flex align-items-center">
                        <div class="home-recommend-card-left">
                          <p>服務内容</p>
                        </div>
                        <div class="home-recommend-card-right ps-4">
                          <div class="w-100">
                            <p class="home-recommend-card-text">
                              {{ serviceTypeId[item.service_type_id] }}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="col-12">
                      <div class="w-100 d-flex align-items-center">
                        <div class="home-recommend-card-left">
                          <p>價格</p>
                        </div>
                        <div class="home-recommend-card-right ps-4">
                          <div class="w-100">
                            <p class="home-recommend-card-text">NT$ {{ item.price }}/{{ item.price_unit }}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </RouterLink>
            </swiper-slide>
          </template>
          <template v-else>
            <div class="w-100 d-flex justify-content-center align-items-center" style="height:513px">
              <p class="home-recommend-nodata mb-0">暫無寵物保姆推薦</p>
            </div>
          </template>
        </template>
        <template v-else>
          <div class="w-100 d-flex justify-content-center align-items-center" style="height:513px">
            <Loading :show="loading" />
          </div>
        </template>
      </swiper>
    </div>
    <button type="button" class="btn swiper-next-btn p-0 d-none d-lg-block" id="next" @click="nextEl">
      <SvgIcon name="chevron_right" :size="44" color="#452B14" />
    </button>
  </div>
  <div class="w-100 d-flex justify-content-center d-lg-none pt-4">
    <button type="button" class="btn swiper-prev-btn p-0" id="prev" @click="prevEl">
      <SvgIcon name="chevron_left" :size="24" color="#452B14" />
    </button>
    <button type="button" class="btn swiper-next-btn p-0" id="next" @click="nextEl">
      <SvgIcon name="chevron_right" :size="24" color="#452B14" />
    </button>
  </div>
</template>
