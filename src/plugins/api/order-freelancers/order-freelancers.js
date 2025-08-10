import service from '@/plugins/axios';
import servicePage from '@/plugins/axios-page';
const root1 = '/api/freelancers/orders';
const root2 = '/api/orders/';

export function getOrder(params) {
  return servicePage({
    url: `${root1}`,
    method: 'get',
    params,
  });
}

export function getSamedayOrder(id) {
  return service({
    url: `/api/orders/${id}/same-date/requested`,
    method: 'get'
  });
}

export function patchOrder(id, data) {
  return service({
    url: `${root2}${id}`,
    method: 'patch',
    data,
  });
}

export function generateWeatherAdvice(data) {
  return service({
    url: `${root2}weather-advice`,
    method: 'post',
    data
  });
}
