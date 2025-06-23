<script setup>
import { onMounted, ref, reactive } from 'vue'
import Modal from 'bootstrap/js/dist/modal'
import FileUpload from 'vue-upload-component'
import { uploadImage } from '@/plugins/api/upload/upload.js'
import { useToast } from '@/plugins/toast/toast-plugin.js'

const toast = useToast()
const prop = defineProps({
  title: String,
  hasPet: Boolean,
  getPetData: Object,
})
const emit = defineEmits(['submitPet'])

let modal_pet_ref = ref(null)
let petModal

const petData = reactive({
  owner_id: '',
  name: '',
  species_id: '',
  gender: '',
  birthday: '',
  is_ligation: '',
  size_id: '',
  personality_description: '',
  health_description: '',
  note: '',
  avatar: [],
})

const formErrorCheck = reactive({
  name: false,
  species_id: false,
  gender: false,
  birthday: false,
  is_ligation: false,
  size_id: false,
  personality_description: false,
  health_description: false,
  note: false,
  avatar: false,
})

const formErrorMsg = reactive({
  name: '名稱格式錯誤',
  species_id: '種類格式錯誤',
  gender: '性別格式錯誤',
  birthday: '出生年月日格式錯誤',
  is_ligation: '是否結紮格式錯誤',
  size_id: '體型格式錯誤',
  personality_description: '性格描述格式錯誤',
  health_description: '健康狀況格式錯誤',
  note: '特殊需求與注意事項格式錯誤',
  avatar: '照片格式錯誤',
})

const species = [
  { id: 0, name: '貓' },
  { id: 1, name: '狗' },
]
const sizes = [
  { id: 0, name: '小型-10公斤以下' },
  { id: 1, name: '中型-10公斤以上，20公斤以下' },
  { id: 2, name: '大型-20公斤以上' },
]

function validateNotRequired(value) {
  return value.length === 0
}

function validateNotDate(value) {
  return !value.match(/^\d{4}-\d{2}-\d{2}$/)
}

const validateForm = () => {
  if (validateNotRequired(petData.name)) formErrorCheck.name = true
  else formErrorCheck.name = false
  if (validateNotRequired(petData.species_id)) formErrorCheck.species_id = true
  else formErrorCheck.species_id = false
  if (validateNotRequired(petData.gender)) formErrorCheck.gender = true
  else formErrorCheck.gender = false
  if (validateNotRequired(petData.birthday) || validateNotDate(petData.birthday))
    formErrorCheck.birthday = true
  else formErrorCheck.birthday = false
  if (validateNotRequired(petData.is_ligation)) formErrorCheck.is_ligation = true
  else formErrorCheck.is_ligation = false
  if (validateNotRequired(petData.size_id)) formErrorCheck.size_id = true
  else formErrorCheck.size_id = false

  const hasErrors = Object.values(formErrorCheck).some((error) => error)
  if (hasErrors) {
    console.log('有錯誤，阻止提交')
  } else {
    console.log('表單可提交')
    emit('submitPet', petData)
    petModal.hide()
  }
}

function submitForm() {
  validateForm()
}

onMounted(() => {
  petModal = new Modal(modal_pet_ref.value)
  const ModalEl = document.getElementById(prop.title)
  ModalEl.addEventListener('hide.bs.modal', () => {
    // 強制把焦點移出 modal，避免 aria-hidden 焦點衝突
    document.activeElement?.blur()
  })
})

function c_show() {
  if (prop.hasPet) Object.assign(petData, prop.getPetData)

  //圖片返回資料整理，避免是null以及整理成套件要的資料格式
  const avatar = prop.getPetData?.avatar
  petData.avatar =
    typeof avatar === 'string' && avatar.trim()
      ? [{ url: avatar.trim(), blob: null }]
      : Array.isArray(avatar)
        ? avatar.map((url) => ({ url, blob: null }))
        : []

  petModal.show()
}

defineExpose({ p_show: c_show })

//  圖片上傳
const upload = ref(null)

const petFilter = (newFile, oldFile, prevent) => {
  if (!newFile || !newFile.file) return

  if (!/\.(jpeg|jpg|png)$/i.test(newFile.name)) {
    toast.show('格式錯誤', 'error')
    remove(newFile)
    prevent()
    return
  }

  if (newFile.size / 1024 / 1024 > 5) {
    toast.show('图片大小不能超过5MB', 'error')
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

const handlePetInput = async (newFile) => {
  if (!newFile || !newFile.file) return
  if (newFile.size / 1024 / 1024 > 5) {
    toast.show('檔案不能超過 5MB', 'error')
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
    toast.show('圖片上傳失敗，請重試', 'error')
    remove(newFile) //移除這筆失敗的檔案
  }
}

const remove = (file) => {
  const index = petData.avatar.findIndex((f) => f.url === file.url)
  if (index !== -1) {
    petData.avatar.splice(index, 1)
  }
}
</script>
<template>
  <div
    class="modal fade"
    ref="modal_pet_ref"
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
              <div class="col-lg-3 text-center position-relative">
                <div class="image-uploader">
                  <div class="img-box" v-for="(file, index) in petData.avatar" :key="index">
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
                    v-if="petData.avatar?.length < 1 && petModal?._isShown"
                    ref="petUpload"
                    v-model="petData.avatar"
                    :multiple="false"
                    :maximum="1"
                    accept="image/png,image/jpeg,image/jpg"
                    extensions="jpg,png,jpeg"
                    @input-file="handlePetInput"
                    @input-filter="petFilter"
                  >
                    <div class="img-box upload">
                      <span class="upload-icon">+</span>
                    </div>
                  </FileUpload>
                </div>
                <p v-show="petData.avatar?.length < 1" class="flex-center upload-btn">[上傳照片]</p>
                <input
                  id="avatar"
                  type="hidden"
                  :class="{ 'is-invalid': formErrorCheck.avatar }"
                  v-model="petData.avatar"
                />
                <div v-if="formErrorCheck.avatar" class="invalid-feedback text-center">
                  {{ formErrorMsg.avatar }}
                </div>
              </div>
              <div class="col-lg-9">
                <div class="mb-3 row">
                  <label for="name" class="col-3 col-form-label text-lg-end">名稱</label>
                  <div class="col-9">
                    <input
                      id="name"
                      type="text"
                      class="form-control"
                      :class="{ 'is-invalid': formErrorCheck.name }"
                      placeholder="請輸入寵物名稱"
                      v-model="petData.name"
                    />
                    <div v-if="formErrorCheck.name" class="invalid-feedback">
                      {{ formErrorMsg.name }}
                    </div>
                  </div>
                </div>

                <div class="mb-3 row">
                  <label for="species" class="col-3 col-form-label text-lg-end">種類</label>
                  <div class="col-9">
                    <select
                      id="species"
                      class="form-select"
                      :class="{ 'is-invalid': formErrorCheck.species_id }"
                      v-model="petData.species_id"
                    >
                      <option value="">請選擇寵物種類</option>
                      <option v-for="specie in species" :key="specie" :value="specie.id">
                        {{ specie.name }}
                      </option>
                    </select>
                    <div v-if="formErrorCheck.species_id" class="invalid-feedback">
                      {{ formErrorMsg.species_id }}
                    </div>
                  </div>
                </div>

                <div class="mb-3 row">
                  <label for="gender" class="col-3 col-form-label text-lg-end">性別</label>
                  <div class="col-9">
                    <div :class="{ 'is-invalid': formErrorCheck.gender }">
                      <div class="form-check form-check-inline">
                        <input
                          id="genderRadio1"
                          type="radio"
                          class="form-check-input"
                          :class="{ 'is-invalid': formErrorCheck.gender }"
                          :value="0"
                          v-model="petData.gender"
                        />
                        <label for="genderRadio1" class="form-check-label">男</label>
                      </div>
                      <div class="form-check form-check-inline">
                        <input
                          id="genderRadio2"
                          type="radio"
                          class="form-check-input"
                          :class="{ 'is-invalid': formErrorCheck.gender }"
                          :value="1"
                          v-model="petData.gender"
                        />
                        <label for="genderRadio2" class="form-check-label">女</label>
                      </div>
                    </div>
                    <div v-if="formErrorCheck.gender" class="invalid-feedback">
                      {{ formErrorMsg.gender }}
                    </div>
                  </div>
                </div>

                <div class="mb-3 row">
                  <label for="birthday" class="col-3 col-form-label text-lg-end">出生年月日</label>
                  <div class="col-9">
                    <input
                      id="birthday"
                      type="text"
                      class="form-control"
                      :class="{ 'is-invalid': formErrorCheck.birthday }"
                      placeholder="請輸入出生年月日,例如:'2000-01-01'"
                      v-model="petData.birthday"
                    />
                    <div v-if="formErrorCheck.birthday" class="invalid-feedback">
                      {{ formErrorMsg.birthday }}
                    </div>
                  </div>
                </div>

                <div class="mb-3 row">
                  <label for="is_ligation" class="col-3 col-form-label text-lg-end">是否結紮</label>
                  <div class="col-9">
                    <div :class="{ 'is-invalid': formErrorCheck.is_ligation }">
                      <div class="form-check form-check-inline">
                        <input
                          id="is_ligationRadio1"
                          type="radio"
                          class="form-check-input"
                          :class="{ 'is-invalid': formErrorCheck.is_ligation }"
                          :value="true"
                          v-model="petData.is_ligation"
                        />
                        <label for="is_ligationRadio1" class="form-check-label">是</label>
                      </div>
                      <div class="form-check form-check-inline">
                        <input
                          id="is_ligationRadio2"
                          type="radio"
                          class="form-check-input"
                          :class="{ 'is-invalid': formErrorCheck.is_ligation }"
                          :value="false"
                          v-model="petData.is_ligation"
                        />
                        <label for="is_ligationRadio2" class="form-check-label">否</label>
                      </div>
                    </div>
                    <div v-if="formErrorCheck.is_ligation" class="invalid-feedback">
                      {{ formErrorMsg.is_ligation }}
                    </div>
                  </div>
                </div>

                <div class="mb-3 row">
                  <label for="size" class="col-3 col-form-label text-lg-end">體型</label>
                  <div class="col-9">
                    <select
                      id="size"
                      class="form-select"
                      :class="{ 'is-invalid': formErrorCheck.size_id }"
                      v-model="petData.size_id"
                    >
                      <option value="">請選擇寵物體型</option>
                      <option v-for="size in sizes" :key="size" :value="size.id">
                        {{ size.name }}
                      </option>
                    </select>
                    <div v-if="formErrorCheck.size_id" class="invalid-feedback">
                      {{ formErrorMsg.size_id }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div>
                <label for="personality_description" class="col-form-label text-lg-end"
                  >性格描述</label
                >
                <textarea
                  id="personality_description"
                  class="form-control"
                  :class="{ 'is-invalid': formErrorCheck.personality_description }"
                  style="height: 100px"
                  placeholder="簡述毛小孩的性格描述"
                  v-model="petData.personality_description"
                ></textarea>
                <div v-if="formErrorCheck.personality_description" class="invalid-feedback">
                  {{ formErrorMsg.personality_description }}
                </div>
              </div>

              <div>
                <label for="health_description" class="col-form-label text-lg-end">健康狀況</label>
                <textarea
                  id="health_description"
                  class="form-control"
                  :class="{ 'is-invalid': formErrorCheck.health_description }"
                  style="height: 100px"
                  placeholder="簡述毛小孩的健康狀況"
                  v-model="petData.health_description"
                ></textarea>
                <div v-if="formErrorCheck.health_description" class="invalid-feedback">
                  {{ formErrorMsg.health_description }}
                </div>
              </div>

              <div>
                <label for="note" class="col-form-label text-lg-end">特殊需求與注意事項</label>
                <textarea
                  id="note"
                  class="form-control"
                  :class="{ 'is-invalid': formErrorCheck.note }"
                  style="height: 100px"
                  placeholder="簡述毛小孩的特殊需求與注意事項"
                  v-model="petData.note"
                ></textarea>
                <div v-if="formErrorCheck.note" class="invalid-feedback">
                  {{ formErrorMsg.note }}
                </div>
              </div>
            </div>
            <div class="row mt-5">
              <div class="col-6">
                <button
                  class="btn btn-outline-dark btn-lg rounded-pill w-100"
                  data-bs-dismiss="modal"
                >
                  取消
                </button>
              </div>
              <div class="col-6">
                <button class="btn btn-primary btn-lg rounded-pill w-100" @click="submitForm">
                  確定
                </button>
              </div>
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
