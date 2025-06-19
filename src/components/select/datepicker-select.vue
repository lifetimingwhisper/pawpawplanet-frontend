<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, useTemplateRef } from 'vue'
import { addDays, differenceInCalendarDays, format } from 'date-fns'

const props = defineProps({
  prependIcon: {
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
  id: {
    type: String,
    default: 'select'
  },
  disabledDates: {
    type: Array,
    default: () => [],
  },
  minDate: {
    type: Date,
    default: null,
  },
  maxDate: {
    type: Date,
    default: null,
  },
  isRange: {
    type: Boolean,
    default: false,
  },
  attributes: {
    type: Array,
    default: () => [],
  },
  availableDates: {
    type: Array,
    default: () => [],
  },
})

const dateModel = defineModel()

const select = useTemplateRef('select')

const showDropDown = ref(false)

const masks = ref({
  modelValue: 'YYYY-MM-DD',
});

const dateText = computed(() => {
  if (props.isRange) {
    const { start, end } = dateModel.value
    if (start) {
      const startDate = format(start, 'yyyy-MM-dd')
      if (end) {
        const endDate = format(end, 'yyyy-MM-dd')
        if (startDate !== endDate) {
          return `${startDate}-${endDate}`
        } else {
          return startDate
        }
      }
    }
  } else {
    return dateModel.value ? format(dateModel.value, 'yyyy-MM-dd') : ''
  }
  return ''
})

const matchDate = computed(() => {

  if (props.availableDates.length > 0) {
    let arr = []
    const min = format(props.minDate, 'yyyy-MM-dd')
    const max = format(props.maxDate, 'yyyy-MM-dd')
    const diffDays = differenceInCalendarDays(max, min)
    // 先計算一週的所有日期
    for (let i = 0; i < diffDays; i++) {
      arr.push(format(addDays(props.minDate, i), 'yyyy-MM-dd'))
    }
    let diff = [...arr.filter(x => !props.availableDates.includes(x))]
    if (props.attributes.length > 0) {
      let dateArr = [...arr.filter(x => props.attributes[0].dates.includes(x))]
      diff = diff.concat(dateArr)
      return diff
    }
    return []
  }
  return []
})

const onPress = () => {
  showDropDown.value = !showDropDown.value
}

const clickOtherElement = (e) => {
  if (select.value && !select.value.contains(e.target)) {
    showDropDown.value = false
  }
}

const updateDate = () => {
  showDropDown.value = false
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
  <div ref="select" class="custom-select">
    <label v-if="label.length > 0" for="service" class="home-search-label">{{ label }}</label>
    <div class="py-lg-3 py-2 position-relative">
      <div class="custom-select-input" :class="{ 'bg-transparent': backgroundIsTransparent }" @click="onPress">
        <div v-if="prependIcon.length > 0" class="flex-0">
          <SvgIcon :name="prependIcon" color="#452B14" :size="28" />
        </div>
        <div class="flex-1">
          <input v-model="dateText" :placeholder="placeholder" :id="id" readonly />
        </div>
        <div class="flex-0">
          <SvgIcon
            name="chevron_down"
            :size="20"
            color="#452B14"
            :class="{ 'custom-select-append': showDropDown }"
          />
        </div>
      </div>
      <ul class="custom-select-options datepicker" :class="{ 'hide': showDropDown }">
        <template v-if="isRange">
          <VDatePicker
            v-model.range="dateModel"
            mode="date"
            class="w-100"
            :attributes="attributes"
            :min-date="minDate"
            :max-date="maxDate"
            :masks="masks"
            :disabled-dates="disabledDates"
            @update:modelValue="updateDate"
          />
        </template>
        <template v-else>
          <VDatePicker
            v-model="dateModel"
            mode="date"
            class="w-100"
            :attributes="attributes"
            :min-date="minDate"
            :max-date="maxDate"
            :masks="masks"
            :disabled-dates="props.availableDates.length > 0 ? matchDate : disabledDates"
            @update:modelValue="updateDate"
          />
        </template>
      </ul>
    </div>
  </div>
</template>
