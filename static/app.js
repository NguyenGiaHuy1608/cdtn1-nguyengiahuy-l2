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
  const successTimers = new Map();
  function showSuccessMessage(id, message, duration = 3500) {
    const element = $(id);
    if (!element) return;
    clearTimeout(successTimers.get(id));
    element.className = 'form-message success';
    element.textContent = message;
    successTimers.set(id, setTimeout(() => {
      if (element.textContent === message) { element.textContent = ''; element.className = 'form-message'; }
      successTimers.delete(id);
    }, duration));
  }
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
  $('export-ticket').addEventListener('click', exportSelectedTicket);
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
  function renderDeviceOptions(customerId) {
    const select = $('ticket-device');
    const devices = customerId
      ? state.devices.filter((device) => String(device.customer_id) === String(customerId))
      : [];
    select.innerHTML = '<option value="">Chọn thiết bị</option>' + devices.map((d) => {
      const brand = d.brand && d.brand !== 'Khác' ? d.brand : 'Chưa rõ hãng';
      const model = d.model && d.model !== 'Chưa cập nhật' ? d.model : 'Chưa cập nhật model';
      return `<option value="${d.device_id}" data-customer="${d.customer_id}">${escapeHtml(d.device_type || 'Thiết bị')} · ${escapeHtml(brand)} ${escapeHtml(model)} · Serial: ${escapeHtml(d.serial_no)}</option>`;
    }).join('');
    if (customerId && !devices.length) {
      setState('device-picker-state', 'empty', 'Khách hàng này chưa có thiết bị. Nhấn “+ Thêm thiết bị” để đăng ký.');
    } else if (customerId) clearState('device-picker-state');
  }

  async function loadPickerData() {
    setState('device-picker-state', 'loading', 'Đang tải dữ liệu khách hàng, thiết bị và nhóm lỗi…');
    try {
      const results = await Promise.all([CustomersApi.list(), CatalogApi.devices(), CatalogApi.categories()]);
      [state.customers, state.devices, state.categories] = results;
      renderCustomerOptions();
      renderDeviceOptions($('ticket-customer').value);
      $('ticket-category').innerHTML = '<option value="">Chọn nhóm lỗi</option>' + state.categories.map((c) => `<option value="${c.category_id}">${escapeHtml(c.category_name)}${c.description ? ' · ' + escapeHtml(c.description) : ''}</option>`).join('');
      if (!state.customers.length) setState('device-picker-state', 'empty', 'Chưa có khách hàng. Hãy tạo hồ sơ khách hàng trước.');
      else if (!state.categories.length) setState('device-picker-state', 'empty', 'Chưa có nhóm lỗi trong database.');
      else if (!$('ticket-customer').value) setState('device-picker-state', 'empty', 'Hãy chọn khách hàng để xem thiết bị đã đăng ký.');
      else if (state.devices.some((d) => String(d.customer_id) === $('ticket-customer').value)) clearState('device-picker-state');
    } catch (error) {
      setState('device-picker-state', 'error', `Không tải được dữ liệu nền: ${error.message}`, loadPickerData);
    }
  }

  $('ticket-customer').addEventListener('change', (event) => renderDeviceOptions(event.target.value));

  $('ticket-device').addEventListener('change', (event) => {
    const option = event.target.selectedOptions[0];
    if (option && option.dataset.customer) $('ticket-customer').value = option.dataset.customer;
  });

  const addDeviceButton = $('add-device-button');
  const deviceCreatePanel = $('device-create-panel');
  const deviceCreateForm = $('device-create-form');
  const deviceCreateMessage = $('device-create-msg');

  addDeviceButton.addEventListener('click', () => {
    const customerId = $('ticket-customer').value;
    if (!customerId) {
      setState('device-picker-state', 'error', 'Vui lòng chọn khách hàng trước khi thêm thiết bị.');
      return;
    }
    deviceCreatePanel.hidden = !deviceCreatePanel.hidden;
    if (!deviceCreatePanel.hidden) {
      const dateInput = deviceCreateForm.elements.purchase_date;
      if (!dateInput.value) dateInput.value = new Date().toISOString().slice(0, 10);
      deviceCreateMessage.textContent = '';
      deviceCreateForm.elements.brand.focus();
    }
  });

  $('cancel-add-device').addEventListener('click', () => {
    deviceCreatePanel.hidden = true;
    deviceCreateForm.reset();
  });

  deviceCreateForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const customerId = $('ticket-customer').value;
    if (!customerId) {
      deviceCreateMessage.className = 'form-message error';
      deviceCreateMessage.textContent = 'Vui lòng chọn khách hàng trước khi lưu thiết bị.';
      return;
    }
    const button = deviceCreateForm.querySelector('button[type="submit"]');
    button.disabled = true;
    button.textContent = 'Đang lưu…';
    deviceCreateMessage.className = 'form-message';
    deviceCreateMessage.textContent = '';
    try {
      const payload = Object.fromEntries(new FormData(deviceCreateForm));
      payload.customer_id = Number(customerId);
      payload.warranty_months = Number(payload.warranty_months);
      const device = await CatalogApi.createDevice(payload);
      state.devices.push(device);
      renderDeviceOptions(customerId);
      $('ticket-device').value = String(device.device_id);
      deviceCreatePanel.hidden = true;
      deviceCreateForm.reset();
      showSuccessMessage('device-create-msg', 'Đã lưu thiết bị vào database và liên kết với khách hàng.');
      clearState('device-picker-state');
      if ($('view-catalog') && $('view-catalog').classList.contains('active')) await loadCatalog();
    } catch (error) {
      deviceCreateMessage.className = 'form-message error';
      deviceCreateMessage.textContent = `Không thể thêm thiết bị: ${error.message}`;
    } finally {
      button.disabled = false;
      button.textContent = 'Lưu thiết bị';
    }
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
      renderDeviceOptions(customer.customer_id);
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
      showSuccessMessage('customer-msg', `Tạo khách hàng thành công · ID ${customer.customer_id}`);
      form.reset(); await loadPickerData();
      $('ticket-customer').value = String(customer.customer_id);
      renderDeviceOptions(customer.customer_id);
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
      showSuccessMessage('ticket-msg', `Tạo phiếu thành công · ${ticket.ticket_code}`);
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
      $('tickets-table-wrap').innerHTML = `<table><thead><tr><th>Mã phiếu</th><th>Khách hàng</th><th>Thiết bị</th><th>Ưu tiên</th><th>Trạng thái</th><th>Hạn xử lý</th><th>Thao tác</th></tr></thead><tbody>${state.tickets.map((t) => `<tr><td><strong>${escapeHtml(t.ticket_code)}</strong><small>ID ${t.ticket_id}</small></td><td>${escapeHtml(t.full_name)}<small>${escapeHtml(t.phone)}</small></td><td><strong>${escapeHtml([t.device_type, t.brand, t.model].filter(Boolean).join(' ') || 'Chưa cập nhật model')}</strong><small>${escapeHtml(t.serial_no)}</small></td><td><span class="priority priority-${escapeHtml(t.priority).toLowerCase()}">${escapeHtml(prettyPriority(t.priority))}</span></td><td><span class="status-badge">${escapeHtml(prettyStatus(t.status))}</span></td><td>${escapeHtml(dateText(t.due_date))}</td><td><button class="text-button" data-ticket-id="${t.ticket_id}" type="button">Xem</button> <button class="text-button" data-edit-ticket="${t.ticket_id}" type="button">Sửa</button> <button class="text-button" data-delete-ticket="${t.ticket_id}" type="button">Xóa</button></td></tr>`).join('')}</tbody></table>`;
      $('tickets-table-wrap').querySelectorAll('[data-ticket-id]').forEach((button) => button.addEventListener('click', () => { state.selectedTicketId = button.dataset.ticketId; showView('detail'); }));
      $('tickets-table-wrap').querySelectorAll('[data-edit-ticket]').forEach((button) => button.addEventListener('click', () => editTicket(button.dataset.editTicket)));
      $('tickets-table-wrap').querySelectorAll('[data-delete-ticket]').forEach((button) => button.addEventListener('click', () => deleteTicket(button.dataset.deleteTicket)));
    } catch (error) { setState('tickets-state', 'error', `Không tải được danh sách: ${error.message}`, loadTickets); }
  }

  async function editTicket(ticketId) {
    const ticket = state.tickets.find((item) => String(item.ticket_id) === String(ticketId));
    if (!ticket) return alert('Không tìm thấy phiếu bảo hành.');
    const issueDesc = prompt('Mô tả sự cố:', ticket.issue_desc);
    if (issueDesc === null) return;
    const priority = prompt('Mức ưu tiên (CAO, TRUNG_BINH, THAP):', ticket.priority);
    if (priority === null) return;
    try {
      await TicketsApi.update(ticketId, { issue_desc: issueDesc.trim(), priority: priority.trim().toUpperCase() });
      await loadTickets();
      if (String(state.selectedTicketId) === String(ticketId)) await loadTicketDetail(ticketId);
      alert('Đã cập nhật phiếu bảo hành.');
    } catch (error) { alert(`Không thể sửa phiếu: ${error.message}`); }
  }

  async function deleteTicket(ticketId) {
    const ticket = state.tickets.find((item) => String(item.ticket_id) === String(ticketId));
    if (!ticket) return alert('Không tìm thấy phiếu bảo hành.');
    if (!confirm(`Bạn có chắc muốn xóa phiếu ${ticket.ticket_code}?`)) return;
    try {
      await TicketsApi.remove(ticketId);
      if (String(state.selectedTicketId) === String(ticketId)) {
        state.selectedTicketId = null;
        $('ticket-detail-content').replaceChildren();
        setState('ticket-detail-state', 'empty', 'Phiếu đã bị xóa.');
      }
      await loadTickets();
      alert('Đã xóa phiếu bảo hành.');
    } catch (error) { alert(`Không thể xóa phiếu: ${error.message}`); }
  }

  async function loadTicketDetail(id) {
    state.selectedTicketId = id;
    setState('ticket-detail-state', 'loading', 'Đang tải chi tiết phiếu…'); $('ticket-detail-content').replaceChildren();
    try {
      const t = await TicketsApi.get(id);
      clearState('ticket-detail-state');
      $('export-ticket').disabled = false;
      $('ticket-detail-content').innerHTML = `<div class="detail-hero"><div><span class="eyebrow">MÃ PHIẾU</span><h3>${escapeHtml(t.ticket_code)}</h3><p>Tiếp nhận lúc ${escapeHtml(dateText(t.received_at))}</p></div><span class="status-badge large">${escapeHtml(prettyStatus(t.status))}</span></div><div class="detail-grid"><section><h4>Khách hàng</h4><dl class="detail-list"><div><dt>Họ tên</dt><dd>${escapeHtml(t.full_name)}</dd></div><div><dt>Số điện thoại</dt><dd>${escapeHtml(t.phone)}</dd></div><div><dt>Email</dt><dd>${escapeHtml(t.email || 'Chưa cập nhật')}</dd></div></dl></section><section><h4>Thiết bị</h4><dl class="detail-list"><div><dt>Loại thiết bị</dt><dd>${escapeHtml([t.device_type, t.brand, t.model].filter(Boolean).join(' ') || 'Chưa cập nhật model')}</dd></div><div><dt>Số serial</dt><dd>${escapeHtml(t.serial_no)}</dd></div><div><dt>Ngày mua</dt><dd>${escapeHtml(t.purchase_date)}</dd></div><div><dt>Bảo hành</dt><dd>${escapeHtml(t.warranty_months)} tháng</dd></div></dl></section><section><h4>Phân loại yêu cầu</h4><dl class="detail-list"><div><dt>Nhóm lỗi</dt><dd>${escapeHtml(t.category_name || 'Chưa phân loại')}</dd></div><div><dt>Mức ưu tiên</dt><dd>${escapeHtml(prettyPriority(t.priority))}</dd></div><div><dt>Hạn xử lý</dt><dd>${escapeHtml(dateText(t.due_date))}</dd></div></dl></section><section><h4>Mô tả sự cố</h4><p class="issue-description">${escapeHtml(t.issue_desc)}</p></section></div>`;
    } catch (error) { $('export-ticket').disabled = true; setState('ticket-detail-state', 'error', `Không tải được chi tiết: ${error.message}`, () => loadTicketDetail(id)); }
  }

  async function exportSelectedTicket() {
    if (!state.selectedTicketId) return;
    // Open synchronously from the click handler so the browser does not block the print window.
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Trình duyệt đã chặn cửa sổ xuất phiếu. Hãy cho phép pop-up rồi thử lại.');
      return;
    }
    printWindow.document.write('<!doctype html><html lang="vi"><head><meta charset="utf-8"><title>Phiếu bảo hành</title></head><body style="font-family:Arial,sans-serif;padding:32px">Đang tạo phiếu bảo hành…</body></html>');
    printWindow.document.close();
    try {
      const t = await TicketsApi.get(state.selectedTicketId);
      const safe = escapeHtml;
      const rows = [
        ['Mã phiếu', t.ticket_code], ['Ngày tiếp nhận', dateText(t.received_at)],
        ['Trạng thái', prettyStatus(t.status)], ['Khách hàng', t.full_name],
        ['Số điện thoại', t.phone], ['Email', t.email || 'Chưa cập nhật'],
        ['Thiết bị', [t.device_type, t.brand, t.model].filter(Boolean).join(' ') || 'Chưa cập nhật model'],
        ['Số serial', t.serial_no], ['Ngày mua', t.purchase_date],
        ['Thời hạn bảo hành', `${t.warranty_months} tháng`], ['Nhóm lỗi', t.category_name || 'Chưa phân loại'],
        ['Mức ưu tiên', prettyPriority(t.priority)], ['Hạn xử lý', dateText(t.due_date)],
        ['Mô tả sự cố', t.issue_desc]
      ];
      printWindow.document.open();
      printWindow.document.write(`<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Phieu-bao-hanh-${safe(t.ticket_code)}</title><style>
        *{box-sizing:border-box}body{font-family:Arial,sans-serif;color:#1c2d3b;margin:0;padding:32px}header{text-align:center;border-bottom:2px solid #176b83;padding-bottom:18px;margin-bottom:22px}h1{font-size:23px;margin:0 0 8px;color:#16465b}header p{margin:0;color:#526879;font-size:12px}.code{font-size:17px;font-weight:bold;margin-top:12px}table{width:100%;border-collapse:collapse}th,td{padding:10px 12px;border:1px solid #d8e1e8;text-align:left;vertical-align:top;font-size:12px;line-height:1.5}th{width:30%;background:#f2f6f8}footer{display:flex;justify-content:space-between;gap:30px;margin-top:50px;text-align:center;font-size:12px}.sign{width:45%;padding-top:12px}@page{size:A4;margin:16mm}@media print{body{padding:0}.no-print{display:none}}
      </style></head><body><header><h1>PHIẾU TIẾP NHẬN BẢO HÀNH</h1><p>MEKONG MOBILE · SMART CRM</p><div class="code">${safe(t.ticket_code)}</div></header><table><tbody>${rows.map(([label,value]) => `<tr><th>${safe(label)}</th><td>${safe(value)}</td></tr>`).join('')}</tbody></table><footer><div class="sign"><strong>Khách hàng</strong><p>(Ký và ghi rõ họ tên)</p></div><div class="sign"><strong>Nhân viên tiếp nhận</strong><p>(Ký và ghi rõ họ tên)</p></div></footer><p class="no-print" style="margin-top:28px;color:#526879;font-size:12px">Trong hộp thoại in, chọn máy in hoặc “Save as PDF” để lưu phiếu.</p><script>window.addEventListener('load',()=>setTimeout(()=>window.print(),250));<\/script></body></html>`);
      printWindow.document.close();
    } catch (error) {
      printWindow.document.body.textContent = `Không thể xuất phiếu bảo hành: ${error.message}`;
    }
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
      else {
        clearState('catalog-customers-state');

        $('catalog-customers-table-wrap').innerHTML = `
          <table>
            <thead>
              <tr>
                <th>Khách hàng</th>
                <th>Liên hệ</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              ${customers.map((c) => `
                <tr>
                  <td>
                    <strong>${escapeHtml(c.full_name)}</strong>
                    <small>ID ${c.customer_id}</small>
                  </td>
                  <td>
                    ${escapeHtml(c.phone)}
                    <small>${escapeHtml(c.email || 'Chưa có email')}</small>
                  </td>
                  <td>
                    <button type="button"
                      class="text-button"
                      data-edit-customer="${c.customer_id}">
                      Sửa
                    </button>
                    <button type="button"
                      class="text-button"
                      data-delete-customer="${c.customer_id}">
                      Xóa
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>`;

        $('catalog-customers-table-wrap')
          .querySelectorAll('[data-edit-customer]')
          .forEach((button) => {
            button.addEventListener('click', () => {
              editCustomer(button.dataset.editCustomer);
            });
          });

        $('catalog-customers-table-wrap')
          .querySelectorAll('[data-delete-customer]')
          .forEach((button) => {
            button.addEventListener('click', () => {
              deleteCustomer(button.dataset.deleteCustomer);
            });
          });
      }
      $('device-count').textContent = `${devices.length} thiết bị`; $('category-count').textContent = `${categories.length} nhóm lỗi`;
      if (!devices.length) setState('devices-state', 'empty', 'Chưa có thiết bị trong database.');
      else { clearState('devices-state'); $('devices-table-wrap').innerHTML = `<table><thead><tr><th>ID</th><th>Loại thiết bị</th><th>Thiết bị</th><th>Serial</th><th>Khách hàng</th><th>Ngày mua</th><th>Tình trạng bảo hành</th></tr></thead><tbody>${devices.map((d) => `<tr><td>${d.device_id}</td><td>${escapeHtml(d.device_type || 'Điện thoại')}</td><td><strong>${escapeHtml([d.brand, d.model].filter((value) => value && !['Khác', 'Chưa cập nhật'].includes(value)).join(' ') || 'Chưa cập nhật model')}</strong></td><td>${escapeHtml(d.serial_no)}</td><td>${escapeHtml(d.customer_name)}<small>${escapeHtml(d.customer_phone)}</small></td><td>${escapeHtml(d.purchase_date)}</td><td><span class="${d.warranty_status === 'CON_HAN' ? 'status-badge' : 'status-badge expired'}">${d.warranty_status === 'CON_HAN' ? 'Còn hạn' : 'Hết hạn'}</span><small>Hết hạn: ${escapeHtml(d.warranty_expires_on || '—')}</small></td></tr>`).join('')}</tbody></table>`; }
      if (!categories.length) setState('categories-state', 'empty', 'Chưa có nhóm lỗi trong database.');
      else { clearState('categories-state'); $('categories-table-wrap').innerHTML = `<table><thead><tr><th>Tên nhóm lỗi</th><th>Mô tả</th></tr></thead><tbody>${categories.map((c) => `<tr><td><strong>${escapeHtml(c.category_name)}</strong><small>ID ${c.category_id}</small></td><td>${escapeHtml(c.description || '—')}</td></tr>`).join('')}</tbody></table>`; }
    } catch (error) {
      setState('catalog-customers-state', 'error', `Không tải được khách hàng: ${error.message}`, loadCatalog);
      setState('devices-state', 'error', `Không tải được thiết bị: ${error.message}`, loadCatalog);
      setState('categories-state', 'error', `Không tải được nhóm lỗi: ${error.message}`, loadCatalog);
    }
  }

  async function editCustomer(customerId) {
    const customer = state.customers.find(
      (c) => String(c.customer_id) === String(customerId)
    );

    if (!customer) {
      alert('Không tìm thấy khách hàng.');
      return;
    }

    const fullName = prompt('Họ tên khách hàng:', customer.full_name);
    if (fullName === null) return;

    const phone = prompt('Số điện thoại:', customer.phone);
    if (phone === null) return;

    const email = prompt('Email (có thể để trống):', customer.email || '');
    if (email === null) return;

    try {
      await CustomersApi.update(customerId, {
        full_name: fullName.trim(),
        phone: phone.trim(),
        email: email.trim()
      });

      alert('Cập nhật khách hàng thành công.');
      await loadCatalog();
      await loadPickerData();
    } catch (error) {
      alert(`Không thể cập nhật khách hàng: ${error.message}`);
    }
  }

  async function deleteCustomer(customerId) {
    const customer = state.customers.find(
      (c) => String(c.customer_id) === String(customerId)
    );

    if (!customer) {
      alert('Không tìm thấy khách hàng.');
      return;
    }

    const confirmed = confirm(
      `Bạn có chắc muốn xóa khách hàng "${customer.full_name}" không?`
    );

    if (!confirmed) return;

    try {
      await CustomersApi.remove(customerId);

      alert('Xóa khách hàng thành công.');
      await loadCatalog();
      await loadPickerData();
    } catch (error) {
      alert(`Không thể xóa khách hàng: ${error.message}`);
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
      sessionStorage.setItem('warranty_api_token', result.data.token);
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
