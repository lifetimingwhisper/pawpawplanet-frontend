<script setup>
import { ref } from 'vue'

const props = defineProps({
  freelancerType: {
    type: Number,
  },
})
const emit = defineEmits(['press'])
const tabGroup = ref([
  {
    id: 0,
    value: '寵物日托'
  },
  {
    id: 1,
    value: '寵物散步'
  },
  {
    id: 2,
    value: '寵物美容'
  },
  {
    id: 3,
    value: '到府服務'
  },
])

const onPress = (value) => {
  emit('press', value)
}
</script>
<template>
  <div class="w-100 overflow-x-scroll">
    <div class="row g-2 flex-nowrap justify-content-between">
      <div v-for="(tab, key) in tabGroup" class="freelancer-list-tab" :key="key">
        <button
          type="button"
          class="btn border-black-300 tab-btn"
          :class="{ 'choose': tab.id === props.freelancerType }"
          @click="onPress(tab.value)"
        >
          {{ tab.value }}
        </button>
      </div>
    </div>
  </div>
</template>
