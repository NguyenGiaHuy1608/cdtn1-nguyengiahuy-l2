(function (global) {
  global.TicketsApi = {
    list: async () => (await global.ApiClient.get('/api/tickets')).data,
    get: async (id) => (await global.ApiClient.get('/api/tickets/' + encodeURIComponent(id))).data,
    create: async (data) => (await global.ApiClient.post('/api/tickets', data)).data
  };
})(window);
