<script setup>
import Modal from '@/components/modal/owner-modal.vue'
import PetModal from '@/components/modal/owner-pet-modal.vue'
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { PatchOwnerProfile, GetOwnerProfile } from '@/plugins/api/users/users.js'
import { getPet, postPet, patchPet } from '@/plugins/api/pets/pets.js'
import { useLoginStore } from '@/stores/login.js'
import { useToast } from '@/plugins/toast/toast-plugin.js'

const { saveUserInfo } = useLoginStore()

const toast = useToast()
const loading = ref(true)
const router = useRouter()
const thisModal = ref()
const thisPetModal = ref()
const owner = ref({})
const petData = ref(null)
const hasPet = ref(null)
const petCardData = reactive({
  name: null,
  species_id: null,
  gender: null,
  birthday: null,
  is_ligation: null,
  size_id: null,
  avatar: null,
})
const formatSpecies = computed(() => {
  const mapping = { 0: '貓', 1: '狗' }
  return mapping[petData.value.species_id] || null
})
const formatGender = computed(() => {
  const mapping = { 0: '男', 1: '女' }
  return mapping[petData.value.gender] || null
})
const formatIs_ligation = computed(() => {
  const mapping = { true: '是', false: '否' }
  return mapping[petData.value.is_ligation] || null
})
const formatSize = computed(() => {
  const mapping = { 0: '小型-10公斤以下', 1: '中型-10公斤以上，20公斤以下', 2: '大型-20公斤以上' }
  return mapping[petData.value.size_id] || null
})
let petCardContents = [
  {name: '種類', key: 'species_id'},
  {name: '性別', key: 'gender'},
  {name: '出生年月日', key: 'birthday'},
  {name: '是否結紮', key: 'is_ligation'},
  {name: '體型', key: 'size_id'}
]

const editProfile = () => {
  // alert('進入編輯模式')
  showModal()
}

const addPetProfile = () => {
  // alert('跳轉新增毛小孩頁面')
  showPetModal()
}

const submitOwner = async (data) => {
  try {
    const updatedOwner = {
      ...data,
      avatar: getImageUrls(data.avatar),
    }
    //console.log("送出資料：", updatedOwner)
    const response = await PatchOwnerProfile(updatedOwner)
    //console.log('送出成功:', response.data);
    toast.show('更新成功', 'success')
    //thisModal.value.p_hide(); // 關閉 Modal
    owner.value = Object.assign({}, owner.value, updatedOwner)
    localStorage.setItem('user_info', JSON.stringify(owner.value))
    saveUserInfo(owner.value)
  } catch (error) {
    //console.error('送出失敗:', error);
    toast.show('更新失敗，請稍後再試。', 'error')
  }
}

const submitPet = async (rawData) => {
  console.log('submitPet')
  const data = {
    ...rawData,
    avatar: rawData.avatar?.[0]?.url || '',
  }
  let postPetData
  try {
    if (!hasPet.value) postPetData = await postPet(data)
    else postPetData = await patchPet(data)
    // console.log(postPetData);
    petData.value = postPetData
    hasPet.value = true
    updatePetCard()
  } catch (error) {
    console.error('寵物送出失敗:', error)
  }
}

const updatePetCard = () => {
  petCardData.name = petData.value.name
  petCardData.birthday = petData.value.birthday
  petCardData.avatar = petData.value.avatar
  petCardData.species_id = formatSpecies.value
  petCardData.gender = formatGender.value
  petCardData.is_ligation = formatIs_ligation.value
  petCardData.size_id = formatSize.value
}

onMounted(async () => {
  const loginStore = useLoginStore()
  if (!loginStore.is_login || loginStore.user.role !== 'owner') {
    await router.push('/login')
    return
  }

  try {
    const response = await GetOwnerProfile()
    console.log(response)
    owner.value = response.user
    //console.log("取得的 owner:", owner.value);
  } catch (err) {
    console.error('取得個人資料失敗:', err)
    err.value = '無法取得個人資料，請稍後再試。'
  } finally {
    loading.value = false
  }

  try {
    const getPetData = await getPet()
    petData.value = getPetData.pet !== null ? getPetData.pet : petData.value
    // console.log(petData.value);
    hasPet.value = getPetData.pet === null ? false : true
    if (hasPet.value) updatePetCard()
  } catch (err) {
    console.log('錯誤寵物get"', err)
  }
})

function showModal() {
  console.log('Modal打開')
  thisModal.value.p_show()
}
function showPetModal() {
  console.log('PetModal打開')
  thisPetModal.value.p_show()
}
//整理圖片入參網址
const getImageUrls = (fileList = []) => {
  return fileList
    .map((file) => file?.url || '') // 取得 .url 屬性
    .filter((url) => typeof url === 'string' && url.trim() !== '') // 過濾掉空字串、null、undefined
}
</script>
<template>
  <main>
    <div class="container py-5">
      <h2 class="text-center mb-4">飼主及毛小孩個人中心</h2>
      <div class="card mx-auto p-4" style="max-width: 700px; border-radius: 20px">
        <div class="d-flex flex-column flex-md-row">
          <img
            v-if="owner?.avatar?.length"
            :src="owner.avatar"
            alt="飼主照片"
            class="rounded img-fluid me-md-4 mb-3 mb-md-0"
            style="max-width: 250px; height: auto"
          />
          <div class="flex-fill">
            <div class="text-end">
              <button class="btn btn-outline-secondary btn-sm" @click="editProfile">
                <i class="bi bi-pencil-square"></i>
              </button>
            </div>

            <div class="owner-info-grid">
              <div class="label">飼主名稱｜</div>
              <div class="value">{{ owner.name }}</div>

              <div class="label">所在縣市｜</div>
              <div class="value">{{ owner.city }}</div>

              <div class="label">所在地區｜</div>
              <div class="value">{{ owner.area }}</div>

              <div class="label">電話｜</div>
              <div class="value">{{ owner.phone }}</div>

              <div class="label">Email｜</div>
              <div class="value">{{ !loading && owner.email ? owner.email : '' }}</div>

              <div class="label">自我介紹｜</div>
              <div class="value">{{ owner.description }}</div>
            </div>
            <!-- <p>飼主名稱:{{ owner.name }}</p>
            <p><strong>所在縣市:</strong>{{ owner.city }}</p>
            <p><strong>所在地區:</strong>{{ owner.area }}</p>
            <p><strong>電話:</strong>{{ owner.phone }}</p>
            <div v-if="!loading && owner.email">
              <p><strong>Email:</strong>{{ owner.email }}</p>
            </div>
            <p><strong>自我介紹:</strong>{{ owner.description }}</p> -->
          </div>
        </div>
      </div>

      <div class="text-center mt-4" v-if="!hasPet">
        <button class="btn btn-success rounded-pill px-4 py-2" @click="addPetProfile">
          <i class="bi bi-plus-circle me-2"></i>新增毛小孩資訊
        </button>
      </div>

      <div class="mt-5" v-if="hasPet">
        <div class="card mx-auto p-4" style="max-width: 700px; border-radius: 20px">
          <div class="d-flex flex-column flex-md-row align-items-center align-items-md-start">
            <div class="order-0 order-md-2 mb-3 ms-auto">
              <button class="btn btn-outline-secondary btn-sm" @click="addPetProfile">
                <i class="bi bi-pencil"></i>
              </button>
            </div>
            <div class="text-center avatar-width me-0 me-md-3 mb-3 mb-md-0">
              <img
                v-if="petCardData.avatar"
                :src="petCardData.avatar"
                alt="毛小孩照片"
                class="rounded-circle avatar"
              />
              <p class="text-break">{{ petCardData.name }}</p>
            </div>
            <div>
              <div class="row gy-2">
                <template v-for="content in petCardContents" :key="content">
                  <div class="col-6 col-md-4 text-end">
                    <p>{{ content.name }}<span>｜</span></p>
                  </div>
                  <div class="col-6 col-md-8 ps-0">
                    <p>{{ petCardData[content.key] }}</p>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Modal title="modal1" ref="thisModal" :ownerData="owner" @submit-owner="submitOwner">
      <template #body>編輯 個人資訊</template>
    </Modal>
    <PetModal
      title="petModal1"
      ref="thisPetModal"
      :hasPet="hasPet"
      :getPetData="petData"
      @submit-pet="submitPet"
    >
      <template #body>新增毛小孩資訊</template>
    </PetModal>
  </main>
</template>
<style scoped>
.card {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
.owner-info-grid {
  display: grid;
  grid-template-columns: 1fr 2fr;
  row-gap: 8px;
  column-gap: 12px;
  align-items: start;
}

.label {
  text-align: right;
  white-space: nowrap;
}

.value {
  text-align: left;
  word-break: break-word;
}

.avatar {
    width: 160px;
    height: 160px;
    object-fit: cover;
    background-color: rgb(249, 234, 220);
  }
.avatar-width {
  width: 160px;
  /* $primary-dark-second */
}
</style>
