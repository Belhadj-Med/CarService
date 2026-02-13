/**
 * Safely parse fetch response, handling both JSON and non-JSON responses
 * @param {Response} res - Fetch response object
 * @returns {Promise<{data: any, isJson: boolean}>}
 */
export async function safeParseResponse(res) {
  const contentType = res.headers.get('content-type') || ''
  const isJson = contentType.includes('application/json')
  
  // Try to get response as text first (we can only read the body once)
  const text = await res.text()
  
  // If content-type says JSON, try to parse it
  if (isJson) {
    try {
      const data = JSON.parse(text)
      return { data, isJson: true }
    } catch (parseError) {
      // Content-type said JSON but parsing failed - log and return text
      console.error('Failed to parse JSON despite content-type:', parseError)
      console.error('Response text:', text.substring(0, 200))
      return { data: text, isJson: false }
    }
  }
  
  // Not JSON, return as text
  return { data: text, isJson: false }
}

/**
 * Handle API errors with proper error messages
 * @param {Error} err - Error object
 * @returns {string} - User-friendly error message
 */
export function getErrorMessage(err) {
  if (err.message?.includes('Failed to fetch') || err.message?.includes('ERR_CONNECTION_REFUSED')) {
    return 'لا يمكن الاتصال بالخادم. يرجى التحقق من الاتصال بالإنترنت أو المحاولة لاحقاً'
  }
  if (err.message?.includes('404') || err.message?.includes('not found')) {
    return 'الخادم غير متاح حالياً. يرجى المحاولة لاحقاً'
  }
  return err.message || 'حدث خطأ في الاتصال بالخادم. يرجى المحاولة مرة أخرى'
}
