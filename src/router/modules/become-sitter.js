import BecomeSitterPage from '@/views/BecomeSitterPage.vue'

const becomeSitterRouter = {
  path: 'become-a-sitter',
  name: 'becomesitter',
  component: BecomeSitterPage,
  meta: {
    verification_required: false,
    accept_role: 'owner',
  },
}

export default becomeSitterRouter
