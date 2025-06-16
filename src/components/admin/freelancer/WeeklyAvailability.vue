<template>
  <div class="weekly-availability">
    <!-- <div class="form-check form-switch mb-2">
      <input class="form-check-input" type="checkbox"
        :checked="weeklyMode"
        @change="$emit('update:weeklyMode', $event.target.checked)"
        :disabled="!editMode" 
      />
      <label class="form-check-label">開啟每週重複</label>
    </div> -->
    
    <div class="d-flex flex-wrap gap-2">
      <button
        v-for="(day, index) in days"
        :key="index"
        class="btn text-primary-dark-second opacity-100"
        :class="{
          'btn-outline-dark-second': !selectedDays.includes(index),
          'btn-primary': selectedDays.includes(index),
          disabled: !editMode
        }"
        @click="toggleDay(index)"
      >{{ day }}</button>
    </div>
    <small v-if="errors?.working_days && editMode" class="text-danger">{{ errors.working_days }}</small>
    <!-- <div class="mt-2 small text-primary-dark" v-if="selectedDays.length && !editMode">最後可工作日： {{ endDate }}</div> -->
  </div>
</template>

<script setup>
const props = defineProps({
  weeklyMode: {
    type: Boolean,
    default: false
  },
  selectedDays: {
    type: Array,
    default: () => []
  },
  editMode: {
    type: Boolean,
    default: true
  },
  endDate: {
    type: String,
    default: ''
  },
  errors: {
    type: Object,
    default: () => ({}),
  },
})
const emit = defineEmits(['update:weeklyMode', 'update:selectedDays'])
const days = ['日', '一', '二', '三', '四', '五', '六']

function toggleDay(dayIndex) {
  const updated = [...props.selectedDays]
  const i = updated.indexOf(dayIndex)
  if (i > -1) updated.splice(i, 1)
  else updated.push(dayIndex)
  emit('update:selectedDays', updated)
}
</script>