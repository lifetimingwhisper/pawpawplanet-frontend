<script setup>
import OrderCard from '@/components/pages/owner-order-management/order-card.vue';
import OrderSelectorModal from '@/components/pages/owner-order-management/order-selector-modal.vue';
import { ref, watch, onMounted, nextTick } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useLoginStore } from '@/stores/login.js'
import { getOrders } from '@/plugins/api/users/owners';
import { patchOrderStatus, getOrdersAcceptedOnSameDate, postPayment, postReview } from '@/plugins/api/orders';

const loginStore = useLoginStore()
const router = useRouter();
const route = useRoute();

const tabs = [
  { id: 'pending', label: '等待回覆', tag: 0 },
  { id: 'accepted', label: '預約成功待付款', tag: 1 },
  { id: 'paid', label: '即將執行', tag: 2 },
  { id: 'latest-response', label: '最新回應', tag: 3 },
  { id: 'closed', label: '結案訂單', tag: 4 },
];

const PET_SIZE_MAP = {
  0: '小型-10公斤以下',
  1: '中型-10公斤以上，20公斤以下',
  2: '大型- 20公斤以上',
};

const currentTag = ref(0);
const currentLimit = ref(10);
const currentPage = ref(1);

const ordersData = ref([])
const ordersDataInModal = ref([])

// const ecpayGatewayUrl = ref(import.meta.env.ECPAY_URL); // 綠界支付閘道 URL
const ecpayGatewayUrl = ref('https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5'); // 綠界支付閘道 URL
const ecpayForm = ref(null); // 使用 ref 獲取模板中的 DOM 元素引用

const showOrderSelectorModal = ref(false);
const orderSelectorModalRef = ref(null);
const tabButtonRefs = ref({});

function changeTab(tag) {
  if (currentTag.value === tag) {
    console.log('已經在當前 Tab，無需導航。');
    return;
  }

  currentTag.value = tag;
  currentLimit.value = 10;
  currentPage.value = 1;

  router.push({
    name: 'owner-order-management',
    query: {
      tag: String(currentTag.value),
      limit: String(currentLimit.value),
      page: String(currentPage.value)
    }
  }).catch(err => {
    if (err.name !== 'NavigationDuplicated') {
      console.error("Tab 導航失敗:", err);
    }
  });
}

const getOrderStatusActions = (orderData, tag) => {
  switch (tag) {
    case 0:
      return {
        leftBtn: { caption: '取消', action: 'cancel' }
      };
    case 1:
      return {
        leftBtn: { caption: '取消', action: 'cancel' },
        rightBtn: { caption: '付款', action: 'pay' }
      };
    case 2:
      return {};
    case 3: // 最新回應 + reject
      return {
        status: { caption: '保姆拒絕預約', bgColor: '#CA4000', icon: 'reject.png' },
        showStatus: true,
        rightBtn: { caption: '結案', action: 'close' }
      };
    case 4: {
      switch (orderData.order.status) {
        case 0:
        case 1:
        case 2:
          // 不會出現在結案頁籤的狀態
          return {};
        case 3:
          return {
            status: { caption: '保姆拒絕預約', bgColor: '#CA4000', icon: 'rejected' },
            showStatus: true
          };
        case 4:
          return {
            status: { caption: '取消預約', bgColor: '#B6B6B6', icon: 'cancelled' },
            showStatus: true
          };
        case 5:
          return {
            status: { caption: '逾期未付款', bgColor: '#CA4000', icon: 'nopay' },
            showStatus: true
          };
        case 6:
          return {
            status: { caption: '保姆逾期未回覆', bgColor: '#CA4000', icon: 'rejected' },
            showStatus: true
          };
        case 7: {
          return (!orderData.review || Object.keys(orderData.review).length === 0)
            ? {
              status: { caption: '訂單完成', bgColor: '#648458', icon: 'completed' },
              rightBtn: { caption: '評論', action: 'comment' },
              showStatus: true,
            } : {
              status: { caption: '訂單完成', bgColor: '#648458', icon: 'completed' },
              showStatus: true,
              showComment: true
            };
        }

        return {};
      }
    }

    console.log('無法取得訂單狀態');
    return {};
  }
};

watch(
  () => route.query,
  (newQuery) => {
    let needsRouteCorrection = false;

    const newTag = parseInt(newQuery.tag, 10);
    const newLimit = parseInt(newQuery.limit, 10);
    const newPage = parseInt(newQuery.page, 10);

    if (Number.isNaN(newTag)) {
      needsRouteCorrection = true;
      currentTag.value = 0;
    } else if (!tabs.some(t => t.tag === newTag)) {
      needsRouteCorrection = true;
      currentTag.value = 0;
    } else {
      currentTag.value = newTag;
    }

    if (Number.isNaN(newLimit) || newLimit <= 0) {
      needsRouteCorrection = true;
      currentLimit.value = 10;
    } else {
      currentLimit.value = newLimit;
    }

    if (Number.isNaN(newPage) || newPage <= 0) {
      needsRouteCorrection = true;
      currentPage.value = 1;
    } else {
      currentPage.value = newPage;
    }

    const canonicalQuery = {
      tag: String(currentTag.value),
      limit: String(currentLimit.value),
      page: String(currentPage.value),
    };

    // 檢查當前 route.query 是否與規範查詢參數完全一致
    // 這裡需要確保所有 key 都存在且值相同，並且沒有額外的 key
    needsRouteCorrection = needsRouteCorrection 
      || !(Object.keys(canonicalQuery).length === Object.keys(newQuery).length &&
        Object.keys(canonicalQuery).every(key => newQuery[key] === canonicalQuery[key]));

    if (needsRouteCorrection) {
      router.replace({
        name: 'owner-order-management',
        query: canonicalQuery
      }).catch(err => {
        if (router.isNavigationFailure(err) && err.name === 'NavigationDuplicated') {
        } else {
          console.error("路由替換失敗:", err);
        }
      });
    } else {
      fetchOrders()
    }
  },
  {
    immediate: true,
    deep: true
  }
)

async function handleOrderSelected(order) {
  try {
    if (tabButtonRefs.value[currentTag.value]) {
      tabButtonRefs.value[currentTag.value].focus();
      console.log('在呼叫 hideModal 前，焦點已預先移回活躍的 Tab 按鈕。');
    }

    if (orderSelectorModalRef.value) {
      orderSelectorModalRef.value.hideModal(); // 呼叫子元件暴露出來的方法
    }
    await pay(order.order.id);
  } catch (error) {
    console.error('處理訂單選取付款有誤:', error);
  }
}

async function fetchOrders() {
  try {
    const response = await getOrders(route.query);
    ordersData.value = response; // Vue 會自動將 response 陣列內的所有物件轉換為響應式物件 Proxy。
  } catch (error) {
    console.error('載入訂單失敗:', error);
  }
}

async function processOrder(orderData, action) {
  try {
    switch (action) {
      case 'pay':
        await handlePayAction(orderData)
        break;
      case 'comment':
        addReview(orderData)
        break;
      case 'accept':
      case 'cancel':
      case 'close':
        await updateStatus(orderData.order.id, action)
        break;
      default:
        console.error('不支援的訂單操作:', action);
        break;
    }
  } catch (error) {
    console.error('處理訂單操作時發生錯誤 :', error);
  }
}

async function handlePayAction(orderData) {
  try {
    const apiResponseJSOrders = await getOrdersAcceptedOnSameDate(orderData.order.id);
    apiResponseJSOrders?.length ? 
      showOrdersAcceptedOnSameDate(orderData, apiResponseJSOrders) : await pay(orderData.order.id);
  } catch (error) {
    console.error('處理訂單付款有誤:', error);
  }
}

function addReview(orderData) {
  orderDataBeingCommented.value = orderData;
  showModal();
}

async function updateStatus(orderId, action) {
  try {
    const response = await patchOrderStatus(orderId, { action: action });
    console.log('改變訂單狀態結果: response', response);

    if (response && response.target_tag && response.target_tag.value) {
      changeTab(response.target_tag.value);
    } else {
      console.warn('更新狀態後缺少目標標籤值:', response);
    }
  } catch (error) {
    console.error('更新訂單狀態失敗:', error);
    throw error;
  }
}

async function pay(orderId) {
  try {
    const ecpayParams = await postPayment(orderId)
    console.log('處理訂單付款，取得綠界資料: ', ecpayParams);

    // 確保 ecpayForm ref 已經指向了 DOM 元素
    if (!ecpayForm.value) {
      throw new Error('未找到綠界支付表單元素 (ref="ecpayForm")。');
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
  } catch (error) {
    console.error('訂單付款流程有誤:', error);
  }
}

function showOrdersAcceptedOnSameDate(theOrderData, otherJSOrders) {
  ordersDataInModal.value.push(theOrderData)
  ordersDataInModal.value.push(...otherJSOrders)
  showOrderSelectorModal.value = true; // 將此變數設為 true，Modal 就會出現
}

// 處理 Modal 關閉後的邏輯
const handleModalHidden = () => {
  console.log('Modal 已關閉。');
  ordersDataInModal.value = [];
  showOrderSelectorModal.value = false; // 同步父元素的狀態，確保 Modal 狀態正確

  nextTick(() => {
    // 只有當當前焦點不在預期的回歸點時才再次聚焦，避免不必要的重複聚焦
    if (tabButtonRefs.value[currentTag.value] && document.activeElement !== tabButtonRefs.value[currentTag.value]) {
      tabButtonRefs.value[currentTag.value].focus();
      console.log('handleModalHidden: 焦點再次確認已返回活躍的 Tab 按鈕。');
    }
  });
};

onMounted(async () => {
  if (!loginStore.is_login || loginStore.user.role !== 'owner') {
    await router.push('/')
    return
  }
    
  nextTick(() => {
    if (tabButtonRefs.value[currentTag.value]) {
      tabButtonRefs.value[currentTag.value].focus();
    }
  });
});

// import { ref} from 'vue';
import Modal from '@/components/modal/order-owner-comment-modal.vue';
const thisModal = ref();
const orderDataBeingCommented = ref({})
function showModal(){
  thisModal.value.p_show()
}

async function submitComment(reviewData, orderData){
  try{
    orderData.review.rating = reviewData.selectedRating;
    orderData.review.comment = reviewData.comment;

    const data = {
      rating: reviewData.selectedRating,
      comment: reviewData.comment,
    }

    const response = await postReview(orderData.order.id, data);
    console.log('新增評論結果: response', response);
    orderDataBeingCommented.value = {};
  } catch(error) {
    console.error('評論流程有誤:', error);
  }
}
</script>

<template>
  <div class="container my-4">
    <form 
      ref="ecpayForm" 
      method="POST" 
      :action="ecpayGatewayUrl" 
      style="display: none;" 
    >
    </form>

    <!-- tab bar -->
    <div class="tab-bar-container my-4">
      <div class="nav-pills-wrapper">
        <ul class="nav nav-pills" id="order-list-tab" role="tablist">
          <li
            v-for="(tab, index) in tabs"
            :key="index"
            class="nav-item"
            role="presentation"
          >
            <button
              class="nav-link"
              :class="{ active: currentTag === tab.tag }"
              @click="changeTab(tab.tag)"
              :id="`${tab.id}-tab`"
              type="button"
              role="tab"
              :aria-controls="tab.id"
              :aria-selected="currentTag === tab.tag"
              :ref="el => { if (el) tabButtonRefs[tab.tag] = el }"
            >
              {{ tab.label }}
            </button>
          </li>
        </ul>
      </div>
    </div>
    <!-- tab content -->
    <div class="tab-content-container">
      <order-card 
        v-for="orderData in ordersData"
       :key="orderData.order.id" 
       :orderData="orderData"
       :orderStatusActions="getOrderStatusActions(orderData, currentTag)"
       @click-btn="processOrder" />
    </div> 

    <OrderSelectorModal
      :show="showOrderSelectorModal"          
      :ordersData="ordersDataInModal"             
      :modalId="'OrderSelectorModal'"    
       @hidden="handleModalHidden"
       @selected="handleOrderSelected" 
       ref="orderSelectorModalRef" />

    <Modal 
      title="Modal1" 
      ref="thisModal" 
      :orderData="orderDataBeingCommented"
      @submit-comment="submitComment">
    </Modal>
      
  </div>
</template>

<style scoped>
.tab-bar-container {
  width: 100%;
  max-width: 900px;
  margin: 0 auto; /* 水平置中自身 */
  box-sizing: border-box; /* 確保 padding 不增加總寬度 */

  display: flex;
  justify-content: center;
}

.nav-pills-wrapper {
  flex-shrink: 0;
  width: fit-content; /* 讓其寬度由內容決定，但最大不超過其父容器 (tag-bar-container) 的可用寬度 */
  max-width: 100%;
  padding: 12px 12px; /* nav-pills 與白色背景邊緣之間的內邊距 */  

  /* 
    當 overflow，內容會從左側開始，justify-content: center 就失去了意義，反而可能導致一些預期之外的行為。
    justify-content: center; 當內容足夠時置中 nav-pills 
    但仍要設定 display: flex 讓 nav-pills 成為 flex items
  */
  display: flex;
  overflow-x: auto; /* 當內容溢出時顯示水平滾動條 */
  overflow-y: hidden;

  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 40px;

  scroll-behavior: smooth;
  cursor: grab; /* 可移除，只是視覺提示可拖曳 */
}

.nav-pills {
  width: max-content; /* 強制根據內容決定寬度 */

  /* 關鍵調整：覆蓋 Bootstrap 預設的負邊距和 padding */
  margin-left:  0 !important;
  margin-right: 0 !important;
  padding-left: 0 !important;
  padding-right: 0 !important;
  margin-bottom: 0;/* 移除 Bootstrap 可能帶來的底部 margin */

  display: flex; /* 讓 nav-items 成為 flex item */
  flex-wrap: nowrap; /* 強制所有 nav-item 不換行 */
}

.nav-pills .nav-item {
  flex-shrink: 0; /* 避免 nav-item 縮小，保持其內容所需的寬度 */
  
  /* 如果你的 nav-item 預設還有負邊距，也需要覆蓋 */
  /* margin-left: 0 !important; */
  margin-right: 24px !important;
}

/* 移除最後一個 nav-item 的右邊距，避免最右邊多餘的空間 */
.nav-pills .nav-item:last-child {
  margin-right: 0 !important;
}

/* nav-link (實際的按鈕/連結元素) */
.nav-pills .nav-item .nav-link {
  white-space: nowrap; /* 確保連結內的文字不換行 */
  padding: 12px 16px; /* 調整 pill 內部文字與邊緣的間距 */
  
  border-radius: 30px;
  font-weight: 700; /* 字體粗細 */

  transition: all 0.2s ease; /* 加上平滑動畫效果 */
  outline: none; /* 移除 focus 時的藍框 */
}

/* nav-link 活躍（active）狀態的樣式 */
.nav-pills .nav-item .nav-link.active {
  border: 1px solid #452B14;
  background-color: #A87D57;
  color: #ffffff;
}

.nav-pills .nav-item .nav-link:not(.active) {
  border: 1px solid #B6B6B6;
  color: #452B14;
  background-color: transparent;
  box-shadow: none; /* 移除可能的陰影 */
}

.tab-content-container {
  width: 100%;
  max-width: 900px;
  margin: 0 auto; /* 水平置中自身 */
  box-sizing: border-box; /* 確保 padding 不增加總寬度 */

  display: flex;
  flex-direction: column;
  gap: 24px;
}
</style>