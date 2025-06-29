<script setup>
import ButtonComponent from '@/components/button/button-component.vue'
import { useLoginStore } from '@/stores/login.js'
import { storeToRefs } from 'pinia'
import { logoutUser } from '@/plugins/api/users/users.js'
import { useToast } from '@/plugins/toast/toast-plugin.js'
import { useRoute, useRouter } from 'vue-router'
import { ref } from 'vue'

defineProps({
  openMenu: {
    type: Boolean,
    required: true,
  },
})

const loginLoading = ref(false)

const emit = defineEmits(['onPress'])

const loginStore = useLoginStore()

const { is_login, user } = storeToRefs(loginStore)

const { removeLoginStatus, removeUserInfo } = loginStore

const router = useRouter()

const route = useRoute()

const toast = useToast()

const clickLink = () => {
  emit('onPress')
}

const clickLoginBtn = async () => {
  if (is_login.value) {
    loginLoading.value = true
    await logoutUser()
    loginLoading.value = false
    removeLoginStatus(false)
    removeUserInfo(false)
    toast.show('登出成功', 'success')
    if (route.meta.verification_required) await router.push('/')
    clickLink()
  } else {
    await router.push('/login')
    clickLink()
  }
}

const clickRegisterBtn = () => {
  router.push('/signup')
  clickLink()
}
</script>
<template>
  <Transition name="slide">
    <div v-show="openMenu" class="position-fixed header-menu flex-column justify-content-between">
      <div class="w-100">
        <SvgIcon name="paw_group" :size="56" color="#FFCF75" style="transform: scaleX(-1)" />
      </div>
      <ul class="header-menu-list d-flex align-items-center flex-column">
        <li>
          <RouterLink to="/service" @click="clickLink">
            <span class="d-inline-block">寵物日托</span>
          </RouterLink>
        </li>
        <li>
          <RouterLink to="/service?type=寵物散步" @click="clickLink">
            <span class="d-inline-block">寵物散步</span>
          </RouterLink>
        </li>
        <li>
          <RouterLink to="/service?type=寵物美容" @click="clickLink">
            <span class="d-inline-block">寵物美容</span>
          </RouterLink>
        </li>
        <li>
          <RouterLink to="/service?type=到府服務" @click="clickLink">
            <span class="d-inline-block">到府服務</span>
          </RouterLink>
        </li>
        <li v-if="user.role === 'owner' || !user.role">
          <RouterLink to="/become-a-sitter" @click="clickLink">
            <span class="d-inline-block">成為接案者</span>
          </RouterLink>
        </li>
        <li v-if="is_login">
          <RouterLink
            v-if="user && user.role"
            :to="user.role === 'owner' ? '/owner-order-list' : 'freelancer-order-list'"
            @click="clickLink"
          >
            <span class="d-inline-block">管理訂單</span>
          </RouterLink>
        </li>
      </ul>
      <div class="w-100 d-flex justify-content-end">
        <SvgIcon name="paw_group" :size="56" color="#FFCF75" />
      </div>
      <div class="row g-3">
        <div v-if="is_login" class="col-12">
          <RouterLink
            v-if="user && user.role"
            :to="user.role === 'freelancer' ? '/freelancer-info' : '/ownerprofile'"
            @click="clickLink"
          >
            <div class="d-flex align-center justify-content-center">
              <div class="header-avatar">
                <!--                  無上傳會員大頭貼預設 svg-->
                <SvgIcon v-if="!user?.avatar?.length" name="user" color="#452B14" size="20" />
                <!--                  上傳會員大頭貼顯示圖片-->
                <img v-else :src="user.avatar[0]" alt="" />
              </div>
              <div class="px-2 d-flex align-items-center">
                <!--                  無填寫會員名稱預設 會員-->
                <h4 class="header-name">{{ !user.name ? '會員' : user.name }}</h4>
              </div>
            </div>
          </RouterLink>
        </div>
        <div class="col-12">
          <ButtonComponent
            class="btn-primary"
            :text="is_login ? '登出' : '登入'"
            :loading="loginLoading"
            @on-press="clickLoginBtn"
          />
        </div>
        <div v-if="!is_login" class="col-12">
          <ButtonComponent
            class="btn-outline-dark-second"
            text="註冊"
            @on-press="clickRegisterBtn"
          />
        </div>
      </div>
    </div>
  </Transition>
</template>
