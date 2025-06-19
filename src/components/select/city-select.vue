<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, useTemplateRef } from 'vue'
import cityJson from '@/utils/city.json'

defineProps({
  prependIcon: {
    type: String,
    default: '',
  },
  appendIcon: {
    type: String,
    default: '',
  },
  label: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: '',
  },
  backgroundIsTransparent: {
    type: Boolean,
    default: false,
  },
})

const model = defineModel()

const emit = defineEmits(['update:model'])

const city = useTemplateRef('city')

const showDropDown = ref(false)

const citiesList = computed(() => {
  let arr = []
  cityJson.forEach((city) => {
    // 先判斷輸入的關鍵字有無符合縣市
    if (model.value.length !== 0 && city.city.includes(model.value.replace(/\s+/g, ""))) {
      city.area.forEach((area, key) => {
        arr.push({
          value: key + 1,
          city: city.city,
          area: area,
        })
      })
    // 再判斷後面的關鍵字是否符合區域
    } else if (model.value.length !== 0 && model.value.replace(/\s+/g, "").includes(city.city)) {
      city.area.forEach((area, key) => {
        if (area.includes(model.value.replace(/\s+/g, "").slice(3))) {
          arr.push({
            value: key + 1,
            city: city.city,
            area: area,
          })
        }
      })
    }
  })
  return arr
})

const onFocus = () => {
  showDropDown.value = true
}

const clickOption = (value) => {
  showDropDown.value = false
  emit('update:model', value)
}

const cancel = () => {
  showDropDown.value = false
  emit('update:model', {})
}

const clickOtherElement = (e) => {
  if (city.value && !city.value.contains(e.target)) {
    showDropDown.value = false
  }
}

onMounted(() => {
  nextTick(() => {
    document.addEventListener('click', (e) => clickOtherElement(e))
  })
})

onUnmounted(() => {
  document.removeEventListener('click', (e) => clickOtherElement(e))
})
</script>
<template>
  <div ref="city" class="custom-input">
    <label v-if="label.length > 0" for="service" class="home-search-label">{{ label }}</label>
    <div class="py-2 position-relative">
      <div class="custom-input-input" :class="{ 'bg-transparent': backgroundIsTransparent }">
        <div v-if="prependIcon.length > 0" class="flex-0">
          <SvgIcon :name="prependIcon" color="#452B14" :size="28" />
        </div>
        <div class="flex-1">
          <input v-model="model" :placeholder="placeholder" @focus="onFocus" />
        </div>
        <div v-show="model.length > 0" class="flex-0">
          <button type="button" class="btn p-1 rounded-circle custom-input-cancel" @click="cancel">
            <SvgIcon
              :name="appendIcon"
              :size="20"
              color="#452B14"
            />
          </button>
        </div>
      </div>
      <ul class="custom-select-options" :class="{ 'hide': showDropDown }">
        <template v-if="citiesList.length > 0">
          <li
            v-for="city in citiesList"
            class="custom-select-option"
            :key="city.value"
            @click="clickOption(city)"
          >
            <div class="me-2">
              <SvgIcon name="map" :color="model.replace(/\s+/g, '') === `${city.city}${city.area}` ? '#ECB88A' : '#452B14'" :size="28" />
            </div>
            <p :class="{ 'text-primary': model.replace(/\s+/g, '') === `${city.city}${city.area}` }">
              {{ `${city.city} ${city.area}` }}
            </p>
          </li>
        </template>
        <template v-else>
          <li class="custom-select-option nodata d-flex justify-content-center">
            <p>無搜尋結果</p>
          </li>
        </template>
      </ul>
    </div>
  </div>
</template>
