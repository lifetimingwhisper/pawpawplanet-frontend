<script setup>
  import { ref, watch } from 'vue';
  import OrderCard from '@/components/pages/freelancer-order-list/order-card.vue';
  import OrderPagination from '@/components/pages/freelancer-order-list/order-Pagination.vue';
  import Modal from '@/components/modal/order-freelancer-modal.vue';
  import { getOrder, getSamedayOrder, patchOrder } from '@/plugins/api/order-freelancers/order-freelancers.js';
  import Loading from '@/components/loading/loading-component.vue'
  const thisModal = ref();
  const loading = ref(true);

  const ordersData = ref([]);
  const samedayOrdersData = ref([]);
  const orderTags = ref([
    {
      name: '等待接受',
      value: 0
    },
    {
      name: '等待付款',
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
      if(newTag !== oldTag) pageData.value.page = 1;
      clearTimeout(timer);
      timer = setTimeout(() => {
        console.log('tag 或 page 變更了，但只執行一次 API');
        getOrderApi();
      }, 100); // 延遲 100ms，避免短時間內連續觸發
  }, { immediate: true });

  function showModal(){
    thisModal.value.p_show();
  }
  function hideModal(){
    thisModal.value.p_hide();
  }

  function changePage(page){
    pageData.value.page = page;
  }

  async function getOrderApi(){
    loading.value = true;
    try {
      console.log('getOrderApi:' ,pageData.value);
      const getOrderOrigin = await getOrder(pageData.value);
      const getOrderData = getOrderOrigin.data;
      console.log(getOrderOrigin);
      console.log(getOrderData);
      pageData.value.total = getOrderOrigin.total;
      ordersData.value = getOrderData;
      loading.value = false;
    }catch (err){
      console.log('錯誤getOrder', err);
    }
  }

  async function getSamedayOrderApi(data){
    loading.value = true;
    try {
      console.log('getSamedayOrderApi:',data, data.order.id);
      let getSamedayOrdersData = await getSamedayOrder(data.order.id);
      console.log(getSamedayOrdersData);
      samedayOrdersData.value = [data, ...getSamedayOrdersData];
      loading.value = false;
      if(Object.keys(getSamedayOrdersData).length === 0) patchOrderApi(data.order.id, 'accept');
      else showModal();
    }catch (err){
      console.log('錯誤getSameDayOrder', err);
    }
  }

  async function patchOrderApi(id, action){
    loading.value = true;
    try {
      let postData = { 'action': action }
      console.log('patchOrderApi:',id, action);
      let patchOrderData = await patchOrder(id, postData);
      console.log(patchOrderData);
      hideModal();
      pageData.value.tag = patchOrderData.target_tag.value;
      loading.value = false;
    }catch (err){
      console.log('錯誤getSameDayOrder', err);
    }
  }
</script>
<template>
  <main>
    <div class="overflow-x-auto d-flex bg-white rounded-5 mx-auto mb-3 p-2 gap-2">
      <template v-for="tag in orderTags" :key="tag.value">
        <input type="radio" class="btn-check" name="orderTag" autocomplete="off" :id="'tag'+tag.value" :value="tag.value" v-model="pageData.tag">
        <label class="btn btn-outline-dark rounded-4" :for="'tag'+tag.value">{{ tag.name }}</label>
      </template>
    </div>

    <Loading :show="loading" class="flex-center" style="height: 300px;"/>
    <div v-show="!loading" v-for="orderData in ordersData" :key="orderData.order.id">
      <OrderCard :notModal="true" :pageData="pageData" :orderData="orderData" @get-sameday-order-api="getSamedayOrderApi" @patch-order-api="patchOrderApi"></OrderCard>
    </div>
    <div v-if="Object.keys(ordersData).length === 0 && !loading" class="flex-center" style="height: 300px;">無資料</div>

    <div v-show="!loading">
      <OrderPagination :pageData="pageData" @change-page="changePage"></OrderPagination>
    </div>

    <Modal title="Modal1" ref="thisModal" :pageData="pageData" :samedayOrdersData="samedayOrdersData" :patchOrderApi="patchOrderApi">
      <template #header>您在 {{ samedayOrdersData?.[0]?.order?.service_date }} 有 {{ Object.keys(samedayOrdersData).length }} 項等待接受的預約，請從清單中選擇接受的預約</template>
    </Modal>
  </main>
</template>
<style scoped lang="scss">
  .overflow-x-auto{
    white-space: nowrap;
    max-width: 470px;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
  input[type="radio"].btn-check{
    &:checked + label, &:hover + label{
      background-color: $primary-dark;
      color: #fff;
    }
  }
</style>
