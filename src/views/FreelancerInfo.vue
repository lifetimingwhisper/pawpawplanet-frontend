<template>
  <div class="form-box my-4">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h4 class="text-primary-dark-second">基本資料設定</h4>
      <button
        v-if="!isEditMode"
        class="text-primary-dark-second btn btn-primary btn-lg rounded-pill"
        @click="startEdit"
      >
        <i class="bi bi-pencil-square"></i> 編輯
      </button>
    </div>
    <profile-form v-model="tempForm" :edit-mode="isEditMode" :errors="errors"> </profile-form>

    <hr />
    <h5 class="text-primary-dark-second mb-3">你可以接案的時間是</h5>
    <weekly-availability
      class="my-3"
      v-model:weeklyMode="tempForm.is_weekly_mode"
      v-model:selectedDays="tempForm.working_days"
      :endDate="originalForm.calendar.end_date"
      :editMode="isEditMode"
      :errors="errors"
    >
    </weekly-availability>
    <schedule-calendar
      v-model="originalForm.calendar.schedule"
      :weeklyMode="tempForm.is_weekly_mode"
      :editMode="isEditMode"
    >
    </schedule-calendar>
    <div class="text-end mt-3" v-if="isEditMode">
      <button
        type="button"
        class="btn-outline-dark-second btn btn-lg rounded-pill me-2"
        @click="cancelEdit"
      >
        取消
      </button>
      <button
        type="button"
        class="text-primary-dark-second btn btn-primary btn-lg rounded-pill"
        @click="confirmSave"
        :disabled="!hasChanges"
      >
        確認儲存
      </button>
    </div>

    <hr />
    <service-list :services="originalForm.services" :is-finished="isFinished" />
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import isEqual from 'lodash/isEqual'
import ProfileForm from '@/components/admin/freelancer/ProfileForm.vue'
import WeeklyAvailability from '@/components/admin/freelancer/WeeklyAvailability.vue'
import ScheduleCalendar from '@/components/admin/freelancer/ScheduleCalendar.vue'
import ServiceList from '@/components/admin/freelancer/ServiceList.vue'
import {
  getFreelancerProfile,
  updateFreelancerProfile,
} from '@/plugins/api/freelancers/freelancers.js'
import { useLoginStore } from '@/stores/login.js'
import { useRouter } from 'vue-router'
import { useToast } from '@/plugins/toast/toast-plugin.js'

const { saveUserInfo } = useLoginStore()

const emptyForm = {
  name: '',
  city: '',
  area: '',
  phone: '',
  description: '',
  avatar: [],
  bank_account: {
    bank: '',
    account_name: '',
    account_number: '',
  },
  is_weekly_mode: false,
  working_days: [],
  calendar: {
    end_date: '',
    schedule: [],
  },
  services: [],
}

const toast = useToast()
//錯誤訊息內容
const errors = ref({})

//是否在編輯模式
const isEditMode = ref(true)
const isFinished = ref(false)

//表格數據
const originalForm = ref({ ...emptyForm })
//深拷貝表格數據，避免表格編輯時，影響原數據
const tempForm = ref({ ...emptyForm })
//編輯表格數據跟原始數據比對，有變更就為true
const hasChanges = ref(false)
const router = useRouter()

onMounted(async () => {
  const loginStore = useLoginStore()
  if (!loginStore.is_login || loginStore.user.role !== 'freelancer') {
    await router.push('/login')
    return
  }
  await init()
})

async function init() {
  //取得保姆個人資料
  const data = await getFreelancerProfile()
  const normalizedData = normalizeFormData(data || {})
  originalForm.value = normalizedData
  tempForm.value = JSON.parse(JSON.stringify(normalizedData)) //深拷貝
  //沒有填寫完整資料就預設為編輯模式
  isEditMode.value = !normalizedData.name ? true : false
  //已經完成資料填寫
  isFinished.value = normalizedData.name ? true : false
}

//整理返回資料
function normalizeFormData(data = {}) {
  return {
    ...data,
    avatar: Array.isArray(data.avatar) ? data.avatar.map((url) => ({ url, blob: null })) : [], //圖片返回資料整理，避免是null以及整理成套件要的資料格式
    bank_account: data.bank_account || {
      bank: '',
      account_name: '',
      account_number: '',
    },
    working_days: Array.isArray(data.working_days) ? data.working_days : [],
  }
}

async function confirmSave() {
  //表單欄位驗證
  if (!validateForm()) {
    toast.show('請完整填寫所有必填欄位', 'error')
    return
  }

  try {
    //更新保姆資料接口
    const {
      name,
      avatar,
      city,
      area,
      phone,
      bank_account,
      description,
      is_weekly_mode,
      working_days,
    } = tempForm.value
    const params = {
      avatar: getImageUrls(avatar),
      name,
      city,
      area,
      phone,
      bank_account,
      description,
      is_weekly_mode,
      working_days,
    }
    await updateFreelancerProfile(params)
    const cachedData = JSON.parse(localStorage.getItem('user_info')) || {}
    const updatedData = {
      ...cachedData,
      ...params,
    }
    localStorage.setItem('user_info', JSON.stringify(updatedData))
    saveUserInfo(updatedData)
    isEditMode.value = false
    //更新保姆資料
    await init()
  } catch (e) {
    console.error(e)
  }
}

function validateForm() {
  const form = tempForm.value
  errors.value = {} // 先清空錯誤訊息

  if (!form.name) errors.value.name = '請輸入姓名'
  if (!form.city) errors.value.city = '請選擇縣市'
  if (!form.area) errors.value.area = '請選擇區域'
  if (!form.phone) errors.value.phone = '請輸入電話'
  if (!form.description) errors.value.description = '請填寫自我介紹'

  const { bank, account_name, account_number } = form.bank_account
  if (!bank) errors.value.bank = '請輸入銀行名稱'
  if (!account_name) errors.value.account_name = '請輸入戶名'
  if (!account_number) errors.value.account_number = '請輸入帳號'

  if (!form.working_days.length) errors.value.working_days = '請選擇您可提供服務的星期'

  return Object.keys(errors.value).length === 0
}

//整理圖片入參網址
const getImageUrls = (fileList = []) => {
  return fileList
    .map((file) => file?.url || '') // 取得 .url 屬性
    .filter((url) => typeof url === 'string' && url.trim() !== '') // 過濾掉空字串、null、undefined
}

function startEdit() {
  isEditMode.value = true
  tempForm.value = JSON.parse(JSON.stringify(originalForm.value))
}

function cancelEdit() {
  isEditMode.value = false
  tempForm.value = JSON.parse(JSON.stringify(originalForm.value))
}

watch(
  tempForm,
  () => {
    hasChanges.value = !isEqual(tempForm.value, originalForm.value)
  },
  { deep: true },
)
</script>

<style scoped lang="scss">
hr {
  background-color: $primary-dark;
  opacity: 1;
}
.form-box {
  border: 1px solid $primary-dark;
  border-radius: 20px;
  padding: 30px 15px;
  @media (min-width: 768px) {
    padding: 30px;
  }
}
</style>
