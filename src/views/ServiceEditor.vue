<template>
  <div class="py-4">
    <h4 class="mb-3 text-primary-dark-second">
      <i :class="service.icon" class="me-2"></i>
      {{ service.label }}
      <div class="form-check form-switch float-end mb-3 d-flex align-items-center">
        <input class="form-check-input" role="button" type="checkbox" v-model="form.enabled" />
        <label class="ms-2 form-check-label">啟用服務</label>
      </div>
    </h4>

    <div class="mb-3">
      <label for="input-title" class="form-label required">服務標題</label>
      <input id="input-title" v-model="form.title" class="form-control-sm" />
      <small v-if="errors.title" class="text-danger">{{ errors.title }}</small>
    </div>

    <div class="mb-3">
      <label for="input-description" class="form-label required">服務介紹</label>
      <textarea id="input-description" v-model="form.description" rows="4" class="form-control" />
      <small v-if="errors.description" class="text-danger">{{ errors.description }}</small>
    </div>

    <div class="mb-3">
      <label class="form-label">服務圖片</label>
      <div class="image-uploader">
        <div class="img-box" v-for="(file, index) in form.images" :key="index">
          <div v-if="file.uploading" class="loading-overlay">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>
          <img :src="file.blob || file.url" />
          <div v-if="!file.uploading" class="close" @click="remove(file)">
            <div class="icon-close">×</div>
          </div>
        </div>
        <FileUpload
          v-show="form.images.length < 3"
          ref="upload"
          v-model="form.images"
          :multiple="true"
          :maximum="3"
          accept="image/png,image/jpeg,image/jpg"
          extensions="jpg,png,jpeg"
          @input-file="handleInput"
          @input-filter="filter"
        >
          <div class="img-box upload">
            <span class="upload-icon">+</span>
          </div>
        </FileUpload>
      </div>
    </div>

    <div class="mb-3">
      <label class="form-label d-block required">寵物種類</label>
      <div class="form-check form-check-inline">
        <input
          id="dog"
          type="checkbox"
          class="form-check-input"
          value="0"
          v-model="form.allowed_pet_types"
        />
        <label for="dog" class="form-check-label">狗</label>
      </div>
      <div class="form-check form-check-inline">
        <input
          id="cat"
          type="checkbox"
          class="form-check-input"
          value="1"
          v-model="form.allowed_pet_types"
        />
        <label for="cat" class="form-check-label">貓</label>
      </div>
      <small v-if="errors.allowed_pet_types" class="text-danger">{{
        errors.allowed_pet_types
      }}</small>
    </div>

    <div class="mb-3">
      <label class="form-label d-block required">體型</label>
      <div class="form-check form-check-inline" v-for="(size, index) in bodySizes" :key="size">
        <input
          :id="'size' + index"
          type="checkbox"
          class="form-check-input"
          :value="index"
          v-model="form.allowed_pet_sizes"
        />
        <label :for="'size' + index" class="form-check-label">{{ size }}</label>
      </div>
      <small v-if="errors.allowed_pet_sizes" class="text-danger">{{
        errors.allowed_pet_sizes
      }}</small>
    </div>

    <div class="mb-3">
      <label for="input-age" class="form-label required">年齡範圍</label>
      <div class="d-flex flex-wrap gap-2">
        <input
          id="input-age"
          v-model="form.allowed_pet_ages.min"
          min="0"
          type="number"
          class="form-control-sm"
          placeholder="最小"
        />
        <input
          v-model="form.allowed_pet_ages.max"
          min="0"
          type="number"
          class="form-control-sm"
          placeholder="最大"
        />
      </div>
      <small v-if="errors.allowed_pet_ages" class="text-danger">{{
        errors.allowed_pet_ages
      }}</small>
    </div>
    <div class="mb-3">
      <label class="form-label required">性別</label>
      <div>
        <div class="form-check form-check-inline">
          <input
            id="male"
            type="checkbox"
            value="0"
            v-model="form.allowed_pet_genders"
            class="form-check-input"
          />
          <label for="male" class="form-check-label">男生</label>
        </div>
        <div class="form-check form-check-inline">
          <input
            id="female"
            type="checkbox"
            value="1"
            v-model="form.allowed_pet_genders"
            class="form-check-input"
          />
          <label for="female" class="form-check-label">女生</label>
        </div>
      </div>
      <small v-if="errors.allowed_pet_genders" class="text-danger">{{
        errors.allowed_pet_genders
      }}</small>
    </div>

    <div class="mb-3">
      <label for="price-unit" class="form-label required">價格單位</label>
      <input
        id="price-unit"
        placeholder="1天8小時費用"
        v-model="form.price_unit"
        type="text"
        class="form-control-sm"
      />
    </div>

    <div class="mb-3">
      <label for="price" class="form-label required">價格</label>
      <input id="price" v-model="form.price" type="number" class="form-control-sm" />
    </div>

    <div v-if="service.pee_poo_times_per_day" class="mb-3">
      <label for="pee_poo_times_per_day" class="form-label required">每天尿尿及便便次數</label>
      <input
        id="pee_poo_times_per_day"
        v-model="form.extra_options.pee_poo_times_per_day"
        type="number"
        class="form-control-sm"
      />
      <small v-if="errors.pee_poo_times_per_day" class="text-danger">{{
        errors.pee_poo_times_per_day
      }}</small>
    </div>

    <div v-if="service.walk_times_per_day" class="mb-3">
      <label for="walk_times_per_day" class="form-label required">每天散步次數</label>
      <input
        id="walk_times_per_day"
        v-model="form.extra_options.walk_times_per_day"
        type="number"
        class="form-control-sm"
      />
      <small v-if="errors.walk_times_per_day" class="text-danger">{{
        errors.walk_times_per_day
      }}</small>
    </div>

    <div v-if="service.house_type" class="mb-3">
      <label for="house_type" class="form-label required">我家類型</label>
      <input id="house_type" v-model="form.extra_options.house_type" class="form-control-sm" />
      <small v-if="errors.house_type" class="text-danger">{{ errors.house_type }}</small>
    </div>

    <div v-if="service.outdoor_area_size" class="mb-4">
      <label for="outdoor_area_size" class="form-label required">我家戶外區域面積坪數</label>
      <input
        id="outdoor_area_size"
        v-model="form.extra_options.outdoor_area_size"
        class="form-control-sm"
      />
      <small v-if="errors.outdoor_area_size" class="text-danger">{{
        errors.outdoor_area_size
      }}</small>
    </div>

    <div class="text-end">
      <button class="btn-outline-dark-second btn btn-lg rounded-pill me-2" @click="goBack">
        取消
      </button>
      <button class="text-primary-dark-second btn btn-primary btn-lg rounded-pill" @click="submit">
        確認
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import FileUpload from 'vue-upload-component'
import { uploadImage } from '@/plugins/api/upload/upload.js'
import {
  createOrUpdateService,
  getFreelancerServiceDetail,
} from '@/plugins/api/freelancers/freelancers.js'
import { useToast } from '@/plugins/toast/toast-plugin.js'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const type = route.params.type

//錯誤訊息內容
const errors = ref({})
const bodySizes = ['小於10公斤以下', '10公斤以上~20公斤以下', '大於20公斤以上']

const serviceMap = {
  0: {
    label: '日托',
    icon: 'bi bi-sun',
    pee_poo_times_per_day: true,
    walk_times_per_day: true,
    house_type: true,
    outdoor_area_size: true,
  },
  1: { label: '散步', icon: 'bi bi-person-walking' },
  2: { label: '美容', icon: 'bi bi-scissors' },
  3: {
    label: '到府照顧',
    icon: 'bi bi-house-door',
    pee_poo_times_per_day: true,
    walk_times_per_day: true,
  },
}

const service = computed(() => serviceMap[type] || { label: '', icon: '' })

const form = ref({
  enabled: true,
  title: null,
  description: null,
  price: null,
  price_unit: null,
  allowed_pet_types: [],
  allowed_pet_ages: { min: null, max: null },
  allowed_pet_sizes: [],
  allowed_pet_genders: [],
  images: [],
  extra_options: {
    outdoor_area_size: null,
    house_type: null,
    pee_poo_times_per_day: null,
    walk_times_per_day: null,
  },
})
onMounted(async () => {
  await init()
})

async function init() {
  const data = await getFreelancerServiceDetail(type)
  console.log('initdata', data)
  if (data) {
    form.value = normalizeFormData(data)
  }
}
//整理返回資料
function normalizeFormData(data = {}) {
  return {
    ...data,
    images: Array.isArray(data.images) ? data.images.map((url) => ({ url, blob: null })) : [], //圖片返回資料整理，避免是null以及整理成套件要的資料格式
  }
}

async function submit() {
  if (!validateForm()) {
    toast.show('請填寫完整表單內容', 'error')
    return
  }

  const payload = {
    service_type_id: Number(type),
    ...form.value,
    images: getImageUrls(form.value.images),
  }

  try {
    await createOrUpdateService(payload)
    goBack()
  } catch (error) {
    console.log(error)
  }
}

function validateForm() {
  const formValue = form.value
  errors.value = {} // 清空錯誤

  if (!formValue.title) errors.value.title = '請填寫服務標題'
  if (!formValue.description) errors.value.description = '請填寫服務介紹'
  if (!formValue.price_unit) errors.value.price_unit = '請填寫價格單位'
  if (formValue.price == null || formValue.price === '') errors.value.price = '請填寫價格'
  if (formValue.allowed_pet_types.length === 0) errors.value.allowed_pet_types = '請選擇寵物種類'
  if (formValue.allowed_pet_sizes.length === 0) errors.value.allowed_pet_sizes = '請選擇體型'
  if (formValue.allowed_pet_genders.length === 0) errors.value.allowed_pet_genders = '請選擇性別'

  if (formValue.allowed_pet_ages.min == null || formValue.allowed_pet_ages.max == null) {
    errors.value.allowed_pet_ages = '請填寫年齡範圍'
  }

  const { outdoor_area_size, house_type, pee_poo_times_per_day, walk_times_per_day } =
    formValue.extra_options

  if (service.value.pee_poo_times_per_day && !pee_poo_times_per_day)
    errors.value.pee_poo_times_per_day = '請填寫提供每天尿尿及便便次數'
  if (service.value.walk_times_per_day && !walk_times_per_day)
    errors.value.walk_times_per_day = '請填寫提供每天散步次數'
  if (service.value.house_type && !house_type) errors.value.house_type = '請填寫我家類型'
  if (service.value.outdoor_area_size && !outdoor_area_size)
    errors.value.outdoor_area_size = '請填寫我家戶外區域面積坪數'

  return Object.keys(errors.value).length === 0
}

function goBack() {
  router.push('/freelancer-info')
}

//  圖片上傳
const upload = ref(null)

const filter = (newFile, oldFile, prevent) => {
  if (!newFile || !newFile.file) return

  if (!/\.(jpeg|jpg|png)$/i.test(newFile.name)) {
    alert('格式錯誤')
    remove(newFile)
    prevent()
    return
  }

  if (newFile.size / 1024 / 1024 > 5) {
    alert('图片大小不能超过5MB')
    remove(newFile)
    prevent()
    return
  }
  // 創建 blob 字段 用於圖片預覽
  const URL = window.URL || window.webkitURL
  newFile.blob = URL.createObjectURL(newFile.file)
  //圖片上傳中
  newFile.uploading = true
}

const handleInput = async (newFile) => {
  if (!newFile || !newFile.file) return

  if (newFile.size / 1024 / 1024 > 5) {
    alert('檔案不能超過 5MB')
    remove(newFile)
    return
  }

  const formData = new FormData()
  formData.append('file', newFile.file)

  try {
    const res = await uploadImage(formData)
    const imageUrl = res?.image_url
    // 把圖片上傳後的 URL 設進 file 中，這樣就會存在 form.avatar 裡
    newFile.url = imageUrl
    newFile.uploading = false // 圖片上傳完成
  } catch (err) {
    console.error('圖片上傳失敗:', err)
    alert('圖片上傳失敗，請重試')
    remove(newFile) //移除這筆失敗的檔案
  }
}

const remove = (file) => {
  const index = form.value.images.findIndex((f) => f.url === file.url)
  if (index !== -1) {
    form.value.images.splice(index, 1)
  }
}

//整理圖片入參網址
const getImageUrls = (fileList = []) => {
  return fileList
    .map((file) => file?.url || '') // 取得 .url 屬性
    .filter((url) => typeof url === 'string' && url.trim() !== '') // 過濾掉空字串、null、undefined
}
</script>
<style scoped lang="scss">
.form-label {
  font-weight: 700;
  color: $primary-dark-second;
  &.required::before {
    content: '*';
    color: red;
    margin-right: 4px;
  }
}
.form-control,
.form-select,
.form-control-sm {
  display: block;
  color: $primary-dark-second;
  border: 1px solid $primary-dark;
  height: 40px;
  border-radius: 100px;
  background-color: transparent;

  &:focus {
    color: $primary-dark-second;
    background-color: transparent;
    border-color: rgb(245.5, 219.5, 196.5);
    outline: 0;
    box-shadow: 0 0 0 0.25rem rgba(236, 184, 138, 0.25);
  }

  &:disabled {
    background-color: $black-100;
  }
}

textarea.form-control {
  height: 140px;
  border-radius: 8px;
  max-width: 100%;
  @media (min-width: 768px) {
    max-width: 500px;
  }
}
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 20px;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
}
.image-uploader {
  display: flex;
  flex-wrap: wrap;
}
.img-box {
  width: 160px;
  height: 160px;
  margin: 10px 5px;
  position: relative;
  @media (min-width: 768px) {
    width: 240px;
    height: 240px;
  }
}
img {
  width: 100%;
  height: 100%;
  border-radius: 20px;
  object-fit: cover;
}
.close {
  cursor: pointer;
  position: absolute;
  top: -5px;
  right: -5px;
  background: red;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  .icon-close {
    position: absolute;
    color: #ffffff;
    z-index: 1;
    top: -8px;
    left: 5px;
    font-size: 20px;
  }
}
.upload {
  border-radius: 20px;
  border: 1px dashed $primary-dark;
  display: flex;
  justify-content: center;
  align-items: center;
}
.upload-icon {
  color: $primary-dark;
  font-size: 20px;
  width: 24px;
  height: 24px;
  line-height: 15px;
}
</style>
