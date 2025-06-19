<script setup>
import { useDeviceStore } from '@/stores/device.js'
import { storeToRefs } from 'pinia'

const deviceStore = useDeviceStore()

const { is_mobile } = storeToRefs(deviceStore)
</script>
<template>
  <div class="position-relative w-100 bg-secondary-tint py-6">
    <div class="container">
      <div class="d-flex flex-column align-items-center">
        <div class="w-100 d-flex justify-content-center align-items-center">
          <SvgIcon name="security" :size="is_mobile ? 28 : 52" color="#A87D57" />
          <div class="px-2">
            <h5 class="home-title">服務與保障</h5>
          </div>
        </div>
        <div class="w-100 py-2 py-lg-5" style="z-index: 2">
          <div class="row g-0">
            <div class="col-lg">
              <div class="row">
                <div class="col">
                  <div class="w-100 d-flex flex-column align-items-center home-security-section px-4 py-3">
                    <div class="mb-2 mb-lg-5">
                      <p class="home-security-subTitle">預定保障</p>
                    </div>
                    <div class="home-security-img">
                      <img class="w-100" src="@/assets/images/home/security.png" alt="">
                    </div>
                    <div class="w-100 pt-3">
                      <p class="home-security-text text-center">只要提前預訂顧客，一定幫你找到適合的寵物照顧者</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-lg">
              <div class="row">
                <div class="col">
                  <div class="w-100 d-flex flex-column align-items-center home-security-section px-4 py-3">
                    <div class="mb-2 mb-lg-5">
                      <p class="home-security-subTitle">免費保險服務</p>
                    </div>
                    <div class="home-security-img">
                      <img class="w-100" src="@/assets/images/home/free_insurance.png" alt="">
                    </div>
                    <div class="w-100 pt-3">
                      <p class="home-security-text text-center">平台剛成立，即日起至2025/12/31前預訂享有該福利</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-lg">
              <div class="row">
                <div class="col">
                  <div class="w-100 d-flex flex-column align-items-center px-4 py-3">
                    <div class="mb-2 mb-lg-5">
                      <p class="home-security-subTitle">值得信賴的寵物保姆</p>
                    </div>
                    <div class="home-security-img">
                      <img class="w-100" src="@/assets/images/home/trust.png" alt="">
                    </div>
                    <div class="w-100 pt-3">
                      <p class="home-security-text text-center">只平台所媒合保姆都有經過平台嚴格把關，請安心把寵物交給我們</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="home-security-foot">
      <img src="@/assets/images/home/foot_print.png" alt="">
    </div>
  </div>
</template>
