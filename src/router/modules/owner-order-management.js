import OwnerOrderManagement from '@/views/OwnerOrderManagement.vue'

const ownerOrderManagementRouter = {
  path: '/owner-order-management',
  name: 'owner-order-management',
  component: OwnerOrderManagement,
  meta: {
    verification_required: true,
    accept_role: 'owner',
  },
}

export default ownerOrderManagementRouter
