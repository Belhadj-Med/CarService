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

export const BACKEND_URL = backendUrl
