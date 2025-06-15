<script setup>
import { useRouter } from 'vue-router'
import { useLoginStore } from '@/stores/login.js'
import { useToast } from '@/plugins/toast/toast-plugin.js'

const loginStore = useLoginStore()
const toast = useToast()
const router = useRouter()

const registerToFreelancer = () => {
  if (loginStore.is_login) {
    if (loginStore.user.role === 'owner') {
      toast.show('您登入的帳號為飼主，請登出後再重新註冊為接案者')
    } else {
      toast.show('您登入的帳號已為接案者')
    }
  } else {
    router.push('/signup')
  }
}
</script>
<template>
  <main>
    <div class="banner position-absolute start-0 end-0 flex-center">
      <div class="text-center bg-light bg-opacity-50 p-3">
        <h1>成為 PawPawPlanet 的寵物保姆</h1>
        <h5>成為 PawPawPlanet 保姆是一種有趣而靈活的</h5>
        <h5>賺錢方式,同時還可以做你喜歡的事來賺錢,並與寵物共度時光</h5>
        <button type="button" class="btn btn-outline-dark p-3 my-3" @click="registerToFreelancer">
          註冊成為寵物保母
        </button>
      </div>
    </div>
    <div class="container main-content text-center mb-3">
      <h1 class="mt-3">寵物保母的流程</h1>
      <div class="row text-start align-items-center mt-3">
        <div class="col-4">
          <img src="https://api.fnkr.net/testimg/300x200/00CED1/FFF/?text=test1" class="img-fluid mb-2" alt="飼主照片">
        </div>
        <div class="col-8">
          <div class="fw-bold">1. 註冊並建立個人檔案</div>
          <div class="ms-3">首先,創建帳號並填寫個人資料,讓飼主了解你的專業背景、照顧經驗及提供的服務內容。</div>
        </div>
      </div>
      <div class="row text-start align-items-center mt-3 flex-row-reverse">
        <div class="col-4">
          <img src="https://api.fnkr.net/testimg/300x200/00CED1/FFF/?text=test2" class="img-fluid mb-2" alt="飼主照片">
        </div>
        <div class="col-8">
          <div class="fw-bold">2. 設定你的服務與價格選擇</div>
          <div class="ms-3">你願意提供的服務類型,例如:寄宿、到府照顧、散步服務等,並設定合理的收費標準。一旦設定完成,你就可以開始接案!</div>
        </div>
      </div>
      <div class="row text-start align-items-center mt-3">
        <div class="col-4">
          <img src="https://api.fnkr.net/testimg/300x200/00CED1/FFF/?text=test3" class="img-fluid mb-2" alt="飼主照片">
        </div>
        <div class="col-8">
          <div class="fw-bold">3. 接受預訂並確認服務與時間安排當飼主發送</div>
          <div class="ms-3">預訂請求時,你可以查看詳細飼主資訊,確認服務內容與時間安排。</div>
        </div>
      </div>
      <div class="row text-start align-items-center mt-3 flex-row-reverse">
        <div class="col-4">
          <img src="https://api.fnkr.net/testimg/300x200/00CED1/FFF/?text=test4" class="img-fluid mb-2" alt="飼主照片">
        </div>
        <div class="col-8">
          <div class="fw-bold">4. 提供專業寵物照護</div>
          <div class="ms-3">按照預約的時間與服務內容,提供安心、舒適的寵物照顧,建立信任感。</div>
        </div>
      </div>
      <div class="row text-start align-items-center mt-3">
        <div class="col-4">
          <img src="https://api.fnkr.net/testimg/300x200/00CED1/FFF/?text=test5" class="img-fluid mb-2" alt="飼主照片">
        </div>
        <div class="col-8">
          <div class="fw-bold">5. 完成服務並獲得報酬</div>
          <div class="ms-3">服務結束後,平台會安全地處理款項,讓你安心收到報酬。此外,飼主還能給予評價,幫助你獲得更多接案機會!</div>
        </div>
      </div>
      <button type="button" class="btn btn-outline-dark p-3 my-5" @click="registerToFreelancer">
        立即註冊,開啟你的寵物保母旅程!
      </button>
    </div>
  </main>
</template>

<style scoped lang="scss">
$breakpoints: (
  sm: 576px,
  md: 768px,
  lg: 992px
);
@mixin responsive-banner {
  height: 50vh;
  @media (max-width: map-get($breakpoints, lg)) {
    height: 40vh;
  }
  @media (max-width: map-get($breakpoints, md)) {
    height: 30vh;
  }
  @media (max-width: map-get($breakpoints, sm)) {
    height: 20vh;
  }
}
@mixin responsive-banner-top {
  padding-top: 50vh;
  @media (max-width: map-get($breakpoints, lg)) {
    padding-top: 40vh;
  }
  @media (max-width: map-get($breakpoints, md)) {
    padding-top: 30vh;
  }
  @media (max-width: map-get($breakpoints, sm)) {
    padding-top: 20vh;
  }
}
.banner {
  background-image: url("https://cdn.stocksnap.io/img-thumbs/960w/man-dog_KOEZ5EORMG.jpg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  @include responsive-banner;
}
.main-content {
  @include responsive-banner-top;
}
</style>
