<script setup>
import SortSelector from '@/components/select/sort-selector.vue'
import { ref } from 'vue'

defineProps({
  total: {
    type: Number,
  },
  selectValue: {
    type: [Number, String],
  },
})

const emit = defineEmits(['updateSort'])

const sortList = ref([
  {
    value: 'newest',
    name: '最新到最舊',
    icon: 'descending',
  },
  {
    value: 'oldest',
    name: '最舊到最新',
    icon: 'ascending',
  },
  {
    value: 'rating',
    name: '評價最高到最低',
    icon: 'descending',
  },
])

const updateSort = (value) => {
  emit('updateSort', value)
}
</script>
<template>
  <div class="w-100 pt-3">
    <div class="d-flex flex-wrap align-items-center">
      <div class="flex-1">
        <p class="freelancer-list-num">共 {{ total }} 個搜尋結果</p>
      </div>
      <div class="flex-1">
        <div class="d-flex justify-content-end">
          <SortSelector :options="sortList" :value="selectValue" @update-sort="updateSort"/>
        </div>
      </div>
    </div>
  </div>
</template>
