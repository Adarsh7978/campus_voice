import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Attach JWT from localStorage to each request if present
api.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem('token')
      if (token) {
        config.headers = config.headers || {}
        config.headers.Authorization = `Bearer ${token}`
      }
    } catch (e) {
      // ignore localStorage errors in non-browser environments
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Global response interceptor: if token invalid/expired, clear and redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status
    if (status === 401) {
      try {
        localStorage.removeItem('token')
      } catch (e) {
        // ignore
      }
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  },
)

export async function login(credentials) {
  const response = await api.post('/login', credentials)
  return response.data
}

export async function register(data) {
  const response = await api.post('/register', data)
  return response.data
}

export async function verifyOtp(data) {
  const response = await api.post('/verify-otp', data)
  return response.data
}

export async function resendOtp(data) {
  const response = await api.post('/resend-otp', data)
  return response.data
}

export async function getIssues(params = {}) {
  const response = await api.get('/issues', { params })
  const payload = response.data

  // The backend now returns an object with issues + metadata.
  // Keep the frontend simple by returning the array of issues.
  if (Array.isArray(payload)) {
    return payload
  }

  return payload?.issues || []
}

export async function createIssue(issue) {
  // If the issue object contains a File (image), send as FormData.
  // This lets the browser automatically set the correct Content-Type (multipart/form-data).
  if (issue.image instanceof File) {
    const formData = new FormData()
    formData.append('title', issue.title)
    formData.append('description', issue.description)
    formData.append('category', issue.category)
    formData.append('image', issue.image)
    const response = await api.post('/issues', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  }

  // No image — use regular JSON (backward compatible).
  const response = await api.post('/issues', issue)
  return response.data
}

// Backend provides upvote via POST /issues/:id/upvote
export async function upvoteIssue(issueId) {
  const response = await api.post(`/issues/${issueId}/upvote`)
  return response.data
}

// Update issue status: PATCH /issues/:id/status
export async function patchIssueStatus(issueId, status) {
  const response = await api.patch(`/issues/${issueId}/status`, { status })
  return response.data
}
