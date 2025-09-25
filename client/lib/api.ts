// API Configuration for SPEAK Platform
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://speak-vercel.onrender.com';

export const api = {
  baseURL: API_BASE_URL,
  
  // Auth endpoints
  auth: {
    login: `${API_BASE_URL}/api/auth/login`,
    register: `${API_BASE_URL}/api/auth/register`,
    logout: `${API_BASE_URL}/api/auth/logout`,
    profile: `${API_BASE_URL}/api/auth/profile`,
    refresh: `${API_BASE_URL}/api/auth/refresh`,
  },
  
  // AI endpoints
  ai: {
    chat: `${API_BASE_URL}/api/ai/chat`,
    generate: `${API_BASE_URL}/api/ai/generate`,
  },
  
  // Counselor endpoints
  counselors: {
    list: `${API_BASE_URL}/api/counselors`,
    book: `${API_BASE_URL}/api/counselors/book`,
    availability: `${API_BASE_URL}/api/counselors/availability`,
  },
  
  // Other endpoints
  ping: `${API_BASE_URL}/api/ping`,
  demo: `${API_BASE_URL}/api/demo`,
};

// Helper function for API calls with error handling
export async function apiCall(endpoint: string, options: RequestInit = {}) {
  try {
    const response = await fetch(endpoint, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API call failed: ${response.statusText}`);
    }
    
    return response.json();
  } catch (error) {
    console.error('API call error:', error);
    throw error;
  }
}

// Authenticated API call helper
export async function authenticatedApiCall(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('authToken');
  
  return apiCall(endpoint, {
    ...options,
    headers: {
      ...options.headers,
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
}

// API call hooks for common operations
export const apiHooks = {
  // Health check
  async ping() {
    return apiCall(api.ping);
  },
  
  // Authentication
  async login(credentials: { email: string; password: string }) {
    return apiCall(api.auth.login, {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },
  
  async register(userData: { email: string; password: string; name: string }) {
    return apiCall(api.auth.register, {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },
  
  async logout() {
    return authenticatedApiCall(api.auth.logout, {
      method: 'POST',
    });
  },
  
  // AI Chat
  async sendMessage(message: string) {
    return authenticatedApiCall(api.ai.chat, {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  },
  
  // Counselors
  async getCounselors() {
    return apiCall(api.counselors.list);
  },
  
  async bookCounselor(counselorId: string, appointmentData: any) {
    return authenticatedApiCall(api.counselors.book, {
      method: 'POST',
      body: JSON.stringify({ counselorId, ...appointmentData }),
    });
  },
};

export default api;