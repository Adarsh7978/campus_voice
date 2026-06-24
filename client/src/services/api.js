import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

export async function login(credentials) {
  const response = await api.post('/login', credentials)
  return response.data
}

export async function register(data) {
  const response = await api.post('/auth/register', data)
  return response.data
}

export async function getIssues() {
  const response = await api.get('/issues')
  return response.data
}

export async function createIssue(issue) {
  const response = await api.post('/issues', issue)
  return response.data
}

export async function voteIssue(issueId) {
  const response = await api.post(`/issues/${issueId}/vote`)
  return response.data
}
