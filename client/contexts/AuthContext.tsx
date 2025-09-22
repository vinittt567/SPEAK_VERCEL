import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  anonymousId: string;
  profileData: {
    course: string;
    year: number;
    joinedAt: string;
  };
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (anonymousId: string) => Promise<boolean>;
  register: (email: string, password: string, name?: string, course?: string, year?: number) => Promise<{success: boolean, user?: User}>;
  anonymousLogin: (anonymousId: string) => Promise<boolean>;
  logout: () => void;
  verifyToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL = 'http://localhost:3000/api';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem('speak_token');
    const savedUser = localStorage.getItem('speak_user');
    
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
      // Verify token is still valid
      verifyTokenInternal(savedToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  const verifyTokenInternal = async (authToken: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setIsLoading(false);
        return true;
      } else {
        // Token is invalid, clear auth state
        clearAuthState();
        return false;
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      clearAuthState();
      return false;
    }
  };

  const clearAuthState = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('speak_token');
    localStorage.removeItem('speak_user');
    setIsLoading(false);
  };

  const register = async (email: string, password: string, name?: string, course?: string, year?: number): Promise<{success: boolean, user?: User}> => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name, course, year }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const { token: authToken, user: userData } = data;
        
        setToken(authToken);
        setUser(userData);
        
        // Save to localStorage
        localStorage.setItem('speak_token', authToken);
        localStorage.setItem('speak_user', JSON.stringify(userData));
        
        setIsLoading(false);
        return { success: true, user: userData };
      } else {
        setIsLoading(false);
        throw new Error(data.error || 'Registration failed');
      }
    } catch (error) {
      setIsLoading(false);
      console.error('Registration error:', error);
      return { success: false };
    }
  };

  const login = async (anonymousId: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ anonymousId }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const { token: authToken, user: userData } = data;
        
        setToken(authToken);
        setUser(userData);
        
        // Save to localStorage
        localStorage.setItem('speak_token', authToken);
        localStorage.setItem('speak_user', JSON.stringify(userData));
        
        setIsLoading(false);
        return true;
      } else {
        setIsLoading(false);
        throw new Error(data.error || 'Login failed');
      }
    } catch (error) {
      setIsLoading(false);
      console.error('Login error:', error);
      return false;
    }
  };

  const anonymousLogin = async (anonymousId: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ anonymousId }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const { token: authToken, user: userData } = data;
        
        setToken(authToken);
        setUser(userData);
        
        // Save to localStorage
        localStorage.setItem('speak_token', authToken);
        localStorage.setItem('speak_user', JSON.stringify(userData));
        
        setIsLoading(false);
        return true;
      } else {
        setIsLoading(false);
        throw new Error(data.error || 'Anonymous login failed');
      }
    } catch (error) {
      setIsLoading(false);
      console.error('Anonymous login error:', error);
      return false;
    }
  };

  const logout = async () => {
    console.log('Logout function called, token:', token ? 'exists' : 'null');
    try {
      if (token) {
        console.log('Making logout API call...');
        const response = await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          console.warn('Logout API call failed, but clearing local state anyway');
        } else {
          console.log('Logout API call successful');
        }
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Continue with clearing state even if API call fails
    } finally {
      console.log('Clearing auth state...');
      clearAuthState();
      console.log('Auth state cleared');
    }
  };

  const verifyToken = async (): Promise<boolean> => {
    if (!token) return false;
    return verifyTokenInternal(token);
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    login,
    register,
    anonymousLogin,
    logout,
    verifyToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}