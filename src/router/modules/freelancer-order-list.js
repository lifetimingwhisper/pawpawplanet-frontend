import freelancerOrderList from '@/views/FreelancerOrderList.vue'

const freelancerOrderListRouter = {
  path: 'freelancer-order-list',
  name: 'freelancerorderlist',
  component: freelancerOrderList,
  meta: {
    verification_required: true,
    accept_role: 'freelancer',
  },
}

export default freelancerOrderListRouter
