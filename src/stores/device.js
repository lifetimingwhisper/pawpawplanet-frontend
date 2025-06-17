import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useDeviceStore = defineStore('device', () => {
  const is_mobile = ref(false)

  function changeMobileScreen(value) {
    is_mobile.value = value
  }

  return {
    is_mobile,
    changeMobileScreen,
  }
})
