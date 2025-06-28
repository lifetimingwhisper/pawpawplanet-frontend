<script setup>
import { ref } from 'vue'
import CitySelect from '@/components/select/city-select.vue'
import CustomSelect from '@/components/select/custom-select.vue'
import ButtonComponent from '@/components/button/button-component.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const serviceModel = ref(null)

const serviceTypes = ref([
  {
    value: '寵物日托',
    name: '寵物日托',
    icon: 'pet_boarding',
  },
  {
    value: '寵物散步',
    name: '寵物散步',
    icon: 'pet_walking',
  },
  {
    value: '寵物美容',
    name: '寵物美容',
    icon: 'pet_grooming',
  },
  {
    value: '到府服務',
    name: '到府服務',
    icon: 'home_care',
  },
])

const location = ref('')

const updateServiceType = (option) => {
  serviceModel.value = option.name
}

const updateLocation = async (value) => {
  if (Object.keys(value).length > 0) {
    location.value = `${value.city} ${value.area}`
  } else {
    location.value = ''
  }
}

const search = () => {
  const locationStr = location.value.replace(/\s+/g, "")
  const query = {
    type: serviceModel.value ? serviceModel.value : undefined,
    city: locationStr.length > 0 ? locationStr.slice(0, 3) : undefined,
    area: locationStr.length > 0 ? locationStr.slice(3) : undefined,
  }
  router.push({
    path: '/service',
    query,
  })
}
</script>
<template>
  <div class="home-banner">
    <div class="container h-100">
      <div class="w-100 h-100 d-flex justify-content-center align-items-center">
        <div class="w-100 home-search">
          <div class="row">
            <div class="col-lg-5">
              <CustomSelect
                v-model="serviceModel"
                prepend-icon="service"
                :options="serviceTypes"
                label="我正在尋找"
                placeholder="選擇服務"
                background-is-transparent
                @update-option="updateServiceType"
              />
            </div>
            <div class="col-lg-5">
              <CitySelect
                v-model="location"
                prepend-icon="map"
                append-icon="cancel"
                label="附近"
                placeholder="選擇你的位置 ex:臺北市 信義區"
                background-is-transparent
                @update:model="updateLocation"
              />
            </div>
            <div class="col-lg-2 d-flex align-self-end">
              <div class="w-100 py-2">
                <ButtonComponent
                  class="btn-primary"
                  text="搜尋"
                  prepend-icon="spotlight"
                  prepend-icon-color="#452B14"
                  :size="28"
                  @on-press="search"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <img class="home-cat" src="../../../assets/images/home/cat_ears.png" alt="">
  </div>
</template>
