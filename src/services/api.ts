import axios from 'axios'
import { API_BASE_URL } from '../utils/constants'

// recursively converts snake_case keys to camelCase
function camelize(str: string): string {
  return str.replace(/_([a-z])/g, (_, c) => c.toUpperCase())
}

function camelizeKeys(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(camelizeKeys)
  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [camelize(k), camelizeKeys(v)])
    )
  }
  return value
}

const api = axios.create({
  baseURL: API_BASE_URL,
})

// attach jwt token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (response) => {
    response.data = camelizeKeys(response.data)
    return response
  },
  async (error) => {
    const original = error.config
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true
      try {
        const refresh = localStorage.getItem('refresh_token')
        const { data } = await axios.post(
          `${API_BASE_URL}/accounts/token/refresh/`,
          { refresh }
        )
        localStorage.setItem('access_token', data.access)
        original.headers.Authorization = `Bearer ${data.access}`
        return api(original)
      } catch {
        localStorage.clear()
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api
