(function (global) {
  global.CatalogApi = {
    devices: async (customerId) => {
      const query = customerId ? '?customer_id=' + encodeURIComponent(customerId) : '';
      return (await global.ApiClient.get('/api/devices' + query)).data;
    },
    createDevice: async (data) => (await global.ApiClient.post('/api/devices', data)).data,
    categories: async () => (await global.ApiClient.get('/api/categories')).data
  };
})(window);
