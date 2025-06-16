<template>
  <!-- 登入表單與 Icon -->
  <div class="container py-5">
    <div class="row">
      <!-- 左側：登入表單 -->
      <div class="col-md-8">
        <h1>登入</h1>
        <form @submit.prevent="submitForm">
          <div class="mb-3">
            <label for="email" class="form-label">Email address<span class="text-danger">*</span></label>
            <input type="email" class="form-control" placeholder="請輸入您的 Email" id="email" v-model="email" required>
          </div>
          <div class="mb-3">
            <label for="password" class="form-label">Password<span class="text-danger">*</span></label>
            <input type="password" class="form-control" placeholder="請輸入您的密碼" id="password" v-model="password" required>
          </div>
          <div class="d-flex align-items-center mt-3">
            <button type="submit" class="btn btn-primary me-3">登入</button>
            <p v-if="errorMessage" class="text-danger mb-0">{{ errorMessage }}</p>
          </div>
        </form>
        <p class="text-danger mb-0 mt-3">
          還沒有帳號?
          <router-link to="/signup" class="text-primary text-decoration-underline">立即註冊</router-link>
        </p>
      </div>

      <!-- 右側：Icon -->
      <div class="col-md-4 d-flex align-items-center justify-content-center">
        <SvgIcon name="paw" color="#FFCF75" :size="80" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { loginUser, GetOwnerProfile } from '@/plugins/api/users/users.js';
import { useLoginStore } from '@/stores/login.js'
import { useToast } from '@/plugins/toast/toast-plugin.js'

const email = ref('');
const password = ref('');
const errorMessage = ref('');
const router = useRouter();
const { changeLoginStatus, saveUserInfo } = useLoginStore()
const toast = useToast()


const submitForm = async () => {

  errorMessage.value = '';

  const formData = {
    email: email.value,
    password: password.value,

  };

    console.log("formData:", formData);

    try {
      const data = await loginUser(formData);
      console.log('登入成功:', data);
      const token = data.token;
      console.log("test token:",token);
      localStorage.setItem('token', token);
      changeLoginStatus(true)
      toast.show('登入成功', 'success')
      //console.log("test token:", localStorage.getItem('token'));
      //alert('登入成功 !');
      //router.push('/ownerprofile');
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(decodeURIComponent(escape(window.atob(base64))));
      console.log('解析後的 payload:', payload);
      await getUserInfo()
      if (payload.role === 'owner') {
        await router.push('/ownerprofile');
      } else if (payload.role === 'freelancer') {
        await router.push('/freelancer-info');
      } else {
        console.warn('未知角色:', payload.role);
        errorMessage.value = '無法識別使用者角色';
      }
    } catch (error) {
      console.error('登入失敗:', error.response?.data || error.message);
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage.value = error.response.data.message;
      } else {
        errorMessage.value = '登入失敗，請稍後再試。';
      }
    }
  };

const getUserInfo = async () => {
  const { user } = await GetOwnerProfile()
  const userInfo = {
    name: user.name,
    avatar: user.avatar,
    role: user.role,
  }
  localStorage.setItem('user_info', JSON.stringify(userInfo))
  saveUserInfo(userInfo)
}

</script>
