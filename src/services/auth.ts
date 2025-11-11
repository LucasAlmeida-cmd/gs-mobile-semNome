import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api';

import { jwtDecode } from 'jwt-decode';
// 3. Importe seus tipos
import { User, LoginCredentials, RegisterData, AuthResponse, RegisterCredentials } from '../types/auth';

const STORAGE_KEYS = {
  USER: '@GS:user',
  TOKEN: '@GS:token',
  PATIOS: '@GS:patios',
};

interface LoginResponse {
  token: string;
}

interface Log {
  id: number;
  data: string;
  emocao: string;
  horasSono: number;
  aguaLitros: number;
  fezExercicio: boolean;
  descansouMente: boolean;
  notas: string;
  usuarioId: number;
}

interface SignInResponse {
  user: User;
  token: string;
}

// --- FUNÇÃO DE LOGIN ---
const signIn = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>('/login', {
      email: credentials.email,
      senha: credentials.password,
    });

    const { user, token } = response.data;

    // Configura o header do Axios
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    return { user, token };

  } catch (error) {
    console.error('Erro no authService.signIn:', error);
    api.defaults.headers.common['Authorization'] = undefined;
    throw new Error('Email ou senha inválidos');
  }
};

// --- FUNÇÃO DE LOGOUT ---
const signOut = async () => {
  api.defaults.headers.common['Authorization'] = undefined;
};

// --- FUNÇÃO DE REGISTER ---
const register = async (credentials: RegisterCredentials) => {
  try {
    const response = await api.post('/usuarios/salvar', {
      nomeUser: credentials.nomeUser,
      email: credentials.email,
      cpfUser: credentials.cpfUser,
      dataAniversario: credentials.dataAniversario,
      password: credentials.password,
    });

    return response.data;
  } catch (error: any) {
    console.error('Erro no authService.register:', error);
    throw new Error('Erro ao criar usuário. Verifique os dados e tente novamente.');
  }
};


// --- FUNÇÃO PARA CARREGAR USUÁRIO ---
const getStoredUser = async (): Promise<User | null> => {
  const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);

  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    return null; 
  }
  const userJson = await AsyncStorage.getItem(STORAGE_KEYS.USER);
  if (!userJson) return null;

  return JSON.parse(userJson) as User;
};

// --- FUNÇÃO PARA CARREGAR LOGS ---
const logService = {
  getLogs: async (): Promise<Log[]> => {
    const response = await api.get('/log/meusLogs');
    return response.data.content; 
  }
};

// --- DEMAIS FUNÇÕES ---



const loadRegisteredUsers = async () => {
  // Simulação
  return Promise.resolve();
};

// --- EXPORTE O SERVIÇO ---
export const authService = {
  signIn,
  signOut,
  getStoredUser,
  register,
  loadRegisteredUsers,
  logService,
};