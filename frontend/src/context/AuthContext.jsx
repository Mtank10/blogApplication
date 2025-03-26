import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client.js';
import { getToken, setToken, removeToken } from '../utils/auth.js';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('User state changed:', user);
  }, [user]);

  useEffect(() => {
    const verifyToken = async () => {
      const token = getToken();
      if (token) {
        try {
          const response = await api.get('/auth/me');
         // console.log('Full verification response:', response);
          
          // Handle different response structures
          const userData = response.data?.user || 
                          response.data?.data?.user || 
                          response.data?.data;
          
          if (!userData) {
            console.error('User data missing in:', response);
            throw new Error('User data not found in response');
          }
  
          console.log('Extracted user data:', userData);
          setUser(userData);
          setIsAuthenticated(true);
          navigate('/dashboard');
        } catch (error) {
          console.error('Token verification failed:', error);
          logout();
        }
      }
      setLoading(false);
    };
    verifyToken();
  }, []);
  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
     // console.log('Full login response:', response.data); // Debug log
  
      // Extract from your actual response structure
      const token = response.data.token;
      const userData = response.data.data?.user;
  
      if (!token || !userData) {
        console.error('Missing data in response:', {
          tokenExists: !!token,
          userDataExists: !!userData,
          fullResponse: response.data
        });
        throw new Error('Server response missing required data');
      }
  
      setToken(token);
      setUser(userData);
      setIsAuthenticated(true);
      
     // console.log('Login successful for:', userData.email);
      navigate('/dashboard');
      
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message;
      console.error('Login failed:', errorMsg);
      throw new Error(errorMsg || 'Login failed. Please try again.');
    }
  };
  const signup = async (formData) => {
    try {
      const { data } = await api.post('/auth/signup', formData);
      //console.log('Signup response:', data);
      
      if (data && data.token && data.user) {
        setToken(data.token);
        setUser(data.user);
        setIsAuthenticated(true);
        navigate('/dashboard');
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Signup failed:', error);
      throw error;
    }
  };

  const logout = () => {
    removeToken();
    setUser(null);
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        login,
        signup,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};