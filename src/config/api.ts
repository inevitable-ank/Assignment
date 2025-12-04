/**
 * API Configuration
 * Reads the API URL from environment variables
 * In Vite, only variables prefixed with VITE_ are exposed to client code
 */
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

/**
 * Get the full API endpoint URL
 */
export const getApiUrl = (endpoint: string): string => {
  // Remove leading slash if present to avoid double slashes
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint
  // Ensure API_URL doesn't have trailing slash
  const cleanBaseUrl = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL
  return `${cleanBaseUrl}/${cleanEndpoint}`
}

/**
 * Handle API response and check for revoked sessions
 */
export const handleApiResponse = async (response: Response) => {
  if (response.status === 401) {
    const data = await response.json().catch(() => ({}))
    // Check if session was revoked
    if (data.message?.includes('revoked')) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      alert('Your session has been revoked from another device. Please sign in again.')
      window.location.href = '/auth/login'
      throw new Error('Session revoked')
    }
  }
  return response
}

/**
 * API endpoints
 */
export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/api/auth/register',
    LOGIN: '/api/auth/login',
    PROFILE: '/api/auth/profile',
    UPDATE_PROFILE: '/api/auth/profile',
    CHANGE_PASSWORD: '/api/auth/password',
  },
  TASKS: {
    LIST: '/api/tasks',
    CREATE: '/api/tasks',
    UPDATE: (id: string) => `/api/tasks/${id}`,
    DELETE: (id: string) => `/api/tasks/${id}`,
  },
  SESSIONS: {
    LIST: '/api/sessions',
    REVOKE: (id: string) => `/api/sessions/${id}`,
    REVOKE_ALL: '/api/sessions/revoke-all',
  },
} as const

export default API_URL

