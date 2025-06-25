<script setup>
const props = defineProps({
  class: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  prependIcon: {
    type: String,
    default: '',
  },
  prependIconColor: {
    type: String,
  },
  appendIcon: {
    type: String,
    default: '',
  },
  appendIconColor: {
    type: String,
  },
  iconSize: {
    type: Number,
  },
  loading: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['onPress'])
const onClick = (value) => {
  emit('onPress', value)
}
</script>
<template>
  <button type="button" class="btn custom-btn fw-bold" :class="props.class" @click="onClick">
    <span
      v-if="loading"
      class="spinner-border spinner-border-sm d-inline-block mx-1"
      role="status"
      style="opacity: 0.8"
    >
    </span>
    <SvgIcon
      v-if="prependIcon.length > 0"
      :name="prependIcon"
      :color="prependIconColor"
      :size="iconSize"
      class="me-2"
    />
    <span class="d-inline-block">
      {{ text }}
    </span>
    <SvgIcon
      v-if="appendIcon.length > 0"
      :name="appendIcon"
      :color="appendIconColor"
      :size="iconSize"
      class="ms-2"
    />
  </button>
</template>
