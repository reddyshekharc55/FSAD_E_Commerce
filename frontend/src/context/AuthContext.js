import React, { createContext, useContext, useEffect, useState } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

const parseJwt = (token) => {
  if (!token) {
    return null;
  }

  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
    const payload = JSON.parse(atob(padded));
    return payload;
  } catch (error) {
    return null;
  }
};

const isTokenValid = (token) => {
  const payload = parseJwt(token);
  if (!payload || !payload.exp) {
    return false;
  }
  return payload.exp * 1000 > Date.now();
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser && isTokenValid(storedToken)) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    if (!token) {
      return undefined;
    }

    const payload = parseJwt(token);
    if (!payload || !payload.exp) {
      logout(false);
      return undefined;
    }

    const expiresAt = payload.exp * 1000;
    const timeoutMs = expiresAt - Date.now();

    if (timeoutMs <= 0) {
      logout(false);
      return undefined;
    }

    const timeoutId = setTimeout(() => {
      logout(true);
    }, timeoutMs);

    return () => clearTimeout(timeoutId);
  }, [token]);

  const persistAuth = (authToken, authUser) => {
    localStorage.setItem('token', authToken);
    localStorage.setItem('user', JSON.stringify(authUser));
    setToken(authToken);
    setUser(authUser);
  };

  const login = async (email, password) => {
    try {
      const response = await authAPI.login({ email, password });
      const { token: authToken, user: authUser } = response.data;

      persistAuth(authToken, authUser);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed. Please try again.';
      return { success: false, message };
    }
  };

  const register = async (payload) => {
    try {
      const response = await authAPI.register(payload);
      const { token: authToken, user: authUser } = response.data;

      persistAuth(authToken, authUser);
      return { success: true };
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.errors?.[0]?.msg ||
        'Registration failed. Please try again.';
      return { success: false, message };
    }
  };

  const logout = (redirect = true) => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);

    if (redirect) {
      window.location.href = '/login';
    }
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: Boolean(token)
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
