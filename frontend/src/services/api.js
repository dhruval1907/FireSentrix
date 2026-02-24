const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

async function request(path, { method = 'GET', body, token } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  let data;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    const message = data?.message || `Request failed with ${res.status}`;
    const error = new Error(message);
    error.status = res.status;
    throw error;
  }

  return data;
}

// Auth
export const authApi = {
  login: (email, password) =>
    request('/auth/login', { method: 'POST', body: { email, password } }),
  register: (payload) =>
    request('/auth/register', { method: 'POST', body: payload }),
  me: (token) => request('/auth/me', { token }),
};

// Clients
export const clientsApi = {
  list: (token) => request('/clients', { token }),
  create: (token, payload) =>
    request('/clients', { method: 'POST', body: payload, token }),
  update: (token, id, payload) =>
    request(`/clients/${id}`, { method: 'PATCH', body: payload, token }),
  remove: (token, id) =>
    request(`/clients/${id}`, { method: 'DELETE', token }),
};

// Guards
export const guardsApi = {
  list: (token) => request('/guards', { token }),
  create: (token, payload) =>
    request('/guards', { method: 'POST', body: payload, token }),
  update: (token, id, payload) =>
    request(`/guards/${id}`, { method: 'PATCH', body: payload, token }),
  remove: (token, id) =>
    request(`/guards/${id}`, { method: 'DELETE', token }),
};

// Equipment
export const equipmentApi = {
  list: (token) => request('/equipment', { token }),
  create: (token, payload) =>
    request('/equipment', { method: 'POST', body: payload, token }),
  update: (token, id, payload) =>
    request(`/equipment/${id}`, { method: 'PATCH', body: payload, token }),
  remove: (token, id) =>
    request(`/equipment/${id}`, { method: 'DELETE', token }),
};

// Attendance
export const attendanceApi = {
  getByDate: (token, date) => request(`/attendance?date=${date}`, { token }),
  mark: (token, payload) =>
    request('/attendance', { method: 'POST', body: payload, token }),
  getByGuard: (token, guardId) =>
    request(`/attendance/guard/${guardId}`, { token }),
};

// Salaries
export const salariesApi = {
  list: (token) => request('/salaries', { token }),
  create: (token, payload) =>
    request('/salaries', { method: 'POST', body: payload, token }),
  update: (token, id, payload) =>
    request(`/salaries/${id}`, { method: 'PATCH', body: payload, token }),
  remove: (token, id) =>
    request(`/salaries/${id}`, { method: 'DELETE', token }),
};

// Invoices
export const invoicesApi = {
  list: (token) => request('/invoices', { token }),
  create: (token, payload) =>
    request('/invoices', { method: 'POST', body: payload, token }),
  markPaid: (token, id) =>
    request(`/invoices/${id}/pay`, { method: 'PATCH', token }),
  remove: (token, id) =>
    request(`/invoices/${id}`, { method: 'DELETE', token }),
};

// Messages / Chat
export const messagesApi = {
  list: (token) => request('/messages', { token }),
  send: (token, payload) =>
    request('/messages', { method: 'POST', body: payload, token }),
};
