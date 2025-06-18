<script setup>
import { useRoute } from 'vue-router'

defineProps({
  list: {
    type: Array,
    required: true,
  },
})

const route = useRoute()
</script>
<style lang="scss" scoped>
.breadcrumb-item {
  a {
    color: $primary-dark-second;
    text-decoration: none;
  }
}
</style>
<template>
  <nav style="--bs-breadcrumb-divider: '>';" aria-label="breadcrumb">
    <ol class="breadcrumb">
      <li
        v-for="(link, key) in list"
        class="breadcrumb-item"
        :class="{
          'active': route.path === link.path,
          'fw-bold': route.path === link.path,
        }"
        :key="key"
      >
        <RouterLink :to="link.path">{{ link.name }}</RouterLink></li>
    </ol>
  </nav>
</template>
