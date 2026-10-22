(function (global) {
  global.CatalogApi = {
    devices: async () => (await global.ApiClient.get('/api/devices')).data,
    categories: async () => (await global.ApiClient.get('/api/categories')).data
  };
})(window);
