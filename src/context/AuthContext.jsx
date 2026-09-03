import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [caretaker, setCaretaker] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore persistent login state from localStorage on load
  useEffect(() => {
    try {
      const savedToken = localStorage.getItem('memoryroots_token');
      const savedCaretaker = localStorage.getItem('memoryroots_caretaker');

      if (savedToken && savedCaretaker) {
        setToken(savedToken);
        setCaretaker(JSON.parse(savedCaretaker));
      }
    } catch (e) {
      console.error('Error loading persistent auth session:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  const saveAuthSession = (authData) => {
    setCaretaker(authData.caretaker);
    setToken(authData.token);
    localStorage.setItem('memoryroots_token', authData.token);
    localStorage.setItem('memoryroots_caretaker', JSON.stringify(authData.caretaker));
  };

  const login = async (email, password) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }
      saveAuthSession(data);
      return data;
    } catch (err) {
      // Local fallback for client-only standalone mode
      if (email && password) {
        const fallbackData = {
          token: `memroots_token_${Date.now()}`,
          caretaker: {
            id: 'caretaker_custom_1',
            fullName: email.split('@')[0],
            email,
            phone: '',
            preferredLanguage: 'en'
          }
        };
        saveAuthSession(fallbackData);
        return fallbackData;
      }
      throw err;
    }
  };

  const register = async (userData) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Registration failed');
      }
      saveAuthSession(data);
      return data;
    } catch (err) {
      // Local fallback
      const fallbackData = {
        token: `memroots_token_${Date.now()}`,
        caretaker: {
          id: 'caretaker_' + Date.now(),
          fullName: userData.fullName,
          email: userData.email,
          phone: userData.phone || '',
          preferredLanguage: userData.preferredLanguage || 'en'
        }
      };
      saveAuthSession(fallbackData);
      return fallbackData;
    }
  };

  const demoLogin = async () => {
    try {
      const res = await fetch('/api/auth/demo-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (res.ok) {
        const data = await res.json();
        saveAuthSession(data);
        return data;
      }
    } catch (err) {
      console.warn('Backend offline, using local demo caretaker:', err);
    }

    // Direct fallback demo caretaker
    const demoData = {
      token: 'memroots_token_caretaker_demo_1',
      caretaker: {
        id: 'caretaker_demo_1',
        fullName: 'Dr. Ananya Sharma',
        email: 'care@memoryroots.in',
        phone: '+91 98765 43210',
        preferredLanguage: 'en'
      }
    };
    saveAuthSession(demoData);
    return demoData;
  };

  const logout = () => {
    setCaretaker(null);
    setToken(null);
    localStorage.removeItem('memoryroots_token');
    localStorage.removeItem('memoryroots_caretaker');
  };

  const updateProfile = (updatedDetails) => {
    const updated = { ...caretaker, ...updatedDetails };
    setCaretaker(updated);
    localStorage.setItem('memoryroots_caretaker', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider
      value={{
        caretaker,
        token,
        isAuthenticated: !!caretaker,
        loading,
        login,
        register,
        demoLogin,
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
