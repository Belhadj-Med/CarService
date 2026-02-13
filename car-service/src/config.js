// Backend URL configuration
// Remove trailing slash to prevent double slashes in URLs
const backendUrl = (import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000').replace(/\/+$/, '')

// Log the backend URL being used (helpful for debugging)
console.log('🔗 Backend URL:', backendUrl)
console.log('🌍 Environment:', import.meta.env.MODE)
console.log('📦 Production:', import.meta.env.PROD)

// Warn in production if using localhost
if (import.meta.env.PROD && backendUrl.includes('localhost')) {
  console.error('❌ ERROR: Using localhost backend URL in production!')
  console.error('📝 Solution: Set VITE_BACKEND_URL in Vercel environment variables and redeploy.')
}

/**
 * Safely construct API URL by ensuring no double slashes
 * @param {string} path - API path (e.g., '/contact' or 'contact')
 * @returns {string} - Full URL
 */
export function getApiUrl(path) {
  // Remove leading slash from path if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path
  // Ensure backendUrl doesn't end with slash and path doesn't start with slash
  return `${backendUrl.replace(/\/+$/, '')}/${cleanPath}`
}

export const BACKEND_URL = backendUrl
