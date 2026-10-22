(function (global) {
  global.CustomersApi = {
    list: async () => (await global.ApiClient.get('/api/customers')).data,
    findByPhone: async (phone) => (await global.ApiClient.get('/api/customers?phone=' + encodeURIComponent(phone))).data,
    create: async (data) => (await global.ApiClient.post('/api/customers', data)).data
  };
})(window);
