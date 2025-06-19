<script setup>
import Header from '@/components/header/header-component.vue'
import Footer from '@/components/footer/footer-component.vue'
import HeaderMenu from '@/components/header/header-menu.vue'
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { useDeviceStore } from '@/stores/device.js'
import { storeToRefs } from 'pinia'

const route = useRoute()

const deviceStore = useDeviceStore()

const { is_mobile } = storeToRefs(deviceStore)

const openMenu = ref(false)

const clickMenu = () => {
  openMenu.value = !openMenu.value
}
</script>
<template>
  <main class="w-100 layout-main">
    <Header :open-menu="openMenu" @on-press="clickMenu" />
    <div class="w-100 layout-main-content">
      <div class="container">
        <RouterView v-slot="{ Component, route }">
          <keep-alive>
            <component :is="Component" :key="route.matched[1].path" v-if="route.meta.keep_alive" />
          </keep-alive>
          <component :is="Component" :key="route.matched[1].path" v-if="!route.meta.keep_alive" />
        </RouterView>
      </div>
      <template v-if="is_mobile">
        <Footer v-if="route.name !== 'freelancerList'" />
      </template>
      <template v-else>
        <Footer />
      </template>
    </div>
    <HeaderMenu :open-menu="openMenu" @on-press="clickMenu" />
  </main>
</template>
