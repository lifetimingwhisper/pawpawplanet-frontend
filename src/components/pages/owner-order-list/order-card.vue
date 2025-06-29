<script setup>
  import { computed } from 'vue';
  import formatter from '@/stores/formatter';

  const props = defineProps({
    orderData: Object,
    notModal: Boolean,
    pageData: Object
  });
  const emit = defineEmits(['patchOrderApi', 'getSamedayOrderApi', 'postPaymentApi', 'presentReviewModal']);
  const { formatSpecies, formatGender, formatSize, formatAge } = formatter(props.orderData['pet']);
  // const { formatStatus } = formatter(props.orderData['order']);
  const { formatServerType } = formatter(props.orderData['service']);
  const { formatPaymentMethod } = formatter(props.orderData['payment']);
  const { formatStatusBadge } = formatter(props.orderData['order']);

  const hasBadge = computed(() => {
    return props.pageData.tag === 3 || props.pageData.tag === 4
  });

  const isServicedToday = computed(() => {
    return props.orderData?.order?.service_date === formatToYYYYMMDDWithTimeZone(new Date())
  });
  
  function formatToYYYYMMDDWithTimeZone(date, timeZone = 'Asia/Taipei') {
    // 創建一個日期格式化器
    const options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      timeZone: timeZone // 指定時區
    };

    const formatter = new Intl.DateTimeFormat('en-US', options); // 'en-US' 確保月份和日期是數字格式
    const parts = formatter.formatToParts(date);

    let year = '';
    let month = '';
    let day = '';

    for (const part of parts) {
      switch (part.type) {
        case 'year':
          year = part.value;
          break;
        case 'month':
          month = part.value;
          break;
        case 'day':
          day = part.value;
          break;
      }
    }
    return `${year}-${month}-${day}`;
  }
</script>
<template>
  <div v-if="hasBadge && notModal" class="d-inline-block text-white small rounded-top p-1"
    :style="{ backgroundColor: formatStatusBadge.bgColorClass, color: formatStatusBadge.textColorClass }">
    <span>
      <SvgIcon :name="formatStatusBadge.iconName" class="me-1" :color="formatStatusBadge.iconColor" size="10px"/>
    </span>{{ formatStatusBadge.text }}
  </div>
  <div class="card rounded-5 shadow-sm mb-3" :class="{ 'card-round': hasBadge && notModal }">
    <div class="card-body">
      <div class="row">
        <div :class="{ 'col-lg-7': notModal }">
          <div class="d-flex align-items-center mb-2">
            <img v-if="orderData.freelancer.avatar?.[0]" :src="orderData.freelancer.avatar[0]" class="rounded-circle avatar me-3" alt="人物頭像" />
            <SvgIcon v-if="!orderData.freelancer.avatar?.[0]" name="user" class="rounded-circle avatar me-3" color="#452B14" />
            <div>
              <div class="fw-bold text-break mb-1 ms-1">{{ orderData.freelancer.name }}</div>
              <div class="text-primary small">
                <span class="text-black me-2">{{ orderData.freelancer.phone }} </span>
                <SvgIcon name="map" color="#ECB88A" class="me-1" :size="24" />
                <span>{{ orderData.freelancer.city }} {{ orderData.freelancer.area }}</span>
              </div>
            </div>
          </div>
          <p class="text-muted small text-break mb-3">{{ orderData.freelancer.description }}</p>
          <hr class="text-muted">
          <div class="d-flex mb-3">
            <div class="text-center me-3">
              <div><span class="badge rounded-pill bg-primary text-dark mb-2">{{ formatSpecies }}</span></div>
              <img v-if="orderData.pet.avatar" :src="orderData.pet.avatar" class="rounded-circle avatar mb-1"
                alt="寵物頭像" />
              <SvgIcon v-if="!orderData.pet.avatar" name="user" class="rounded-circle avatar mb-1" color="#452B14" />
              <div class="pet-name text-break">{{ orderData.pet.name }}</div>
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
                  <p v-if="i == 4" class="text-break">{{ orderData.pet.personality_description }}</p>
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
                  <p v-if="i == 1" class="d-flex">
                    <span class="flex-grow-1 text-truncate">{{ orderData.service.title }}</span>
                    <span class="flex-shrink-0">
                      <SvgIcon :name="formatServerType.icon" color="#ECB88A" class="me-1" :size="24" />
                      <span>{{ formatServerType.name }}</span>
                    </span>
                  </p>
                  <p v-if="i == 2">{{ orderData.order.service_date }}</p>
                  <p v-if="i == 3">{{ orderData.service.city }} {{ orderData.service.area }}</p>
                  <p v-if="i == 4" class="text-break">{{ orderData.order.note }}</p>
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
              <button v-if="notModal && pageData.tag === 1"
                class="btn btn-outline-primary w-100 text-dark rounded-pill p-3"
                @click="emit('patchOrderApi', orderData.order.id, 'cancel')">取消</button>
            </div>
            <div class="col-6">
              <button v-if="notModal && pageData.tag === 0"
                class="btn btn-outline-primary w-100 text-dark rounded-pill p-3"
                @click="emit('patchOrderApi', orderData.order.id, 'cancel')">取消</button>
              <button v-if="pageData.tag === 1" class="btn btn-primary w-100 rounded-pill p-3"
                @click="notModal ? emit('getSamedayOrderApi', orderData) : emit('postPaymentApi', orderData.order.id)">付款</button>
              <button v-if="pageData.tag === 2 && isServicedToday && (!(Object.keys(orderData.payment).length === 0) && orderData.payment.success)"
                class="btn btn-primary w-100 rounded-pill p-3"
                @click="emit('patchOrderApi', orderData.order.id, 'complete')">服務完成，結案</button>  
              <button v-if="pageData.tag === 3" class="btn btn-primary w-100 rounded-pill p-3"
                @click="emit('patchOrderApi', orderData.order.id, 'close')">確認</button>
              <button v-if="pageData.tag === 4 && orderData.order.status === 7 && (Object.keys(orderData.review).length === 0)"
                class="btn btn-primary w-100 rounded-pill p-3"
                @click="emit('presentReviewModal', orderData)">評論</button>  
            </div>
          </div>
        </div>
      </div>

      <div v-if="!(Object.keys(orderData.review).length === 0)"
        class="position-relative border rounded-4 text-center p-3 mt-2">
        <div class="position-absolute top-0 start-50 translate-middle">
          <div class="text-brown fw-bold bg-white p-2">\ 評論 /</div>
        </div>
        <div class="mb-2">
          <i v-for="i in 5" :key="i" class="bi mx-1"
            :class="i <= orderData.review.rating ? 'bi-star-fill text-warning' : 'bi-star text-muted'"></i>
        </div>
        <p class="mb-0 text-dark">{{ orderData.review.comment }}</p>
      </div>

      <div v-if="!(Object.keys(orderData.payment).length === 0) && orderData.payment.success"
        class="border rounded-4 p-3 mt-2">
        <p>支付方式<span>｜</span>{{ formatPaymentMethod }}</p>
        <p>金額<span>｜</span>NT$ {{ orderData.payment.amount }}</p>
        <p>付款日期<span>｜</span>{{ orderData.payment.paid_at }}</p>
      </div>
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
