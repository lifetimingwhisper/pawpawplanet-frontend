<script setup>
  import { ref, computed } from 'vue';
  const activeClass = ref('page-link bg-primary rounded-5 border-0');
  const NotActiveClass = ref('page-link bg-transparent border-0');
  const emit = defineEmits(['changePage']);
  const props = defineProps({
    pageData: Object
  });
  
  const countTotalPage = computed(() => {
    return Math.ceil(props.pageData.total /props.pageData.limit)
  });

  const showPages = computed(() => {
    if(countTotalPage.value <= 0 || !countTotalPage.value) return null;
    if(countTotalPage.value === 1) return [1];
    if(countTotalPage.value === 2) return [1, 2];
    if(props.pageData.page === 1) return [1, 2, 3];
    if(props.pageData.page === countTotalPage.value) return [countTotalPage.value - 2, countTotalPage.value - 1, countTotalPage.value];
    return [props.pageData.page - 1, props.pageData.page, props.pageData.page + 1];
  });

  function clickPage(page) {
    if(page !== props.pageData.page && page > 0 && page <= countTotalPage.value) emit('changePage', page);
  }
</script>
<template>
  <div class="flex-center" v-if="showPages">
    <nav aria-label="Page navigation">
      <ul class="pagination gap-2">
        <li class="page-item" :class="{ 'disabled': pageData.page == 1 }" @click="clickPage(pageData.page - 1)">
          <a :class="NotActiveClass" aria-label="Previous">
            <SvgIcon name="chevron_left" size="24"/>
          </a>
        </li>
        <template v-for="page in showPages" :key="page">
          <li class="page-item"
            :class="{ 'active': pageData.page == page }"
            :aria-current="[pageData.page == page ? 'page' : '']"
            @click="clickPage(page)"
          >
            <a :class="[pageData.page == page ? activeClass : NotActiveClass]">{{ page }}</a>
          </li>
        </template>
        <li class="page-item" :class="{ 'disabled': pageData.page == countTotalPage }" @click="clickPage(pageData.page + 1)">
          <a :class="NotActiveClass" aria-label="Next">
            <SvgIcon name="chevron_right" size="24"/>
          </a>
        </li>
      </ul>
    </nav>
  </div>
</template>
<style scoped lang="scss">
  .page-link{
    padding: 2px 10px;
  }
  .page-item{
    &:not(.disabled) {
      cursor: pointer;
    }
  }
</style>
