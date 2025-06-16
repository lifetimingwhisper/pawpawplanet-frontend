<script setup>
import { onMounted, ref, reactive, computed } from 'vue'
import Modal from 'bootstrap/js/dist/modal'
import FileUpload from 'vue-upload-component'
import { uploadImage } from '@/plugins/api/upload/upload.js'
import cityData from '@/utils/city.json'

const prop = defineProps({
  title: String,
  ownerData: Object,
})

const emit = defineEmits(['submitOwner'])

let modal_owner_ref = ref(null)
let ownerModal

// 用 reactive() 來綁定所有表單欄位
const updatedOwner = reactive({
  name: '',
  city: '',
  area: '',
  phone: '',
  // email: '',
  description: '',
  avatar: [],
})

const cityAreaMap = computed(() => {
  const map = {}
  cityData.forEach((item) => {
    map[item.city] = item.area
  })
  return map
})

const availableAreas = computed(() => {
  return cityAreaMap.value[updatedOwner.city] || []
})

const isFormValid = computed(() => {
  return (
    updatedOwner.name.trim() !== '' &&
    updatedOwner.phone.trim() !== '' &&
    updatedOwner.city.trim() !== '' &&
    updatedOwner.area.trim() !== ''
  )
})

onMounted(() => {
  ownerModal = new Modal(modal_owner_ref.value)
  const ModalEl = document.getElementById(prop.title)
  ModalEl.addEventListener('hide.bs.modal', () => {
    document.activeElement?.blur()
  })
})

function c_show() {
  updatedOwner.name = prop.ownerData?.name || ''
  updatedOwner.city = prop.ownerData?.city || ''
  updatedOwner.area = prop.ownerData?.area || ''
  updatedOwner.phone = prop.ownerData?.phone || ''
  updatedOwner.description = prop.ownerData?.description || ''
  //圖片返回資料整理，避免是null以及整理成套件要的資料格式
  updatedOwner.avatar = Array.isArray(prop.ownerData?.avatar)
    ? prop.ownerData.avatar.map((url) => ({ url, blob: null }))
    : []

  ownerModal.show()
}

function submitForm() {
  // 使用 emit 來傳遞資料
  emit('submitOwner', { ...updatedOwner })
}

defineExpose({ p_show: c_show })
//  圖片上傳
const ownerUpload = ref(null)

const ownerFilter = (newFile, oldFile, prevent) => {
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

const handleOwnerInput = async (newFile) => {
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
  const index = updatedOwner.avatar.findIndex((f) => f.url === file.url)
  if (index !== -1) {
    updatedOwner.avatar.splice(index, 1)
  }
}
</script>

<template>
  <div
    class="modal fade"
    ref="modal_owner_ref"
    :id="title"
    tabindex="-1"
    :aria-labelledby="title + 'Label'"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-body">
          <div class="container-fluid">
            <h5 class="modal-title flex-center mb-3" :id="title + 'Label'">
              <slot name="body"></slot>
            </h5>
            <div class="row">
              <div class="col-lg-6 text-center position-relative">
                <div class="image-uploader">
                  <div class="img-box" v-for="(file, index) in updatedOwner.avatar" :key="index">
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
                    v-if="updatedOwner.avatar?.length < 1 && ownerModal?._isShown"
                    ref="ownerUpload"
                    v-model="updatedOwner.avatar"
                    :multiple="false"
                    :maximum="1"
                    accept="image/png,image/jpeg,image/jpg"
                    extensions="jpg,png,jpeg"
                    @input-file="handleOwnerInput"
                    @input-filter="ownerFilter"
                  >
                    <div class="img-box upload">
                      <span class="upload-icon">+</span>
                    </div>
                  </FileUpload>
                </div>
                <p v-show="updatedOwner.avatar?.length < 1" class="flex-center upload-btn">
                  [上傳照片]
                </p>
              </div>
              <div class="col-lg-6">
                <div class="mb-3 row">
                  <label for="input1" class="col-lg-4 col-form-label">飼主名稱:</label>
                  <div class="col-lg-8">
                    <input
                      type="text"
                      v-model="updatedOwner.name"
                      class="form-control"
                      :class="{ 'is-invalid': updatedOwner.name.trim() === '' }"
                      placeholder="請輸入飼主名字"
                      id="input1"
                    />
                  </div>
                </div>
                <div class="mb-3 row">
                  <label for="input2" class="col-lg-4 col-form-label">所在縣市:</label>
                  <div class="col-lg-8">
                    <select
                      v-model="updatedOwner.city"
                      class="form-select"
                      aria-label="Default select example"
                      id="input2"
                    >
                      <!-- <option selected>選擇縣市</option> -->
                      <option disabled value="">請選擇縣市</option>
                      <option v-for="item in cityData" :key="item.city" :value="item.city">
                        {{ item.city }}
                      </option>
                    </select>
                  </div>
                </div>
                <div class="mb-3 row">
                  <label
                    for="input2"
                    class="col-lg-4 col-form-label"
                    :class="{ 'is-invalid': updatedOwner.name.trim() === '' }"
                    >所在地區:</label
                  >
                  <div class="col-lg-8">
                    <select
                      v-model="updatedOwner.area"
                      class="form-select"
                      aria-label="Default select example"
                      id="input2"
                    >
                      <option v-for="area in availableAreas" :key="area" :value="area">
                        {{ area }}
                      </option>
                    </select>
                  </div>
                </div>
                <div class="mb-3 row">
                  <label for="input3" class="col-lg-4 col-form-label">電話:</label>
                  <div class="col-lg-8">
                    <input
                      type="text"
                      v-model="updatedOwner.phone"
                      class="form-control"
                      placeholder="請輸入電話"
                      id="input3"
                      :class="{ 'is-invalid': updatedOwner.name.trim() === '' }"
                    />
                  </div>
                </div>
                <!-- <div class="mb-3 row">
                  <label for="input4" class="col-lg-4 col-form-label">Email:</label>
                  <div class="col-lg-8">
                    <input type="text" v-model="updatedOwner.email" class="form-control" placeholder="請輸入email" id="input4">
                  </div>
                </div> -->
              </div>
            </div>
            <div class="row">
              <label for="input5" class="col-lg-3 col-form-label text-lg-end">自我介紹:</label>
              <div class="col-lg-9">
                <textarea
                  v-model="updatedOwner.description"
                  class="form-control"
                  placeholder="簡述與毛小孩的日常"
                  id="input5"
                  style="height: 100px"
                ></textarea>
              </div>
            </div>
            <div class="flex-center mt-5">
              <button
                class="btn btn-outline-dark btn-lg rounded-pill w-100"
                data-bs-dismiss="modal"
              >
                取消
              </button>
              <!-- <button class="btn btn-outline-dark btn-lg px-4" data-bs-dismiss="modal" 
               @click="submitForm" :disabled="!isFormValid">
                確定
              </button> -->
              <button
                class="btn btn-primary btn-lg rounded-pill w-100"
                data-bs-dismiss="modal"
                @click="submitForm"
                :disabled="!isFormValid"
              >
                確定
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
}
.upload-btn {
  cursor: pointer;
}
.image-uploader {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
.img-box {
  width: 100px;
  height: 100px;
  margin: 10px 0;
  position: relative;
}
img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
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
  border-radius: 50%;
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
