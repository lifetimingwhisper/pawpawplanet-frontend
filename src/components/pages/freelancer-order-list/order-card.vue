<script setup>
  import { ref } from 'vue';
  import formatter from '@/stores/formatter';
  const hasBadge = ref(true);
  const props = defineProps({
    orderData: Object,
    notModal: Boolean,
    pageData: Object
  });
  const emit = defineEmits(['patchOrderApi', 'getSamedayOrderApi']);
  const { formatSpecies, formatGender, formatSize, formatAge } = formatter(props.orderData['pet']);
  const { formatStatus } = formatter(props.orderData['order']);
  const { formatServerType } = formatter(props.orderData['service']);
  const { formatPaymentMethod } = formatter(props.orderData['payment']);
  // const payment = ref({
  //   payment_method: 1,
  //   amount: 200,
  //   paid_at: '2024-03-22'
  // })
  // const { formatPaymentMethod } = formatter(payment.value);
</script>
<template>
  <div v-if="hasBadge && notModal" class="d-inline-block bg-primary small rounded-top p-1"><span></span>{{ formatStatus }}</div>
  <div class="card rounded-5 shadow-sm mb-3" :class="{ 'card-round': hasBadge && notModal }">
    <div class="card-body">
      <div class="row">
        <div :class="{ 'col-lg-7': notModal }">
          <div class="d-flex align-items-center mb-2">
            <img v-if="orderData.owner.avatar" :src="orderData.owner.avatar" class="rounded-circle avatar me-3" alt="人物頭像" />
            <SvgIcon v-if="!orderData.owner.avatar" name="user" class="rounded-circle avatar me-3" color="#452B14"/>
            <div>
              <div class="fw-bold mb-1 ms-1">{{ orderData.owner.name }}</div>
              <div class="d-flex align-items-center text-primary small">
                <SvgIcon name="map" color="#ECB88A" class="me-1" :size="24" />
                <span>{{ orderData.owner.city }} {{ orderData.owner.area }}</span>
              </div>
            </div>
          </div>
          <p class="text-muted small mb-3">{{ orderData.owner.description }}</p>
          <hr class="text-muted">
          <div class="d-flex mb-3">
            <div class="text-center me-3">
              <div><span class="badge rounded-pill bg-primary text-dark mb-2">{{ formatSpecies }}</span></div>
              <img v-if="orderData.pet.avatar" :src="orderData.pet.avatar" class="rounded-circle avatar mb-1" alt="寵物頭像" />
              <SvgIcon v-if="!orderData.pet.avatar" name="user" class="rounded-circle avatar mb-1" color="#452B14"/>
              <div class="pet-name">{{ orderData.pet.name }}</div>
            </div>
            <div class="row w-100">
              <template v-for="i in 4" :key="i">
                <div class="col-5 text-end" :class="{ 'col-xl-3': !notModal, 'col-md-2': notModal }">
                  <p v-if="i == 1">體型<span>｜</span></p>
                  <p v-if="i == 2">年紀<span>｜</span></p>
                  <p v-if="i == 3">性別<span>｜</span></p>
                  <p v-if="i == 4">個性<span>｜</span></p>
                </div>
                <div class="col-7 ps-0" :class="{ 'col-xl-9': !notModal, 'col-md-10': notModal }">
                  <p v-if="i == 1">{{ formatSize }}</p>
                  <p v-if="i == 2">{{ formatAge }} 歲</p>
                  <p v-if="i == 3">{{ formatGender }}</p>
                  <p v-if="i == 4">{{ orderData.pet.personality_description }}</p>
                </div>
              </template>
            </div>
          </div>
        </div>
        <div :class="{ 'col-lg-5': notModal }">
          <div class="bg-secondary-tint rounded-3 p-3 mb-3">
            <div class="row">
              <template v-for="i in 4" :key="i">
                <div class="col-5 col-md-4 text-end">
                  <p v-if="i == 1">預約服務<span>｜</span></p>
                  <p v-if="i == 2">時間<span>｜</span></p>
                  <p v-if="i == 3">地點<span>｜</span></p>
                  <p v-if="i == 4">備註<span>｜</span></p>
                </div>
                <div class="col-7 col-md-8 ps-0">
                  <p v-if="i == 1" class="d-flex align-items-center">
                    <SvgIcon :name="formatServerType.icon" color="#ECB88A" class="me-1" :size="24" />
                    <span>{{ formatServerType.name }}</span>
                  </p>
                  <p v-if="i == 2">{{ orderData.order.service_date }}</p>
                  <p v-if="i == 3">{{ orderData.owner.city }} {{ orderData.owner.area }}</p>
                  <p v-if="i == 4">{{ orderData.order.note }}</p>
                </div>
              </template>
            </div>
            <hr class="text-muted">
            <div class="d-flex justify-content-between">
              <p>總共</p>
              <p>NT$ {{ orderData.service.price }}</p>
            </div>
          </div>
          <div class="row">
            <div class="col-6">
              <button v-if="notModal && pageData.tag === 0" class="btn btn-outline-primary w-100 text-dark rounded-pill p-3"  @click="emit('patchOrderApi', orderData.order.id, 'reject')">忍痛拒絕</button>
            </div>
            <div class="col-6">
              <button v-if="pageData.tag === 0" class="btn btn-primary w-100 rounded-pill p-3" @click="notModal ? emit('getSamedayOrderApi', orderData) : emit('patchOrderApi', orderData.order.id, 'accept')">接受預約</button>
              <button v-if="pageData.tag === 3" class="btn btn-primary w-100 rounded-pill p-3" @click="emit('patchOrderApi', orderData.order.id, 'close')">確認</button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="!(Object.keys(orderData.review).length === 0)" class="position-relative border rounded-4 text-center p-3 mt-2">
        <div class="position-absolute top-0 start-50 translate-middle">
          <div class="text-brown fw-bold bg-white p-2">\ 評論 /</div>
        </div>
        <div class="mb-2">
          <i
            v-for="i in 5"
            :key="i"
            class="bi mx-1"
            :class="i <= orderData.review.rating ? 'bi-star-fill text-warning' : 'bi-star text-muted'"
          ></i>
        </div>
        <p class="mb-0 text-dark">{{ orderData.review.comment }}</p>
      </div>

      <div v-if="!(Object.keys(orderData.payment).length === 0) && orderData.payment.success" class="border rounded-4 p-3 mt-2">
        <p>支付方式<span>｜</span>{{ formatPaymentMethod }}</p>
        <p>金額<span>｜</span>{{ orderData.payment.amount }}</p>
        <p>付款日期<span>｜</span>{{ orderData.payment.paid_at }}</p>
      </div>
      <!-- <div v-if="!(Object.keys(payment).length === 0)" class="border rounded-4 p-3 mt-2">
        <p>支付方式<span>｜</span>{{ formatPaymentMethod }}</p>
        <p>金額<span>｜</span>{{ payment.amount }}</p>
        <p>付款日期<span>｜</span>{{ payment.paid_at }}</p>
      </div> -->
    </div>
  </div>
</template>
<style scoped lang="scss">
  .card-round {
    border-top-left-radius: 0 !important;
  }
  .text-brown {
    color: #7c4f27;
  }
  .avatar {
    width: 80px;
    height: 80px;
    object-fit: cover;
    background-color: rgb(249, 234, 220);
  }
  .pet-name{
    width: 80px;
  }
</style>
