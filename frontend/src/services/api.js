/**
 * Thin fetch wrapper around the Java Servlet API.
 *
 * The backend is deployed as a WAR named LibraryApp on Tomcat, so every
 * endpoint lives under  /LibraryApp/api/...  Override with VITE_API_BASE
 * if you deploy under a different context path.
 */
const API_BASE =
  import.meta.env.VITE_API_BASE || 'http://localhost:8080/LibraryApp/api'

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    // JSESSIONID must travel with every call so the server-side session works
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  })

  let payload = null
  try {
    payload = await res.json()
  } catch {
    payload = null
  }

  if (!res.ok || (payload && payload.success === false)) {
    const message = (payload && payload.message) || `Request failed (${res.status})`
    const error = new Error(message)
    error.status = res.status
    throw error
  }
  return payload ? payload.data : null
}

export const api = {
  baseUrl: API_BASE,

  // catalogue
  getBooks: (params = {}) => {
    const qs = new URLSearchParams()
    if (params.q) qs.set('q', params.q)
    if (params.category && params.category !== 'All') qs.set('category', params.category)
    if (params.available) qs.set('available', 'true')
    const suffix = qs.toString() ? `?${qs}` : ''
    return request(`/books${suffix}`)
  },
  getBook: (id) => request(`/books/${id}`),
  addBook: (book) => request('/books', { method: 'POST', body: JSON.stringify(book) }),
  deleteBook: (id) => request(`/books/${id}`, { method: 'DELETE' }),

  // reference data
  getStats: () => request('/stats'),
  getCategories: () => request('/categories'),

  // auth
  me: () => request('/auth/me'),
  login: (email, password) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  register: (payload) =>
    request('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  logout: () => request('/auth/logout', { method: 'POST' }),

  // circulation
  getLoans: () => request('/loans'),
  borrowBook: (bookId) => request('/loans', { method: 'POST', body: JSON.stringify({ bookId }) }),
  returnLoan: (loanId) => request(`/loans/${loanId}/return`, { method: 'POST' }),
  renewLoan: (loanId) => request(`/loans/${loanId}/renew`, { method: 'POST' }),

  // enquiries
  sendMessage: (payload) => request('/contact', { method: 'POST', body: JSON.stringify(payload) }),
}

export default api
