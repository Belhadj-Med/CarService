/**
 * Safely parse fetch response, handling both JSON and non-JSON responses
 * @param {Response} res - Fetch response object
 * @returns {Promise<{data: any, isJson: boolean}>}
 */
export async function safeParseResponse(res) {
  // Clone the response so we can read it multiple times if needed
  // But since we can't clone a consumed body, we'll read as text first
  let text = ''
  
  try {
    // Read response as text (safe - works for both JSON and HTML)
    text = await res.text()
  } catch (readError) {
    console.error('Failed to read response body:', readError)
    throw new Error('Failed to read server response')
  }
  
  // Check if response looks like HTML (common for 404 pages)
  const looksLikeHtml = text.trim().startsWith('<!DOCTYPE') || text.trim().startsWith('<html')
  
  // Get content-type header
  const contentType = res.headers.get('content-type') || ''
  const contentTypeLower = contentType.toLowerCase()
  const claimsToBeJson = contentTypeLower.includes('application/json')
  
  // If it looks like HTML, don't try to parse as JSON
  if (looksLikeHtml) {
    console.warn(`Server returned HTML (status ${res.status}):`, text.substring(0, 200))
    return { data: text, isJson: false }
  }
  
  // If content-type claims JSON, try to parse it
  if (claimsToBeJson || text.trim().startsWith('{') || text.trim().startsWith('[')) {
    try {
      const data = JSON.parse(text)
      return { data, isJson: true }
    } catch (parseError) {
      // Content-type said JSON but parsing failed - likely HTML error page
      console.error('Failed to parse JSON:', parseError.message)
      console.error('Response preview:', text.substring(0, 300))
      console.error('Content-Type header:', contentType)
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
