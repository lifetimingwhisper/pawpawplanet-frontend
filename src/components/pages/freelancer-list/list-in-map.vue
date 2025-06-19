<script setup>
import TabGroup from '@/components/pages/freelancer-list/tab-group.vue'
import SearchFilter from '@/components/pages/freelancer-list/search-filter.vue'
import SortAndNum from '@/components/pages/freelancer-list/sort-and-num.vue'
import BottomDrawer from '@/components/bottom-drawer/bottom-drawer.vue'
import FreelancerCard from '@/components/pages/freelancer-list/freelancer-card.vue'
import {
  ref,
  reactive,
  watch,
  useTemplateRef,
  onMounted,
  nextTick,
  onActivated,
} from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useDeviceStore } from '@/stores/device.js'
import { storeToRefs } from 'pinia'
import { GoogleMap, MarkerCluster, CustomMarker } from 'vue3-google-map'
import { getService } from '@/plugins/api/services/services.js'
import Loading from '@/components/loading/loading-component.vue'
import { format } from 'date-fns'
import calcRating from '@/utils/calculRating.js'

const router = useRouter()

const route = useRoute()

const deviceStore = useDeviceStore()

const { is_mobile } = storeToRefs(deviceStore)

const center = { lat: 25.030724, lng: 121.520076 }

const googleMapKey = import.meta.env.VITE_MAP_KEY

let total = ref(0)

const topHeight = useTemplateRef('freelancer-top')

const freelancerOuter = useTemplateRef('freelancer-outer')

const map = useTemplateRef('map')

let outerHeight = ref(null)

let mapCardWidth = ref(null)

let imgHeightInCard = ref(null)

const isExpand = ref(false)

const zoom = ref(10)

const location = ref('')

const request = reactive({
  page: 1,
  limit: 10,
  service_type_id: 0,
  date: format(new Date(), 'yyyy-MM-dd'),
  min_price: null,
  max_price: null,
  sort: 'newest', // 'newest' || 'oldest' || 'rating',
  city: null,
  area: null,
})

const budge = ref(0)

const date = ref({
  start: new Date(),
  end: new Date(),
})

const list = ref([])

const markerList = ref([])

let loading = ref(false)

let isCache = ref(false)

const chooseService = ref(null)

watch(route, async (newVal) => {
  if (newVal.name === 'freelancerList') {
    await reset()
    await checkRouteQuery(newVal)
    await getServiceList()
  }
})

const expandMap = () => {
  isExpand.value = !isExpand.value
}

const zoomIn = () => {
  zoom.value += 1
}

const zoomOut = () => {
  zoom.value -= 1
}

const getServiceList = async () => {
  loading.value = true
  const res = await getService(request)
  total.value = res.total
  list.value = res.services
  if (res.services.length > 0) {
    res.services.forEach((service) => {
      const obj = {
        position: {
          lat: service.freelancer_info.latitude,
          lng: service.freelancer_info.longitude,
        },
        image: service.image,
        id: service.id,
        price: service.price,
        price_unite: service.price_unit,
        title: service.title,
        rating: service.rating,
        review_count: service.review_count,
        freelancer_info: service.freelancer_info,
      }
      markerList.value.push(obj)
    })
  }
  loading.value = false
}

const checkoutCategory = async (value) => {
  switch (value) {
    case '寵物寄宿/日托':
      request.service_type_id = 0
      await router.push('/service')
      break;
    case '寵物散步':
      request.service_type_id = 1
      await router.push({
        path: '/service',
        query: {
          type: value,
        },
      })
      break;
    case '寵物美容':
      request.service_type_id = 2
      await router.push({
        path: '/service',
        query: {
          type: value,
        },
      })
      break;
    case '到府服務':
      request.service_type_id = 3
      await router.push({
        path: '/service',
        query: {
          type: value,
        },
      })
      break;
  }
}

const updateLocation = async (value) => {
  if (Object.keys(value).length > 0) {
    location.value = `${value.city} ${value.area}`
    request.city = value.city
    request.area = value.area
    await router.push({
      path: '/service',
      query: {
        ...route.query,
        city: value.city,
        area: value.area,
      },
    })
  } else {
    location.value = ''
    request.city = null
    request.area = null
    await router.push({
      path: '/service',
      query: {
        ...route.query,
        city: undefined,
        area: undefined,
      },
    })
  }
}

const updateBudge = async (value) => {
  budge.value = value
  switch (value) {
    case 1:
      request.min_price = null
      request.max_price = 999
      await router.push({
        path: '/service',
        query: {
          ...route.query,
          max_price: request.max_price,
        }
      })
      break;
    case 2:
      request.min_price = 1000
      request.max_price = 1999
      await router.push({
        path: '/service',
        query: {
          ...route.query,
          min_price: request.min_price,
          max_price: request.max_price,
        }
      })
      break;
    case 3:
      request.min_price = 2000
      request.max_price = 2999
      await router.push({
        path: '/service',
        query: {
          ...route.query,
          min_price: request.min_price,
          max_price: request.max_price,
        }
      })
      break;
    case 4:
      request.min_price = 3000
      request.max_price = null
      await router.push({
        path: '/service',
        query: {
          ...route.query,
          min_price: request.min_price,
        }
      })
      break;
    default:
      break;
  }
}

const updateDate = async (value) => {
  let str = ''
  const { start, end } = value
  const startDate = format(start, 'yyyy-MM-dd')
  if (end) {
    const endDate = format(end, 'yyyy-MM-dd')
    if (startDate !== endDate) {
      str += `${startDate},${endDate}`
    } else {
      str += startDate
    }
  } else {
    str += startDate
  }
  request.date = str
  await router.push({
    path: '/service',
    query: {
      ...route.query,
      date: str,
    },
  })
}

const updateSort = async (value) => {
  request.sort = value
  await router.push({
    path: '/service',
    query: {
      ...route.query,
      sort: value === 'newest' ? undefined: value,
    },
  })
}

const reset = async () => {
  request.page = 1
  request.date = format(new Date(), 'yyyy-MM-dd')
  request.min_price = null
  request.max_price = null
  request.city = null
  request.area = null
  request.sort = 'newest'
  budge.value = 0
  date.value.start = new Date()
  date.value.end = new Date()
  location.value = ''
  chooseService.value = null
  markerList.value = []
  zoom.value = 10
}

const checkRouteQuery = async (route) => {
  switch (route.query.type) {
    case '寵物散步':
      request.service_type_id = 1
      break;
    case '寵物美容':
      request.service_type_id = 2
      break;
    case '到府服務':
      request.service_type_id = 3
      break;
    default:
      request.service_type_id = 0
      break;
  }

  if (route.query.city) {
    request.city = route.query.city
  }

  if (route.query.area) {
    request.area = route.query.area
  }

  if (route.query.city && route.query.area) {
    location.value = `${route.query.city} ${route.query.area}`
  }

  if (route.query.sort) {
    request.sort = route.query.sort
  }
  if (parseInt(route.query.max_price) === 999) {
    request.min_price = null
    request.max_price = parseInt(route.query.max_price)
    budge.value = 1
  } else if (parseInt(route.query.min_price) === 1000 && parseInt(route.query.max_price) === 1999) {
    request.min_price = parseInt(route.query.min_price)
    request.max_price = parseInt(route.query.max_price)
    budge.value = 2
  } else if (parseInt(route.query.min_price) === 2000 && parseInt(route.query.max_price) === 2999) {
    request.min_price = parseInt(route.query.min_price)
    request.max_price = parseInt(route.query.max_price)
    budge.value = 3
  } else if (parseInt(route.query.min_price) === 3000) {
    request.min_price = parseInt(route.query.min_price)
    request.max_price = null
    budge.value = 4
  } else {
    request.min_price = null
    request.max_price = null
    budge.value = 0
  }

  if (route.query.date) {
    const dateStr = route.query.date.split(',')
    request.date = route.query.date
    date.value.start = new Date(dateStr[0])
    if (dateStr.length > 1) {
      date.value.end = new Date(dateStr[1])
    }
  }
}

const checkMarker = (location) => {
  center.lat = location.position.lat
  center.lng = location.position.lng
  chooseService.value = location.id
}

const closeDetail = () => {
  chooseService.value = null
}

onMounted(async () => {
  await nextTick(() => {
    if (!is_mobile.value) {
      // 計算列表的高度
      outerHeight.value = freelancerOuter.value.offsetHeight - topHeight.value.offsetHeight - 24
    } else {
      outerHeight.value = 560 - topHeight.value.offsetHeight - 40
    }
    // 先計算 map 可視區寬度，再計算卡片顯示的寬度
    mapCardWidth.value = map.value.offsetWidth * 0.576
    imgHeightInCard.value = (mapCardWidth.value - 40) * 0.705
  })
  await reset()
  await checkRouteQuery(route)
  await getServiceList()
})

onActivated(() => {
  isCache.value = true
})
</script>
<template>
  <div ref="freelancer-outer" class="border border-primary freelancer-list-section">
    <div class="h-100 row g-0">
      <div class="col-6 d-none d-lg-block" :class="{ 'd-none': isExpand }">
        <div class="w-100 h-100 freelancer-list-search bg-white">
          <div ref="freelancer-top" class="w-100">
            <TabGroup :freelancer-type="request.service_type_id" @press="checkoutCategory" />
            <SearchFilter
              v-model:location="location"
              v-model:date="date"
              v-model:budge="budge"
              :cond="request"
              @update-budge="updateBudge"
              @update-date="updateDate"
              @update-location="updateLocation"
            />
            <SortAndNum :select-value="request.sort" :total="total" @update-sort="updateSort"/>
          </div>
          <div class="w-100 pb-4 freelancer-list-items" :style="{ 'height': `${outerHeight}px` }">
            <template v-if="loading">
              <div class="w-100 h-100 py-2 d-flex justify-content-center align-items-center">
                <Loading :show="loading" />
              </div>
            </template>
            <template v-else>
              <template v-if="list.length > 0">
                <div class="row gy-2">
                  <div v-for="(item, key) in list" class="col-12 py-2" :key="key">
                    <FreelancerCard :item="item" />
                  </div>
                </div>
              </template>
              <template v-else>
                <div class="w-100 h-100 py-2 d-flex justify-content-center align-items-center">
                  <p class="freelancer-list-items-nodata">無資料</p>
                </div>
              </template>
            </template>
          </div>
        </div>
      </div>
      <div class="col-lg-6" :class="{ 'col-12': isExpand }">
        <div ref="map" class="w-100 h-100 position-relative">
          <GoogleMap
            :api-key="googleMapKey"
            style="width: 100%; height: 100%"
            :center="center"
            :zoom="zoom"
            :fullscreenControl="false"
            :rotateControl="false"
            :scaleControl="false"
            :streetViewControl="false"
            :mapTypeControl="false"
          >
            <MarkerCluster>
              <CustomMarker
                v-for="(location, key) in markerList"
                :options="{
                  position: location.position,
                  anchorPoint: 'BOTTOM_CENTER',
                  clickable: true,
                }"
                :key="key"
              >
                <div class="position-relative">
                  <button
                    type="button"
                    class="freelancer-list-location bg-primary-dark-second rounded-circle d-flex justify-content-center align-items-center"
                    :class="{ 'choose': chooseService === location.id }"
                    @click="checkMarker(location)"
                  >
                    <SvgIcon name="pet_boarding" color="white" :size="54" />
                  </button>
                  <RouterLink
                    :to="{ path: `/service/${location.id}` }"
                    class="position-absolute text-decoration-none freelancer-list-location-card bg-white"
                    :class="{ 'd-block': chooseService === location.id }"
                    :style="{ 'width': `${mapCardWidth}px` }"
                  >
                    <div
                      ref="img-in-card"
                      class="position-relative w-100 overflow-hidden freelancer-list-location-card-top"
                      :style="{ 'height': `${imgHeightInCard}px` }"
                    >
                      <img class="w-100 h-100 object-fit-cover" :src="location.image" alt="">
                      <button
                        type="button"
                        class="btn position-absolute freelancer-list-location-card-btn p-1 bg-white rounded-circle d-flex justify-content-center align-items-center"
                        @click.stop.prevent="closeDetail"
                      >
                        <SvgIcon name="cancel" color="#452B14" :size="is_mobile ? 20 : 44" />
                      </button>
                      <div class="position-absolute rounded-pill bg-primary d-flex align-items-center freelancer-list-card-badge p-1" style="bottom: 16px; left: 16px">
                        <SvgIcon name="map" color="#452B14" :size="is_mobile ? 20 : 24" />
                        <p class="fw-bold text-primary-dark-second">
                          {{ `${location.freelancer_info.city} ${location.freelancer_info.area}` }}
                        </p>
                      </div>
                    </div>
                    <div class="w-100 pt-2">
                      <div class="w-100">
                        <p class="fw-bold text-primary-dark-second freelancer-list-card-name">
                          {{ location.title }}
                        </p>
                      </div>
                      <div class="w-100 py-2">
                        <div class="row gx-1 align-items-center">
                          <div v-for="(index) in 5" class="px-1" :style="{ 'width': is_mobile ? '20px' : '32px' }" :key="index">
                            <SvgIcon name="star" :size="is_mobile ? 16 : 24" :color="calcRating(location.rating, index)" />
                          </div>
                          <div class="col">
                            <div class="px-2">
                              <p class="freelancer-list-card-comment text-black-700">
                                {{ `(${location.review_count}則評論)` }}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </RouterLink>
                </div>
              </CustomMarker>
            </MarkerCluster>
          </GoogleMap>
          <div class="freelancer-list-sidebar position-absolute d-none d-lg-none">
            <button
              type="button"
              class="btn freelancer-list-expand bg-white rounded-circle d-flex align-items-center justify-content-center"
              @click="expandMap"
            >
              <SvgIcon name="zoom" color="#452B14" :size="32" />
            </button>
            <div class="py-4">
              <div class="freelancer-list-zoom d-flex flex-column bg-white">
                <button
                  type="button"
                  class="btn freelancer-list-zoom-btn d-flex justify-content-center align-items-center"
                  @click="zoomIn"
                >
                  <SvgIcon name="add" color="#452B14" :size="32" />
                </button>
                <div class="w-100 px-2">
                  <div class="w-100 freelancer-list-divide"></div>
                </div>
                <button
                  type="button"
                  class="btn freelancer-list-zoom-btn d-flex justify-content-center align-items-center"
                  @click="zoomOut"
                >
                  <SvgIcon name="reduce" color="#452B14" :size="32" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <BottomDrawer ref="drawerRef">
    <div ref="freelancer-top" class="w-100">
      <TabGroup :freelancer-type="request.service_type_id" @press="checkoutCategory" />
      <SearchFilter
        v-model:location="location"
        v-model:date="date"
        v-model:budge="budge"
        :cond="request"
        @update-budge="updateBudge"
        @update-date="updateDate"
        @update-location="updateLocation"
      />
      <SortAndNum :select-value="request.sort" :total="total" @update-sort="updateSort"/>
    </div>
    <div class="w-100 pb-4 freelancer-list-items" :style="{ 'height': `${outerHeight}px` }">
      <template v-if="loading">
        <div class="w-100 h-100 py-2 d-flex justify-content-center align-items-center">
          <Loading :show="loading" />
        </div>
      </template>
      <template v-else>
        <template v-if="list.length > 0">
          <div class="row gy-2">
            <div v-for="(item, key) in list" class="col-12 py-2" :key="key">
              <FreelancerCard :item="item" />
            </div>
          </div>
        </template>
        <template v-else>
          <div class="w-100 h-100 py-2 d-flex justify-content-center align-items-center">
            <p class="freelancer-list-items-nodata">無資料</p>
          </div>
        </template>
      </template>
    </div>
  </BottomDrawer>
</template>
