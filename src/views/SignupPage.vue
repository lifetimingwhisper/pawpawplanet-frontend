<template>
  <!-- 註冊表單 + Icon -->
  <div class="container py-5">
    <div class="row">
      <!-- 左側：註冊表單 -->
      <div class="col-md-8">
        <h1>註冊</h1>
        <form @submit.prevent="submitForm">
          <div class="mb-3">
            <label for="email" class="form-label">Email address<span class="text-danger">*</span></label>
            <input type="email" class="form-control" placeholder="請輸入您的 Email" id="email" v-model="email" required>
          </div>
          <div class="mb-3">
            <label for="password" class="form-label">密碼<span class="text-danger">*</span></label>
            <input type="password" class="form-control" placeholder="密碼需包含至少 8 個字元並包含英文與數字" id="password" v-model="password" required>
<!--            <div class="form-text">密碼需包含至少 8 個字元並包含英文與數字</div>-->
          </div>
          <div class="mb-3">
            <label for="confirmPassword" class="form-label">確認密碼<span class="text-danger">*</span></label>
            <input type="password" class="form-control" placeholder="密碼需包含至少 8 個字元並包含英文與數字" id="confirmPassword" v-model="confirmPassword" required>
          </div>
          <div class="mb-3">
            <label class="form-label d-block">選擇身分<span class="text-danger">*</span>
            </label>
            <div class="form-check form-check-inline">
              <input class="form-check-input" type="radio" id="roleEmployer" name="role" value="owner" v-model="role">
              <label class="form-check-label" for="roleEmployer">飼主</label>
            </div>
            <div class="form-check form-check-inline">
              <input class="form-check-input" type="radio" id="roleContractor" name="role" value="freelancer" v-model="role">
              <label class="form-check-label" for="roleContractor">接案者</label>
            </div>
          </div>
          <button type="submit" class="btn btn-primary">註冊</button>
        </form>
        <p v-if="errorMessage" class="text-danger mt-3">{{ errorMessage }}</p>
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
  import { registerUser } from '@/plugins/api/users/users.js'; // 引入註冊 API 函數

  const email = ref('');
  const password = ref('');
  const confirmPassword = ref('');
  const role = ref('owner');
  const errorMessage = ref('');

  const router = useRouter();



  const submitForm = async () => {
     errorMessage.value = '';

    if (password.value !== confirmPassword.value) {
      errorMessage.value = '密碼和確認密碼不一致';
      return;
    }

    const formData = {
      email: email.value,
      password: password.value,
      confirmPassword: confirmPassword.value,
      role: role.value,
    };

    //console.log("formData:", formData);

    try {
      const data = await registerUser(formData);
      console.log('註冊成功:', data);
      alert('註冊成功！');
      await router.push('/login');
    } catch (error) {
      console.error('註冊失敗:', error.response?.data || error.message);
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage.value = error.response.data.message;
      } else {
        errorMessage.value = '註冊失敗，請稍後再試。';
      }
    }
  };
  </script>
