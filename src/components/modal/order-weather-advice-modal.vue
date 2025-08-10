<script setup>
  import { ref, onMounted, onUnmounted } from 'vue';
  import Modal from 'bootstrap/js/dist/modal';

  const prop = defineProps({
    title: String,
    // orderData: {
    //   type: Object,
    //   required: true
    // },
    message: String
  });
  // const emit = defineEmits(['submitComment']);
  let modal_ref = ref(null);
  let modal;
  let handleModalHide;

  // const formData = ref({
  //   hoverRating: 0,
  //   selectedRating: 0,
  //   comment: ''
  // })

  onMounted(() => {
    modal = new Modal(modal_ref.value);
    const ModalEl = document.getElementById(prop.title);
    handleModalHide = () => {
      document.activeElement?.blur();
    };
    ModalEl?.addEventListener("hide.bs.modal", handleModalHide);
  });
  onUnmounted(() => {
    const ModalEl = document.getElementById(prop.title);
    ModalEl?.removeEventListener("hide.bs.modal", handleModalHide);
  });

  function c_show() {
    modal.show();
    // formData.value.selectedRating = 0;
    // formData.value.comment = '';
  };

  function c_hide() {
    modal.hide();
  }
  
  defineExpose({ 
    p_show: c_show,
    p_hide: c_hide 
  });
  //加入這段到父層
  // import { ref} from 'vue';
  // import Modal from '@/components/modal/order-owner-comment-modal.vue';
  // const thisModal = ref();
  // function showModal(){
  //   thisModal.value.p_show()
  // }
  // function submitComment(Data){
  //   console.log(Data);
  // }
</script>
<template>
  <!-- 加入這段到父層
  <Modal title="Modal1" ref="thisModal" @submit-comment="submitComment">
  </Modal>
  <button @click="showModal">開啟Modal</button> -->
  <div class="modal fade" ref="modal_ref" :id="title" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-body">
          <div class="container-fluid">
            <div class="row mb-3">
              <div v-for="(line, idx) in message.split('\n')" :key="idx" class="mb-1">
                <span v-if="line.startsWith('- ')">• {{ line.slice(2) }}</span>
                <span v-else>{{ line }}</span>
              </div>

                <!-- <p> {{ message }}</p> -->
                <!-- <label for="note" class="col-sm-2 col-form-label text-sm-end">評分</label>
                <div id="star" class="col-sm-10 mb-2">
                  <i
                    v-for="i in 5"
                    :key="i"
                    class="bi pe-1"
                    :class="[
                      i <= (formData.hoverRating || formData.selectedRating)
                        ? 'bi-star-fill text-warning'
                        : 'bi-star text-muted'
                    ]"
                    @mouseover="formData.hoverRating = i"
                    @mouseleave="formData.hoverRating = 0"
                    @click="formData.selectedRating = i"
                  ></i>
                </div>
                <label for="comment" class="col-sm-2 col-form-label text-sm-end">評論</label>
                <div class="col-sm-10">
                  <textarea id="comment" class="form-control" style="height: 100px" :maxlength="200" placeholder="請填寫200字內的評論" v-model="formData.comment"></textarea>
                </div> -->
            </div>
            <!-- <div class="row">
              <div class="col">
                <button class="btn btn-outline-primary btn-lg rounded-pill w-100" data-bs-dismiss="modal">取消</button>
              </div>
              <div class="col">
                <button class="btn btn-primary btn-lg rounded-pill w-100" data-bs-dismiss="modal" @click="emit('submitComment', formData, orderData)">送出</button>
              </div>
            </div> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<!-- <style scoped>
  i {
    cursor: pointer; font-size: 24px;
  }
</style> -->

