<script setup>
import Breadcrumb from '@/components/breadcrumb/breadcrumb-component.vue'
import ListInMap from '@/components/pages/freelancer-list/list-in-map.vue'
import { useRoute } from 'vue-router'

const route = useRoute()

</script>
<template>
  <div class="w-100 pt-4 freelancer-list">
    <Breadcrumb :list="route.meta.breadcrumb ? route.meta.breadcrumb : []" />
    <ListInMap />
    <div class="w-100 py-3 d-none justify-content-between d-lg-flex">
      <SvgIcon name="two_paws" :size="56"/>
      <SvgIcon name="two_paws" :size="56" style="transform: scaleX(-1)"/>
    </div>
  </div>
</template>
