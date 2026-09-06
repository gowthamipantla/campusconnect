import { createContext, useContext, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../services/api';

const AuthContext = createContext(null);

function getInitialAuthState() {
  try {
    const storedToken = localStorage.getItem('cc_token');
    const storedUser = localStorage.getItem('cc_user');

    if (storedToken) {
      const decoded = jwtDecode(storedToken);
      // Check if token has expired (exp is in seconds)
      if (decoded.exp && decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem('cc_token');
        localStorage.removeItem('cc_user');
        return { user: null, token: null };
      }

      let parsedUser = null;
      if (storedUser) {
        try {
          parsedUser = JSON.parse(storedUser);
        } catch {
          parsedUser = null;
        }
      }

      const user = parsedUser || {
        name: decoded.name || decoded.sub || 'User',
        email: decoded.sub || decoded.email,
        role: decoded.role || 'STUDENT',
      };

      return { user, token: storedToken };
    }
  } catch {
    localStorage.removeItem('cc_token');
    localStorage.removeItem('cc_user');
  }

  return { user: null, token: null };
}

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState(getInitialAuthState);
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token: jwtToken, email: userEmail, role, name } = response.data;

      let userData = {
        name: name || email,
        email: userEmail || email,
        role: role || 'STUDENT',
      };

      if (jwtToken) {
        localStorage.setItem('cc_token', jwtToken);
        try {
          const decoded = jwtDecode(jwtToken);
          userData = {
            name: name || decoded.name || userEmail || email,
            email: userEmail || decoded.sub || decoded.email || email,
            role: role || decoded.role || 'STUDENT',
          };
        } catch {
          // Token decode failed, fallback to payload values
        }
      }

      localStorage.setItem('cc_user', JSON.stringify(userData));
      setAuthState({ user: userData, token: jwtToken });
      return response.data;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('cc_token');
    localStorage.removeItem('cc_user');
    setAuthState({ user: null, token: null });
  };

  return (
    <AuthContext.Provider
      value={{
        user: authState.user,
        token: authState.token,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
