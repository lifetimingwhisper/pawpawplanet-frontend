<script setup>
import { computed, ref, useTemplateRef, onMounted, nextTick, onUnmounted } from 'vue'
import { useDeviceStore } from '@/stores/device.js'
import { storeToRefs } from 'pinia'

const props = defineProps({
  value: {
    type: [Number, String],
    required: true,
  },
  options: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits(['updateSort'])

const sort = useTemplateRef('sort')

const deviceStore = useDeviceStore()

const { is_mobile } = storeToRefs(deviceStore)

const chooseValue = computed(() => {
  let value = {}
  if (props.options.length > 0) {
    props.options.forEach((item) => {
      if (props.value === item.value) {
        value = item
      }
    })
  }
  return value
})

const showDropDown = ref(false)

const onPress = () => {
  showDropDown.value = !showDropDown.value
}

const updateSort = (value) => {
  emit('updateSort', value)
  showDropDown.value = false
}

const clickOtherElement = (e) => {
  if (sort.value && !sort.value.contains(e.target)) {
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
  <div ref="sort" class="position-relative">
    <button type="button" class="btn btn-link text-decoration-none sort-selector px-0" @click="onPress">
      <span class="d-flex align-items-center">
        <div style="width: 24px; height: 24px;">
          <SvgIcon :name="chooseValue.icon" color="#452B14" :size="is_mobile? 20 : 24"/>
        </div>
        <p>{{ chooseValue.name }}</p>
      </span>
    </button>
    <ul class="position-absolute sort-selector-dropdown py-2 px-0 bg-white" :class="{ 'hide': showDropDown }">
      <li v-for="(item, key) in options" class="w-100 d-flex align-items-center" :key="key" @click="updateSort(item.value)">
        <div class="sort-selector-item d-flex align-items-center">
          <SvgIcon v-if="item.icon" name="descending" color="#452B14" />
          <p>
            {{ item.name }}
          </p>
        </div>
        <SvgIcon v-if="value === item.value" name="check" color="#A87D57" :size="28" />
      </li>
    </ul>
  </div>
</template>
