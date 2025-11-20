'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  email: string;
  name?: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loginWithSocial: (provider: 'google' | 'microsoft' | 'linkedin') => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('nuri_user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (e) {
        console.error('Failed to parse stored user:', e);
        localStorage.removeItem('nuri_user');
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    // TODO: Implement actual API call
    // For now, simulate login
    const mockUser = {
      email,
      name: email.split('@')[0],
    };

    setUser(mockUser);
    setIsAuthenticated(true);
    localStorage.setItem('nuri_user', JSON.stringify(mockUser));
  };

  const loginWithSocial = async (provider: 'google' | 'microsoft' | 'linkedin') => {
    // TODO: Implement actual social login
    // For now, simulate social login
    const mockUser = {
      email: `user@${provider}.com`,
      name: `${provider} User`,
    };

    setUser(mockUser);
    setIsAuthenticated(true);
    localStorage.setItem('nuri_user', JSON.stringify(mockUser));
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('nuri_user');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, loginWithSocial }}>
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
