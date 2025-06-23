<script setup>
import { ref, onMounted, useTemplateRef } from 'vue'
import { useRouter } from 'vue-router'
import Modal from 'bootstrap/js/dist/modal.js'
import DatepickerSelect from '@/components/select/datepicker-select.vue'
import { format, addDays } from 'date-fns'
import { postOrder } from '@/plugins/api/orders/orders.js'
import { useToast } from '@/plugins/toast/toast-plugin.js'

const props = defineProps({
  info: {
    type: Object,
    required: true,
  },
  availableDates: {
    type: Array,
    required: true,
  },
  attributes: {
    type: Array,
    required: true,
  },
  pet: {
    type: Object,
    required: true,
  },
})


const toast = useToast()

const router = useRouter()

const modalRef = useTemplateRef('modalRef');

let modalInstance = null

const today = new Date()

const serviceType = ['寵物日托', '寵物散步', '寵物美容', '到府照顧']

const endOfWeekDate = addDays(today, 6)     // 週日

const end = ref(endOfWeekDate)

const disabled = ref(false)


const request = ref({
  freelancer_id: null,
  service_id: null,
  service_date: '',
  note: null,
  pet_id: null,
  owner_id: null,
  price: null,
  price_unit: null,
  status: null,
  did_owner_close_the_order: false,
  did_freelancer_close_the_order: false,
})

const show = () => {
  modalInstance.show()
}

const cancel = () => {
  modalInstance.hide()
  request.value = {
    freelancer_id: null,
    service_id: null,
    service_date: '',
    note: null,
    pet_id: null,
    owner_id: null,
    price: null,
    price_unit: null,
    status: null,
    did_owner_close_the_order: false,
    did_freelancer_close_the_order: false,
  }
}

const reserve = async () => {
  if (disabled.value) return
  if (request.value.service_date.length === 0) {
    toast.show('請選擇預約日期', 'warning')
    return
  }
  request.value = {
    freelancer_id: props.info.freelancer_id,
    service_id: props.info.id,
    service_date: format(request.value.service_date, 'yyyy-MM-dd'),
    note: request.value.note,
    pet_id: props.pet.id,
    owner_id: props.pet.owner_id,
    price: props.info.price,
    price_unit: props.info.price_unit,
    status: 0,
    did_owner_close_the_order: false,
    did_freelancer_close_the_order: false,
  }
  disabled.value = true
  const res = await postOrder(request.value)
  if (res) {
    if (res.order_id) {
      disabled.value = false
      toast.show('預約成功', 'success')
      modalInstance.hide()
      await router.push('/owner-order-list')
    }
  } else {
    disabled.value = false
  }
}

defineExpose({ show })

onMounted(async () => {
  modalInstance = new Modal(modalRef.value)
  modalRef.value.addEventListener("hide.bs.modal", () => {
    document.activeElement?.blur()
  })
})
</script>
<style lang="scss" scoped>
.reserve-modal {
  border: 1px solid $primary-dark-second;
}
.reserve-dialog {
  max-width: 1280px !important;
}
.reserve-title {
  font-size: 20px;
  font-weight: 700;
  color: $primary-dark-second;
  @media (min-width: 992px) {
    font-size: 28px;
  }
}
.badge {
  --bs-badge-padding-y: 8px;
  --bs-badge-padding-x: 12px;
  --bs-badge-font-size: 16px;
  --bs-badge-font-weight: 700;
  @media (min-width: 992px) {
    font-size: 20px;
  }
}
.reserve-text {
  font-size: 16px;
  color: $primary-dark-second;
  @media (min-width: 992px) {
    font-size: 20px;
  }
}
.reserve-textarea {
  resize: none;
  font-size: 16px;
  color: $primary-dark-second;
  border-color: $black-300;
  &::placeholder {
    color: $black-600;
  }
  @media (min-width: 992px) {
    font-size: 20px;
  }
}
</style>
<template>
  <div class="modal fade" ref="modalRef" tabindex="-1" aria-labelledby="reserve-modal" aria-hidden="true">
    <div class="modal-dialog reserve-dialog">
      <div class="modal-content px-4 reserve-content reserve-modal">
        <div class="modal-header reserve-header px-0 py-3 d-flex justify-content-center border-primary-dark-second">
          <h5 class="modal-title reserve-title">預約</h5>
        </div>
        <div class="modal-body py-2 px-0">
          <div class="row gx-0">
            <div class="col-lg-4">
              <div class="py-2 py-lg-3">
                <div class="py-1">
                  <div class="badge rounded-pill bg-primary-dark">服務者</div>
                </div>
                <div class="py-1">
                  <p class="reserve-text fw-bold mb-0">{{ info.title }}</p>
                </div>
              </div>
            </div>
            <div class="col-lg-4">
              <div class="py-2 py-lg-3">
                <div class="py-1">
                  <div class="badge rounded-pill bg-primary-dark">服務類型</div>
                </div>
                <div class="py-1">
                  <p class="reserve-text fw-bold mb-0">{{ serviceType[info.service_type_id] }}</p>
                </div>
              </div>
            </div>
            <div class="col-lg-4">
              <div class="py-3">
                <div class="py-1">
                  <div class="badge rounded-pill bg-primary-dark">價格</div>
                </div>
                <div class="py-1">
                  <p class="reserve-text fw-bold mb-0">{{ `NT$ ${info.price}/${info.price_unit}` }}</p>
                </div>
              </div>
            </div>
            <div class="col-lg-4">
              <div class="py-2 py-lg-3">
                <div class="py-1">
                  <div class="badge rounded-pill bg-primary-dark">區域</div>
                </div>
                <div class="py-1">
                  <p class="reserve-text fw-bold mb-0">{{ `${info.freelancer?.user.city} ${info.freelancer?.user.area}` }}</p>
                </div>
              </div>
            </div>
            <div class="col-lg-4">
              <div class="py-2 py-lg-3">
                <div class="d-flex align-items-center py-1">
                  <div class="badge rounded-pill bg-primary-dark">
                    預約日期
                  </div>
                  <p class="d-flex align-items-center px-2 mb-0" style="font-size: 14px">
                    標示
                    <span class="rounded-circle mx-1" style="width: 12px; height: 12px; background: #ef4444"></span>
                    為您已有付款預約的日期
                  </p>
                </div>
                <div class="py-1">
                  <DatepickerSelect
                    v-model="request.service_date"
                    prepend-icon="datepicker"
                    :min-date="new Date()"
                    :max-date="end"
                    :attributes="attributes"
                    :available-dates="availableDates"
                    placeholder="請選擇預約日期"
                  />
                </div>
              </div>
            </div>
            <div class="col-12 gx-0">
              <div class="w-100 py-2 py-lg-3">
                <div class="py-1">
                  <div class="badge rounded-pill bg-primary-dark">備註</div>
                </div>
                <div class="w-100 py-1">
                  <textarea
                    v-model="request.note"
                    class="form-control reserve-textarea"
                    placeholder="請輸入其他資訊"
                    rows="5"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
          <div class="pt-4 pb-2">
            <div class="row">
              <div class="col-6">
                <button
                  type="button"
                  class="w-100 btn btn-outline-dark-second rounded-5 py-3"
                  :class="{ 'disabled': disabled }"
                  @click="cancel"
                >
                  取消
                </button>
              </div>
              <div class="col-6">
                <button
                  type="button"
                  class="w-100 btn btn-primary rounded-5 py-3"
                  :class="{ 'disabled': disabled }"
                  @click="reserve"
                >
                  確認
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
