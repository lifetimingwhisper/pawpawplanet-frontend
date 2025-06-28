<template>
  <div>
    <h5 class="mb-3 text-primary-dark-second">你所服務</h5>
    <div class="mb-3">
      <h6 class="text-primary-dark-second">在我家</h6>
      <div
        v-for="item in homeServiceList"
        :key="item.name"
        class="service-box d-flex justify-content-between align-items-center p-2 mb-2"
      >
        <div class="text-primary-dark-second">
          <div class="d-flex align-items-center">
            <SvgIcon class="me-1" :name="item.icon" color="#452B14" :size="20" />
            {{ item.name }}
          </div>
          <div v-if="item.serviceData?.enabled && item.created" class="ms-4 text-black">
            <small> 價格：{{ item.serviceData.price_unit }}費用 </small>
            <br />
            <small> {{ item.serviceData.price }} TWD </small>
          </div>
        </div>
        <button
          class="text-primary-dark-second btn btn-primary btn-lg rounded-pill"
          @click="goEdit(item.type)"
        >
          {{ item.serviceData?.enabled ? '提供' : '啟用' }}服務
        </button>
      </div>
    </div>
    <div>
      <h6 class="text-primary-dark-second">在顧客家</h6>
      <div
        v-for="item in customerServiceList"
        :key="item.name"
        class="service-box d-flex justify-content-between align-items-center p-2 mb-2"
      >
        <div class="text-primary-dark-second">
          <div class="d-flex align-items-center">
            <SvgIcon class="me-1" :name="item.icon" color="#452B14" :size="20" />
            {{ item.name }}
          </div>
          <div v-if="item.serviceData?.enabled && item.created" class="ms-4 text-black">
            <small> 價格：{{ item.serviceData.price_unit }}費用 </small>
            <br />
            <small> {{ item.serviceData.price }} TWD </small>
          </div>
        </div>
        <button
          class="text-primary-dark-second btn btn-primary btn-lg rounded-pill"
          @click="goEdit(item.type)"
        >
          {{ item.serviceData?.enabled ? '提供' : '啟用' }}服務
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useToast } from '@/plugins/toast/toast-plugin.js'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
const props = defineProps({
  isFinished: {
    type: Boolean,
    defauit: true,
  },
  services: {
    type: Array,
    defauit: () => [],
  },
})
const router = useRouter()
const toast = useToast()

const homeServices = [
  { name: '寵物日托', type: 0, icon: 'pet_boarding' },
  { name: '寵物美容', type: 2, icon: 'pet_grooming' },
]

const customerServices = [
  { name: '寵物散步', type: 1, icon: 'pet_walking' },
  { name: '到府服務', type: 3, icon: 'home_care' },
]

const homeServiceList = computed(() => attachServiceData(homeServices))
const customerServiceList = computed(() => attachServiceData(customerServices))

function attachServiceData(serviceList) {
  return serviceList.map((item) => {
    const matched = props.services.find((s) => s.service_type_id === item.type)
    return {
      ...item,
      created: !!matched,
      serviceData: matched || null,
    }
  })
}

function goEdit(type) {
  //是否已經完成個人資料填寫
  if (!props.isFinished) {
    toast.show('請先填個人資料', 'error')
    return
  }
  router.push(`/freelancer/services/${type}`)
}
</script>
<style lang="scss" scoped>
.service-box {
  border: 1px solid $primary-dark;
  border-radius: 8px;
}
</style>
