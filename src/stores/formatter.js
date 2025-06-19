import { computed } from 'vue';

export default function formatter(data) {
  //資料轉換
  const formatMapping = {
    species_id: { 0: '貓', 1: '狗' },
    gender: { 0: '男生', 1: '女生' },
    is_ligation: { true: '是', false: '否' },
    size: { 0: '小型-10公斤以下', 1: '中型-10公斤以上，20公斤以下', 2: '大型-20公斤以上' },
    size_id: { 0: '小型-10公斤以下', 1: '中型-10公斤以上，20公斤以下', 2: '大型-20公斤以上' },
    tag: { 0: '等待接受', 1: '等待付款', 2: '即將執行', 3: '最新回應', 4: '結案' },
    payment_method: { 0: '信用卡', 1: 'ATM', 2: '其他' },
    status: { 0: '飼主請求預約', 1: '保姆接受預約', 2: '飼主完成付款', 3: '保姆拒絕預約', 4: '飼主取消預約', 5: '飼主逾期未付款', 6: '保姆逾期未回覆', 7: '訂單完成' }
  };
  // const formatData = (key) => computed(() => formatMapping[key][data.value[key]] || null);
  const formatData = (key) => computed(() => formatMapping[key][data[key]] || null);

  //服務類型轉換
  const serviceTypes = [
    { name: '寵物寄宿/日托', icon: 'pet_boarding' },
    { name: '寵物散步', icon: 'pet_walking' },
    { name: '寵物美容', icon: 'pet_grooming' },
    { name: '到府服務', icon: 'home_care' }
  ];
  const formatServerTypeData = (key) => computed(() => serviceTypes[data[key]] || null);

  const statusTypes = [
    { name: '飼主請求預約' },
    { name: '保姆接受預約' },
    { name: '飼主完成付款' },
    { name: '保姆拒絕預約', bgColor: '#CA4000', icon: 'rejected' },
    { name: '飼主取消預約', bgColor: '#B6B6B6', icon: 'cancelled' },
    { name: '飼主逾期未付款', bgColor: '#CA4000', icon: 'nopay' },
    { name: '保姆逾期未回覆', bgColor: '#CA4000', icon: 'rejected' },
    { name: '訂單完成', bgColor: '#648458', icon: 'completed' }
  ];
  const formatStatusTypeData = (key) => computed(() => statusTypes[data[key]] || null);

  // 計算年齡
  const formatAge = computed(() => {
    if(!data.birthday) return null;
    const birth = new Date(data.birthday);
    const today = new Date();

    let age = today.getFullYear() - birth.getFullYear();
    if(today.getMonth() < birth.getMonth() || (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())) {
      age--;
    }

    return age;
  });

  return {
    formatSpecies: formatData('species_id'),
    formatGender: formatData('gender'),
    formatIsLigation: formatData('is_ligation'),
    formatSize: formatData('size'),
    formatSizeId: formatData('size_id'),
    formatTag: formatData('tag'),
    formatStatus: formatData('status'),
    formatPaymentMethod: formatData('payment_method'),
    formatAge,
    formatServerType: formatServerTypeData('service_type_id'),
    formatStatusType: formatStatusTypeData('status')
  };
}