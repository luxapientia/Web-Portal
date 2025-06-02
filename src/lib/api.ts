interface FetchOptions extends RequestInit {
  requireAuth?: boolean;
}

export async function fetchWithAuth(url: string, options: FetchOptions = {}) {
  try {
    // Get token from localStorage
    const token = localStorage.getItem('token');

    console.log('Token:', token);

    // If token is required but not present, redirect to login
    if (options.requireAuth && !token) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/auth/login';
      return null;
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Content-Type': 'application/json',
        // Add Authorization header if token exists
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    });

    // If response is 401 (Unauthorized) or 403 (Forbidden), redirect to login
    if (response.status === 401 || response.status === 403) {
      // Get auth context from localStorage since we can't use hooks in async functions
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Redirect to login page
      window.location.href = '/auth/login';
      return null;
    }

    return response;
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
} 