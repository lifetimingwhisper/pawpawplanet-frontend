<script setup>
import { useTemplateRef, ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useLoginStore } from '@/stores/login.js'
import { logoutUser } from '@/plugins/api/users/users.js'
import { useToast } from '@/plugins/toast/toast-plugin.js'


defineProps({
  openMenu: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits(['onPress'])

const router = useRouter()
const route = useRoute()
const toast = useToast()
const loginStore = useLoginStore()
const { is_login, user } = storeToRefs(loginStore)
const { removeLoginStatus, removeUserInfo } = loginStore
const open = ref(false)
const menu = useTemplateRef('header-menu')

const clickOtherElement = (e) => {
  if (!menu.value.contains(e.target)) {
    open.value = false
  }
}

const clickLoginBtn = async () => {
  if (is_login.value) {
    await logoutUser()
    removeLoginStatus(false)
    removeUserInfo(false)
    toast.show('登出成功', 'success')
    if (route.meta.verification_required) await router.push('/')
  } else {
    await router.push('/login')
  }
}

const clickRegisterBtn = () => {
  router.push('/signup')
}

const clickMenu = () => {
  emit('onPress')
}

onMounted(() => {
  window.addEventListener('click', clickOtherElement)
})
</script>
<template>
  <div class="header position-fixed top-0 w-100 bg-secondary-tint py-1-25">
    <div class="container">
      <div class="d-flex align-items-center justify-content-between">
        <RouterLink to="/">
          <img class="header-logo" src="@/assets/images/logo/logo.png" alt="">
        </RouterLink>
        <div class="d-lg-flex align-items-center d-none">
          <div class="px-2">
            <div class="dropdown">
              <button
                ref="header-menu"
                type="button"
                class="btn btn-link text-decoration-none text-primary-dark-second header-link fw-bold"
                id="dropdownMenuButton1"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                @click="open = !open"
              >
                <p>
                  服務內容
                </p>
                <SvgIcon
                  name="chevron_down"
                  color="#452B14"
                  :size="28"
                  style="transition: ease-in 0.2s"
                  :style="{
                    'transform': open ? 'rotate(-180deg)' : 'rotate(0deg)',
                  }"
                />
              </button>
              <ul class="dropdown-menu bg-secondary-tint border-primary-dark" :class="{ 'show': open }" aria-labelledby="dropdownMenuButton1">
                <li>
                  <RouterLink to="/service" class="dropdown-item">
                    <span class="d-inline-block">寵物寄宿</span>
                  </RouterLink>
                </li>
                <li>
                  <RouterLink to="/service?type=寵物散步" class="dropdown-item">
                    <span class="d-inline-block">寵物散步</span>
                  </RouterLink>
                </li>
                <li>
                  <RouterLink to="/service?type=寵物美容" class="dropdown-item">
                    <span class="d-inline-block">寵物美容</span>
                  </RouterLink>
                </li>
                <li>
                  <RouterLink to="/service?type=到府服務" class="dropdown-item">
                    <span class="d-inline-block">到府服務</span>
                  </RouterLink>
                </li>
              </ul>
            </div>
          </div>
          <div class="px-2">
            <RouterLink
              to="/become-a-sitter"
              class="btn text-decoration-none text-primary-dark-second header-link fw-bold"
            >
              成為接案者
            </RouterLink>
          </div>
          <div v-if="is_login">
            <RouterLink
              v-if="user && user.role"
              :to="user.role === 'owner' ? '/owner-order-list' : 'freelancer-order-list'"
              class="btn text-decoration-none text-primary-dark-second header-link fw-bold"
            >
              管理訂單
            </RouterLink>
          </div>
          <div class="px-2 d-flex align-items-center">
            <div class="px-2">
              <SvgIcon name="paw" color="#FFCF75" :size="28" />
            </div>
            <div v-if="is_login" class="px-2">
              <RouterLink
                v-if="user && user.role"
                :to="user.role === 'freelancer' ? '/freelancer-info' : '/ownerprofile'"
                class="d-flex align-items-center text-decoration-none"
              >
                <div class="header-avatar">
                  <!--                  無上傳會員大頭貼預設 svg-->
                  <SvgIcon v-if="!user?.avatar?.length" name="user" color="#452B14" size="20"/>
                  <!--                  上傳會員大頭貼顯示圖片-->
                  <img v-else :src="user.avatar[0]" alt="">
                </div>
                <div class="px-2">
<!--                  無填寫會員名稱預設 會員-->
                  <h4 class="header-name">{{ !user.name ? '會員' : user.name }}</h4>
                </div>
              </RouterLink>
            </div>
            <div class="px-2">
              <ButtonComponent class="btn-primary" :text="is_login ? '登出' : '登入'" @on-press="clickLoginBtn" />
            </div>
            <div v-if="!is_login" class="px-2">
              <ButtonComponent class="btn-outline-dark-second" text="註冊" @on-press="clickRegisterBtn" />
            </div>
          </div>
        </div>
        <button type="button" class="btn d-lg-none" @click="clickMenu">
          <div :class="{ 'open': openMenu }" id="nav-icon4">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>
