/* UI controller only. HTTP requests live in static/api/*.api.js and client.js. */
(() => {
  const $ = (id) => document.getElementById(id);
  const state = { customers: [], devices: [], categories: [], tickets: [], selectedTicketId: null };
  const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const prettyPriority = (value) => ({ CAO: 'Cao', TRUNG_BINH: 'Trung bình', THAP: 'Thấp' }[value] || value || '—');
  const prettyStatus = (value) => ({ MOI: 'Mới tiếp nhận', DANG_XU_LY: 'Đang xử lý', HOAN_TAT: 'Hoàn tất', HUY: 'Đã hủy' }[value] || value || '—');
  const dateText = (value) => value ? new Date(value.replace(' ', 'T')).toLocaleString('vi-VN') : '—';

  function setState(id, type, message, retry) {
    const element = $(id);
    if (!element) return;
    element.hidden = false;
    element.className = `data-state ${type || ''}`;
    element.replaceChildren();
    const text = document.createElement('span');
    text.textContent = message || '';
    element.appendChild(text);
    if (retry) {
      const button = document.createElement('button');
      button.type = 'button'; button.className = 'text-button'; button.textContent = 'Thử lại';
      button.addEventListener('click', retry);
      element.appendChild(button);
    }
  }
  function clearState(id) { const el = $(id); if (el) { el.hidden = true; el.replaceChildren(); } }
  function showView(name) {
    document.querySelectorAll('.view').forEach((view) => {
      const active = view.id === `view-${name}`;
      view.classList.toggle('active', active); view.hidden = !active;
    });
    document.querySelectorAll('.nav-link').forEach((button) => button.classList.toggle('active', button.dataset.view === name));
    if (name === 'tickets') loadTickets();
    if (name === 'catalog') loadCatalog();
    if (name === 'detail' && state.selectedTicketId) loadTicketDetail(state.selectedTicketId);
  }
  document.querySelectorAll('.nav-link').forEach((button) => button.addEventListener('click', () => showView(button.dataset.view)));
  $('refresh-tickets').addEventListener('click', loadTickets);
  $('back-to-tickets').addEventListener('click', () => showView('tickets'));
  $('refresh-catalog').addEventListener('click', loadCatalog);

  async function loadCustomers() {
    setState('customer-search-state', 'loading', 'Đang tải danh sách khách hàng…');
    try {
      state.customers = await CustomersApi.list();
      renderCustomerOptions();
      clearState('customer-search-state');
      return state.customers;
    } catch (error) {
      setState('customer-search-state', 'error', `Không tải được khách hàng: ${error.message}`, loadCustomers);
      throw error;
    }
  }
  function renderCustomerOptions() {
    const select = $('ticket-customer');
    const previous = select.value;
    select.innerHTML = '<option value="">Chọn khách hàng</option>' + state.customers.map((c) => `<option value="${c.customer_id}">${escapeHtml(c.full_name)} · ${escapeHtml(c.phone)} (ID ${c.customer_id})</option>`).join('');
    if (state.customers.some((c) => String(c.customer_id) === previous)) select.value = previous;
  }
  async function loadPickerData() {
    setState('device-picker-state', 'loading', 'Đang tải dữ liệu khách hàng, thiết bị và nhóm lỗi…');
    try {
      const results = await Promise.all([CustomersApi.list(), CatalogApi.devices(), CatalogApi.categories()]);
      [state.customers, state.devices, state.categories] = results;
      renderCustomerOptions();
      $('ticket-device').innerHTML = '<option value="">Chọn thiết bị</option>' + state.devices.map((d) => `<option value="${d.device_id}" data-customer="${d.customer_id}" ${d.warranty_status === 'HET_HAN' ? 'disabled' : ''}>${escapeHtml(d.serial_no)} · ${escapeHtml(d.customer_name)} · ${d.warranty_status === 'HET_HAN' ? 'Hết hạn' : 'Còn hạn'}</option>`).join('');
      $('ticket-category').innerHTML = '<option value="">Chọn nhóm lỗi</option>' + state.categories.map((c) => `<option value="${c.category_id}">${escapeHtml(c.category_name)}${c.description ? ' · ' + escapeHtml(c.description) : ''}</option>`).join('');
      if (!state.customers.length || !state.devices.length || !state.categories.length) {
        setState('device-picker-state', 'empty', 'Một hoặc nhiều danh mục chưa có dữ liệu. Hãy kiểm tra database/seed.');
      } else clearState('device-picker-state');
    } catch (error) {
      setState('device-picker-state', 'error', `Không tải được dữ liệu nền: ${error.message}`, loadPickerData);
    }
  }
  $('ticket-device').addEventListener('change', (event) => {
    const option = event.target.selectedOptions[0];
    if (option && option.dataset.customer) $('ticket-customer').value = option.dataset.customer;
  });

  $('customer-search-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const phone = new FormData(event.currentTarget).get('phone');
    const output = $('customer-result');
    output.className = 'result-card'; output.textContent = 'Đang tra cứu khách hàng…';
    try {
      const customer = await CustomersApi.findByPhone(phone);
      output.innerHTML = `<div class="result-top"><div><span class="eyebrow">HỒ SƠ KHÁCH HÀNG</span><h4>${escapeHtml(customer.full_name)}</h4></div><span class="count-pill">ID ${customer.customer_id}</span></div><dl class="detail-list"><div><dt>Số điện thoại</dt><dd>${escapeHtml(customer.phone)}</dd></div><div><dt>Email</dt><dd>${escapeHtml(customer.email || 'Chưa cập nhật')}</dd></div><div><dt>Ngày tạo</dt><dd>${escapeHtml(dateText(customer.created_at))}</dd></div></dl>`;
      $('ticket-customer').value = String(customer.customer_id);
    } catch (error) {
      output.className = 'result-card error-card'; output.textContent = error.message;
    }
  });

  $('customer-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = event.currentTarget; const button = form.querySelector('button[type="submit"]');
    button.disabled = true; button.textContent = 'Đang tạo…'; $('customer-msg').textContent = '';
    try {
      const customer = await CustomersApi.create(Object.fromEntries(new FormData(form)));
      $('customer-msg').className = 'form-message success'; $('customer-msg').textContent = `Tạo khách hàng thành công · ID ${customer.customer_id}`;
      form.reset(); await loadPickerData();
      $('ticket-customer').value = String(customer.customer_id);
    } catch (error) {
      $('customer-msg').className = 'form-message error'; $('customer-msg').textContent = error.message;
    } finally { button.disabled = false; button.textContent = 'Tạo khách hàng'; }
  });

  $('ticket-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = event.currentTarget; const button = $('create-ticket-button');
    button.disabled = true; button.textContent = 'Đang tạo phiếu…';
    $('ticket-msg').className = 'form-message'; $('ticket-msg').textContent = '';
    try {
      const ticket = await TicketsApi.create(Object.fromEntries(new FormData(form)));
      $('ticket-msg').className = 'form-message success'; $('ticket-msg').textContent = `Tạo phiếu thành công · ${ticket.ticket_code}`;
      state.selectedTicketId = ticket.ticket_id;
      form.reset(); await loadPickerData();
      await loadTickets();
      showView('detail');
    } catch (error) {
      $('ticket-msg').className = 'form-message error'; $('ticket-msg').textContent = error.message;
    } finally { button.disabled = false; button.textContent = 'Tạo phiếu bảo hành'; }
  });

  async function loadTickets() {
    setState('tickets-state', 'loading', 'Đang tải danh sách phiếu…'); $('tickets-table-wrap').replaceChildren();
    try {
      state.tickets = await TicketsApi.list();
      clearState('tickets-state');
      if (!state.tickets.length) { setState('tickets-state', 'empty', 'Chưa có phiếu bảo hành nào. Hãy tạo phiếu đầu tiên ở màn hình Tiếp nhận.'); return; }
      $('tickets-table-wrap').innerHTML = `<table><thead><tr><th>Mã phiếu</th><th>Khách hàng</th><th>Thiết bị</th><th>Ưu tiên</th><th>Trạng thái</th><th>Hạn xử lý</th><th></th></tr></thead><tbody>${state.tickets.map((t) => `<tr><td><strong>${escapeHtml(t.ticket_code)}</strong><small>ID ${t.ticket_id}</small></td><td>${escapeHtml(t.full_name)}<small>${escapeHtml(t.phone)}</small></td><td>${escapeHtml(t.serial_no)}</td><td><span class="priority priority-${escapeHtml(t.priority).toLowerCase()}">${escapeHtml(prettyPriority(t.priority))}</span></td><td><span class="status-badge">${escapeHtml(prettyStatus(t.status))}</span></td><td>${escapeHtml(dateText(t.due_date))}</td><td><button class="text-button" data-ticket-id="${t.ticket_id}" type="button">Xem chi tiết →</button></td></tr>`).join('')}</tbody></table>`;
      $('tickets-table-wrap').querySelectorAll('[data-ticket-id]').forEach((button) => button.addEventListener('click', () => { state.selectedTicketId = button.dataset.ticketId; showView('detail'); }));
    } catch (error) { setState('tickets-state', 'error', `Không tải được danh sách: ${error.message}`, loadTickets); }
  }

  async function loadTicketDetail(id) {
    state.selectedTicketId = id;
    setState('ticket-detail-state', 'loading', 'Đang tải chi tiết phiếu…'); $('ticket-detail-content').replaceChildren();
    try {
      const t = await TicketsApi.get(id);
      clearState('ticket-detail-state');
      $('ticket-detail-content').innerHTML = `<div class="detail-hero"><div><span class="eyebrow">MÃ PHIẾU</span><h3>${escapeHtml(t.ticket_code)}</h3><p>Tiếp nhận lúc ${escapeHtml(dateText(t.received_at))}</p></div><span class="status-badge large">${escapeHtml(prettyStatus(t.status))}</span></div><div class="detail-grid"><section><h4>Khách hàng</h4><dl class="detail-list"><div><dt>Họ tên</dt><dd>${escapeHtml(t.full_name)}</dd></div><div><dt>Số điện thoại</dt><dd>${escapeHtml(t.phone)}</dd></div><div><dt>Email</dt><dd>${escapeHtml(t.email || 'Chưa cập nhật')}</dd></div></dl></section><section><h4>Thiết bị</h4><dl class="detail-list"><div><dt>Số serial</dt><dd>${escapeHtml(t.serial_no)}</dd></div><div><dt>Ngày mua</dt><dd>${escapeHtml(t.purchase_date)}</dd></div><div><dt>Bảo hành</dt><dd>${escapeHtml(t.warranty_months)} tháng</dd></div></dl></section><section><h4>Phân loại yêu cầu</h4><dl class="detail-list"><div><dt>Nhóm lỗi</dt><dd>${escapeHtml(t.category_name || 'Chưa phân loại')}</dd></div><div><dt>Mức ưu tiên</dt><dd>${escapeHtml(prettyPriority(t.priority))}</dd></div><div><dt>Hạn xử lý</dt><dd>${escapeHtml(dateText(t.due_date))}</dd></div></dl></section><section><h4>Mô tả sự cố</h4><p class="issue-description">${escapeHtml(t.issue_desc)}</p></section></div>`;
    } catch (error) { setState('ticket-detail-state', 'error', `Không tải được chi tiết: ${error.message}`, () => loadTicketDetail(id)); }
  }

  async function loadCatalog() {
    setState('catalog-customers-state', 'loading', 'Đang tải danh sách khách hàng…');
    setState('devices-state', 'loading', 'Đang tải danh sách thiết bị…');
    setState('categories-state', 'loading', 'Đang tải nhóm lỗi…');
    $('catalog-customers-table-wrap').replaceChildren(); $('devices-table-wrap').replaceChildren(); $('categories-table-wrap').replaceChildren();
    try {
      const [customers, devices, categories] = await Promise.all([CustomersApi.list(), CatalogApi.devices(), CatalogApi.categories()]);
      state.customers = customers; state.devices = devices; state.categories = categories;
      $('customer-count').textContent = `${customers.length} khách hàng`;
      if (!customers.length) setState('catalog-customers-state', 'empty', 'Chưa có khách hàng trong database.');
      else { clearState('catalog-customers-state'); $('catalog-customers-table-wrap').innerHTML = `<table><thead><tr><th>Khách hàng</th><th>Liên hệ</th></tr></thead><tbody>${customers.map((c) => `<tr><td><strong>${escapeHtml(c.full_name)}</strong><small>ID ${c.customer_id}</small></td><td>${escapeHtml(c.phone)}<small>${escapeHtml(c.email || 'Chưa có email')}</small></td></tr>`).join('')}</tbody></table>`; }
      $('device-count').textContent = `${devices.length} thiết bị`; $('category-count').textContent = `${categories.length} nhóm lỗi`;
      if (!devices.length) setState('devices-state', 'empty', 'Chưa có thiết bị trong database.');
      else { clearState('devices-state'); $('devices-table-wrap').innerHTML = `<table><thead><tr><th>Serial</th><th>Khách hàng</th><th>Ngày mua</th><th>Bảo hành</th></tr></thead><tbody>${devices.map((d) => `<tr><td><strong>${escapeHtml(d.serial_no)}</strong><small>ID ${d.device_id}</small></td><td>${escapeHtml(d.customer_name)}<small>${escapeHtml(d.customer_phone)}</small></td><td>${escapeHtml(d.purchase_date)}</td><td><span class="${d.warranty_status === 'CON_HAN' ? 'status-badge' : 'status-badge expired'}">${d.warranty_status === 'CON_HAN' ? 'Còn hạn' : 'Hết hạn'}</span><small>${escapeHtml(d.warranty_expires_on || '—')}</small></td></tr>`).join('')}</tbody></table>`; }
      if (!categories.length) setState('categories-state', 'empty', 'Chưa có nhóm lỗi trong database.');
      else { clearState('categories-state'); $('categories-table-wrap').innerHTML = `<table><thead><tr><th>Tên nhóm lỗi</th><th>Mô tả</th></tr></thead><tbody>${categories.map((c) => `<tr><td><strong>${escapeHtml(c.category_name)}</strong><small>ID ${c.category_id}</small></td><td>${escapeHtml(c.description || '—')}</td></tr>`).join('')}</tbody></table>`; }
    } catch (error) {
      setState('catalog-customers-state', 'error', `Không tải được khách hàng: ${error.message}`, loadCatalog);
      setState('devices-state', 'error', `Không tải được thiết bị: ${error.message}`, loadCatalog);
      setState('categories-state', 'error', `Không tải được nhóm lỗi: ${error.message}`, loadCatalog);
    }
  }

  function showLogin(message = '') {
    $('login-view').hidden = false;
    $('app-shell').hidden = true;
    $('login-message').className = message ? 'form-message error' : 'form-message';
    $('login-message').textContent = message;
  }
  function showApp() {
    $('login-view').hidden = true;
    $('app-shell').hidden = false;
    loadPickerData();
    checkHealth();
  }
  $('login-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const button = form.querySelector('button[type="submit"]');
    button.disabled = true; button.textContent = 'Đang đăng nhập…';
    $('login-message').className = 'form-message'; $('login-message').textContent = '';
    try {
      const result = await ApiClient.post('/api/login', Object.fromEntries(new FormData(form)));
      sessionStorage.setItem('warranty_api_token', result.token);
      showApp();
    } catch (error) {
      $('login-message').className = 'form-message error';
      $('login-message').textContent = error.message;
    } finally { button.disabled = false; button.textContent = 'Đăng nhập'; }
  });
  $('logout-button').addEventListener('click', () => {
    sessionStorage.removeItem('warranty_api_token');
    showLogin('Bạn đã đăng xuất khỏi hệ thống.');
  });
  window.addEventListener('auth:unauthorized', () => showLogin('Phiên đăng nhập hết hạn hoặc không hợp lệ. Vui lòng đăng nhập lại.'));

  async function checkHealth() {
    const target = $('api-health');
    try { await ApiClient.get('/api/health'); target.innerHTML = '<span class="status-dot"></span> API đang hoạt động'; target.classList.add('healthy'); }
    catch (_) { target.innerHTML = '<span class="status-dot offline"></span> Không kết nối được API'; target.classList.remove('healthy'); }
  }

  if (sessionStorage.getItem('warranty_api_token')) showApp();
  else showLogin();
})();
