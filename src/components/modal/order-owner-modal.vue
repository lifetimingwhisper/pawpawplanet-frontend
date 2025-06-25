<script setup>
  import { ref, onMounted, onUnmounted, computed } from 'vue';
  import Modal from 'bootstrap/js/dist/modal';
  import OrderCard from '@/components/pages/owner-order-list/order-card.vue';

  const prop = defineProps({
    title: String,
    samedayOrdersData: Object,
    pageData: Object,
    postPaymentApi: Function
  });

  let modal_ref = ref(null);
  let modal;
  let handleModalHide;

  const startIndex = ref(0);
  const cardsPerPage = ref(window.innerWidth >= 992 ? 2 : 1);
  const updateCardsPerPage = () => {
    cardsPerPage.value = window.innerWidth >= 992 ? 2 : 1;
  };

  const visibleCards = computed(() =>
    prop.samedayOrdersData.slice(startIndex.value, startIndex.value + cardsPerPage.value)
  );

  const next = () => {
    console.log(startIndex.value , cardsPerPage.value);
    if (startIndex.value < prop.samedayOrdersData.length) {
      startIndex.value ++;
    }
  };

  const prev = () => {
    console.log(startIndex.value , cardsPerPage.value);
    if (startIndex.value > 0) {
      startIndex.value --;
    }
  };

  onMounted(() => {
    modal = new Modal(modal_ref.value);
    const ModalEl = document.getElementById(prop.title);
    handleModalHide = () => {
      document.activeElement?.blur();
    };
    ModalEl?.addEventListener("hide.bs.modal", handleModalHide);

    window.addEventListener('resize', updateCardsPerPage);
  });
  onUnmounted(() => {
    const ModalEl = document.getElementById(prop.title);
    ModalEl?.removeEventListener("hide.bs.modal", handleModalHide);

    window.removeEventListener('resize', updateCardsPerPage);
  });

  function c_show() {
    modal.show();
    startIndex.value = 0;
  }
  function c_hide() {
    modal.hide();
  }

  defineExpose({
    p_show: c_show,
    p_hide: c_hide
  });
</script>
<template>
  <div class="modal fade" ref="modal_ref" :id="title" tabindex="-1" :aria-labelledby="title + 'Label'" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-lg modal-xl">
      <div class="modal-content bg-secondary-tint">
        <div class="modal-header justify-content-between">
          <span></span>
          <h6 class="modal-title text-center" :id="title + 'Label'">
            <slot name="header"></slot>
          </h6>
          <span>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </span>
        </div>
        <div class="modal-body px-1 px-sm-3">
          <div class="container-fluid">
            <div class="row mb-3">
              <div v-for="orderData in visibleCards" :key="orderData.order.id" class="col-lg-6">
                <OrderCard :notModal="false" :pageData="pageData" :orderData="orderData" @post-payment-api="postPaymentApi"></OrderCard>
              </div>
            </div>
            <div class="d-flex justify-content-between">
              <button type="button" class="btn border-0" @click="prev" :disabled="startIndex === 0">
                <SvgIcon name="chevron_left" :size="28" />
              </button>
              <button type="button" class="btn border-0" @click="next" :disabled="startIndex + cardsPerPage >= samedayOrdersData.length">
                <SvgIcon name="chevron_right" :size="28" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
</style>

