<script setup>
import { useDeviceStore } from '@/stores/device.js'
import { storeToRefs } from 'pinia'

const deviceStore = useDeviceStore()

const { is_mobile } = storeToRefs(deviceStore)
</script>
<template>
  <div class="w-100 bg-secondary-tint py-6">
    <div class="container">
      <div class="home-use-section w-100 position-relative border-5">
        <div class="home-use-titleSection bg-secondary-tint text-center">
          <h5 class="home-title">如何使用該平台</h5>
          <p class="home-use-text">立即將您的寵物與接案服務者配對</p>
        </div>
        <div class="row">
          <div class="col-lg">
            <div class="w-100 d-flex flex-column align-items-center">
              <div class="home-use-img">
                <img class="w-100" src="@/assets/images/home/request.png" alt="">
              </div>
              <div class="d-flex flex-column align-items-center pt-3">
                <p class="home-use-subTitle">發出需求</p>
                <p class="home-use-text">諮詢相關服務</p>
              </div>
            </div>
          </div>
          <div class="col-lg">
            <div class="w-100 h-100 d-flex justify-content-center align-items-center py-4 py-lg-0">
              <SvgIcon name="arrow" :size="is_mobile ? 28 : 44" color="#A87D57" :style="{ 'transform': is_mobile ? 'rotate(90deg)' : 'rotate(0deg)' }" />
            </div>
          </div>
          <div class="col-lg">
            <div class="w-100 d-flex flex-column align-items-center">
              <div class="home-use-img">
                <img class="w-100" src="@/assets/images/home/match.png" alt="">
              </div>
              <div class="d-flex flex-column align-items-center pt-3">
                <p class="home-use-subTitle">與接案者配對</p>
                <p class="home-use-text">獲取報價</p>
              </div>
            </div>
          </div>
          <div class="col-lg">
            <div class="w-100 h-100 d-flex justify-content-center align-items-center py-4 py-lg-0">
              <SvgIcon name="arrow" :size="is_mobile ? 28 : 44" color="#A87D57" :style="{ 'transform': is_mobile ? 'rotate(90deg)' : 'rotate(0deg)' }" />
            </div>
          </div>
          <div class="col-lg">
            <div class="w-100 d-flex flex-column align-items-center">
              <div class="home-use-img">
                <img class="w-100" src="@/assets/images/home/meet.png" alt="">
              </div>
              <div class="d-flex flex-column align-items-center pt-3">
                <p class="home-use-subTitle">預定會面</p>
                <p class="home-use-text text-center">通過支付費用后，即可以安排會面</p>
              </div>
            </div>
          </div>
          <div class="col-lg">
            <div class="w-100 h-100 d-flex justify-content-center align-items-center py-4 py-lg-0">
              <SvgIcon name="arrow" :size="is_mobile ? 28 : 44" color="#A87D57" :style="{ 'transform': is_mobile ? 'rotate(90deg)' : 'rotate(0deg)' }" />
            </div>
          </div>
          <div class="col-lg">
            <div class="w-100 d-flex flex-column align-items-center">
              <div class="home-use-img">
                <img class="w-100" src="@/assets/images/home/confirm.png" alt="">
              </div>
              <div class="d-flex flex-column align-items-center pt-3">
                <p class="home-use-subTitle">確認寵物保母</p>
                <p class="home-use-text">可以通過郵箱隨時與我們聯繫</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
