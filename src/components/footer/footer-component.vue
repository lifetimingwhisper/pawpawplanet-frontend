<script setup>
</script>
<template>
  <div class="footer bg-primary-dark">
    <div class="container">
      <div class="d-flex flex-column align-items-center">
        <div class="footer-logo">
          <img class="w-100" src="@/assets/images/footer/footer_logo.png" alt="footer-logo">
        </div>
        <div class="footer-lists w-100 d-flex justify-content-center flex-wrap">
          <ul class="w-100 d-flex flex-column flex-lg-row justify-content-between ps-0">
            <li class="footer-li px-3 py-3 py-lg-4 text-center">
              <RouterLink to="service">寵物日托</RouterLink>
            </li>
            <li class="footer-li px-3 py-3 py-lg-4 text-center">
              <RouterLink to="service?type=寵物散步">寵物散步</RouterLink>
            </li>
            <li class="footer-li px-3 py-3 py-lg-4 text-center">
              <RouterLink to="service?type=寵物美容">寵物美容</RouterLink>
            </li>
            <li class="footer-li px-3 py-3 py-lg-4 text-center">
              <RouterLink to="service?type=到府照顧">到府照顧</RouterLink>
            </li>
          </ul>
        </div>
        <div class="footer-rights text-center">
          <p>© 2025 PawPawPlanet. All Rights Reserved.</p>
        </div>
      </div>
    </div>
  </div>
</template>
