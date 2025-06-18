import service from '@/plugins/axios';
import servicePage from '@/plugins/axios-page';
const root1 = '/api/owners/orders';
const root2 = '/api/orders';

export function getOrder(params) {
  return servicePage({
    url: `${root1}`,
    method: 'get',
    params,
  });
}

export function getSamedayOrder(id) {
  return service({
    url: `${root2}/${id}/same-date/accepted`,
    method: 'get'
  });
}

export function patchOrder(id, data) {
  return service({
    url: `${root2}/${id}`,
    method: 'patch',
    data,
  });
}

export function postPayment(id) {
  return service({
    url: `${root2}/${id}/payment`,
    method: 'post'
  });
}

export function postReview(id, data) {
  return service({
    url: `${root2}/${id}/review`,
    method: 'post',
    data
  });
}
