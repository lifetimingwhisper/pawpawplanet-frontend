<script setup>
import { useDeviceStore } from '@/stores/device.js'
import { storeToRefs } from 'pinia'

const deviceStore = useDeviceStore()

const { is_mobile } = storeToRefs(deviceStore)
</script>
<template>
  <div class="position-relative w-100 bg-secondary-tint py-4">
    <div class="home-trust-foot">
      <img class="w-100" src="@/assets/images/home/foot_print.png" alt="">
    </div>
    <div class="container">
      <div class="d-flex flex-column align-items-center">
        <div class="d-flex align-items-center">
          <SvgIcon name="trust" :size="is_mobile ? 28 : 56" color="#A87D57" />
          <div class="px-2">
            <h5 class="home-title">為何信任 PawPawPlanet ?</h5>
          </div>
        </div>
        <div class="w-100 py-5" style="z-index: 2">
          <div class="row g-4">
            <div class="col-lg-3">
              <div class="w-100 border border-3 border-primary p-4 bg-primary-tint home-trust-card">
                <div class="w-100 d-flex align-items-center mb-2 mb-lg-4">
                  <div class="home-trust-icon">
                    <SvgIcon name="safety" :size="is_mobile ? 24 : 40" color="#A87D57" />
                  </div>
                  <div class="home-trust-title">
                    <p>安心托管</p>
                  </div>
                </div>
                <div class="home-trust-text">
                  <p>PawPawPlanet 提供安全舒適的家庭環境，讓您的寵物在溫馨的空間中獲得細心照顧與陪伴。</p>
                </div>
              </div>
            </div>
            <div class="col-lg-3">
              <div class="w-100 border border-3 border-primary p-4 bg-primary-tint home-trust-card">
                <div class="w-100 d-flex align-items-center mb-2 mb-lg-4">
                  <div class="home-trust-icon">
                    <SvgIcon name="group" :size="is_mobile ? 24 : 40" color="#A87D57" />
                  </div>
                  <div class="home-trust-title">
                    <p>專業團隊</p>
                  </div>
                </div>
                <div class="home-trust-text">
                  <p>我們的寵物保母皆經過嚴格審核，擁有專業經驗與熱忱，確保您的毛孩獲得最佳的呵護。</p>
                </div>
              </div>
            </div>
            <div class="col-lg-3">
              <div class="w-100 border border-3 border-primary p-4 bg-primary-tint home-trust-card">
                <div class="w-100 d-flex align-items-center mb-2 mb-lg-4">
                  <div class="home-trust-icon">
                    <SvgIcon name="sociality" :size="is_mobile ? 24 :  40" color="#A87D57" />
                  </div>
                  <div class="home-trust-title">
                    <p>社交互動</p>
                  </div>
                </div>
                <div class="home-trust-text">
                  <p>透過 PawPawPlanet，您的寵物將有機會與當地的寵物愛好者互動，享受社交樂趣，減少分離焦慮。</p>
                </div>
              </div>
            </div>
            <div class="col-lg-3">
              <div class="w-100 border border-3 border-primary p-4 bg-primary-tint home-trust-card">
                <div class="w-100 d-flex align-items-center mb-2 mb-lg-4">
                  <div class="home-trust-icon">
                    <SvgIcon name="care" :size="is_mobile ? 24 :  40" color="#A87D57" />
                  </div>
                  <div class="home-trust-title">
                    <p>客製化照護</p>
                  </div>
                </div>
                <div class="home-trust-text">
                  <p>依照每隻寵物的個性與需求，提供量身打造的照護方案，確保您的毛孩獲得最貼心的關懷。</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div >
  </div>
</template>
