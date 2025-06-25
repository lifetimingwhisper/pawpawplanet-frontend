<script setup>
  import { ref, watch, onMounted } from 'vue';
  import OrderCard from '@/components/pages/owner-order-list/order-card.vue';
  import OrderPagination from '@/components/pages/owner-order-list/order-pagination.vue';
  import Modal from '@/components/modal/order-owner-modal.vue';
  import ReviewModal from '@/components/modal/order-owner-comment-modal.vue';
  import { getOrder, getSamedayOrder, patchOrder, postPayment, postReview } from '@/plugins/api/order-owners/order-owners.js';
  import { useLoginStore } from '@/stores/login.js'
  import { useRouter, useRoute } from 'vue-router';
  import Loading from '@/components/loading/loading-component.vue'

  const loginStore = useLoginStore()
  const loading = ref(true)

  const router = useRouter();
  const route = useRoute();

  const ecpayGatewayUrl = ref('https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5'); // 綠界支付閘道 URL
  const ecpayForm = ref(null); // 使用 ref 獲取模板中的 DOM 元素引用

  const thisModal = ref();
  const reviewModal = ref();

  const ordersData = ref([]);
  const samedayOrdersData = ref([]);
  const orderDataBeingCommented = ref({})
  const orderTags = ref([
    {
      name: '等待回覆',
      value: 0
    },
    {
      name: '預約成功待付款',
      value: 1
    },
    {
      name: '即將執行',
      value: 2
    },
    {
      name: '最新回應',
      value: 3
    },
    {
      name: '結案',
      value: 4
    }
  ]);
  const pageData = ref({
    page: 1,
    limit: 3,
    tag: 0,
    total: 0
  });

  let timer;
  watch([() => pageData.value.tag, () => pageData.value.page],
    ([newTag], [oldTag]) => {
      if(newTag !== oldTag) {
        ordersData.value = [];
        pageData.value.page = 1;
      }
      clearTimeout(timer);
      timer = setTimeout(() => {
        // console.log('tag 或 page 變更了，但只執行一次 API');
        getOrderApi();
      }, 100); // 延遲 100ms，避免短時間內連續觸發
  }, { immediate: true });  
  
  onMounted(async () => {
    if (!loginStore.is_login || loginStore.user.role !== 'owner') {
      await router.push('/')
      return
    }
  });

  watch(
    () => route.query,
    (newQuery) => {
      const newTag = parseInt(newQuery.tag, 10);

      if (!Number.isNaN(newTag)) {
        pageData.value.tag = newTag;
      } 

      if (Object.keys(newQuery).length > 0) {
        router.replace({
          name: 'owner-order-list',
          
        }).catch(err => {
          if (router.isNavigationFailure(err) && err.name === 'NavigationDuplicated') {
          } else {
            console.error("路由替換失敗:", err);
          }
        });
      } 
    },
    {
      immediate: true,
      deep: true
    }
  )

  function showModal(){
    thisModal.value.p_show();
  }
  function hideModal(){
    thisModal.value.p_hide();
  }

  function showReviewModal() {
    reviewModal.value.p_show()
  }
  function hideReviewModal() {
    reviewModal.value.p_hide();
  }

  function changePage(page){
    pageData.value.page = page;
  }

  async function getOrderApi(){
    try {
      loading.value = true;
      // console.log('getOrderApi:' ,pageData.value);
      const getOrderOrigin = await getOrder(pageData.value);
      const getOrderData = getOrderOrigin.data;
      // console.log(getOrderOrigin);
      // console.log(getOrderData);
      pageData.value.total = getOrderOrigin.total;
      ordersData.value = getOrderData;
    } catch (err){
      console.log('錯誤getOrder', err);
    } finally {
      loading.value = false;
    }
  }

  async function getSamedayOrderApi(data){
    try {
      loading.value = true;
      // console.log('getSamedayOrderApi:',data, data.order.id);
      let getSamedayOrdersData = await getSamedayOrder(data.order.id);
      console.log(getSamedayOrdersData);
      samedayOrdersData.value = [data, ...getSamedayOrdersData];
      if(Object.keys(getSamedayOrdersData).length === 0) {
        await postPaymentApi(data.order.id);
      } else showModal();
    } catch (err){
      console.log('錯誤getSameDayOrder', err);
    } finally {
      loading.value = false;
    }
  }

  async function patchOrderApi(id, action){
    try {
      loading.value = true;
      let postData = { 'action': action }
      console.log('patchOrderApi:',id, action);
      let patchOrderData = await patchOrder(id, postData);
      console.log(patchOrderData);
      hideModal();
      pageData.value.tag = patchOrderData.target_tag.value;
    } catch (err){
      console.log('錯誤patchOrderApi', err);
    } finally {
      loading.value = false;
    }
  }

  async function postPaymentApi(id) {
    try{
      loading.value = true;
      const ecpayParams = await postPayment(id)
      console.log('處理訂單付款，取得綠界資料: ', ecpayParams)
      if (!ecpayForm.value) { 
        throw new Error('未找到綠界支付表單元 "ecpayForm")。');
      }

      // 清空表單，並動態填充隱藏的 input 欄位
      ecpayForm.value.innerHTML = '';

      // 遍歷後端回傳的所有綠界參數，為每個參數創建一個隱藏的 input 元素
      for (const key in ecpayParams) {
        if (Object.hasOwnProperty.call(ecpayParams, key)) {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;           // 設置 input 的 name 屬性 (綠界要求的參數名稱)
          input.value = ecpayParams[key]; // 設置 input 的 value 屬性
          ecpayForm.value.appendChild(input);
        }
      }

      // 透過 JavaScript 提交表單，觸發瀏覽器導向綠界支付頁面
      console.log('綠界支付表單已準備就緒，正在提交...');
      ecpayForm.value.submit(); // 呼叫表單的 submit() 方法
    } catch(error) {
      console.log('錯誤postPaymentApi', err);
    } finally {
      loading.value = false;
    }
  }

  async function submitComment(formData, orderData) {
    try {
      loading.value = true;
      orderDataBeingCommented.value = {};
      hideReviewModal();
      await postReviewApi(formData, orderData);
    } catch(error) {
      console.log('錯誤submitComment', err);
    } finally {
      loading.value = false;
    }
  }
  async function postReviewApi(reviewData, orderData) {
    try {
      loading.value = true;
      const data = {
        rating: reviewData.selectedRating,
        comment: reviewData.comment, 
      };

      await postReview(orderData.order.id, data);
      orderData.review.rating = reviewData.selectedRating;
      orderData.review.comment = reviewData.comment;
    } catch (err) {
      console.log('錯誤postReviewApi', err);
    } finally {
      loading.value = false;
    }
  }

  function presentReviewModal(orderData) {
    orderDataBeingCommented.value = orderData;
    showReviewModal()
  }
</script>
<template>
  <main>
    <form ref="ecpayForm" method="POST" :action="ecpayGatewayUrl" style="display: none;"></form>
    <div class="overflow-x-auto d-flex bg-white rounded-5 mx-auto mb-3 p-2 gap-2">
      <template v-for=" tag in orderTags" :key="tag.value">
        <input type="radio" class="btn-check" name="orderTag" autocomplete="off" :id="'tag'+tag.value"
          :value="tag.value" v-model="pageData.tag">
        <label class="btn btn-outline-dark rounded-4" :for="'tag'+tag.value">{{ tag.name }}</label>
      </template>
    </div>
    <Loading :show="loading" class="flex-center" style="height: 300px;"/>
    <div v-show="!loading" v-for="orderData in ordersData" :key="orderData.order.id">
      <OrderCard :notModal="true" :pageData="pageData" :orderData="orderData"
        @get-sameday-order-api="getSamedayOrderApi" @patch-order-api="patchOrderApi"
        @present-review-modal="presentReviewModal" @post-payment-api="postPaymentApi"></OrderCard>
    </div>

    <div v-if="Object.keys(ordersData).length === 0 && !loading" class="flex-center" style="height: 300px;">無資料</div>

    <div v-show="!loading">
      <OrderPagination :pageData="pageData" @change-page="changePage"></OrderPagination>
    </div>

    <Modal title="Modal1" ref="thisModal" :pageData="pageData" :samedayOrdersData="samedayOrdersData"
      :postPaymentApi="postPaymentApi">
      <template #header>您在 {{ samedayOrdersData?.[0]?.order?.service_date }} 有 {{ Object.keys(samedayOrdersData).length
        }} 項等待付款的預約，請從清單中選擇要付款的預約，其他預約會自動取消</template>
    </Modal>
    <ReviewModal title="ReviewModal" ref="reviewModal" :orderData="orderDataBeingCommented" @submit-comment="submitComment">
    </ReviewModal>
  </main>
</template>
<style scoped lang="scss">
  .overflow-x-auto {
    white-space: nowrap;
    max-width: 516px;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
  input[type="radio"].btn-check{
    & + label{
      border-color: $black-300;
      color: $primary-dark-second;
    }
    &:checked + label, &:hover + label{
      border-color: $primary-dark-second;
      background-color: $primary-dark;
      color: #fff;
    }
  }
</style>
