(function (global) {
  global.CustomersApi = {
    list: async () => (await global.ApiClient.get('/api/customers')).data,
    findByPhone: async (phone) => (await global.ApiClient.get('/api/customers?phone=' + encodeURIComponent(phone))).data,
    create: async (data) => (await global.ApiClient.post('/api/customers', data)).data,
    update: async (id, data) => (await global.ApiClient.put('/api/customers/' + encodeURIComponent(id), data)).data,
    remove: async (id) => (await global.ApiClient.delete('/api/customers/' + encodeURIComponent(id))).data
  };
})(window);
