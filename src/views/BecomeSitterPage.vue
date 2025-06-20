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

  let stepsData = [
    {
      title: "註冊並建立個人檔案",
      content: "首先,創建帳號並填寫個人資料,讓飼主了解你的專業背景、照顧經驗及提供的服務內容。",
      img: "https://img.icons8.com/color/200/user-male-circle--v1.png"
    },
    {
      title: "設定你的服務與價格選擇",
      content: "你願意提供的服務類型,例如:寄宿、到府照顧、散步服務等,並設定合理的收費標準。一旦設定完成,你就可以開始接案!",
      img: "https://img.icons8.com/color/200/services--v1.png"
    },
    {
      title: "接受預訂並確認服務與時間安排當飼主發送",
      content: "預訂請求時,你可以查看詳細飼主資訊,確認服務內容與時間安排。",
      img: "https://img.icons8.com/color/200/calendar--v1.png"
    },
    {
      title: "提供專業寵物照護",
      content: "按照預約的時間與服務內容,提供安心、舒適的寵物照顧,建立信任感。",
      img: "https://img.icons8.com/color/200/dog.png"
    },
    {
      title: "完成服務並獲得報酬",
      content: "服務結束後,平台會安全地處理款項,讓你安心收到報酬。此外,飼主還能給予評價,幫助你獲得更多接案機會!",
      img: "https://img.icons8.com/color/200/money--v1.png"
    },
  ]
</script>
<template>
  <main>
    <div class="banner position-absolute start-0 end-0 flex-center">
      <div class="text-center bg-light bg-opacity-50 p-2 p-md-3">
        <h1>成為 PawPawPlanet 的寵物保姆</h1>
        <div class="font-description">成為 PawPawPlanet 保姆是一種有趣而靈活的<br>賺錢方式,同時還可以做你喜歡的事來賺錢,並與寵物共度時光</div>
        <button type="button" class="btn btn-outline-dark p-2 p-sm-3 my-2 my-md-3" @click="registerToFreelancer">
          註冊成為寵物保母
        </button>
      </div>
    </div>
    <div class="container main-content text-center mb-3">
      <h1 class="mt-3">寵物保母的流程</h1>
      <template v-for="(step, i) in stepsData" :key="step">
        <div class="row text-start align-items-center mt-3" :class="{ 'flex-row-reverse': i % 2 != 0 }">
          <div class="col-4" :class="{ 'text-end': i % 2 != 0 }">
            <img :src="step.img" class="img-fluid" alt="步驟圖片">
          </div>
          <div class="col-8 d-flex gap-1">
            <div class="fw-bold font-title">{{ i + 1 }}.</div>
            <div>
              <div class="fw-bold font-title">{{ step.title }}</div>
              <div class="font-description">{{ step.content }}</div>
            </div>
          </div>
        </div>
      </template>
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
    lg: 992px,
    xl: 1200px
  );
  @mixin responsive-banner {
    height: 50vh;
    @media (max-width: map-get($breakpoints, xl)) {
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
    @media (max-width: map-get($breakpoints, xl)) {
      padding-top: 40vh;
    }
    @media (max-width: map-get($breakpoints, md)) {
      padding-top: 30vh;
    }
    @media (max-width: map-get($breakpoints, sm)) {
      padding-top: 20vh;
    }
  }
  @mixin h1-size {
    font-size: 2.5rem;
    @media (max-width: map-get($breakpoints, lg)) {
      font-size: 1.75rem;
    }
    @media (max-width: map-get($breakpoints, md)) {
      font-size: 1.5rem;
    }
    @media (max-width: map-get($breakpoints, sm)) {
      font-size: 1.25rem;
    }
  }

  .banner {
    background-image: url("https://cdn.stocksnap.io/img-thumbs/960w/husky-animal_TFSKPZTEPD.jpg");
    background-size: cover;
    background-position: 50% 60%;
    background-repeat: no-repeat;
    @include responsive-banner;
  }
  .main-content {
    @include responsive-banner-top;
  }
  h1 {
    @include h1-size
  }
  .font-title {
    font-size: 1rem;
    @media (min-width: map-get($breakpoints, sm)) {
      font-size: 1.5rem;
    }
    @media (min-width: map-get($breakpoints,md)) {
      font-size: 1.75rem;
    }
  }
  .font-description {
    font-size: 0.75rem;
    @media (min-width: map-get($breakpoints, sm)) {
      font-size: 1rem;
    }
    @media (min-width: map-get($breakpoints, md)) {
      font-size: 1.25rem;
    }
  }
</style>
