import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getAuthToken, setAuthToken } from '@/api/client';

interface User {
  fullName: string;
  email: string;
  role: 'Admin' | 'Manager' | 'Staff';
}

interface AuthContextType {
  user: User | null;
  login: (userData: User, token: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const token = getAuthToken();

    if (savedUser && token) {
      try {
        const parsedUser: User = JSON.parse(savedUser);
        setUser(parsedUser);
      } catch (error) {
        logout();
      }
    } else {
      // If user data exists but token is missing (or vice versa), log out
      logout();
    }

    setIsLoading(false);
  }, []);
  
  const login = (userData: User, token: string) => { 
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    setAuthToken(token);
  };

  const logout = () => { 
    setUser(null);
    localStorage.removeItem('user');
    setAuthToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {throw new Error("useAuth must be used within an AuthProvider");}
  return context;
};