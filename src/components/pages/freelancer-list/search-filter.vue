<script setup>
import CustomSelect from '@/components/select/custom-select.vue'
import DatepickerSelect from '@/components/select/datepicker-select.vue'
import CitySelect from '@/components/select/city-select.vue'
import { computed, ref } from 'vue'
import { endOfWeek, startOfWeek, addDays } from 'date-fns'

defineProps({
  cond: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['updateBudge', 'updateDate', 'updateLocation'])

const dateModel = defineModel('date')
const locationModel = defineModel('location')
const budgeModel = defineModel('budge')

const today = new Date()

const endOfWeekDate = addDays(today, 6)     // 週日

const end = ref(endOfWeekDate)

const attributes = computed(() => [
  {
    dates: { start: startOfWeek.value, end: endOfWeek.value }
  }
])

const budgeList = ref([
  {
    icon: 'budge',
    value: 0,
    name: '不限'
  },
  {
    icon: 'budge',
    value: 1,
    name: '< NT $1000'
  },
  {
    icon: 'budge',
    value: 2,
    name: 'NT $1000 ~ 2000'
  },
  {
    icon: 'budge',
    value: 3,
    name: 'NT $2000 ~ 3000'
  },
  {
    icon: 'budge',
    value: 4,
    name: '> NT $3000'
  },
])

const updateBudget = (value) => {
  emit('updateBudge', value.value)
}

const updateDate = (value) => {
  emit('updateDate', value)
}

const updateLocation = (value) => {
  emit('updateLocation', value)
}
</script>
<template>
  <div class="w-100">
    <div class="row g-0">
      <div class="col-12">
        <CitySelect
          v-model="locationModel"
          prepend-icon="map"
          append-icon="cancel"
          label=""
          placeholder="選擇你的位置 ex:臺北市 信義區"
          @update:model="updateLocation"
        />
      </div>
      <div class="col-12">
        <div class="row g-0">
          <div class="col-12">
            <DatepickerSelect
              v-model="dateModel"
              prepend-icon="datepicker"
              is-range
              :attributes="attributes"
              :min-date="new Date()"
              :max-date="end"
              label=""
              placeholder="日期"
              @update:modelValue="updateDate"
            />
          </div>
          <div class="col-12">
            <CustomSelect
              v-model="budgeModel"
              prepend-icon="budge"
              :options="budgeList"
              label=""
              placeholder="預算"
              id="service-budge"
              @update-option="updateBudget"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
