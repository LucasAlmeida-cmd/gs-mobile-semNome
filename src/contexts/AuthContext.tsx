import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../services/auth';
import { User, LoginCredentials, RegisterData, AuthContextData, UpdateUserCredentials } from '../types/auth';

const STORAGE_KEYS = {
  USER: '@GS:user',
  TOKEN: '@GS:token',
  PATIOS: '@GS:patios',
};

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStoredUser();
    loadRegisteredUsers();
  }, []);

  const loadStoredUser = async () => {
    try {
      const storedUser = await authService.getStoredUser();
      if (storedUser) {
        setUser(storedUser);
      }
    } catch (error) {
      console.error('Erro ao carregar usuário:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadRegisteredUsers = async () => {
    try {
      await authService.loadRegisteredUsers();
    } catch (error) {
      console.error('Erro ao carregar usuários registrados:', error);
    }
  };
  const signIn = async (credentials: LoginCredentials) => {
    const response = await authService.signIn(credentials);
    setUser(response.user);
    await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user));
    await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, response.token);
  };

  const register = async (credentials: RegisterData) => {
    const response = await authService.register(credentials);
    setUser(response.user);
    await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user));
    await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, response.token);
  }



  const signOut = async () => {
    try {
      await authService.signOut();
      setUser(null);
      await AsyncStorage.removeItem(STORAGE_KEYS.USER);
      await AsyncStorage.removeItem(STORAGE_KEYS.TOKEN);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const updateUser = async (id: number, credentials: UpdateUserCredentials) => {
    try {
      const updatedUser = await authService.updateUser(id, credentials);
      setUser(updatedUser);
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Erro ao atualizar usuário no contexto:', error);
      throw error;
    }
  };


  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut, register, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
