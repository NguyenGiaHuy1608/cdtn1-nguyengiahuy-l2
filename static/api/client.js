/* Shared API client: UI controllers must not call fetch() directly. */
(function (global) {
  async function request(path, options = {}) {
    const token = sessionStorage.getItem('warranty_api_token');
    const headers = { Accept: 'application/json', ...(options.body ? { 'Content-Type': 'application/json' } : {}), ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(options.headers || {}) };
    const response = await fetch(path, { ...options, headers });
    const contentType = response.headers.get('content-type') || '';
    const body = contentType.includes('application/json') ? await response.json() : null;
    if (response.status === 401 && !path.startsWith('/api/login')) {
      sessionStorage.removeItem('warranty_api_token');
      global.dispatchEvent(new CustomEvent('auth:unauthorized'));
    }
    if (!response.ok) {
      const error = new Error((body && (body.message || body.error)) || `Yêu cầu thất bại (${response.status}).`);
      error.status = response.status;
      throw error;
    }
    return body;
  }
  global.ApiClient = { get: (path) => request(path), post: (path, data) => request(path, { method: 'POST', body: JSON.stringify(data) }) };
})(window);
