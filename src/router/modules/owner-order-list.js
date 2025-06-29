import ownerOrderList from '@/views/OwnerOrderList.vue'

const ownerOrderListRouter = {
  path: 'owner-order-list',
  name: 'owner-order-list',
  component: ownerOrderList,
  meta: {
    verification_required: true,
    accept_role: 'owner',
  },
}

export default ownerOrderListRouter
