import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import backend from '~backend/client';

interface User {
  id: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  // For testing purposes, bypass authentication
  const [user] = useState<User>({
    id: 'admin-1',
    email: 'admin@test.com',
    role: 'admin'
  });
  const [token] = useState<string>('test-token');
  const [isLoading] = useState(false);

  const login = async (email: string, password: string) => {
    // Mock login - always succeeds
    console.log('Mock login for:', email);
  };

  const register = async (email: string, password: string) => {
    // Mock register - always succeeds  
    console.log('Mock register for:', email);
  };

  const logout = () => {
    console.log('Mock logout');
  };

  const isAdmin = true; // Always admin for testing

  const value: AuthContextType = {
    user,
    token,
    login,
    register,
    logout,
    isLoading,
    isAdmin,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
