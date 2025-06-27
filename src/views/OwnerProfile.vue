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

let ownerCardContents = [
  {name: '所在縣市', key: 'city'},
  {name: '所在地區', key: 'area'},
  {name: '電話', key: 'phone'},
  {name: 'Email', key: 'email'},
  {name: '自我介紹', key: 'description'}
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
      <div class="card border-dark-second mx-auto p-4">
        <div class="d-flex flex-column flex-md-row align-items-center align-items-md-start">
          <div class="order-0 order-md-2 mb-3 ms-auto">
            <button class="btn btn-outline-secondary btn-sm" @click="editProfile">
              <i class="bi bi-pencil"></i>
            </button>
          </div>
          <div class="text-center avatar-width me-0 me-md-3 mb-3 mb-md-0">
            <img
              v-if="owner?.avatar?.length"
              :src="owner.avatar"
              alt="飼主照片"
              class="rounded-circle avatar"
            />
            <SvgIcon v-if="!owner?.avatar?.length" name="user" class="rounded-circle avatar" color="#452B14"/>
            <p class="text-break">{{ owner.name }}</p>
          </div>
          <div class="w-100">
            <div class="grid-columns gap-2">
              <template v-for="item in ownerCardContents" :key="item">
                <p class="text-nowrap text-end">{{ item.name }}｜</p>
                <p class="text-break">{{ owner[item.key] }}</p>
              </template>
            </div>
          </div>
        </div>
      </div>

      <div class="position-relative">
        <hr class="border-dark-second mt-5 my-3">
        <div class="position-absolute top-0 start-50 translate-middle">
          <div class="text-brown fw-bold hr-content p-2" style="background: #FFECC8; color: #452B14;">您的毛小孩</div>
        </div>
      </div>

      <div class="text-center mt-4" v-if="!hasPet">
        <button class="btn btn-primary rounded-pill px-4 py-2" @click="addPetProfile">
          <i class="bi bi-plus-circle me-2"></i>新增毛小孩資訊
        </button>
      </div>

      <div v-if="hasPet" class="card border-dark-second mx-auto p-4 mt-5">
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
            <SvgIcon v-if="!petCardData.avatar" name="user" class="rounded-circle avatar" color="#452B14"/>
            <p class="text-break">{{ petCardData.name }}</p>
          </div>
          <div class="w-100">
            <div class="grid-columns gap-2">
              <template v-for="item in petCardContents" :key="item">
                <p class="text-nowrap text-end">{{ item.name }}｜</p>
                <p class="text-break">{{ petCardData[item.key] }}</p>
              </template>
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
    max-width: 700px;
    border-radius: 20px;
  }
  .grid-columns {
    display: grid;
    grid-template-columns: 0fr 1fr;
  }
  .avatar {
      width: 160px;
      height: 160px;
      object-fit: cover;
      background-color: rgb(249, 234, 220);
    }
  .avatar-width {
    width: 160px;
  }
  .border-dark-second{
    border-color: #452B14;
  }
</style>
