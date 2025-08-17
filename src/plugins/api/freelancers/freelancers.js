import service from '@/plugins/axios.js';

const root = '/api/freelancers';

export function getFreelancerProfile(data) {
  return service({
    url: `${root}/profile`,
    method: 'get',
    data,
  });
}

export function updateFreelancerProfile(data) {
  return service({
    url: `${root}/profile`,
    method: 'patch',
    data,
  });
}

export function createOrUpdateService(data) {
  return service({
    url: `${root}/services`,
    method: 'post',
    data,
  });
}

export function getFreelancerServiceDetail(data) {
  return service({
    url: `${root}/services/${data}`,
    method: 'get',
    data,
  });
}

export function getFreelancerSchedule(id) {
  return service({
    url: `${root}/${id}/schedule`,
    method: 'get',
  });
}

export function generateIntroSuggestion(data) {
  return service({
    url: `${root}/profile/intro-suggestion`,
    method: 'post',
    data
  });
}