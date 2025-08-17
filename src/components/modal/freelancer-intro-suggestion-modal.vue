<script setup>
  import { ref, onMounted, onUnmounted, watch } from 'vue';
  import Modal from 'bootstrap/js/dist/modal';

  const prop = defineProps({
    title: String,
    suggestion: String
  });
  const emit = defineEmits(['replaceIntro']);
  let modal_ref = ref(null);
  let modal;
  let handleModalHide;

  const updateIntro = ref(prop.suggestion)

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

  watch(() => prop.suggestion, (val) => {
    updateIntro.value = val;
  });
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
                <div class="col-12">
                  <label class="form-label fw-bold">優化後的自我介紹：</label>
                </div>
                <div class="col-sm-12">
                  <textarea id="comment" class="form-control" style="height: 100px" :maxlength="300" v-model="updateIntro"></textarea>
                </div>
            </div>
            <div class="row">
              <div class="col">
                <button class="btn btn-outline-primary btn-lg rounded-pill w-100" data-bs-dismiss="modal">取消</button>
              </div>
              <div class="col">
                <button class="btn btn-primary btn-lg rounded-pill w-100" data-bs-dismiss="modal" @click="emit('replaceIntro', updateIntro)">取代</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
  i {
    cursor: pointer; font-size: 24px;
  }
</style>

